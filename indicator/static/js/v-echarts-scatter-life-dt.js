/******************************************
 -元件名：v-echarts-scatter-life-dt
 -描述：可播放，1dt, 1維度, 3量值
 -html attr必要屬性
 id : 注意，不是屬性，元性的id，同一個頁面要有唯一性，裏面會用到，一定要設
 -屬性：
 data : [  {dt:'yyyy-mm-dd', 維度color:abc,  量值x:22, 量值y:44,  量值size:44 },....], 注意，dt為保留字，dim是必須是字串，其他的都是量值數字
 maxsymbolsize:數值裏面最大的那個圓圈的大小要多少px，預設48
 plotheight:圖型的高度，一定要設，預設300
 -限制，特別說明：
 只支援一個dt, 一個維度，三個量值
 -依賴：
 <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
 -顏色是從下面網站copy來的 http://www.wrappixel.com/demos/admin-templates/elegant-admin/main/index2.html
 -echarts範例看這：https://echarts.apache.org/examples/zh/editor.html?c=scatter-life-expectancy-timeline
 -author:Rolence
 -example:
 <v-echarts-scatter-life-dt id="scat2"
 :maxsymbolsize='"50"'
 :xlabeltype="dtype"
 :data="area_data"
 :plotheight="300">

 </v-echarts-scatter-life-dt>
 漸層顏色靠他產出https://www.strangeplanet.fr/work/gradient-generator/index.php
 ******************************************/

Vue.component("v-echarts-scatter-life-dt", {
    props: ["data", "plotheight", "maxsymbolsize"],
    watch: {
        xlabeltype: function (newVal, oldVal) {
            this.render()

        },
        data: function (newVal, oldVal) {
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
        //取得數值的，最大，最小，以及所有數值
        get_axis_valsue(data, meskey) {
            vals = []
            data.forEach(function (d, idx, arr) {
                vals.push(d[meskey])
            })
            max = Math.max(...vals)
            min = Math.min(...vals)
            return {vals: vals, max: max, min: min}
        },

        //繪出圖型
        render() {
            var gradient = ["#7460EE", "#7260EE", "#7161EE", "#6F62EE", "#6E62EE", "#6D63EE", "#6B64EE", "#6A65EF", "#6865EF", "#6766EF", "#6667EF", "#6468EF", "#6368EF", "#6169F0", "#606AF0", "#5F6BF0", "#5D6BF0", "#5C6CF0", "#5A6DF0", "#596EF0", "#586EF1", "#566FF1", "#5570F1", "#5371F1", "#5271F1", "#5172F1", "#4F73F2", "#4E74F2", "#4C74F2", "#4B75F2", "#4A76F2", "#4877F2", "#4777F3", "#4578F3", "#4479F3", "#437AF3", "#417AF3", "#407BF3", "#3E7CF3", "#3D7DF4", "#3C7DF4", "#3A7EF4", "#397FF4", "#3780F4", "#3680F4", "#3581F5", "#3382F5", "#3283F5", "#3083F5", "#2F84F5", "#2E85F5", "#2C86F5", "#2B86F6", "#2987F6", "#2888F6", "#2789F6", "#2589F6", "#248AF6", "#228BF7", "#218CF7", "#208CF7", "#1E8DF7", "#1D8EF7", "#1B8FF7", "#1A8FF8", "#1990F8", "#1791F8", "#1692F8", "#1492F8", "#1393F8", "#1294F8", "#1095F9", "#0F95F9", "#0D96F9", "#0C97F9", "#0B98F9", "#0998F9", "#0899FA", "#069AFA", "#059BFA", "#049BFA", "#029CFA", "#019DFA", "#009EFB", "#009EF9", "#019EF8", "#019FF7", "#029FF6", "#039FF5", "#03A0F4", "#04A0F3", "#05A1F2", "#05A1F1", "#06A1F0", "#07A2EF", "#07A2EE", "#08A3ED", "#09A3EC", "#09A3EB", "#0AA4EA", "#0BA4E9", "#0BA4E8", "#0CA5E7", "#0DA5E6", "#0DA6E5", "#0EA6E4", "#0EA6E3", "#0FA7E2", "#10A7E1", "#10A8E0", "#11A8DF", "#12A8DE", "#12A9DD", "#13A9DC", "#14A9DB", "#14AADA", "#15AAD9", "#16ABD8", "#16ABD7", "#17ABD6", "#18ACD5", "#18ACD4", "#19ADD3", "#1AADD2", "#1AADD1", "#1BAECF", "#1BAECE", "#1CAECD", "#1DAFCC", "#1DAFCB", "#1EB0CA", "#1FB0C9", "#1FB0C8", "#20B1C7", "#21B1C6", "#21B2C5", "#22B2C4", "#23B2C3", "#23B3C2", "#24B3C1", "#25B3C0", "#25B4BF", "#26B4BE", "#27B5BD", "#27B5BC", "#28B5BB", "#28B6BA", "#29B6B9", "#2AB7B8", "#2AB7B7", "#2BB7B6", "#2CB8B5", "#2CB8B4", "#2DB8B3", "#2EB9B2", "#2EB9B1", "#2FBAB0", "#30BAAF", "#30BAAE", "#31BBAD", "#32BBAC", "#32BCAB", "#33BCAA", "#34BCA9", "#34BDA8", "#35BDA7", "#36BEA6", "#38BDA4", "#3ABDA3", "#3DBDA1", "#3FBDA0", "#42BD9F", "#44BD9D", "#47BD9C", "#49BD9A", "#4CBD99", "#4EBD98", "#50BD96", "#53BD95", "#55BD93", "#58BD92", "#5ABD91", "#5DBD8F", "#5FBD8E", "#62BD8C", "#64BD8B", "#67BD8A", "#69BD88", "#6BBD87", "#6EBD86", "#70BD84", "#73BD83", "#75BD81", "#78BD80", "#7ABD7F", "#7DBD7D", "#7FBD7C", "#81BD7A", "#84BD79", "#86BD78", "#89BD76", "#8BBD75", "#8EBD73", "#90BD72", "#93BD71", "#95BD6F", "#98BD6E", "#9ABD6D", "#9CBC6B", "#9FBC6A", "#A1BC68", "#A4BC67", "#A6BC66", "#A9BC64", "#ABBC63", "#AEBC61", "#B0BC60", "#B3BC5F", "#B5BC5D", "#B7BC5C", "#BABC5A", "#BCBC59", "#BFBC58", "#C1BC56", "#C4BC55", "#C6BC53", "#C9BC52", "#CBBC51", "#CDBC4F", "#D0BC4E", "#D2BC4D", "#D5BC4B", "#D7BC4A", "#DABC48", "#DCBC47", "#DFBC46", "#E1BC44", "#E4BC43", "#E6BC41", "#E8BC40", "#EBBC3F", "#EDBC3D", "#F0BC3C", "#F2BC3A", "#F5BC39", "#F7BC38", "#FABC36", "#FCBC35", "#FFBC34"]

            var thiscomp = this //有些method裏面引用不到this，就用這個

            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            //動態偵測key ykeys by item[0]
            var allkeys = Object.keys(this.data[0])
            var dimkey = allkeys[1] //第零個是維度
            var meskeys = allkeys.slice(2, allkeys.length) //量值鍵值
            var dimvalues = this.get_axis_valsue(this.data, dimkey).vals
            var dtvalues = this.get_axis_valsue(this.data, 'dt').vals

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            var dimkeys = dimvalues.filter(onlyUnique);

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            //group by function
            var groupBy = function (xs, key) {
                return xs.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            };
            var timeline=[]
            var counties= Object.keys(groupBy(this.data, dimkey))
            var series = []
            var dtgrp = groupBy(this.data, 'dt')
            for (let [dt, dtvalues] of Object.entries(dtgrp)) {
                dtitem = []
                timeline.push(dt);

                counties.forEach(function (country, i, arr) {
                    dimitem = []
                    dimvalues = dtvalues.filter(y => y[dimkey] == country)
                    dimvalues.forEach(function (x, i, a) {
                        dimitem.push(x[meskeys[0]])
                        dimitem.push(x[meskeys[1]])
                        dimitem.push(x[meskeys[2]])
                        dimitem.push(country)
                        dimitem.push(dt)
                    });
                    dtitem.push(dimitem);

                })

                series.push(dtitem)
            }


            var data = {
                "counties": counties, //維度１，分顏色
                "timeline": timeline,
                "series": series

            }


            var xvalues = this.get_axis_valsue(this.data, meskeys[0])
            var yvalues = this.get_axis_valsue(this.data, meskeys[1])
            var symbolvalues = this.get_axis_valsue(this.data, meskeys[2])
            var symboldiv = symbolvalues["max"] / this.maxsymbolsize

            var itemStyle = {
                normal: {
                    opacity: 0.8,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            };

            var sizeFunction = function (x) {
                return x / symboldiv;

            };
            // Schema:
            var schema = meskeys.map(function (m, i, a) {
                return {name: m, index: (i + 1), text: m, unit: ""}
            })


            var option = {
                baseOption: {
                    timeline: {
                        axisType: 'category',
                        orient: 'vertical',
                        autoPlay: true,
                        inverse: true,
                        playInterval: 1000,
                        left: null,
                        right: 20,
                        top: 20,
                        bottom: 20,
                        width: 55,
                        height: null,
                        label: {
                            normal: {
                                textStyle: {
                                    color: '#999'
                                }
                            },
                            emphasis: {
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        symbol: 'none',
                        lineStyle: {
                            color: '#555'
                        },
                        checkpointStyle: {
                            color: '#bbb',
                            borderColor: '#777',
                            borderWidth: 2
                        },
                        controlStyle: {
                            showNextBtn: false,
                            showPrevBtn: false,
                            normal: {
                                color: '#666',
                                borderColor: '#666'
                            },
                            emphasis: {
                                color: '#aaa',
                                borderColor: '#aaa'
                            }
                        },
                        data: []
                    },
                    backgroundColor: '#404a59',
                    title: [
                        {
                        text: data.timeline[0],
                        textAlign: 'center',
                        left: '73%',
                        top: '75%',
                        textStyle: {
                            fontSize: 20,
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                        {
                        text: '訂單x人數',
                        left: 'center',
                        top: 10,
                        textStyle: {
                            color: '#aaa',
                            fontWeight: 'normal',
                            fontSize: 20
                        }
                    }],
                    tooltip: {
                        padding: 5,
                        backgroundColor: '#222',
                        borderColor: '#777',
                        borderWidth: 1,
                        formatter: function (obj) {
                            //return "hello"
                            var value = obj.value;
                            tooltipstr =
                                value[3] + '<br/>'+
                            schema[1].text + '：' + value[1] + schema[1].unit + '<br/>'
                            + schema[0].text + '：' + value[0] + schema[0].unit + '<br/>'
                            + schema[2].text + '：' + value[2] + '<br/>';
                            return tooltipstr;
                        }
                    },
                    grid: {
                        top: 100,
                        containLabel: true,
                        left: 30,
                        right: '110'
                    },
                    xAxis: {
                        type: 'value',
                        name: meskeys[0],
                        max: xvalues["max"],
                        min: 0,
                        nameGap: 25,
                        nameLocation: 'middle',
                        nameTextStyle: {
                            fontSize: 18
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        axisLabel: {
                            formatter: '{value} $'
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: meskeys[1],
                        max: yvalues["max"],
                        min: 0,
                        nameTextStyle: {
                            color: '#ccc',
                            fontSize: 18
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    visualMap: [
                        {
                            show: false,
                            dimension: 3,
                            categories: data.counties,
                            calculable: true,
                            precision: 0.1,
                            textGap: 30,
                            textStyle: {
                                color: '#ccc'
                            },
                            inRange: {
                                color: (function () {
                                    return gradient;
                                })()
                            }
                        }
                    ],
                    series: [
                        {
                            type: 'scatter',
                            itemStyle: itemStyle,
                            data: data.series[0],
                            symbolSize: function (val) {
                                //return 80;
                                return sizeFunction(val[2]);
                            }
                        }
                    ],
                    animationDurationUpdate: 1000,
                    animationEasingUpdate: 'quinticInOut'
                },
                options: []
            };

            for (var n = 0; n < data.timeline.length; n++) {
                option.baseOption.timeline.data.push(data.timeline[n]);
                option.options.push({
                    title: {
                        show: true,
                        'text': data.timeline[n] + ''
                    },
                    series: {
                        name: data.timeline[n],
                        type: 'scatter',
                        itemStyle: itemStyle,
                        data: data.series[n],
                        symbolSize: function (val) {
                            //return 60;
                            return sizeFunction(val[2]);
                        }
                    }
                });
            }


            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            thiscomp._chart = myChart;

            //將chart元件放在window._echartskey就是這個chart的id
            if(window._echarts == undefined){window._echarts={}}
            window._echarts[this.$attrs['id']]=myChart;
        }
    },
    mounted: function () {
        var that = this
        that.render();
        window.addEventListener('resize',function (){
            if(that._chart){
                that._chart.resize();
            }
        });
    },


})
;