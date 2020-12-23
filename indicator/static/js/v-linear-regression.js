/*************************************
- 元件名:
        v-linear-regression.js
- 描述:
        線性迴歸分析圖
- 維度量值:
        dt、總銷售額
- html:
        id:必填，元件id，要有唯一性
- 限制:
        data裏面一定要有dt, dt格式一定'yyyy-mm-dd'
- 屬性:
        data : [{dt:'2020-10-01', 總銷售額:44},....]
        predict_count : 可選擇想預測的次數(想預測的日期)  ex:  公式為 y = 18715.99x + -3023.27  x為預測數(日期判定)
        dt_interval : 日期間隔，預設為 day 
- 依賴:
        <script src="/static/style/echarts/4.8.0/ecStat.js"></script>
- 作者:
        daniel
- 展示:
       https://echarts.apache.org/examples/zh/editor.html?c=scatter-linear-regression
- 使用範例:
       <v-echarts-pie id="pie" :data="piedata"></v-echarts-pie>
- 日期:
       2018-08-06 11:16
*************************************/


Vue.component("v-linear-regression", {
    props: {
        data: Array,
        y_label_format: {
            type: Function,
            default: (val, key) => val 
        },
        x_label_format: {
            type: Function,
            default: (val) => val 
        },
        predict_count:{
            type: Number,
            default: 0
        },
        dt_interval:{
            type: String,
            default: 'day'
        }
    },
    watch: {
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
        <div id="this.$attrs['id']" style="width: 100%; height: 450px;" ></div>
    `,
    data() {
        return {
            _chart: null
        };
    },
    methods: {
        format_dt(val, type){
            switch (type) {
                case 'year':
                     return moment(val).format('YYYY');
                case 'month':
                    return moment(val).format('YYYY-MM');
                case 'week':
                    return moment(val).format('YYYY-MM-DD');
                case 'day':
                    return moment(val).format('YYYY-MM-DD');
                default:
                    return val;
            }
        },
        get_x_label() {
            var date_list = this.data.map(item => {
                return this.format_dt(item['dt'], this.dt_interval);
            })

            var my_day = new Date(date_list[date_list.length-1])
            if(this.dt_interval == 'day'){
                for(i=1;i<=this.predict_count;i++){
                    var add_day = my_day.setDate(my_day.getDate() + 1)
                    var tomorrow_date = moment(add_day).format("YYYY-MM-DD")
                    date_list.push(tomorrow_date)};
                }
                else if(this.dt_interval == 'week'){
                    for(i=1;i<=this.predict_count;i++){
                        var add_day = my_day.setDate(my_day.getDate() + 7)
                        var next_week = moment(add_day).format("YYYY-MM-DD")
                        date_list.push(next_week)};
                    }
                else if(this.dt_interval == 'month'){
                for(i=1;i<=this.predict_count;i++){
                    var add_month = my_day.setMonth(my_day.getMonth() + 1)
                    var next_month  = moment(add_month).format("YYYY-MM")
                    date_list.push(next_month)};
                }
                else if(this.dt_interval == 'year'){
                for(i=1;i<=this.predict_count;i++){
                    var add_year = my_day.setYear(my_day.getFullYear() + 1)
                    var next_year  = moment(add_year).format("YYYY")
                    date_list.push(next_year)};
                }
            return date_list
        },
        render() {

            var thiscomp = this //有些method裏面引用不到this，就用這個
            //防止重覆呼叫，所以先清掉內文
            elobj = document.getElementById(this.$attrs['id']);
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_");
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            
            var c_data = _.map(this.data,(v,k) =>{ 
                var c_data = [k+1,v.總銷售額]
                return c_data})
            var myRegression = ecStat.regression('linear', c_data);
            
            var reg_data = _.map(myRegression.points,d=>{ 
                    d[1] = Math.floor(d[1] * 100) / 100
                    return d 
                })


            var pre_data = _.cloneDeep(reg_data).sort(function(a, b) {
                result = a[0] - b[0]
                return  result;
            });


            var a = myRegression.parameter.gradient
            var b = myRegression.parameter.intercept
            
            var data_count = this.data.length
            var origin_date = this.get_x_label()
            

            var weekdays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");
            var e_date = _.map(origin_date,d=>{ 
                if (this.dt_interval == 'day' || this.dt_interval == 'week'){
                    var week = weekdays[new Date(d).getDay()].split('星期')[1]
                    var date_edition = d + ' '+'('+week+')'+ ' '
                            return date_edition
                }else{
                    return d
                }})


            for(i=1;i<=this.predict_count;i++){
                var x = data_count + i
                var y = a * x + b
                var round_y = Math.floor(y * 100) / 100
                pre_data.push([x,round_y])
            }

            var option = {
                title: {
                    text: '線性迴歸分析',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    formatter: params => { 
                                var dt = origin_date[params[0].axisValueLabel-1]
                                // 如果 params  內有 '趨勢線' 資料 則刪除預測線資料
                                params.splice(1, 1)
                                var my_format = `${dt}<br/>` +params.map(d => {
                                    var value = this.y_label_format(d.data[1]||0, d.seriesName);
                                    return `${d.marker}${d.seriesName}: ${value}`
                                }).join('</br>');
                                return my_format }
                },
                grid:{
                    bottom: '10',
                    containLabel: true
                },

                xAxis: {
                    type: 'category',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        rotate:45,
                        formatter: params => {
                            var index = this.x_label_format(params)-1
                            return e_date[index]
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    min: 1.5,
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                },
                series: [{
                    name: '總銷售額',
                    type: 'scatter',
                    emphasis: {
                        label: {
                            show: true,
                            position: 'left',
                            color: 'blue',
                            fontSize: 16
                        }
                    },
                    data: c_data
                },
                {
                    name: '預測線',
                    type: 'line',
                    showSymbol: false,
                    data: pre_data,

                    lineStyle: {
                        type: "dashed",
                        color:  "rgba(17, 17, 17, 1)",
                        opacity: 0.6
                    },
                    markPoint: {
                        itemStyle: {
                            color: 'transparent'
                        },
                        data: [{
                            coord: pre_data[pre_data.length - 1]
                        }]
                    }
                },
                {
                    name: '趨勢線',
                    type: 'line',
                    showSymbol: false,
                    data: reg_data,
                    color:"rgba(17, 17, 17, 1)",
                    lineStyle: {
                        type: "solid",
                        color:  "rgba(17, 17, 17, 1)",
                        opacity: 1
                    },

                    markPoint: {
                        itemStyle: {
                            color: 'transparent'
                        },
                        data: [{
                            coord: reg_data[reg_data.length - 1]
                        }]
                    }
                },
            
            
            
                ]
            };
            


            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            thiscomp._chart = myChart;

            //將chart元件放在window._echartskey就是這個chart的id
            if(window._echarts == undefined){ window._echarts = {} }
            window._echarts[this.$attrs.id] = myChart;
        }
    },
    mounted: function () {
        var that = this;
        that.render();
        window.addEventListener('resize',function (){
            if(that._chart){
                that._chart.resize();
            }
        });
    },
});



