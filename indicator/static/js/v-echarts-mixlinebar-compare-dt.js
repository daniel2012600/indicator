/******************************************
 -元件名：
 -描述：
 -html attr必要屬性
 id : 注意，不是屬性，元性的id，同一個頁面要有唯一性，裏面會用到，一定要設

 -屬性：
    xlabeltype : x軸顯示的時間，一樣必須設，可能以下幾字串
        year :代表只顯示年份, ex 2017
        month :代表只顯示月份, ex 一月
        day:　代表只顯示日期, ex 2017-1-1
     data1 :
        data1 :[ {dt:'yyyy-mm-dd', 量值:22 },....], 注意，dt為保留字, 一定要放在第一順位
     meskeys_type :傳入陣列["bar", "bar", "line"]，代表第一、二個量值是用bar, 第三用line這是預設值，可以改
 -限制，特別說明：
    data裏面一定要有dt, dt格式一定'yyyy-mm-dd'
    量值最多三個
    量值一跟二用bar顯示，三一定用c

 -依賴：
 underscore
 <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
 -顏色是從下面網站copy來的 http://www.wrappixel.com/demos/admin-templates/elegant-admin/main/index2.html
 -echarts範例看這：https://echarts.apache.org/examples/zh/editor.html?c=mix-line-bar
 -author:Rolence
 ******************************************/

Vue.component("v-echarts-mixlinebar-compare-dt", {
    props: {
        data1: Array,
        data2: Array,
        color: {
            type: Array,
            default: () => ["#6574BB","#62CACA","#E1CCFA","#D58B23","#EED431","#999999","#253E9F","#82AF36","#6858A4","#91B6E6"]
        },
        meskeys: String,
        meskeys_type: {
            type: Array,
            default: () => ['line','line','bar']
        },
        plotheight: {
            type: Number,
            default: 650
        },
        y_label_format: {
            type: Function,
            default: (val, key) => val
        }
    },
    watch: {
        data1() {
            this.render();
        },
        data2() {
            this.render();
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
        //取得x軸的設定
        format_legend(data) {
            if (!data.length) {
                return '';
            }
            var min = _.minBy(data, 'dt').dt;
            var max = _.maxBy(data, 'dt').dt;
            return `${min}~${max}`;
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
        get_xlabels(){
            //取得x座標的文字
            return _.zipWith(this.data1, this.data2, (d1, d2) => {
                var val1 = _.isEmpty(d1) ? '無日期資料' : d1.dt;
                var val2 = _.isEmpty(d2) ? '無日期資料' : d2.dt;
                return `${val1} VS ${val2}`;
            });
        },
        //取得series的設定
        get_series(){
            return [{
                name: this.format_legend(this.data1),
                type: this.meskeys_type[0],
                itemStyle: { color: this.color[0] },
                data: _.map(this.data1, this.meskeys),
                yAxisIndex: 0,
            },
            {
                name: this.format_legend(this.data2),
                type: this.meskeys_type[1],
                itemStyle: { color: this.color[1] },
                data: _.map(this.data2, this.meskeys),
                yAxisIndex: 0,
            }];
        },
        
        render() {
            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: params => {
                        return _.map(params, (d, idx) => {
                            var seriesName = d.axisValueLabel.split(' VS ')[idx];
                            var value = this.y_label_format(this.fKNum(d.data), this.meskeys);
                            return `${d.marker}${seriesName}: ${value}`
                        }).join('</br>');
                    }
                },
                color:  [
                    "#6574BB","#62CACA","#E1CCFA","#D58B23","#EED431","#999999","#253E9F","#82AF36","#6858A4","#91B6E6"
                ],
                toolbox: {
                    feature: {
                        dataView: {
                            show: true, 
                            readOnly: false
                        },
                        saveAsImage: { show: true, title: '保存為圖片' }
                    }
                },
                legend: {
                    orient: 'vertical',
                    show:true,
                    right: 100,
                    data: [
                        this.format_legend(this.data1),
                        this.format_legend(this.data2)
                    ]
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.get_xlabels(),
                        boundaryGap: false,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            rotate: 45,
                            // interval: 0,
                        }
                    }
                ],
                grid: {
                    bottom:'150'
                },
                yAxis: [{
                    name:  this.meskeys,
                    type: 'value',
                    axisLabel: {
                        formatter: (value, index) => {
                            return this.y_label_format(this.fKNum(value), this.meskeys);
                        }
                    }
                }],
                series: this.get_series()
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            this._chart = myChart;

            //將chart元件放在window._echartskey就是這個chart的id
            if(window._echarts == undefined){ window._echarts = {} }
            window._echarts[this.$attrs.id] = myChart;
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