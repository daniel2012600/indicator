from google.cloud import bigquery

class BigqueryService:

    def __init__(self, jsonkey_path):
        self._jsonkey = jsonkey_path


    def bq_execute(self, sql, use_legacy_sql = False, use_query_cache = True):
        bq_client = bigquery.Client.from_service_account_json(self._jsonkey)
        job_config = bigquery.QueryJobConfig()
        job_config.use_legacy_sql = use_legacy_sql
        job_config.use_query_cache = use_query_cache
        ser = bq_client.query(sql, location='US', job_config=job_config)
        return ser


    def bq_search(self, sql):
        bq_client = bigquery.Client.from_service_account_json(self._jsonkey)
        job_config = bigquery.QueryJobConfig()
        job_config.use_legacy_sql = False
        job_config.use_query_cache = True
        df = bq_client.query(sql, location='US', job_config=job_config).to_dataframe()

        return df

    def bq_insert_search(self, sql, destination_dataset, destination_table_id):
        bq_client = bigquery.Client.from_service_account_json(self._jsonkey)
        job_config = bigquery.QueryJobConfig()
        job_config.use_legacy_sql = False

        table_ref = bq_client.dataset(destination_dataset).table(destination_table_id)
        job_config.destination = table_ref
        job_config.create_disposition = 'CREATE_IF_NEEDED'
        job_config.write_disposition ='WRITE_APPEND'

        df = bq_client.query(sql, location='US', job_config=job_config).to_dataframe()

        return df

    def bq_insert_partition_search(self, sql, destination_dataset, destination_table_id):
        bq_client = bigquery.Client.from_service_account_json(self._jsonkey)
        job_config = bigquery.QueryJobConfig()
        job_config.use_legacy_sql = False

        table_ref = bq_client.dataset(destination_dataset).table(destination_table_id)

        job_config.destination = table_ref
        job_config.create_disposition = 'CREATE_IF_NEEDED'
        job_config.write_disposition = 'WRITE_APPEND'
        job_config.time_partitioning = table_ref
        df = bq_client.query(sql, location='US', job_config=job_config).to_dataframe()

        return df


    def get_table_list(self, dataset_name):

        # get ta table name list
        list_sql = f'''SELECT table_id 
           FROM {dataset_name}.__TABLES__
           '''

        list_df = self.bq_search(list_sql)

        return list_df['table_id'].tolist()

