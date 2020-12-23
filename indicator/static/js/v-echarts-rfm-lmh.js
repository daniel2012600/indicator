
/*
描述:
    RFM-自訂圖
html:
    id:必填，元件id，要有唯一性
屬性:
    data : {"rl":28653,"rm":142495,"rh":235679,"fl":334191,"fm":70355,"fh":2281,"ml":221935,"mm":128669,"mh":56223}
    ytext : 須為object， ex:[ [60,200],[20,140],[3000,10000] ]
    [    R[0~a天，a~b天]    F[0~a次，a~b次]    M[0~a元，a~b元]    ]
參考:
    https://echarts.apache.org/examples/zh/editor.html?c=bar-y-category

*/


Vue.component("v-echarts-rfm-lmh", {
    props: {
        data: { type: Object },
        plotheight: { 
            type: Number,
            default: 450 },
        ytext: { type: Array 
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
        k_sep(strNum) {
            //千分位逗號
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
        //繪出圖型
        render() {
            var tData = this.data;

            var rfmlabel = ['R(最近有買)', 'F(消費次數)', 'M(消費金額)'];
            var colcolor = ["#6574BB","#62CACA","#E1CCFA","#D58B23","#EED431","#999999","#253E9F","#82AF36","#6858A4","#91B6E6"];

            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

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
                        rotate: 45
                    }
                }, {
                    gridIndex: 1,
                    splitNumber: 4,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        rotate: 45
                    }
                }, {
                    gridIndex: 2,
                    splitNumber: 4,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        rotate: 45
                    }
                }],

                ////yAxis开始/////
                yAxis: [{
                    name: rfmlabel[0],
                    axisLabel: {
                        interval: 0,
                        color: colcolor[0]
                    },
                    data: [
                        `低(${this.k_sep(this.ytext[0][1])}~∞天)`, 
                        `中(${this.k_sep(this.ytext[0][0])}~${this.k_sep(this.ytext[0][1])}天)`, 
                        `高(0~${this.k_sep(this.ytext[0][0])}天)`
                    ],
                }, { //b
                    name: rfmlabel[1],
                    gridIndex: 1,
                    axisLabel: {
                        interval: 0,
                        color: colcolor[1]
                    },
                    data: [
                        `低(0~${this.k_sep(this.ytext[1][0])}次)`, 
                        `中(${this.k_sep(this.ytext[1][0])}~${this.k_sep(this.ytext[1][1])}次)`, 
                        `高(${this.k_sep(this.ytext[1][1])}~∞次)`
                    ],
                }, { //c
                    name: rfmlabel[2],
                    gridIndex: 2,
                    axisLabel: {
                        interval: 0,
                        color: colcolor[2]
                    },
                    data: [
                        `低(0~${this.k_sep(this.ytext[2][0])}元)`, 
                        `中(${this.k_sep(this.ytext[2][0])}~${this.k_sep(this.ytext[2][1])}元)`, 
                        `高(${this.k_sep(this.ytext[2][1])}~∞元)`
                    ],
                }],
                tooltip: [{
                    formatter: parmes => {
                        return parmes[0].name + ":" + this.k_sep(parmes[0].value) + "人"
                    },
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                }],
                legend: {
                    data: rfmlabel
                },
                series: [
                    /////////bar开始/////////////
                    { //a
                        name: 'R組',
                        type: 'bar',
                        data: [tData['rl'], tData['rm'], tData['rh']],
                        color: colcolor[0],
                        label: {
                            show: true,
                            position: 'right',
                            align: 'left',
                            formatter: function (p) {return p.value.toLocaleString();}
                        },

                    }, { //b
                        name: 'F組',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: [tData['fl'], tData['fm'], tData['fh']],
                        color: colcolor[1],
                        label: {
                            show: true,
                            position: 'right',
                            align: 'left',
                            formatter: function (p) {return p.value.toLocaleString();}
                        },

                    }, { //c
                        name: 'M組',
                        type: 'bar',
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        data: [tData['ml'], tData['mm'], tData['mh']],
                        color: colcolor[2],
                        label: {
                            show: true,
                            position: 'right',
                            align: 'left',
                            formatter: function (p) {return p.value.toLocaleString();}
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
    mounted: function () {
        this.render();
        window.addEventListener('resize', () => {
            if (this._chart) {
                this._chart.resize();
            }
        });
    },


})
    ;