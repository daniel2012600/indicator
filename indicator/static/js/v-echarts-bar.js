/*************************************
- 元件名:
       v-echarts-bar
- 描述:
       直式柱狀圖,會顯示top代表最高的值, 顯示平均線
- 維度量值:
       維度1個，量值n個；維度是x軸，量值分顏色
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ data : [{x軸維度:'abc', 量值1:44 , 量值2:44 , 量值3:44},....]
       ⓞ meskeys : 陣列，列舉要顯示的量值
- 依賴:
       <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
- 作者:
       Rolence
- 展示:
       http://echarts.baidu.com/examples/editor.html?c=bar1
- 使用範例:
       <v-echarts-bar id="rebuy1" :data="rebuydata" :meskeys="['回購天數佔比']" :plotheight="450"></v-echarts-bar>
- 日期:
       2018-08-05 17:16
*************************************/
Vue.component("v-echarts-bar", {
    props: {
        data:Array,
        meskeys:Array,
        //顯示平均線，若設為"true"代表顯示，預設不顯示
        //數值符號
        xaxis_location: {
            type:String, 
            default:'middle'
        },
        //圖下方空間佔高度的百分比
        gird_bottom: {
            type: Number,
            default: 20
        }, 
        plotheight: {
            type: Number,
            default: 450
        },
        bar_color: {
            type: String,
            default: "#6574BB"
        },
        xlabel: {
            type: String,
            default: ""
        },
        tooltip_label: String,
        x_label_format: {
            type: Function,
            default: (val) => val
        },
        y_label_format: {
            type: Function,
            default: (val, key) => val
        }
    },
    watch: {
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
            <div id="this.$attrs['id']" style="width: 100%;" :style="{height:plotheight+'px'}"></div>
        `,
    data() {
        return {
            _chart: null
        };
    },
    methods: {
        fKNum(strNum) {
            if (strNum && strNum.length <= 3) {
                return strNum;
            }
            if (!RegExp('^(\\+|-)?(\\d+)(\\.\\d+)?$').test(strNum)) {
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
        //取得series的設定
        get_series(meskeys) {
            series = meskeys.map((meskeys) => {
                var vals = this.data.map(d=> {
                    return d[meskeys]
                });
                return {
                    name: meskeys,
                    type: 'bar',
                    markLine: null,
                    data: vals
                };
            });
            return series;
        },
        render() {
            if (this.data == undefined || this.data.length == 0)
                return;

            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            //動態偵測key ykeys by item[0]
            var allkeys = Object.keys(this.data[0]);
            meskeys = this.meskeys
            if (meskeys == undefined) {
                if(allkeys){
                    meskeys = allkeys.slice(1, allkeys.length)
                }else{
                    meskeys = ''
                }
            }
            var dimkey = allkeys[0] //第零個是維度

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            var option = {
                color: [
                    this.bar_color, "rgba(52, 58, 64, 0.85)", "rgba(0, 158, 251, 0.85)", 
                    "rgba(246, 45, 81, 0.85)", "rgba(54, 190, 166, 0.85)", "rgba(255, 188, 52, 0.85)"
                ],
                tooltip: {
                    trigger: 'axis',
                    formatter: params => {
                        return params.map(d => {
                            var value = this.y_label_format(this.fKNum(d.data), d.seriesName);
                            return `${d.marker}${d.seriesName}: ${value}`
                        }).join('</br>');
                    },
                },
                grid: {
                    bottom: this.gird_bottom + '%'
                },
                legend: {
                    data: meskeys,
                    top:"94%"
                },
                toolbox: {
                    show: true,
                    feature: {
                        // dataView: {show: true, readOnly: false},
                        saveAsImage: {show: true, title: '保存為圖片'}
                    }
                },
                calculable: true,
                xAxis: [{
                    name: this.xlabel,
                    nameLocation: this.xaxis_location,
                    nameGap: 35,
                    type: 'category',
                    data: this.data.map(d => d[dimkey]),
                    axisLabel: {
                        rotate:45,
                        formatter: params => this.x_label_format(params)
                    }
                }],
                yAxis: [{
                    name: meskeys[0],
                    type: 'value',
                    axisLabel: {
                        formatter: (value, index) => {
                            return this.y_label_format(this.fKNum(value), meskeys[0]);
                        }
                    }
                }],
                series: this.get_series(meskeys)
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            this._chart = myChart;

            //將chart元件放在window._echartskey就是這個chart的id
            if(window._echarts == undefined){window._echarts={}}
            window._echarts[this.$attrs['id']] = myChart;
        }
    },
    mounted: function () {
        this.render();
        window.addEventListener('resize', () => {
            if(this._chart){
                this._chart.resize();
            }
        });
    },
});