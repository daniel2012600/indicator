from google.cloud import storage
import os

class gcs_download:

    _storage_client = None

    def __init__(self, jsonkey):
        self._storage_client = storage.Client.from_service_account_json(
            jsonkey)

    def download_file(self, bucket_name, fpath, destination_name):

        if len(fpath) == 0:
            return ''

        if os.path.isfile(destination_name):
            return destination_name

        bucket = self._storage_client.get_bucket(bucket_name)
        blob = bucket.blob(fpath)

        blob.download_to_filename(destination_name)

        return destination_name
