/*************************************
- 元件名:
       v-echarts-barstack-dt
- 描述:
       橫向顯示的堆疊圖
- 維度量值:
       dt維度1個，量值n個；dt維度是y軸，量值分顏色
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ data : [{dt:'abc', 量值1:44 , 量值2:44 , 量值3:44},....]
       ⓞ ylabeltype : year, month, week, day
       ⓞ meskeys : 陣列，可以不設，如果指定量值鍵，會決定量值出現在bar上的順序，由左到右
- 依賴:
       <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
- 作者:
       Rolence
- 展示:
       https://echarts.apache.org/examples/zh/editor.html?c=bar-y-category-stack
- 使用範例:
       <v-echarts-barstack-dt id="bs" :data="area_data" :ylabeltype="dtype" :meskeys="['僅購買1次', '複購2次', '複購3次', '複購大於3次']"></v-echarts-barstack-dt>
- 日期:
       2018-08-05 17:33
*************************************/

Vue.component("v-echarts-barstack-dt", {
    props: {
        data: Array,
        meskeys: Array,
        dt_interval: String,
        xaxis_max: {
            type: Number,
            default: 100
        },
        vertical: {
            type: Boolean,
            default: false
        },
        plotheight: {
            type: Number,
            default: 450
        },
        x_label_format: {
            type: Function,
            default: (val) => val + '%'
        },
        y_label_format: {
            type: Function,
            default: (val, key) => val + '%'
        },
        show_legend: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        data(val, val2) {
            this.render();
        },
        plotheight(val){
            document.getElementById(this.$attrs.id).style.height = val + 'px';
            this._chart.resize();
        }
    },
    template: `
        <div id="this.$attrs['id']" :style="{ height: plotheight + 'px', width: 100 + '%' }"></div>
    `,
    data() {
        return {
            _chart: null
        };
    },
    methods: {
        format_dt(val, type){
            switch (type) {
                case '每年':
                case 'year':
                     return moment(val).format('YYYY');
                case '每月':
                case 'month':
                    return moment(val).format('YYYY-MM');
                case '每週':
                case 'week':
                case '每月':
                case 'day':
                    return moment(val).format('YYYY-MM-DD');
                default:
                    return val;
            }
        },
        //取得series的設定
        get_series() {
            var series = _.map(this.meskeys, key => {
                return {
                    name: key,
                    type: 'bar',
                    stack: '總量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight',
                            formatter: param => {
                                return this.y_label_format(param.value, param.seriesName);
                            }
                        }
                    },
                    data: this.data.map(item => item[key])
                };
            });
            return series;
        },
        render() {
            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            //動態偵測key ykeys by item[0]
            if(this.meskeys == undefined) {
                for (var k in this.data[0]) if (k != 'dt') this.meskeys.push(k);
            }

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: params => {
                        var test = `${params[0].axisValueLabel}<br/>` +params.map(d => {
                            var value = this.y_label_format(d.data||0, d.seriesName);
                            return `${d.marker}${d.seriesName}: ${value}`
                        }).join('</br>');
                    return test
                    },
                },
                color: [
                    "#6574BB",
                    "#62CACA",
                    "#E1CCFA",
                    "#D58B23",
                    "#EED431",
                    "#999999",
                    "#253E9F",
                    "#82AF36",
                    "#6858A4",
                    "#91B6E6",
                ],
                legend: {
                    show: this.show_legend,
                    data: this.meskeys,
                    type: "scroll",
                    pageButtonPosition: "start"
                },
                toolbox: {
                    show: true,
                    feature: {
                        //dataView: {show: true, readOnly: false},
                        saveAsImage: {show: true, title: '保存為圖片'}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    max: this.xaxis_max,
                    axisLabel: {
                        formatter: (value, index) => {
                            return this.x_label_format(value);
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    data: this.data.map(item => {
                        return this.format_dt(item['dt'], this.dt_interval);
                    }),
                },
                series: this.get_series(),
            };

            if(this.vertical){
                var xAxis_option = _.cloneDeep(option["xAxis"]);
                var yAxis_option = _.cloneDeep(option["yAxis"]);
                option["xAxis"] = yAxis_option;
                option["yAxis"] = xAxis_option;
            }

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            this._chart = myChart;

            //將chart元件放在window._echartskey就是這個chart的id
            if(window._echarts == undefined){window._echarts={}}
            window._echarts[this.$attrs['id']] = myChart;
        }
    },
    mounted() {
        this.render();
        window.addEventListener('resize', () => {
            if(this._chart){
                this._chart.resize();
            }
        });
    },
});