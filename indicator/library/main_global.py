# -*- coding: utf-8 -*-
from flask import Flask
from flask import render_template
from flask import request
from flask import make_response
from flask import abort
from flask import Blueprint
from flask import session
from flask import redirect
from flask import url_for
from flask import jsonify
from flask import g
from flask_socketio import SocketIO
from flask_caching import Cache
from werkzeug.contrib.cache import SimpleCache
import os
import sys
import arrow
import json
import datetime as dt
import requests
import threading
import base64
import pandas as pd
import numpy as np
import time
import decimal
import functools
import string
import random
import logging
import pymongo
import datetime
import pytz
import google.cloud.logging
import pydash as py_
import re
from PIL import Image
from io import BytesIO
from dateutil import tz
from functools import wraps
from pymongo import MongoClient
from time import time, struct_time, mktime
from service.account_service import AccountService
from account_db import AccountConfig as AC

from service.mongodb_service import MongoService
from library.download_gcs_file import gcs_download
from library.bq_crud import BigqueryService
from library.my_thread import MyThread


from service.lookup_service import LookupService


class CDPJsonEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime.datetime):
            return str(o)
        elif isinstance(o, datetime.date):
            return str(o)
        elif isinstance(o, decimal.Decimal):
            return float(o)
        elif isinstance(o, struct_time):
            return datetime.fromtimestamp(mktime(o))
        elif isinstance(o, np.ndarray):
            return o.tolist()
        # Any other serializer if needed
        return super(CDPJsonEncoder, self).default(o)

json.dumps = functools.partial(json.dumps, cls=CDPJsonEncoder)

sche = SimpleCache()
app = Flask(__name__, template_folder = '../templates', static_folder = '../static')
# app = Flask(__name__, instance_relative_config = True)
# Check Configuring Flask-Caching section for more details
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
app.config.from_object('config.ProdConfig')
app.secret_key = pd.util.testing.rands(24)  # 使用session必要初始值

socketio = SocketIO(app, async_mode='threading')
#app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon.ico'))

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] =  app.config['GCS_JSONKEY']
credentials, project = google.auth.default()
#logging_client = google.cloud.logging.Client(project='cdp-duz',credentials = credentials)
#logging_client.setup_logging()
client = google.cloud.logging.Client()
logging.basicConfig(level=logging.DEBUG)


web_url = app.config['WEB_URI']
sqlconfig = app.config['SQL_CONFIG']
bqgcs_config = app.config['BQGCS_CONFIG']
mail_sender = app.config['MAIL_CONFIG']['EMAIL_SENDER']
mail_key = app.config['MAIL_CONFIG']['SEND_GRID_KEY']
sendinblue_sender = app.config['MAIL_CONFIG']['SEND_IN_BLUE_SENDER']
sendinblue_key = app.config['MAIL_CONFIG']['SEND_IN_BLUE_KEY']

list_page_size = 10
tw_zone = pytz.timezone('Asia/Taipei')

# mongo_connect = MongoService(
#     app.config['MONGO_CONN'], 
#     app.config['MONGO_CONN_DB'], 
#     '')
