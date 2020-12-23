import boto
from boto.gs.bucket import Bucket

from bigquery.client import get_client, JOB_WRITE_TRUNCATE, JOB_CREATE_IF_NEEDED
from bigquery.errors import BigQueryTimeoutException



CONTENT_TYPE_CSV = 'text/csv'


class Exporter(object):

    def __init__(self, config, *args, **kwargs):
        """
        Parameters
        ----------
        config: dict
            Dict containing all the configuration details
        """

        if 'GCS_ACCESS_KEY' not in config:
            raise BadConfigurationException("GCS_ACCESS_KEY needs to be specify in config")

        if 'GCS_SECRET_KEY' not in config:
            raise BadConfigurationException("GCS_SECRET_KEY needs to be specify in config")

        if 'GCS_BUCKET_NAME' not in config:
            raise BadConfigurationException("GCS_BUCKET_NAME needs to be specify in config")

        if 'BQ_PROJECT_ID' not in config:
            raise BadConfigurationException("BQ_PROJECT_ID needs to be specify in config")

        if 'BQ_SERVICE_ACCOUNT' not in config:
            raise BadConfigurationException("BQ_SERVICE_ACCOUNT needs to be specify in config")

        if 'BQ_PRIVATE_KEY_PATH' not in config:
            raise BadConfigurationException("BQ_PRIVATE_KEY_PATH needs to be specify in config")

        if 'BQ_DEFAULT_QUERY_TIMEOUT' not in config:
            raise BadConfigurationException("BQ_DEFAULT_QUERY_TIMEOUT needs to be specify in config")

        if 'BQ_DEFAULT_EXPORT_TIMEOUT' not in config:
            raise BadConfigurationException("BQ_DEFAULT_EXPORT_TIMEOUT needs to be specify in config")

        self.gcs_access_key = config['GCS_ACCESS_KEY']
        self.gcs_secret_key = config['GCS_SECRET_KEY']
        self.gcs_bucket_name = config['GCS_BUCKET_NAME']
        self.bq_project_id = config['BQ_PROJECT_ID']
        self.bq_service_account = config['BQ_SERVICE_ACCOUNT']
        self.bq_private_key_path = config['BQ_PRIVATE_KEY_PATH']
        self.bq_default_query_timeout = config['BQ_DEFAULT_QUERY_TIMEOUT']
        self.bq_default_export_timeout = config['BQ_DEFAULT_EXPORT_TIMEOUT']

    @property
    def bq_private_key(self):
        return self._get_file(self.bq_private_key_path)

    @property
    def gcs_client(self):
        if not hasattr(self, "_gcs_client"):
            
            self._gcs_client = boto.connect_gs(self.gcs_access_key, self.gcs_secret_key)
        return self._gcs_client

    @property
    def bq_client(self):
        if not hasattr(self, "_bq_client"):
            print('取得bq client，使用json key檔案：', self.bq_private_key_path)
            self._bq_client = get_client(json_key_file=self.bq_private_key_path, readonly=False)
        return self._bq_client

    @property
    def gcs_bucket(self):
        if not hasattr(self, "_gcs_bucket"):
            self._gcs_bucket = Bucket(self.gcs_client, self.gcs_bucket_name)
        return self._gcs_bucket

    @staticmethod
    def _get_file(filename):
        with open(filename) as f:
            return f.read()

    def dataset_exist(self, dataset):
        """Given dataset name, check if dataset exist"""
        all_datasets = self.bq_client.get_datasets()
        if all_datasets:
            for row in all_datasets:
                if row["datasetReference"]["datasetId"] == dataset:
                    return True
        return False

    def table_exist(self, dataset, table):
        """Given dataset and table name, check if table exist"""
        return self.bq_client.check_table(dataset, table)

    def get_or_create_dataset(self, dataset):
        if not self.dataset_exist(dataset):
            print("建立dataset:%s" % dataset) 
            self.bq_client.create_dataset(dataset)

    def delete_table_if_exist(self, dataset, table):
        print("準備刪除bq暫時表, %s:%s"% (dataset, table))
        exist = self.table_exist(dataset, table)
        if exist:
            #tablemeta = self.bq_client.get_table(dataset, table)
            print('完成刪除bq暫時表')
            #print(tablemeta)
            self.bq_client.delete_table(dataset, table)
            #return tablemeta["numRows"]
        else:
            print('找不到暫時表')
            #return None
            

    def write_to_table(self, dataset, table, query, write_disposition=JOB_WRITE_TRUNCATE, query_timeout=None):
        timeout = query_timeout or self.bq_default_query_timeout

        try:
            print('開始寫入查詢結果到bq暫時表')
            job = self.bq_client.write_to_table(query=query,
                                                dataset=dataset,
                                                table=table,
                                                create_disposition=JOB_CREATE_IF_NEEDED,
                                                write_disposition=write_disposition,
                                                allow_large_results=True)
            
            print('等待寫入工作完成')
            job_resource = self.bq_client.wait_for_job(job, timeout=timeout)
            print('寫入工作已完成')

        # re-raise exceptions with details if job resource is still running after timeout
        except BigQueryTimeoutException:
            raise BigQueryTimeoutException('BigQuery Timeout. job="query" query="%s"' % query)

        dataset_id = job_resource["configuration"]["query"]["destinationTable"]["datasetId"]
        table_id = job_resource["configuration"]["query"]["destinationTable"]["tableId"]
        tablemeta = self.bq_client.get_table(dataset, table)
        table_rows = tablemeta["numRows"]
        return (dataset_id, table_id, table_rows)

    def _export_table_to_gcs(self, dataset, table, folder_name, file_name, export_timeout=None):
        timeout = export_timeout or self.bq_default_export_timeout
        #gs_path = 'gs://%s/%s/%s.csv-parts-*' % (self.gcs_bucket_name, folder_name, file_name)
        gs_path = 'gs://%s/%s/%s.csv' % (self.gcs_bucket_name, folder_name, file_name)

        try:
            #job = self.bq_client.export_data_to_uris([gs_path], dataset, table, print_header=False)
            #第一個參數改成不傳陣列
            job = self.bq_client.export_data_to_uris(gs_path, dataset, table, print_header=True)
            job_resource = self.bq_client.wait_for_job(job, timeout=timeout)

        # re-raise exceptions with details if job resource is still running after timeout
        except BigQueryTimeoutException:
            raise BigQueryTimeoutException('BigQuery Timeout. job="export" location="GCS"')

    def _delete_file(self, folder_name, file_name):
        file_path = '%s/%s.csv' % (folder_name, file_name)
        key = self.gcs_bucket.get_key(file_path)
        if key:
            self.gcs_bucket.delete_key(key.name)

    def _delete_file_parts(self, folder_name, file_name):
#         parts_path = '%s/%s.csv-parts-' % (folder_name, file_name)
        parts_path = '%s/%s.csv' % (folder_name, file_name)
        parts_list = self.gcs_bucket.list(parts_path)
        
        for parts in parts_list:
            print("刪除檔案:", parts.name)
            self.gcs_bucket.delete_key(parts.name)

    def _join_file_parts(self, folder_name, file_name):
        pass

    def export(self, dataset_temp, table_temp, folder_name, file_name):     
        #print("刪除GCS%s資料匣上的檔案%s.csv" % (folder_name, file_name))
        #self._delete_file_parts(folder_name, file_name) #先刪掉

        print("匯出暫時表到GCS,%s/%s.csv" %(folder_name, file_name) )
        self._export_table_to_gcs(dataset_temp, table_temp, folder_name, file_name)


    def query_and_export(self, query, dataset_temp, table_temp, folder_name, file_name, query_timeout=None, export_timeout=None, onBigQueryFunc = None):

        print('1.======取得或建立臨時bq dataset======')
        self.get_or_create_dataset(dataset_temp)

        print("2.======執行sql，將結果寫入暫時表======")
        _dataset_id, _table_id, _table_rows = self.write_to_table(dataset_temp, table_temp, query, JOB_WRITE_TRUNCATE, query_timeout)

        if onBigQueryFunc:
            onBigQueryFunc(_table_rows)

        print("3.======匯出暫時表到GCS======")
        self.export(dataset_temp, table_temp, folder_name, file_name)

        print("4.======刪除暫時表，回傳資料列數======")
        self.delete_table_if_exist(dataset_temp, table_temp)

        return _table_rows
    
class BadConfigurationException(Exception):
    pass

from itertools import islice


def split_every(n, iterable):
    """Split an iterator every X items

    Parameters
    ----------
    n: int
        Number of items before split

    iterable: list
        Iterable that you use for spliting

    Examples
    --------
    list(split_every(5, range(9))) will produce [[0, 1, 2, 3, 4], [5, 6, 7, 8]]

    References
    ----------
    http://stackoverflow.com/a/1915307/1446284
    """
    i = iter(iterable)
    piece = list(islice(i, n))
    while piece:
        yield piece
        piece = list(islice(i, n))