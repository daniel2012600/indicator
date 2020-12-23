
/*************************************
- 元件名:
       v-echarts-bubblechart
- 描述:
       泡泡圖
- 維度量值:
       維度1個，量值3個。維度分顏色，量值分別是x、y、大小
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ data : [{維度:'abc', 量值1:44 , 量值2:44 , 量值3:44},....]
       ⓞ maxsymbolsize : 數值裏面最大的那個圓圈的大小要多少px，預設48
       ⓞ plotheight : 圖型的高度，一定要設，預設值300
- 依賴:
       <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
- 作者:
       Rolence
- 展示:
       http://echarts.baidu.com/examples/editor.html?c=bubble-gradient
- 使用範例:
       <v-echarts-bubblechart id="bb1" :data="area_data" :plotheight="450" maxsymbolsize="100"></v-echarts-bubblechart>
- 日期:
       2018-08-05 16:52
*************************************/


Vue.component("v-echarts-bubblechart", {
    props: ["data", "xlabeltype", "maxsymbolsize", "plotheight"],
    watch: {
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
        //取得series的設定
        get_series(meskeys, dimkey, dimvals, symboldiv) {
            thisdata = this.data
            series = dimvals.map(function (dv) {
                thisdimdata = thisdata.filter(function (item, index, arr) {
                    return item[dimkey] == dv
                }).map(function (item, index, arr) {
                    //[量值１，量值２...維度1]
                    dvalue = []
                    meskeys.forEach(function (mk, index, arr) {
                        dvalue.push(item[mk])
                    })
                    dvalue.push(item[dimkey])
                    return dvalue
                });

                return {
                    name: dv,
                    data: thisdimdata,
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[2])/symboldiv
                        //return data[2]/symboldiv
                    },
                    label: {
                        emphasis: {
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 0.6,
                        }
                    }
                };
            })
            return series;
        },

        //繪出圖型
        render() {
            var thiscomp = this //有些method裏面引用不到this，就用這個

            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            //動態偵測key ykeys by item[0]
            var allkeys = Object.keys(this.data[0])
            var meskeys = allkeys.slice(1, allkeys.length)
            var dimkey = allkeys[0] //第零個是維度
            var dimvals = this.data.map(function (d) {
                return d[dimkey]
            });

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));


            var vals = []
            this.data.forEach(function (d, idx, arr) {
                vals.push(d[meskeys[2]])
            })
            var maxSymbolSize = 48
            if (this.maxsymbolsize != undefined) {
                maxSymbolSize = this.maxsymbolsize //預設最大數的點大小px
            }
            var max = Math.max(...vals)
            var symboldiv = max / maxSymbolSize

            var option = {
                legend: {
                    show:false,
                    right: 10,
                    data: dimvals,
                    top:"94%"
                },
                toolbox: {
                    show: true,
                    feature: {
                        // dataView: {show: true, readOnly: false},
                        saveAsImage: {show: true, title: '保存為圖片'}
                    }
                },
                grid: {
                    height: '60%',
                    // y: '10%'
                    //bottom: '20%'
                },
                tooltip: {
                    position: 'top',
                    //提示的格式化函式在這裏
                    formatter: function (d) {
                        sf = d["seriesName"]+"<br/>"
                        i = 0
                        meskeys.forEach(function (mk, index, arr) {
                            sf= sf + mk + ":" + thiscomp.fKNum(d.data[i])+"<br/>";
                            i++;
                        })
                        return sf;
                    }
                },
                color: ["#7460ee", "#009efb", "#f62d51", "#36bea6", "#ffbc34",],
                xAxis: {
                    name:meskeys[0],
                    nameLocation: 'middle',
                    nameGap:35,//橫軸顯示數值的名稱距離主圖型的高度
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    name:meskeys[1],
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    scale: true
                },
                visualMap: [
                    {
                        left: 'center',
                        bottom: '4%',
                        // top: '10%',
                        dimension: 2,
                        orient: 'horizontal',
                        min: 0,
                        max: max,
                        itemWidth: 20,
                        itemHeight: 130,
                        calculable: true,
                        precision: 0.1,
                        textGap: 30,
                        inRange: {
                            symbolSize: [10, 70]
                        },
                        // outOfRange: {
                        //     symbolSize: [10, 70],
                        //     color: ['rgba(255,255,255,.2)']
                        // },
                        controller: {
                            inRange: {
                                color: ['#888']
                            },
                            outOfRange: {
                                color: ['#888']
                            }
                        }
                    },
                ],
                series: this.get_series(meskeys, dimkey, dimvals, symboldiv)
            };


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