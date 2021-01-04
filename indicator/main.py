# -*- coding: utf-8 -*-
# ==============================[引用]==============================
from library.main_global import *
from library.main_help import *
from service.rfm_service import RFM_DataService
from config import Config as cfg

app = Flask(__name__, template_folder = './templates', static_folder = './static')
app.secret_key = pd.util.testing.rands(24)  # 使用session必要初始值

# --------[登入頁]--------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        action = request.args.get('a', None)
        # 登出
        if action == 'out':
            if 'user' in session:
                if sche.has(session['user']['acc']):
                    sche.delete(session['user']['acc'])
                session.pop('user', None)
        # 已登入
        if 'user' in session:
            return redirect('/')

    elif request.method == 'POST':
        # 登入/資料存取
        dict_acc = py_.map_(AC.ACCOUNT_COLLECTION,'acc')
        if request.form['acc'] in dict_acc:
            dict_pwd = py_.filter_(AC.ACCOUNT_COLLECTION, {'acc': request.form['acc']})[0]['pwd']
            if  request.form['pwd'] in dict_pwd:
                return render_template('indicator.html')
            else :
                return render_template('user_login.html',viewbag_msg={ 'status': 0, 'msg': "密碼錯誤,請重新登入" })
                
        else:
            return redirect('/')

                

    return render_template('user_login.html')


@app.route('/socket_proc', methods=['POST'])
def socket_proc():
    data = request.json

    if data['type'] == "logout":
        socketio.emit(f"forcedLogout_{data['acc_id']}", {
            'action': 'logout', 
            'msg': '使用者帳號被刪除, 強制登出！'
        })

    elif data['type'] == "reload":
        socketio.emit(f"reload_account_{data['owner']}")


@app.route('/report/rfm_api', methods=['POST'])
def rfm_api():
    owner = json.loads(request.form['owner'])
    ser = RFM_DataService(owner,cfg.BQGCS_CONFIG['BQ_PRIVATE_KEY_PATH'])
    data = ser.get_rfm()
    orrrr = [{'d':'ee'}]
    return json.dumps(data)

@app.route('/report/rfm_matrix', methods=['POST'])
def rfm_matrix():
    owner = json.loads(request.form['owner'])
    ser = RFM_DataService(owner,cfg.BQGCS_CONFIG['BQ_PRIVATE_KEY_PATH'])
    data = ser.get_matrix()
    return json.dumps(data)

@app.route('/account_info', methods=['POST'])
def account_info():
    account_data = AC.ACCOUNT_COLLECTION
    return json.dumps(account_data)



@app.route('/')
@requires_login()
def layout():
    return render_template('indicator.html')

@app.route('/account')
def account():
    return render_template('account.html')
    # if request.method == 'GET':
    #     return render_template('account.html')
    # elif request.method == 'POST':
    #     return render_template('user_login.html')

if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.run()
