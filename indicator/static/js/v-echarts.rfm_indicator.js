/*************************************
- 元件名:
       v-echarts-rfm-indicator
- 描述:
       熱地圖
- 維度量值:
       維度1個，量值n個；維度是x軸，量值的key是y軸
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ data : [{x軸維度:'abc', y軸維度11:44 , y軸維度2:44 , y軸維度3:44},....]
         ex:[{"時段":"0點","星期日":0.02,"星期一":0.04,"星期二":0.01,"星期三":0.02,"星期四":0.01,"星期五":0.02,"星期六":0.05},{"時段":"1點","星期日":0,"星期一":0.01,"星期二":0,"星期三":0,"星期四":0,"星期五":0,"星期六":0},
       ⓞ fromcolor : 最小量值的顏色
       ⓞ tocolor : 最大量值的顏色
       ⓞ plotheight : 圖型的高度，一定要設，預設值300
       ⓞ valuelabelunit : 字串，預設空值。有設定時，會加在值的最後面
- 依賴:
       <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
- 作者:
       Rolence
- 展示:
       https://echarts.apache.org/examples/zh/editor.html?c=heatmap-cartesian
- 使用範例:
       <v-echarts-rfm-indicator id="hm1" :data="heatmapdata" :plotheight="650" :fromcolor="'#f8f9fa'" :tocolor="'#009efb'"></v-echarts-rfm-indicator>
- 日期:
       2018-08-05 17:05
*************************************/

Vue.component("v-echarts-rfm-indicator", {
    props: ["data", "plotheight", "xlabeltype","valuelabelunit", "fromcolor", "tocolor", "addlabel", "colors"],
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
            _chart: null,
            chartcolors: this.colors === undefined ? ['#C5E4FA', '#66ABEF', '#327DDD', '#085A9B'] : this.colors
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
        get_xlable_by_type(x, type) {
            switch (type) {
                case 'y':
                    return new Date(x).getFullYear().toString();
                    break;
                case 'm':
                    var month = this.months[new Date(x).getMonth()];
                    return month.toString();
                    break;
                case 'ym':
                    dt = new Date(x)
                    return dt.getFullYear() + "/" + (dt.getMonth() + 1);
                    break;
                case 'd':
                    return new Date(x).toISOString().slice(0, 10);
                    break;
                default:
                    return x
            }
        },

        //繪出圖型
        render() {
            var thiscomp = this //有些method裏面引用不到this，就用這個
            if (thiscomp.data.length == 0)
                return;
            var valuelabelunit = (thiscomp.valuelabelunit!=undefined)? thiscomp.valuelabelunit : ""
            var addlabel = (thiscomp.addlabel!=undefined)? thiscomp.addlabel : ""


            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            var xlabels = this.data.map(function (v,k){ return k+1})
            var ylabels = this.data.map(function (v,k){ return k+1})

            //data的結構是[ylabes索引，xlabels索引，數值]
            // var tt = []
            // _.map(_.range(6), d1=>{
            //     _.map(_.range(6), d2=>{
            //         tt.push({R: d1, F: d2, d: _.map(_.range(6), d3=>{
            //             return _.get(this.data, `${d1}.${d2}.${d3}`,0)
            //         })})
            //     })
            // })

            var data = []
            _.map(_.range(6), d1=>{
                _.map(_.range(6), d2=>{
                    data.push({R: d1, F: d2, d: _.map(_.range(6), d3=>{
                        return _.get(this.data, `${d1}.${d2}.${d3}.cnt`,0)
                    })})
                })
            })
            var data = data.map(function (item) {
                total = _.sumBy(item['d'])
                return [item["R"], item["F"] ,total || 0];
            });
            // if colors is set, ignore fromcolor & tocolor
            var thisColor;
            if (this.fromcolor === undefined && this.tocolor === undefined ) {
                thisColor = this.chartcolors;
            } else {
                thisColor = [this.fromcolor, this.tocolor];
            }

            
            var option = {
                tooltip: {
                    position: 'top',
                    formatter: function(p){
                        var color=p["marker"];
                        var text = p["name"];
                        var value = p["value"][2];
                        var label = addlabel;
                        return  label + " " + color + text + ": " + value + "%"
                    },
                },
                animation: false,
                grid: {
                    height: '50%',
                    top: '10%'
                },
                xAxis: {
                    type: 'category',
                    data: xlabels,
                    splitArea: {
                        show: true
                    }
                },
                yAxis: {
                    type: 'category',
                    data: ylabels,
                    splitArea: {
                        show: true
                    }
                },
                visualMap: {
                    min: 0,
                    max: 100,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: '15%'
                },
                series: [{
                    name: 'Punch Card',
                    type: 'heatmap',
                    data: data,
                    label: {
                        show: true
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
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