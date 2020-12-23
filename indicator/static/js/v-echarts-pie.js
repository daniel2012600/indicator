/*************************************
- 元件名:
       v-echarts-pie
- 描述:
       圓餅圖
- 維度量值:
       維度1個，量值1個；dt維度是分顏色，量值決定大小
- html:
       id:必填，元件id，要有唯一性
- 屬性:
              ⓞ data : [{name:'abc', value:44},....]
       ⓞ colors : 色碼["#xxxxx","#xxxxx"]
       ⓞ showlabel : 字串"true", 預設"false", 設true的話會顯示label
- 限制:
        資料一定是name, value
- 依賴:
       <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
- 作者:
       Rolence
- 展示:
       https://echarts.apache.org/examples/zh/editor.html?c=pie-legend
- 使用範例:
       <v-echarts-pie id="pie" :data="piedata"></v-echarts-pie>
- 日期:
       2018-08-06 11:16
*************************************/


Vue.component("v-echarts-pie", {
    props: {
        data: Array,
        colors:  {
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
        showlabel: {
            type: Boolean,
            default: true
        },
        plotheight: {
            type: Number,
            default: 450
        },
        hiddenarr: Array,
        showtext: {
            type: String,
            default: '人'
        },
        // 開始角度，預設從90度開始
        startangle: {
            type: Number,
            default: 90
        },
    },
    watch: {
        ylabeltype: function (newVal, oldVal) {
            this.render()

        },
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
        <div id="this.$attrs['id']" style="width: 100%;" :style="{ height: plotheight+'px' }"></div>
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
        labeloption(showlabel){
            var thiscomp = this;
            if (showlabel) {
                return {
                    normal: {
                        formatter: function(p){
                            //' {b|{b}：}{c}\n{per|{d}%}  ',
                            return  "{b|" + p['name'] + '}：'+ thiscomp.fKNum(p["value"]) +'\n' + '{per|' + p["percent"] + "%" +  '}'
                        },
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 22,
                                align: 'center'
    
                            },
                            hr: {
                                borderColor: '#999',
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                lineHeight: 25,
    
                            },
                            c:{
                                 function (p) {
                                    return this.fKNum(p.value);
                                }
                            },
                            per: {
                                color: '#999',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    }
                };
            } else {
                return null;
            }
        },
        render() {
            var thiscomp = this //有些method裏面引用不到this，就用這個
            //防止重覆呼叫，所以先清掉內文
            elobj = document.getElementById(this.$attrs['id']);
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_");

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));
            var hidden_obj = {};
            if (thiscomp.hiddenarr && this.data.length > 1){
                _.map(thiscomp.hiddenarr, d => {
                    hidden_obj[d] = false;
                })
            }

            var opt_colors = _.map(this.data, (item, idx) => {
                var sel_color = this.colors[item.name];
                if (sel_color) {
                    return sel_color;
                } else {
                    return Object.values(this.colors)[idx]
                }
            });

            var option = {
                color: opt_colors,
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    },
                    formatter: function(parmes) {
                        if (thiscomp.showtext == '$'){
                            return `${parmes.name} :${thiscomp.showtext}${thiscomp.fKNum(parmes.value)}(${parmes.percent}%)`
                        } else {
                            return `${parmes.name} :${thiscomp.fKNum(parmes.value)}${thiscomp.showtext}(${parmes.percent}%)`
                        }
                    }
                },
                legend: {
                    selected: hidden_obj ? hidden_obj : "",
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 40,
                    bottom: 20,
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: { show: true, title: '保存為圖片' }
                    }
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: '50%',
                    center: ['40%', '50%'],
                    startAngle: this.startangle,
                    data: this.data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            if (this.showlabel){
                option.series[0]["label"] = this.labeloption(this.showlabel);
            }

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