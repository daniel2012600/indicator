import pymysql
import flask_bcrypt
import json
import arrow
import re
import petl
import pandas as pd
import numpy as np
import pydash as py_


class AccountService:

    def __init__(self, sqlconfig=False, mongo_conn=False):
        self.sqlconfig = sqlconfig
        self.mongo_conn = mongo_conn


    def _generate_password_hash(self, password):
        """
        生成hash密碼
        :param password
        :return password hash
        """

        # 在python3中，你需要使用在generate_password_hash()上使用decode('utf-8')方法
        return flask_bcrypt.generate_password_hash(password).decode('utf-8')


    def upsert_account(self, acc_json):
        """
        新增帳號權限
        :param role_id
        :param email
        :param name
        :param password
        :return is success
        """

        # password_hash = self._generate_password_hash(acc_json['pwd'])
        # acc_json['pwd'] = password_hash

        self.mongo_conn.set_coll('account')
        acc_id = self.mongo_conn.upsert(acc_json)

        return acc_id


    def upsert_account_roles(self, role_json):
        """
        更新帳號權限
        :param acc_id
        :param role_id
        :return is success
        """
        self.mongo_conn.set_coll('account_roles')
        self.mongo_conn.upsert(role_json)


    def push_account_roles(self, role_id, role_json):
        self.mongo_conn.set_coll('account_roles')
        self.mongo_conn.push(role_id, role_json)


    def delete_account(self, acc_id):
        """
        新增or更新帳號權限
        :param acc_id
        """
        self.mongo_conn.set_coll('account')
        self.mongo_conn.delete_one(acc_id)


    def delete_account_role(self, role_id):
        """
        新增or更新帳號權限
        :param acc_id
        """
        self.mongo_conn.set_coll('account_roles')
        self.mongo_conn.delete_one(role_id)


    def check_account_login(self, email, password, env_name):
        """
        檢查帳號密碼
        :param email
        :param password
        :return 帳號內容
        """

        today = arrow.now('Asia/Taipei')
        mongoDB = self.mongo_conn.original_db_conn()
        find_acc = mongoDB['account'].find({"email": email, "pwd": password})
        if find_acc.count() == 1:
            acc_info = find_acc[0]
            acc_owner = mongoDB['owner'].find({'id': acc_info['owner_id']})
            if acc_owner.count() == 1:
                acc_owner = acc_owner[0]
                if acc_owner['is_active'] == '0':
                    return '帳號未被啟用', {}
                if today > arrow.get(acc_owner['expiry_dt']):
                    return '帳號過期，無法登入', {}
                roles = list(mongoDB['account_roles'].find({'acc_ids': acc_info['id']}))
                if not roles:
                    return '該帳戶沒有任何角色權限, 請聯絡管理員協助設定', {}
                # 取得 Owner 設定
                init_store = self.get_area_store_all(acc_owner['owner_name'])
                # 合併權限
                permissions = self.get_all_permissions(acc_owner['owner_init']['web'], env_name)
                acc_role = self.merge_all_role_permissions(roles, permissions, init_store)
                # 設定"權限"和"Owner資訊"
                acc_info['roles'] = acc_role
                acc_info['owner'] = acc_owner
                acc_info['init'] = acc_owner['owner_init']
                # 測試站統一使用 reddoor 測試帳號, 發送簡訊
                if env_name == 'Develop':
                    acc_info['owner']['sms_login_id'] = 'reddoor_test'
                    acc_info['owner']['sms_password'] = 'XEKRqlhC'
                # acc_info['filter'] = self.get_filter_data(acc_owner['owner_init']['filter'], acc_role, init_store)
                return "", acc_info
        else:
            return '帳號或密碼錯誤，請重新輸入', {}


    def get_account(self, **kargs):
        """
        取得帳號內容
        :param acc_id
        :return 帳號內容
        """
        owner_id =  kargs.pop('owner_id', None)
        pg = kargs.pop('pg', None)
        acc_id = kargs.pop('id', None)
        filter_key = kargs.pop('filter_key', None)
        email = kargs.pop('email', None)
        query_str = {}

        if owner_id:
            query_str["owner_id"] = owner_id
        if acc_id:
            query_str["id"] = acc_id
        if email:
            query_str["email"] = email
        if filter_key:
            query_str["$or"] = [{"email": {"$regex": f'.*{filter_key}.*', '$options':'i'}}, {"acc_name": {"$regex": f'.*{filter_key}.*', '$options':'i'}}]
        self.mongo_conn.set_coll('account')
        cnt = self.mongo_conn.find_count(query_str)
        acc_info = self.mongo_conn.find(query_str, pg=pg, pgsize=300)
        return acc_info, cnt


    def get_account_roles(self, **kargs):
        """
        取得權限列表
        :return 權限列表
        """
        owner_id =  kargs.pop('owner_id', None)
        pg = kargs.pop('pg', None)
        filter_key = kargs.pop('filter_key', None)
        query_str = {}

        if owner_id:
            query_str["owner_id"] = owner_id
        if filter_key:
            query_str["role_name"] = {"$regex": f'.*{filter_key}.*', '$options':'i'}

        self.mongo_conn.set_coll('account_roles')
        cnt = self.mongo_conn.find_count(query_str)
        all_role_by_an_owner = self.mongo_conn.find(query_str, pg=pg, pgsize=300)
        return all_role_by_an_owner, cnt 


    def get_area_store_all(self, owner):
        sql = f'''
        SELECT store_area, store_id FROM `lookupdb`.`lookup_area_store` WHERE `owner` = '{owner}'
        '''

        conn = pymysql.connect(**self.sqlconfig)
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(sql)

        item = cursor.fetchall()

        cursor.close()
        conn.close()

        return item


    def get_all_permissions(self, web_init, env_name):
        with open('static/json/permissions.json', 'r') as f:
            data = f.read()
            result = json.loads(data)
            for idx, item in enumerate(result):
                if not item['isPublic'] and item['name'] not in web_init['visable_custom_page']:
                    result[idx] = None
                # 暫時寫死, 測試站唯一顯示
                if env_name != 'Develop' and item['class'] in ['展示區']:
                    result[idx] = None
            return py_.compact(result)


    def get_filter_data(self, filter_init, role, store):
        # 拿 store_id 當 key
        store_object = py_.key_by(store, 'store_id')
        filter_init['store']['val'] = py_.chain(role['區域及門店']).map_(
            # 找出 "on" 的門店id
            lambda item: py_.keys(py_.pick_by(item['children'], py_.is_string))
        # 解開一層去重, 遍歷拿store完整資訊
        ).flatten().union().map(
            lambda key: store_object[key]
        ).value()
        return filter_init


    def merge_all_role_permissions(self, roles, permissions, store):
        # 預設權限模板
        template_role = py_.chain(permissions).group_by('class').map_values(
            lambda item: py_.chain(item).group_by('class2').map_values(
                lambda it: {
                    'status': 'on', 
                    'children': py_.chain(it).group_by('name').map_values(lambda t: 'on').value()
                }
            ).value()
        ).value()

        template_role['區域及門店'] = py_.chain(store).group_by('store_area').map_values(
            lambda st: {
                'status': 'on', 
                'children': py_.chain(st).group_by('store_id').map_values(lambda s: 'on').value()
            }
        ).value()

        # 管理者使用預設全開權限
        if '管理員' in py_.map_(roles, 'role_name'):
            return template_role

        # 合併權限
        is_first = True
        for role in roles:
            for name1, group in template_role.items():
                for name2, item in group.items():
                    # 新的權限區塊關閉, 同時符合 (第一次 或 原本權限區塊也是關閉)
                    item['status'] = None if not py_.get(role['func'], f'{name1}.{name2}.status') and (is_first or not item['status']) else 'on'
                    for key, val in item['children'].items():
                        item['children'][key] = None if not py_.get(role['func'], f'{name1}.{name2}.children.{key}') and (is_first or not val) else 'on'
            is_first = False

        return template_role


    def batch_upload_account_verify(self,  owner_id, owner, filename, role_ids, acc_limit):
        acc_data = []
        role_data = []
        c_dt = arrow.now("Asia/Taipei").format("YYYY-MM-DD")
        df = pd.read_excel(filename, usecols=["姓名", "Email", "角色"]).fillna('None')
        if len(df.index) > acc_limit:
            return [{'name': 'acc_limit', 'row': 0, 'field': None, 'value': None, 'error': 'AssertionError'}], [], []
        email_reg = '^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$'

        self.mongo_conn.set_coll('account')
        acc_info = self.mongo_conn.find({"owner_id": owner_id})
        name_list = py_.map_(acc_info, lambda x: x['acc_name'])
        email_list = py_.map_(acc_info, lambda x: x['email'])
        role_name_list = py_.map_(role_ids, lambda x: x['role_name'])
        role_id_list = py_.map_(role_ids, lambda x: x['id'])
        role_dict = py_.zip_object(role_name_list, role_id_list)

        tbl_src = petl.fromdataframe(df)
        header = ('姓名', 'Email', '角色')
        constraints = [
            dict(name='row_empty', assertion=lambda v: 'None' not in v),
            dict(name='name_repeated', field='姓名', assertion=lambda v: v not in name_list or 'None' in v),
            dict(name='email_error', field='Email', assertion=lambda v: v not in email_list and re.search(email_reg, v) or 'None' in v),
            dict(name='role_error', field='角色', assertion=lambda v: v in role_name_list or 'None' in v),
        ]
        problems = petl.validate(tbl_src, header=header, constraints=constraints)

        acc_data = py_.map_(df.values, lambda x: { "acc_name": x[0], "email": x[1], "pwd": "", "c_dt": c_dt, "m_dt": c_dt,  "owner_id": owner_id})
        role_data = py_.map_(df.values, lambda x: py_.get(role_dict, x[2]))
        return problems.todf().to_dict('records'), acc_data, role_data


