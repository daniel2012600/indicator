# -*- coding: utf-8 -*-
# ==============================[引用]==============================
from library.main_global import *
from library.main_help import *
from service.rfm_service import RFM_DataService
from config import Config as cfg

app = Flask(__name__, template_folder = './templates', static_folder = './static')
app.secret_key = pd.util.testing.rands(24)  # 使用session必要初始值

# --------[登入頁]--------
# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'GET':
#         action = request.args.get('a', None)
#         # 登出
#         if action == 'out':
#             if 'user' in session:
#                 if sche.has(session['user']['email']):
#                     sche.delete(session['user']['email'])
#                 session.pop('user', None)
#         # 重設密碼
#         elif action == 'resetpwd':
#             return render_template('user_login.html',
#                 viewbag_msg={ 'status': 1, 'msg': "修改密碼成功,請使用新密碼登入" })
#         elif action == 'reload':
#             try:
#                 msg = account_login(session['user']['email'], session['user']['pwd'])
#                 if msg:
#                     raise Exception(msg)
#                 return json.dumps({ 'status': 'success', 'msg': '更新成功' })
#             except Exception as ex:
#                 return json.dumps({ 'status': 'error', 'msg': '更新失敗' })
#         # 已登入
#         if 'user' in session:
#             return redirect('/')

#     elif request.method == 'POST':
#         # 登入/資料存取
#         dict_acc = py_.map_(AC.ACCOUNT_COLLECTION,'acc')
#         if request.form['acc'] in dict_acc:
#             dict_pwd = py_.filter_(AC.ACCOUNT_COLLECTION, {'acc': request.form['acc']})[0]['pwd']
#             if  request.form['pwd'] in dict_pwd:
#                 return render_template('indicator.html')
#         if msg:
#             return render_template('user_login.html', 
#                 viewbag_msg={'status': 0,'msg': msg})
#         else:
#             return redirect('/')
#             insrt_login_log(g.get('user'))
#             socketio.emit('forcedLogout_' + g.get('user')['id'], {
#                 'action': 'logout', 
#                 'msg': '有使用者登入該帳號, 強制登出！'
#             })
                

    # return render_template('indicator.html')

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


@app.route('/')
def layout():
    return render_template('indicator.html')

@app.route('/echarts.heatmap')
def echarts_heatmap():
    return render_template('v-echarts.heatmap-demo.html')

if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.run()
