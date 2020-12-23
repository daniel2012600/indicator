/******************************************
 -元件名：
 -描述：
 -html attr必要屬性
 id : 注意，不是屬性，元性的id，同一個頁面要有唯一性，裏面會用到，一定要設

 -屬性：
    dt_interval : x軸顯示的時間，一樣必須設，可能以下幾字串
        year :代表只顯示年份, ex 2017
        month :代表只顯示月份, ex 一月
        day:　代表只顯示日期, ex 2017-1-1
     data :
        data :[ {dt:'yyyy-mm-dd', 量值１:22, 量值2:44 },....], 注意，dt為保留字，限制為橫軸的鍵名，但方便編程，其他的都是量值
     meskeys_type :傳入陣列["bar", "bar", "line"]，代表第一、二個量值是用bar, 第三用line這是預設值，可以改
 -限制，特別說明：
    data裏面一定要有dt, dt格式一定'yyyy-mm-dd'
    量值最多三個
    量值一跟二用bar顯示，三一定用c

 -依賴：
 <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
 -顏色是從下面網站copy來的 http://www.wrappixel.com/demos/admin-templates/elegant-admin/main/index2.html
 -echarts範例看這：https://echarts.apache.org/examples/zh/editor.html?c=mix-line-bar
 -author:Rolence
 ******************************************/

Vue.component("v-echarts-mixlinebar-dt", {
    props: {
        data: Array,
        dimkey: {
            type: String,
            default: 'dt'
        },
        meskeys: {
            type: Array,
            default: () => []
        },
        meskeys_type: {
            type: Array,
            default: () => ['bar', 'line']
        },
        dt_interval: String,
        grid_bottom: {
            type: Number,
            default: 20
        },
        y_label_format: {
            type: Function,
            default: (val, key) => val
        },
        yaxis_single: {
            type: Boolean,
            default: false
        },
        color: {
            type: Array,
            default: () => ["#6574BB","#62CACA","#E1CCFA","#D58B23","#EED431","#999999","#253E9F","#82AF36","#6858A4","#91B6E6"]
        }
    },
    watch: {
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
    <div id="this.$attrs['id']" style="width: 100%;height:450px;"></div>
    `,
    data() {
        return {
            _chart: null
        };
    },
    methods: {
        //取得x軸的設定
        get＿xlable＿by＿type(x, type) {
            switch (type) {
                case 'year':
                    return new Date(x).getFullYear().toString();
                case 'm':
                    var month = this.months[new Date(x).getMonth()];
                    return month.toString();
                case 'month':
                    dt = new Date(x)
                    return dt.getFullYear() + "/" + (dt.getMonth() + 1);
                case 'day':
                case 'week':
                    return new Date(x).toISOString().slice(0, 10);
                default:
                    return 'labeltype屬性沒設值出錯了'
            }
        },
        
        
        rep_f0(num) {
            if (num == null) return 0
            return parseFloat(num.toFixed(0))
        },
        fKNum(strNum) {
            if (strNum.length <= 3) {
                return strNum;
            }
            if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
                return strNum;
            }
            var a = RegExp.$1,
                b = RegExp.$2,
                c = RegExp.$3;
            var re = new RegExp();
            re.compile("(\\d)(\\d{3})(,|$)");
            while (re.test(b)) {
                b = b.replace(re, "$1,$2$3");
            }
            return a + "" + b + "" + c;
        },
        //取得y軸的設定
        get_ylabel_by_data(){
            var ylabel_only2 = this.yaxis_single ? 1 :2;//y軸一定是取量值的前兩個去設
            var yAxis = this.meskeys.slice(0, ylabel_only2).map((ykey,idx) => {
                var series = this.get_series();
                var meskey_type = this.meskeys_type[idx]
                var res = _.filter(series, ['type', meskey_type])
                if(res.length > 1){
                    var vals = [];
                    _.forEach(res, item => { vals = vals.concat(item.data)})
                    var max = Math.max(...vals);
                    var min = Math.min(...vals);
                } else {
                    var vals = this.data.map(d=> d[ykey]);
                    var max = Math.max(...vals);
                    var min = Math.min(...vals);
                }
                var interval = Math.abs((max-min) / 10) > 1 ?  Math.round((max-min) / 10) : Math.ceil((max-min) / 10);
                if(vals.length === 1){
                    interval = interval == 0 ? 1 : interval
                }
                if(max <= 0 ){
                    max = max + interval >=0 ? 0 : (max + interval)
                } else if (min >= 0){
                    min = min - interval  <= 0 ? 0 : (min - interval)
                }
                
                return {
                    type: 'value',
                    name: ykey,
                    min: min,
                    max: max,
                    interval: interval,
                    axisLabel: {
                        formatter: (value, index) => {
                            return this.y_label_format(this.fKNum(value), ykey);
                        }
                    }
                };
            })
            return yAxis;
        },
        //取得series的設定
        get_series(){
            var series = this.meskeys.map((ykey, idx) => {
                return {
                    name: ykey,
                    type: this.meskeys_type[idx],
                    data: this.data.map(d => d[ykey]),
                    yAxisIndex: this.yaxis_single ? 0 : this.meskeys_type.indexOf(this.meskeys_type[idx])
                };
            });
            return series;
        },
        render() {
            if (this.data.length == 0) {
                return;
            }
            // 防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            // 動態偵測key by item[0]
            if (!this.meskeys.length) {
                for (var key in this.data[0]) if (key != this.dimkey && key != 'dtgroup') this.meskeys.push(key);
            }
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));
            var weekdays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");
            var origin_date = this.data.map(d => {
                if (this.dt_interval != undefined) {
                    return this.get＿xlable＿by＿type(d[this.dimkey], this.dt_interval);
                } else {
                    return d[this.dimkey]
                }
            })
            var e_date = _.map(origin_date,d=>{ 
                if (this.dt_interval == 'day'){
                    var week = weekdays[new Date(d).getDay()].split('星期')[1]
                    var date_edition = d + ' '+'('+week+')'+ ' '
                            return date_edition
                }else{
                    return d
                }})
            
            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        },
                        label: {
                            formatter: (params) => {
                                if (!params.seriesData.length) {
                                    if (this.yaxis_single){
                                        
                                        return this.y_label_format(this.fKNum(this.rep_f0(params.value)), this.meskeys[0]);
                                    } else {
                                        return this.y_label_format(this.fKNum(this.rep_f0(params.value)), this.meskeys[params.axisIndex]);
                                    }
                                }
                                return params.value
                            }
                        }
                    },
                    formatter: params => {
                        return params.map(d => {
                            var value = this.y_label_format(this.fKNum(d.data), d.seriesName);
                            return `${d.marker}${d.seriesName}: ${value}`
                        }).join('</br>');
                    }
                },
                color:  this.color,
                toolbox: {
                    feature: {
                        //dataView: {show: true, readOnly: false},
                        saveAsImage: {show: true, title: '保存為圖片'}
                    }
                },
                legend: {
                    data: this.meskeys,
                    top:'94%'
                },
                
                grid: {
                    bottom: this.grid_bottom + '%'
                },
                xAxis: [{
                    type: 'category',
                    data: e_date,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        rotate:45
                    }
                }],
                yAxis: this.get_ylabel_by_data(),
                series: this.get_series()
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            this._chart = myChart;

            //將chart元件放在window._echartskey就是這個chart的id
            if(window._echarts == undefined){window._echarts={}}
            window._echarts[this.$attrs['id']]=myChart;
        }
    },
    mounted(){
        this.render();
        window.addEventListener('resize', ()=>{
            if(this._chart){
                this._chart.resize();
            }
        });
    },
});