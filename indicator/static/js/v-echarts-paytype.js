/******************************************

    -屬性：
        name : 組合成dataset所使用的名稱，預設為"product"

        datalist : 傳入的資料陣列
        dkey : 從資料庫撈出時使用的alias名稱，傳入兩組String，
            Array[0]的String是顯示在pie的項目名稱; Array[1]的String是項目的數值

        charttype : 下列趨勢圖的顯示種類，預設為"line"，可更改為"bar"

        piecolor : pie的顏色值

    -依賴：
        -echarts範例：https://echarts.apache.org/examples/zh/editor.html?c=dataset-link

******************************************/

Vue.component("v-echarts-paytype", {
    props: {
        name: { type: String, default: "product" },
        datalist: { type: Array },
        dkey: { type: Array },
        show_currency: {type: Boolean, default: false},
        charttype: { type: String, default: "line" },
        piecolor:  {
            type: Object,
            default: () => {
                return {
                    "item1": "#6574BB", "item2": "#62CACA",
                    "item3": "#E1CCFA", "item4": "#D58B23",
                    "item5": "#EED431", "item6": "#999999",
                    "item7": "#253E9F", "item8": "#82AF36",
                    "item9": "#6858A4", "item10": "#91B6E6"
                }
            }
        },
    },
    watch: {
        datalist: function(newVal, oldVal) {
            this.render();
        }
    },
    template: `
        <div id="this.$attrs['id']" style="width: 100%; height: 800px;"></div>
    `,
    data() {
        return {
            _chart: null
        };
    },
    methods: {
        render() {
            var typeList = _.union(_.map(this.datalist, this.dkey[0]));
            
            var dimFirst = [this.name].concat(
                _.map(_.groupBy(this.datalist, this.dkey[0])[typeList[0]], "dt")
            );
            var dimSecond = _.map(_.groupBy(this.datalist, this.dkey[0]), d =>
                [d[0][this.dkey[0]]].concat(_.map(d, this.dkey[1]))
            );

            var weekdays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");
            if(dimFirst[0] = 'product'){
                dimFirst.shift()
                var e_date = _.map(dimFirst,d=>{ 
                    var week = weekdays[new Date(d).getDay()].split('星期')[1]
                    var date_edition = d + ' '+'('+week+')'+ ' '
                            return date_edition  })
                e_date.unshift('product');
                }
                else{
                var e_date = _.map(dimFirst,d=>{ 
                    var week = weekdays[new Date(d).getDay()].split('星期')[1]
                    var date_edition = d + ' '+'('+week+')'+ ' '
                            return date_edition  })
                }
                
            
            var dimBonded = [e_date].concat(dimSecond);
            var create_series = {
                type: this.charttype,
                smooth: true,
                seriesLayoutBy: "row"
            };
            var seriesRow = [];
            _.forEach(typeList, d => seriesRow.push(create_series));
        
            var opt_colors = _.map(this.datalist, (item, idx) => {
                var sel_color = this.piecolor[item.pay_type];
                if (sel_color) {
                    return sel_color;
                } else {
                    return Object.values(this.piecolor)[idx]
                }
            });
            var Currency = ''
            if(this.show_currency) Currency = '$'
            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs["id"]);
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_");

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs["id"]));
        
            // 指定图表的配置项和数据
            var option = {
                legend: {},
                tooltip: {
                    trigger: "axis",
                    showContent: false
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {
                            show: true,
                            title: '保存為圖片'
                        },
                    }
                },
                color: opt_colors,
                dataset: {
                    source: dimBonded
                },
                xAxis: {type: 'category'},

                yAxis: { gridIndex: 0 },
                grid: { top: "60%" },
                series: seriesRow.concat({
                    type: "pie",
                    id: "pie",
                    radius: "30%",
                    center: ["50%", "30%"],
                    label: {
                        formatter: function(p) {
                            const lableName = p.name;
                            const labelValue = p.value;
                            const labelPercent = p.percent + "%";

                            return `\{b|${lableName}: \}\t \{c|${Currency}${(
                                labelValue[1].toLocaleString() 
                            )}\}\t \{d|${labelPercent}\}`;
                        },
                        rich: {
                            b: {
                                fontSize: 13
                            },
                            c: {
                                fontSize: 15
                            },
                            d: {
                                fontSize: 15
                            }
                        }
                    },
                    encode: {
                        itemName: this.name,
                        value: dimBonded[0][1],
                        tooltip: dimBonded[0][1]
                    }
                })
            };

            myChart.on("updateAxisPointer", function(event) {
                var xAxisInfo = event.axesInfo[0];
                if (xAxisInfo) {
                    var dimension = xAxisInfo.value + 1;
                    myChart.setOption({
                        series: {
                            id: "pie",
                            label: {
                                formatter: function(p) {
                                    if (p.value.length < p.seriesIndex){
                                        for (i = 0; i < p.seriesIndex; i++){
                                            p.value[i] =  p.value[i] ? p.value[i] : 0 
                                        }
                                    }
                                    const lableName = p.name;
                                    const labelValue = p.value;
                                    const labelPercent = p.percent + "%";

                                    return `\{b|${lableName}: \}\t \{c|${Currency}${(
                                        labelValue[dimension].toLocaleString()
                                    )}\}\t \{d|${labelPercent}\}`;
                                },
                                rich: {
                                    b: {
                                        fontSize: 13
                                    },
                                    c: {
                                        fontSize: 15
                                    },
                                    d: {
                                        fontSize: 15
                                    }
                                }
                            },
                            encode: {
                                value: dimension,
                                tooltip: dimension
                            }
                        }
                    });
                }
            });
            myChart.setOption(option);
            this._chart = myChart;
        
            //將chart元件放在window._echartskey就是這個chart的id
            if (window._echarts == undefined) {
                window._echarts = {};
            }
            window._echarts[this.$attrs["id"]] = myChart;
        }
    },
    mounted: function() {
        var that = this;
        that.render();
        window.addEventListener("resize", function() {
            if (that._chart) {
                that._chart.resize();
            }
        });
    }
});

