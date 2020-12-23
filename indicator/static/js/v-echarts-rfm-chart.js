/*
描述:
    RFM人數分布圖
html:
    id:必填，元件id，要有唯一性
屬性:
    data : [{"rfm":"M",         設定RFM類型
            "rank":6,           設定級距
            "cnt":1767,         級距內佔有數
            "label1":"9424",    級距內最小值
            "label2":"91332",   級距內最小值
            "unit":"元"         級距單位
    },
    {"rfm":"F","rank":6,"cnt":19,"label1":"83","label2":"365","unit":"次"},{"rfm":"R","rank":6,"cnt":66031,"label1":"0","label2":"5","unit":"天"},..............]
參考:
    https://echarts.apache.org/examples/zh/editor.html?c=bar-y-category
*/




Vue.component("v-echarts-rfm", {
    // props: ["data", "plotheight"],
    props:{
        data:{
            type : Array
        },
        plotheight :{
            type: Number,
            default: 450
        }
    },
    watch: {
        data: function () {
            this.render()
        }
    },
    template: `
            <div id="this.$attrs['id']" v-bind:style=" 'width: 100%;min-height:' + this.plotheight + 'px'"></div>
        `,
    data() {
        return {
            _chart: null
        };
    },
    methods: {
        k_sep(strNum){
            //千分位逗號
            if (strNum.length <= 3) {
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
        //繪出圖型
        render() {
            var tData = this.data;
            var rfmlabel = ['R(最近有買)',  'F(消費次數)', 'M(消費金額)'];
            var colcolor = ["#6574BB","#62CACA","#E1CCFA","#D58B23","#EED431","#999999","#253E9F","#82AF36","#6858A4","#91B6E6"];

            var xData = [[],[],[]];
            var yData = [[],[],[]];

            for (var i = 0; i < tData.length; i++) {
                var item = tData[i];
                var ylabel = `[${item.rank}]: ${this.k_sep(item.label1)}~${this.k_sep(item.label2)} ${item.
                    unit}`
                switch(item.rfm) {
                    case 'R':
                        xData[0].push(item.cnt);
                        yData[0].push(ylabel);
                        break;
                    case 'F':
                        xData[1].push(item.cnt);
                        yData[1].push(ylabel);
                        break;
                    case 'M':
                        xData[2].push(item.cnt);
                        yData[2].push(ylabel);
                        break;
                }

            }

            var myChart = echarts.init(document.getElementById(this.$attrs['id']));
            var legenddData = {};
            var option = {

                title: [],

                grid: [{
                    x: '2%',
                    y: '14%',
                    width: '26%',
                    height: '80%',
                    containLabel: true,
                }, { //b
                    x: '34%',
                    y: '14%',
                    width: '26%',
                    height: '80%',
                    containLabel: true,
                }, { //c
                    x: '68%',
                    y: '14%',
                    width: '26%',
                    height: '80%',
                    containLabel: true,
                }],

                ////xAxis开始/////
                xAxis: [{
                    splitNumber: 4,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        rotate:45
                    }
                }, {
                    gridIndex: 1,
                    splitNumber: 4,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        rotate:45
                    }
                }, {
                    gridIndex: 2,
                    splitNumber: 4,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        rotate:45
                    }
                }],

                ////yAxis开始/////
                yAxis: [{
                    name: rfmlabel[0],
                    axisLabel: {
                        interval: 0,
                        color: colcolor[0]
                    },
                    data: yData[0].reverse(),
                }, { //b
                    name: rfmlabel[1],
                    gridIndex: 1,
                    axisLabel: {
                        interval: 0,
                        color: colcolor[1]
                    },
                    data: yData[1].reverse(),
                }, { //c
                    name: rfmlabel[2],
                    gridIndex: 2,
                    axisLabel: {
                        interval: 0,
                        color: colcolor[2]
                    },
                    data: yData[2].reverse(),
                }],

                tooltip: {
                    formatter: parmes => {
                        return parmes.name + ":" + this.k_sep(parmes.value) + "人";
                    }
                },
                legend: {
                    data: rfmlabel,
                    selected: legenddData
                },


                series: [

                    /////////bar开始/////////////
                    { //a
                        name: 'A组',
                        type: 'bar',
                        data: xData[0].reverse(),
                        color: colcolor[0],
                        label: {
                            show: true,
                            position: 'right',
                            align: 'left',
                            formatter: p => this.k_sep(p.value)
                        },

                    }, { //b
                        name: 'B组',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: xData[1].reverse(),
                        color: colcolor[1],
                        label: {
                            show: true,
                            position: 'right',
                            align: 'left',
                            formatter: p => this.k_sep(p.value)
                        },

                    }, { //c
                        name: 'C组',
                        type: 'bar',
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        data: xData[2].reverse(),
                        color: colcolor[2],
                        label: {
                            show: true,
                            position: 'right',
                            align: 'left',
                            formatter: p => this.k_sep(p.value)
                        },

                    }
                ]
            };

            myChart.setOption(option);
            this._chart = myChart;

            //將chart元件放在window._echartskey就是這個chart的id
            if(window._echarts == undefined){window._echarts={}}
            window._echarts[this.$attrs['id']]=myChart;
        }
    },
    mounted() {
        this.render();
        window.addEventListener('resize', ()=>{
            if(this._chart){
                this._chart.resize();
            }
        });
    },


})
;