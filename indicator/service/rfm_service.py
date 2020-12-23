from library.main_global import *
from library.main_help import *
import arrow
import service.bq_parameter as g_para
from library.bq_crud import BigqueryService
from config import Config as cfg
from google.cloud import bigquery
import pandas as pd
import numpy as np
import datetime as dt

class RFM_DataService():
    _bqjson = ''
    _sdt = ''
    _edt = ''

    def __init__(self,owner,bqjson):
        self._owner = owner
        g_para.get_parameter()
        self._ds_nodash = g_para.ds_nodash
        self._bqjson = bqjson

    def trans_time(self,period):
        today = dt.date.today()
        day_delta = dt.timedelta(days=1)
        yesterday = today - day_delta
        dt_list = [str(yesterday)]

        if period == "1m" :
            day_delta2 = dt.timedelta(days=30)
            dr_2 = yesterday - day_delta2
        elif period == "2m" :
            day_delta2 = dt.timedelta(days=60)
            dr_2 = yesterday - day_delta2
                
        
        dt_list.append(str(dr_2))
        return dt_list



    def _exec_sql_get_data_dataframe(self, sql, columns,use_query_cache=True):
        #執行sql語法，返回資料(dataframe格式)
    
        bq_client = bigquery.Client.from_service_account_json(self._bqjson)
        job_config = bigquery.QueryJobConfig()
        job_config.use_legacy_sql = False
        # job_config.allow_large_results = True
        job_config.use_query_cache= use_query_cache

        result = bq_client.query(sql, job_config=job_config)

        # https://googleapis.github.io/google-cloud-python/latest/bigquery/generated/google.cloud.bigquery.job.QueryJob.html
        
        df = result.to_dataframe()
        # # 重設欄位名稱
        # df.columns = columns

        # print(f"是否開啟快取:{job_config.use_query_cache},資料來至快取:{result.cache_hit},歷時：{result.slot_millis}")
        # 回傳結果
        print(df)
        return df

    def _exec_sql_get_data_dict(self, sql, columns,use_query_cache=True):
        #執行sql語法，返回資料(字典格式)
        df = self._exec_sql_get_data_dataframe(sql, columns, use_query_cache)
        data = df.fillna(0).to_dict('records')
        return data


    def get_daydiff(self, dt_list,js):
        #報表 > 回購間隔佔比
        sql = f"""
        #standardSQL
        CREATE TEMPORARY FUNCTION get_rank(v FLOAT64,rg0 FLOAT64,rg1 FLOAT64,rg2 FLOAT64,rg3 FLOAT64,rg4 FLOAT64,rg5 FLOAT64,rg6 FLOAT64, revert INT64) RETURNS INT64 LANGUAGE js AS '''{js}''';


        WITH a as
        (
            SELECT * FROM level1_table_{self._owner}.order
            WHERE (DATE(dt) >= '{dt_list[1]}' AND DATE(dt) <= '{dt_list[0]}')
        ),
        b as
        (
          --每一天有消費的pid see https://i.screenshot.net/6mw86hz?c109acf03e957eedde60a0ab3a634b33
          SELECT dt, pid ,daily_price  from
          (
              SELECT  EXTRACT(date FROM  dt) AS dt, pid, ord_id, 
              ROW_NUMBER() over (PARTITION BY  pid, EXTRACT(date FROM  dt)) AS row , 
              SUM(ord_price) over (PARTITION BY  pid, EXTRACT(date FROM  dt)) AS daily_price 
              FROM a
          )b1
          WHERE b1.row = 1
          )
        , c as
        (
            --每一個會員的每一天，跟上一天資料 see https://i.screenshot.net/pmw82hq?1a818ab12985bbb8feab486b7efcfe99 pw:123
            SELECT dt, pid,daily_price, ROW_NUMBER() over (PARTITION BY pid) AS row,
            LEAD(dt) over (PARTITION BY pid ORDER BY dt) AS leaddt,
            FROM  b
        )
        , d as
        (
            --算出同一個會員訂單之間的間隔天數
            SELECT  * ,date_diff(leaddt, dt, DAY) day_diff FROM c
        )
        , RFM_table as
        (
            SELECT  *  , SUM(day_diff) OVER (PARTITION BY pid) AS day_diff_sum , 
            COUNT(pid) OVER (PARTITION BY pid) AS buy_count, 
            SUM(daily_price)  OVER (PARTITION BY pid) AS total_price
            FROM 
            (
                SELECT  pid , dt, leaddt, day_diff,daily_price  FROM d
                WHERE day_diff is not Null and pid is not null
            )
        )
        ,RFM_indicator as
        (
            SELECT pid , ROUND(day_diff_sum / buy_count,2) AS rebuy_day , buy_count , total_price ,
            FROM RFM_table
            GROUP BY pid ,rebuy_day ,buy_count ,total_price
        )
        ,RFM_percent as
        (
            SELECT *,
            PERCENTILE_CONT(rebuy_day, 0) OVER() AS r0,
            PERCENTILE_CONT(rebuy_day, 0.166666666667) OVER() AS r1,
            PERCENTILE_CONT(rebuy_day, 0.333333333333) OVER() AS r2,
            PERCENTILE_CONT(rebuy_day, 0.5) OVER() AS r3,
            PERCENTILE_CONT(rebuy_day, 0.666666666667) OVER() AS r4,
            PERCENTILE_CONT(rebuy_day, 0.833333333333) OVER() AS r5,
            PERCENTILE_CONT(rebuy_day, 1) OVER() AS r6,
            PERCENTILE_CONT(buy_count, 0) OVER() AS f0,
            PERCENTILE_CONT(buy_count, 0.166666666667) OVER() AS f1,
            PERCENTILE_CONT(buy_count, 0.333333333333) OVER() AS f2,
            PERCENTILE_CONT(buy_count, 0.5) OVER() AS f3,
            PERCENTILE_CONT(buy_count, 0.666666666667) OVER() AS f4,
            PERCENTILE_CONT(buy_count, 0.833333333333) OVER() AS f5,
            PERCENTILE_CONT(buy_count, 1) OVER() AS f6,
            PERCENTILE_CONT(total_price, 0) OVER() AS m0,
            PERCENTILE_CONT(total_price, 0.166666666667) OVER() AS m1,
            PERCENTILE_CONT(total_price, 0.333333333333) OVER() AS m2,
            PERCENTILE_CONT(total_price, 0.5) OVER() AS m3,
            PERCENTILE_CONT(total_price, 0.666666666667) OVER() AS m4,
            PERCENTILE_CONT(total_price, 0.833333333333) OVER() AS m5,
            PERCENTILE_CONT(total_price, 1) OVER() AS m6
            FROM RFM_indicator
        )
        ,RFM_rank as
        (
            SELECT *, 
            get_rank(rebuy_day, r0,r1,r2,r3,r4,r5,r6, 1) R,
            get_rank(buy_count, f0,f1,f2,f3,f4,f5,f6, 0) F,
            get_rank(total_price, m0,m1,m2,m3,m4,m5,m6, 0) M
            FROM RFM_percent 
        )
        ,USR_CNT AS (
            SELECT 'R' AS rfm, R AS rank, COUNT(*) AS cnt FROM RFM_rank GROUP BY R
            UNION ALL 
            SELECT 'F' AS rfm, F AS rank, COUNT(*) AS cnt FROM RFM_rank GROUP BY F
            UNION ALL 
            SELECT 'M' AS rfm, M AS rank, COUNT(*) AS cnt FROM RFM_rank GROUP BY M
        )
        ,R_LABEL AS (
            SELECT DISTINCT 'R' AS rfm,
                CAST(ROUND(r5,0) AS STRING) AS l1_1, CAST(ROUND(r6,0) AS STRING) l2_1,
                CAST(ROUND(r4,0) AS STRING) AS l1_2, CAST(ROUND(r5,0) AS STRING) l2_2,
                CAST(ROUND(r3,0) AS STRING) AS l1_3, CAST(ROUND(r4,0) AS STRING) l2_3,
                CAST(ROUND(r2,0) AS STRING) AS l1_4, CAST(ROUND(r3,0) AS STRING) l2_4,
                CAST(ROUND(r1,0) AS STRING) AS l1_5, CAST(ROUND(r2,0) AS STRING) l2_5,
                CAST(ROUND(r0,0) AS STRING) AS l1_6, CAST(ROUND(r1,0) AS STRING) l2_6
            FROM RFM_percent
        )
        ,F_LABEL AS (
            SELECT DISTINCT 'F' AS rfm,
                CAST(ROUND(f0,0) AS STRING) AS l1_1, CAST(ROUND(f1,0) AS STRING) l2_1,
                CAST(ROUND(f1,0) AS STRING) AS l1_2, CAST(ROUND(f2,0) AS STRING) l2_2,
                CAST(ROUND(f2,0) AS STRING) AS l1_3, CAST(ROUND(f3,0) AS STRING) l2_3,
                CAST(ROUND(f3,0) AS STRING) AS l1_4, CAST(ROUND(f4,0) AS STRING) l2_4,
                CAST(ROUND(f4,0) AS STRING) AS l1_5, CAST(ROUND(f5,0) AS STRING) l2_5,
                CAST(ROUND(f5,0) AS STRING) AS l1_6, CAST(ROUND(f6,0) AS STRING) l2_6
            FROM RFM_percent
        )
        ,M_LABEL AS (
            SELECT DISTINCT 'M' AS rfm,
                CAST(ROUND(m0,0) AS STRING) AS l1_1, CAST(ROUND(m1,0) AS STRING) AS l2_1,
                CAST(ROUND(m1,0) AS STRING) AS l1_2, CAST(ROUND(m2,0) AS STRING) AS l2_2,
                CAST(ROUND(m2,0) AS STRING) AS l1_3, CAST(ROUND(m3,0) AS STRING) AS l2_3,
                CAST(ROUND(m3,0) AS STRING) AS l1_4, CAST(ROUND(m4,0) AS STRING) AS l2_4,
                CAST(ROUND(m4,0) AS STRING) AS l1_5, CAST(ROUND(m5,0) AS STRING) AS l2_5,
                CAST(ROUND(m5,0) AS STRING) AS l1_6, CAST(ROUND(m6,0) AS STRING) AS l2_6
            FROM RFM_percent
        )
        ,ALL_LABEL AS (
            SELECT rfm, [
                STRUCT(1 AS rank, l1_1 AS label1, l2_1 AS label2),
                STRUCT(2 AS rank, l1_2 AS label1, l2_2 AS label2),
                STRUCT(3 AS rank, l1_3 AS label1, l2_3 AS label2),
                STRUCT(4 AS rank, l1_4 AS label1, l2_4 AS label2),
                STRUCT(5 AS rank, l1_5 AS label1, l2_5 AS label2),
                STRUCT(6 AS rank, l1_6 AS label1, l2_6 AS label2)] AS T
            FROM (
                SELECT * FROM R_LABEL
                UNION ALL
                SELECT * FROM F_LABEL
                UNION ALL
                SELECT * FROM M_LABEL
            )
        )
        ,RESULT AS (
            SELECT 
                rfm,
                VAL.rank AS rank,
                VAL.label1 AS label1,
                VAL.label2 AS label2
            FROM ALL_LABEL 
            CROSS JOIN UNNEST(ALL_LABEL.T) AS VAL
        )
        
        SELECT rfm, rank, cnt, label1, label2,
            CASE 
                WHEN rfm = 'R' THEN '天'
                WHEN rfm = 'F' THEN '次'
                ELSE '元'
            END AS unit
        FROM USR_CNT
        LEFT JOIN RESULT
        USING (rfm, rank)
        ORDER BY rank DESC

        # SELECT pid, rebuy_day, buy_count, total_price, R, F, M
        # FROM RFM_rank
        # LIMIT 20
        """
        return self._exec_sql_get_data_dict(sql, ["會員編號","回購天數","會員消費次數","會員消費金額","R","F","M"])

