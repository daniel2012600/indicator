from library.main_global import *
from functools import wraps
from pytz import timezone


__all__ = [ "account_login", "cache_data", "verify_roles", "get_overview", "requires_login",
            "requires_apikey", "requires_mars", "requires_user_roles", "get_session_args", 
            "get_cache_args", "insrt_login_log", "query_login_log", "exec_target_user", 
            "order_filter_to_where", "exec_sms", "getPerchaseDataResult", "Exec_RuleResult",
            "get_airflow_is_done", "get_limit_store"]


# =============== jinja_env function ===============
# -------- 取得快取資料 --------
def cache_data():
    cache = sche.get(session['user']['email'])
    if cache:
        return json.dumps(cache)
    else:
        return {}

# -------- 驗證是否擁有權限 --------
def verify_roles(group1, group2, opt, val):
    try:
        cache = sche.get(g.get('user')['email'])
        if not cache:
            msg = account_login(g.get('user')['email'], g.get('user')['pwd'])
            if msg:
                raise Exception(msg)
        try:
            if cache['roles'][group1][group2]['children'][opt] == val:
                return True
            return False
        except Exception as e:
            return False
    except Exception as ex:
        print (f"*** 權限驗證出現錯誤 *** : {ex}")


# -------- 驗證悟饕首頁權限 --------
def get_overview():
    try:
        cache = sche.get(g.get('user')['email'])
        overview = '總覽'
        if '總覽' in cache['roles']:
            overview = py_.find_key(cache['roles']['總覽']['Empty']['children'], lambda x: x == 'on') or overview
        overview_dict = {
            "悟饕全國總覽": "wt/wt_national.html", 
            "悟饕區域總覽": "wt/wt_district.html", 
            "悟饕門店總覽": "wt/wt_store.html",
            "總覽": "overview.html"
        }
        overview_path = {
            "key": overview ,
            "value": overview_dict[overview] 
        }
        return overview_path
    except Exception as ex:
        print (f"*** Get Overview Error *** : {ex}")


# =============== flask requires function ===============
def requires_api():
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            auth = request.authorization
            msg = account_login(auth['username'], auth['password'])
            if msg:
                return json.dumps({'status': 0, 'msg': msg})
            return f(*args, **kwargs)
        return wrapped
    return wrapper


# -------- 需要登入 --------
def requires_login():
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            auth = request.authorization
            if auth:
                msg = account_login(auth['username'], auth['password'])
                if msg:
                    return json.dumps({'status': 0, 'msg': msg})
                else:
                    return f(*args, **kwargs)
            if 'user' not in session:
                return redirect(url_for('login'))
            if not sche.has(session['user']['email']):
                return redirect(url_for('login', a = 'out'))
            g.user = session['user']
            g.cache = sche.get(session['user']['email'])
            g.account_class = session['user']['owner']['owner_name']
            return f(*args, **kwargs)
        return wrapped
    return wrapper

# -------- 需要Api Key --------
def requires_apikey(view_function):
    @wraps(view_function)
    # the new, post-decoration function. Note *args and **kwargs here.
    def decorated_function(*args, **kwargs):
        origin_url = request.environ.get('HTTP_ORIGIN')

        if origin_url == request.host_url[:-1]:
            return view_function(*args, **kwargs)
        elif origin_url is not None and 'https' in origin_url:
            if str(origin_url).split('//')[1] ==  str(request.host_url[:-1]).split('//')[1]:
                return view_function(*args, **kwargs)

        if 'key' not in request.headers:
            return jsonify({'message': u'授權失敗'}), 401

        if request.headers['key'] == '~st@)2{G\\4,~s7{4<Q<pvr8kWH+8=!Cv':
            return view_function(*args, **kwargs)
        else:
            return jsonify({'message': u'授權失敗'}), 401

    return decorated_function

# -------- 限定mars --------
def requires_mars():
    """
    需要mars
    """
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if 'user' not in session or session['user']['email'] != "mars@reddoor.com.tw":
                return redirect(url_for('login'))
            return f(*args, **kwargs)
        return wrapped
    return wrapper

# -------- 需要角色權限 --------
def requires_user_roles(method, *roles):
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if 'user' not in session:
                return redirect(url_for('login'))
            if request.method == method:
                for item in roles:
                    if verify_roles(*item):
                        return f(*args, **kwargs)
            else:
                return f(*args, **kwargs)
            # Verify failed
            if method == 'GET':
                return redirect(request.headers.get("Referer"))
            else:
                return json.dumps({'status': 0, 'msg': "Verify authentication failed"})
        return wrapped
    return wrapper


# =============== main_help function ===============
# -------- 登入 --------
def account_login(acc, pwd):
    try:
        srvAcc = AccountService(sqlconfig, mongo_connect)
        msg, info = srvAcc.check_account_login(acc, pwd, app.config['ENV_NAME'])
        if not info:
            return msg
        if not request.authorization:
            session['account_class'] = info['owner']['owner_name']
            session['user'] = get_session_args(info)
            sche.set(info['email'], get_cache_args(info), 0)
        g.user = get_session_args(info)
        g.cache = get_cache_args(info)
        g.account_class = info['owner']['owner_name']
    except Exception as ex:
        print (ex)


# -------- 重新設定session存的key,value --------
def get_session_args(acc_info):
    args = {
        'id': acc_info['id'],
        'acc_name': acc_info['acc_name'], 
        'pwd': acc_info['pwd'], 
        'email': acc_info['email'],
        'owner_id': acc_info['owner_id'],
        'owner': {
            'name': acc_info['owner']['name'],
            'admin_name': acc_info['owner']['admin_name'],
            'admin_email': acc_info['owner']['admin_email'],
            'charge': acc_info['owner']['charge'],
            'cdp_acc_count': acc_info['owner']['cdp_acc_count'],
            'api_key': acc_info['owner']['api_key'],
            'email_key': acc_info['owner']['email_key'],
            'brands_uuid': acc_info['owner']['brands_uuid'],
            'line_channel_secret': acc_info['owner']['line_channel_secret'],
            'line_channel_access_token': acc_info['owner']['line_channel_access_token'],
            'sms_login_id': acc_info['owner']['sms_login_id'],
            'sms_password': acc_info['owner']['sms_password'],
            'owner_key': acc_info['owner']['owner_key'],
            'owner_name': acc_info['owner']['owner_name'],
            'owner_init': acc_info['owner']['owner_init'],
            'is_active': acc_info['owner']['is_active'],
            'expiry_dt': acc_info['owner']['expiry_dt']
        }
    }
    return args


# -------- 重新設定cache存的key,value --------
def get_cache_args(acc_info):
    args = {
        'init': acc_info['init'],
        'roles': acc_info['roles']
    }
    return args


# -------- 寫入登入記錄 --------
def insrt_login_log(owner, log):
    mongo_connect.set_coll(f"log_account_{owner}")
    mongo_connect.original_coll_conn().insert_one({
        'dt':datetime.datetime.now(tz=pytz.utc),
        'data':log
        })


# -------- 讀取登入記錄 --------
def query_login_log(owner, pg):
    # 讀取登入記錄
    mongo_connect.set_coll(f"log_account_{owner}")
    col = mongo_connect.original_coll_conn()

    cnt = col.estimated_document_count()
    pgsize = 12 #每頁大小

    cursor = col.find({}, { "_id": False }).sort(
        [("dt", pymongo.DESCENDING)]).skip((pg-1)*pgsize).limit(pgsize)

    from_zone = tz.gettz('UTC')
    to_zone = tz.gettz('Asia/Taipei')

    data = [{
        "dt":c["dt"].replace(tzinfo=from_zone).astimezone(to_zone).strftime("%Y-%m-%d %H:%M:%S"),
        'acc_name':c["data"]["acc_name"]
        } for c in cursor]
    return data, cnt


# -------- 讀取登入記錄 --------
def order_filter_to_where(data):
    # 一般選項處理
    bhv1 = "','".join(data["bhv1"])
    bhv2 = "','".join(data["bhv2"])
    ord_type = "','".join(data["ord_type"])
    ord_paytype = "','".join(data["ord_paytype"])
    prd_cat1 = "','".join(data["prd_cat1"])
    prd_cat2 = "','".join(data["prd_cat2"])
    touch1 = "','".join(data["touch1"])
    touch2 = "','".join(data["touch2"])
    dr = data['dr']
    # 門店選項處理 (權限)
    if data['area_store']:
        area_store = "','".join(data["area_store"])
    else:
        ser = LookupService(g.get('user')['owner']['owner_name'], sqlconfig)
        lookup_area_store = ser.get_lookup_area_store()
        store_object = py_.key_by(lookup_area_store, 'store_id')

        # 拿 store_id 當 key
        my_cache = sche.get(g.get('user')['email'])
        resp = py_.chain(my_cache['roles']['區域及門店']).map_(
            # 找出 "on" 的門店id
            lambda item: py_.keys(py_.pick_by(item['children'], py_.is_string)) 
        ).flatten().union().map(
            # 遍歷拿store完整資訊
            lambda key: store_object[key]
        ).value()

        area_store = "','".join(
            py_.map_(resp, lambda item: item['store_id'])
        )
    # 階層選項處理
    bhv_C = " OR ".join(py_.map_(
        py_.group_by(data["bhv_C"], 0), lambda items, key: "(bhv1 = '{}' AND bhv2 IN ('{}'))".format(key, "','".join(py_.map_(items, lambda i: i[1])))
    ))
    prd_cat_C = " OR ".join(py_.map_(
        py_.group_by(data["prd_cat_C"], 0), lambda items, key: "(prd_cat1 = '{}' AND prd_cat2 IN ('{}'))".format(key, "','".join(py_.map_(items, lambda i: i[1])))
    ))
    touch_C = " OR ".join(py_.map_(
        py_.group_by(data["touch_C"], 0), lambda items, key: "(touch1 = '{}' AND touch2 IN ('{}'))".format(key, "','".join(py_.map_(items, lambda i: i[1])))
    ))

    warr = []

    if dr:
        warr.append(f"DATE(dt) >= '{dr[0]}' AND DATE(dt) <= '{dr[1]}'")
    if area_store:
        warr.append(f"store_id IN ( '{area_store}' )")
    if bhv_C:
        warr.append(f"( {bhv_C} )")
    if bhv1:
        warr.append(f"bhv1 IN ( '{bhv1}' )")
    if bhv2:
        warr.append(f"bhv2 IN ( '{bhv2}' )")
    if ord_type:
        warr.append(f"ord_type IN ( '{ord_type}' )")
    if ord_paytype:
        warr.append(f"ord_paytype IN ( '{ord_paytype}' )")
    if prd_cat1:
        warr.append(f"prd_cat1 IN ( '{prd_cat1}' )")
    if prd_cat2:
        warr.append(f"prd_cat2 IN ( '{prd_cat1}' )")
    if prd_cat_C:
        warr.append(f"( {prd_cat_C} )")
    if touch1:
        warr.append(f"touch1 IN ( '{touch1}' )")
    if touch2:
        warr.append(f"touch2 IN ( '{touch2}' )")
    if touch_C:
        warr.append(f"( {touch_C} )")

    return " AND ".join(warr) if warr else 'True'


def get_airflow_is_done(owner):
    afSer = AfService(owner, sqlconfig)
    data = afSer.get_dag_run_last_one(f'clean_{owner}')
    last_run_dt = arrow.get(data['end_date']).shift(hours=8).format('YYYY-MM-DD')
    return arrow.now('Asia/Taipei').format('YYYY-MM-DD') == last_run_dt and data['state'] == 'success'


def get_limit_store():
    my_cache = sche.get(g.get('user')['email'])
    limit_store = py_.chain(my_cache['roles']['區域及門店']).map_(
        # 找出 "on" 的門店id
        lambda item: py_.keys(py_.pick_by(item['children'], py_.is_string)) 
    ).flatten().union().value()
    return limit_store


def exec_target_user(uid, owner, pf_key, tid, rulejson, lsort, pagesize):
    """
    查詢人群
    :param tid:
    :param rulejson:
    :param lsort:
    :param pagesize:
    """
    ser = RuleDataService(sqlconfig, owner)

    try:
        # get sql
        execser = ExecRule(web_domain=web_url, account_class=owner, pf_key=pf_key)
        selsql = execser.table_R_rule(json.loads(rulejson))

        ser_cust = CustomerDataService(owner, bqgcs_config['BQ_PRIVATE_KEY_PATH'])

        datalist = ser_cust.get_list(pf_key=pf_key, selsql=selsql, lsort= lsort,
                                pagesize=pagesize, page=1)

        ser.update_target_user_cache_info(tid, listjson=json.dumps(datalist,  ensure_ascii=False), dt=dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), status='completed')

    except Exception as ex:
        ser.update_target_user_cache_info(tid, listjson=[],
                                          dt=dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), status='failed')

        web_send_info(uid, 'targetsjson', {'status': 'failed', 'tid': tid})

        raise ex

    web_send_info(uid, 'targetsjson', {'status': 'completed', 'tid': tid, 'd': datalist})


def exec_sms(uid, owner, owner_key, sms_login_id, sms_password, rid, data):
    """
    :param rid:
    :param data:
    """

    batchts = dt.datetime.utcnow().timestamp()

    try:
        ser = SMSDataService(sqlconfig=sqlconfig, account_class=owner)
        red_ser = SMSApi(login_id=sms_login_id, pwd=sms_password)

        # send message tag
        tags = f'''sms_{rid}'''
        start_utctime = dt.datetime.utcnow()
        bq_dt = dt.datetime.now().strftime('%Y-%m-%d')
        try:
            # get point and check point
            account_point = red_ser.get_point()
            if account_point < 1:
                raise Exception('點數不足')

            serpr = SMSProfileDataService(owner, bqgcs_config['BQ_PRIVATE_KEY_PATH'])

            # get rule
            pitem = ser.get_sms_all(rid)

            # get bq ta table
            ta_ser = TargetReport(jsonkey_path=bqgcs_config['BQ_PRIVATE_KEY_PATH'], account_class=owner)
            tb_list = ta_ser.get_taid_table_list()

            ta_table = f'''sms_{rid}'''
            if ta_table not in tb_list:
                execser = ExecRule(web_domain=web_url, account_class=owner, pf_key=owner_key)
                r_sql = execser.table_R_rule(json.loads(pitem['rulesjson']))

                rule_sql = f'''{r_sql}
                                        SELECT DISTINCT DATE('{bq_dt}') AS dt, pid
                                        FROM R
                                        '''
                bq_ser = BigqueryService(app.config['GCS_JSONKEY'])
                bq_ser.bq_insert_partition_search(sql=rule_sql, destination_table_id=ta_table,
                                                  destination_dataset=f"ta_{owner}")


            # use web vm same timezone(utc)
            dt_now = dt.datetime.now().astimezone(pytz.utc).strftime('%Y-%m-%d')

            query = ta_ser.get_ta_phones_by_id(rule_type='sms', tid=rid, dt=dt_now)

            fdata = query['phone']
            pflen = len(fdata)

            # check point
            if account_point < pflen:
                raise Exception('點數不足')

            smscount = 0
            runcount = 0
            runsize = 10000

            while(runcount < pflen):

                endcount = runcount + runsize

                # decode phones
                mongo_connect.set_coll('cdpplatform_smslog')
                phonelist = serpr.get_phones(owner_key, fdata[runcount:endcount], mongo_connect)

                # send message.
                if len(phonelist) > 0:
                    smscount = smscount + len(phonelist)

                    if data['sch_type'] == 'realtime':
                        # *** Remember take out comment out in formal site ***
                        try:
                            sms_log_id = red_ser.send_message(phone=phonelist, msg=data['message'], tags=tags)
                            mongo_connect.Record_Message(
                                {'dt': dt.datetime.utcnow(), 'batch_ts': batchts, 'id': rid, 'status': 'success', 'message': 'send successed', 'SMSLogId': sms_log_id})
                        except Exception as ex:
                            mongo_connect.Record_Message({'dt': dt.datetime.utcnow(), 'batch_ts': batchts, 'id': rid, 'status': 'error', 'message': str(ex)})
                    elif data['sch_type'] == 'oneday':
                        try:
                            MaSer = MaTriggerService(
                                owner=owner, 
                                ds=arrow.get(data['sch_d1']).shift(hours=-8).format('YYYY-MM-DDTHH:mm:ssZ'), 
                                login_id=sms_login_id, 
                                pwd=sms_password
                            )
                            MaSer.schedule_sender(phone=phonelist, msg=data['message'], tags=tags, rid=rid, uid=uid)
                        except Exception as ex:
                            mongo_connect.set_coll('cdpplatform_weblog')
                            mongo_connect.Record_Message({'dt': dt.datetime.utcnow(), 'batch_ts': batchts, 'id': rid, 'status': 'error', 'message': str(ex)})
                            web_send_info(uid, 'smsprocess', {'status': 0})
                runcount = endcount
                web_send_info(uid, 'smsprocess',
                    {'status': 1, 'percent': f'{int((runcount/pflen)*100)}', 'sending_waiting': str(pflen - runcount)})

            if data['sch_type'] == 'realtime':
                up_data = {
                    'lastest_sch_status': '發送成功',
                    'm_dt': dt.datetime.now(tw_zone).strftime('%Y/%m/%d %H:%M:%S')
                }
    
                ser.update_sms(rid, up_data)
            elif data['sch_type'] == 'oneday':
                up_data = {
                    'lastest_sch_status': '待發送',
                }
                ser.update_sms(rid, up_data)

        except Exception as ex:

            up_data = {
                'm_dt': dt.datetime.now().strftime('%Y/%m/%d %H:%M:%S'),
                'lastest_sch_status': '發生錯誤'
            }

            ser.update_sms(rid, up_data)

            mongo_connect.set_coll('cdpplatform_weblog')
            mongo_connect.Record_Message({'dt': dt.datetime.utcnow(), 'batch_ts': batchts, 'id': rid, 'data': json.dumps(data), 'status': '發生錯誤', 'msg': str(ex)})
            web_send_info(uid, 'smsprocess', {'status': 0})

        finally:
            time.sleep(5)
            total_info = red_ser.get_send_history(tp='T', sdt=start_utctime.strftime('%Y-%m-%d'), edt= (start_utctime+dt.timedelta(days=1)).strftime('%Y-%m-%d'), tags=tags)

            if total_info['status'] == 1:
                detail = total_info['Data']
                memojson = {
                    'SendCount': detail['SendCount'],
                    'SuccessCount': detail['SuccessCount'],
                    'FailedCount': detail['FailedCount'],
                    'RejectBusinessCount': detail['RejectBusinessCount'],
                    'UsePoint': detail['UsePoint']
                }

                up_data['m_dt'] = dt.datetime.now(tw_zone).astimezone(tw_zone).strftime('%Y/%m/%d %H:%M:%S')
                up_data['lastest_sms_result'] = json.dumps(memojson)

                ser.update_sms(rid, up_data)
                web_send_info(uid, 'smsinfo', {'id': rid, 'status': up_data['lastest_sch_status'],
                                          'lastest_sms_result': json.dumps(memojson)})


    except Exception as ex:
        web_send_info(uid, 'smsinfo', {'id': rid, 'status': '發生錯誤', 'lastest_sms_result': str(ex)})
        mongo_connect.set_coll('cdpplatform_weblog')
        mongo_connect.Record_Message({'dt': dt.datetime.utcnow(), 'batch_ts': batchts, 'id': rid, 'status': '發生錯誤', 'msg': str(ex)})


def getPerchaseDataResult(owner, pid, pg_num, pg_size, total_rows=-1):
    """
    取得顯示購買記錄的資料格式
    """
    ser = CustomerDataService(account_class=owner, bqjson=bqgcs_config['BQ_PRIVATE_KEY_PATH'])

    if total_rows == -1:
        total_rows = ser.get_customer_perchase_count(pid)

    result_perchase = {'totalRows': total_rows, 'data': []}

    if total_rows < 1:
        return result_perchase

    data_list = ser.get_customer_perchase_list(pid, pg_num, pg_size)
    df = pd.DataFrame(data_list)
    detail_list = df[['ord_id', 'dt', 'ord_qty', 'ord_price', 'prd_name', 'prd_img', 'prd_sku', 'week', 'bhv1', 'bhv2', 'store_id', 'store_name', 'store_area', 'ord_paytype', 'ord_attr']].to_dict('records')

    df['total'] = df['ord_qty'] * df['ord_price']
    df['ord_total'] = df['total'].groupby(df['ord_id']).transform('sum')
    df.drop_duplicates('ord_id', 'first', inplace=True)
    df['dt'] = df['dt'].apply(lambda x: change_perchase_time_display(x))
    df['week'] = df['week'].apply(lambda x: x[-1])
    order_list = df[['ord_id', 'dt', 'ord_total', 'week', 'bhv1', 'store_id']].to_dict('records')

    isFirst = True
    for order in order_list:
        row = {'isFirst':isFirst, 'ord_id':order['ord_id'], 'dt':order['dt'],'ord_total':order['ord_total'],'week':order['week'],'bhv1':order['bhv1'],'store_id':order['store_id'],'detail': []}
        for detail in (x for x in detail_list if x['ord_id'] == order['ord_id']):
            rowd = {'ord_qty':detail['ord_qty'], 'ord_price':detail['ord_price'], 'prd_name':detail['prd_name'], 'prd_img':detail['prd_img'], 'prd_sku':detail['prd_sku'], 'bhv2':detail['bhv2'],'ord_paytype':detail['ord_paytype'],'ord_attr':detail['ord_attr']}
            row['detail'].append(rowd)
        result_perchase['data'].append(row)
        isFirst = False

    return result_perchase


def Exec_RuleResult(uid, owner, owner_key, rid, sql, cl):
    """
    執行bq並上傳檔案API
    :param rid: rule id
    :param sql: bq sql cmd
    :return: json {status,msg}
    """
    rrid = 0
    srv = RuleResultService(sqlconfig)

    if rid is None or sql is None:
        raise ValueError('傳入的參數不正確')

    sql = sql.replace('"', '\'')
    rrid = srv.insert_rule_result(int(rid), sql, cl)

    # Notify web file info.
    rule_result = srv.get_rule_result_by_id(rrid)
    web_send_info(uid, 'rulefile', rule_result)

    # Get Target User Info.
    if cl == 'custom':
        ser = RuleDataService(sqlconfig=sqlconfig, owner=owner)
        rule = ser.get_rule_by_id(int(rid))
        ta_rule = ser.get_target_user_rule_by_id(rule['target_user_id'])

        t2 = threading.Thread(target=exec_target_user, args=(uid, owner, owner_key, ta_rule['id'], ta_rule['rulesjson'], 'ltv', 300))
        t2.start()


    t1 = threading.Thread(target=export_from_query, args=(uid, owner, rrid, sql, onBigQueryExcutedFunc, onCompleteNotifyFunc))
    t1.start()

    print('exec sql...')


# =============== main_help private function ===============
def change_perchase_time_display(t):
    """
    若一週內則顯示n天前
    :param t:
    :return:
    """
    t = t.replace(tzinfo=None)
    currtime = dt.datetime.now().replace(tzinfo=None)
    aweekago = currtime - dt.timedelta(days=7)
    is_in_week = t >= aweekago
    if is_in_week:
        diff = currtime - t
        days = diff.days
        if days > 0:
            return f'{days}天前'
        hours = int((diff.seconds) / 3600)
        if hours > 0:
            return f'{hours}小時前'
        mins = int((diff.seconds) / 60)
        if mins > 0:
            return f'{mins}分鐘前'
        return '就在剛剛'
    else:
        return t.strftime('%Y-%m-%d %H:%M:%S')


def export_from_query(uid, owner, rrid, sql, onBigQueryFunc=None, onCompleteFunc=None):
    """
    在client呼叫bq_to_gcs的lib實作將結果上傳gcs
    :param rrid: (int)
    :param sql: (str)
    :param onCompleteFunc: (callback func) 完成後回呼此方法
    :return:
    """
    srv = RuleResultService(sqlconfig)
    try:
        # ----開始計時----
        s_time = dt.datetime.now()

        tw_time = dt.datetime.utcnow() + dt.timedelta(hours=8)
        # 預期格式為ruleresultid_yyyymmdd.csv
        file_name = '{}_{}.csv'.format(rrid, tw_time.strftime('%Y%m%d%H%M%S'))
        bq_gcs_srv = BqGcsService(bqgcs_config)
        rowcnt = bq_gcs_srv.bq_export_gcs_csv(sql, file_name,  'cdpplatform_temp', owner, onBigQueryFunc=onBigQueryFunc)

        # ----結束計時----
        e_time = dt.datetime.now()
        sec = (e_time - s_time).total_seconds()

        srv.export_rule_result(rrid, bqgcs_config['GCS_BUCKET_NAME'], owner, rowcnt, sec, file_name)

        if onCompleteFunc:
            onCompleteFunc(uid, rrid, owner)

    except Exception as ex:
        srv.processfail_rule_result(rrid)

        if onCompleteFunc:
            onCompleteFunc(uid, rrid, owner)

        raise ex


def onBigQueryExcutedFunc(rows):
    """
    執行完bq事件後，可自訂做些什麼
    :param rows: (int) 可取回的變數
    :return:
    """
    print('暫存表裡有:{}行'.format(rows))


def onCompleteNotifyFunc(uid, rrid, owner):
    """
    執行完bq_to_gcs事件後，可自訂做些什麼
    :param rrid: (int) 可取回的變數
    :return:
    """
    srv = RuleResultService(sqlconfig)
    # Notify web file info.
    rule = srv.get_rule_result_by_id(rrid)

    web_send_info(uid, 'rulefile',rule)


def web_send_info(uid, topic, data):
    """
     CDP Web socket
    :param eninfo:
    :return:
    """
    sendinfo = { "topic": topic, "data": data }
    biinfo = base64.b64encode(str.encode(json.dumps(sendinfo))).decode()
    print(f"{web_url}/SendInfo/{uid}/{biinfo}")
    requests.get(f"{web_url}/SendInfo/{uid}/{biinfo}", verify=False)

