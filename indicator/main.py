# -*- coding: utf-8 -*-
# ==============================[引用]==============================
from library.main_global import *
from library.main_help import *
from service.rfm_service import RFM_DataService
from config import Config as cfg

app = Flask(__name__, template_folder = './templates', static_folder = './static')
app.secret_key = pd.util.testing.rands(24)  # 使用session必要初始值

@app.route('/report/rfm_api', methods=['POST'])
def rfm_api():
    owner = json.loads(request.form['owner'])
    ser = RFM_DataService(owner,cfg.BQGCS_CONFIG['BQ_PRIVATE_KEY_PATH'])
    period = json.loads(request.form['period'])
    dt_list = ser.trans_time(period)
    js =  '''
        var res = 6
        if ( v >= rg0 && v < rg1 ) {res = 1}
        else if ( v >= rg1 && v < rg2 ) {res = 2}
        else if ( v >= rg2 && v < rg3 ) {res = 3}
        else if ( v >= rg3 && v < rg4 ) {res = 4}
        else if ( v >= rg4 && v < rg5 ) {res = 5}
        else {res = 6}
        if (revert > 0){
            res = 7 - res
        }
        return res
        '''
    data = ser.get_rfm(dt_list,js)
    orrrr = [{'d':'ee'}]
    return json.dumps(data)

# ========================[Component Demo頁]========================
@app.route('/')
def layout():
    return render_template('indicator.html')

@app.route('/echarts.heatmap') 
def echarts_heatmap():
    return render_template('v-echarts.heatmap-demo.html')

if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.run()
