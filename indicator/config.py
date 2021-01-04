# -*- coding: utf-8 -*-
class Config(object):

    SQL_CONFIG = {
        'host': '35.200.15.129',
        'connect_timeout': 60,
        'read_timeout': 60,
        'write_timeout': 60,
        'max_allowed_packet': 102400,
        'user': 'cdpdev',
        'password': 'cdp!@#',
        'db': 'cdpplatformdb',
        'charset': 'utf8mb4'
    }

    GCS_JSONKEY = 'static/json/KeywordTag-3c600346e709.json'
    DOWNLOAD_PATH = 'static/filedownload/'

    BQGCS_CONFIG = {
        'GCS_ACCESS_KEY': "GOOGT3VSRBINAZUOKSNFLDIL",
        'GCS_SECRET_KEY': "nl/3xDx2rrtiqswJJIrALnWsI4h/PoC7i9Wyr0Sl",
        'GCS_BUCKET_NAME': "cdpplatform_rule_result",
        'BQ_PROJECT_ID': "keywordtag",
        'BQ_SERVICE_ACCOUNT': "dmplogstore@keywordtag.iam.gserviceaccount.com",
        'BQ_PRIVATE_KEY_PATH': "static/json/KeywordTag-3c600346e709.json",
        'BQ_DEFAULT_QUERY_TIMEOUT': 86400,  # 24 hours
        'BQ_DEFAULT_EXPORT_TIMEOUT': 86400,  # 24 hours
    }

    MONGO_CONN_DB = 'cdpbackenddb'
    MONGO_CONN = "mongodb://savebar1122:s%40veb%40r0524@35.200.1.235:27017/"

    MAIL_CONFIG = {
        'EMAIL_SENDER': 'service@eagleeye.com.tw',
        'SEND_GRID_KEY': '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',
        'SEND_IN_BLUE_SENDER': {"name":"service", "email":"service@eagleeye.com.tw"},
        'SEND_IN_BLUE_KEY': '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',
    }

    CRYPTO_PWD = 'cdpweb'

    API_PRIVATE_KEY = '~st@)2{G\\4,~s7{4<Q<pvr8kWH+8=!Cv'

    CDP_BACKEND_WEB_URI = 'http://34.84.221.26:8800'


class ProdConfig(Config):
    ENV_NAME = "Production"
    KEY = 'app-key-in-config'
    WEB_URI = 'https://cdppj.eagleeye.com.tw'

class DevConfig(Config):
    ENV_NAME = "Develop"
    DEBUG = True
    WEB_URI = 'https://cdppj-sit.eagleeye.com.tw'
    # WEB_URI = 'http://127.0.0.1:5000'
