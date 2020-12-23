import datetime as dt
import pytz

tw = pytz.timezone('Asia/Taipei')

data_dt = dt.datetime.strptime('20190701', '%Y%m%d')
ds_nodash = data_dt.strftime('%Y%m%d')
ds = data_dt.strftime('%Y-%m-%d')


def get_parameter():

    global data_dt, ds_nodash, ds

    data_dt = dt.datetime.now().astimezone(tw) + dt.timedelta(days=-1)

    ds_nodash = data_dt.strftime('%Y%m%d')
    ds = data_dt.strftime('%Y-%m-%d')



