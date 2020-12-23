import pymysql
import json
import pydash as py_


class LookupService:

    def __init__(self, owner, sqlconfig=False, mongo_conn=False):
        self.owner = owner
        self.sqlconfig = sqlconfig
        self.mongo_conn = mongo_conn


    def _exec_sql(self, sql):
        conn = pymysql.connect(**self.sqlconfig)
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(sql)

        item = cursor.fetchall()

        cursor.close()
        conn.close()

        return item


    def get_lookup_area_store(self):
        sql = f'''
        SELECT store_area, store_id, store_name FROM `lookupdb`.`lookup_area_store`
        WHERE `owner` = '{self.owner}'
        ORDER BY store_area, store_name
        '''
        return self._exec_sql(sql)


    def get_lookup_bhv(self):
        sql = f'''
        SELECT bhv1, bhv2 FROM `lookupdb`.`lookup_bhv`
        WHERE `owner` = '{self.owner}'
        ORDER BY bhv1, bhv2
        '''
        return self._exec_sql(sql)


    def get_lookup_ord_type(self):
        sql = f'''
        SELECT ord_type FROM `lookupdb`.`lookup_ord_type`
        WHERE `owner` = '{self.owner}'
        ORDER BY ord_type
        '''
        return self._exec_sql(sql)


    def get_lookup_ord_paytype(self):
        sql = f'''
        SELECT ord_paytype FROM `lookupdb`.`lookup_ord_paytype`
        WHERE `owner` = '{self.owner}'
        ORDER BY ord_paytype
        '''
        return self._exec_sql(sql)


    def get_lookup_prd_cat(self):
        sql = f'''
        SELECT prd_cat1, prd_cat2 FROM `lookupdb`.`lookup_prd_cat`
        WHERE `owner` = '{self.owner}'
        ORDER BY prd_cat1, prd_cat2
        '''
        return self._exec_sql(sql)


    def get_lookup_touch(self):
        sql = f'''
        SELECT touch1, touch2 FROM `lookupdb`.`lookup_touch`
        WHERE `owner` = '{self.owner}'
        ORDER BY touch1, touch2
        '''
        return self._exec_sql(sql)
