/******************************************
 -元件名：v-echarts-scattersingleaxis-dt
 -描述：y軸表格式散點圖
 -html attr必要屬性
 id : 注意，不是屬性，元性的id，同一個頁面要有唯一性，裏面會用到，一定要設
 -屬性：
 data : [  {dim:'yyyy-mm-dd', 量值１:22, 量值2:44 },....],
    這裏的量值的名稱會放y軸，x軸放維度
 xlabeltype :x軸顯示的時間，一樣必須設，可能以下幾字串
 y :代表只顯示年份, ex 2017
 m :代表只顯示月份, ex 一月
 ym :代表只顯示年月, ex 2017-11
 d:　代表只顯示日期, ex 2017-1-1
 maxsymbolsize:數值裏面最大的那個圓圈的大小要多少px，預設48
 plotheight:圖型的高度，一定要設，300
 -限制，特別說明：
 -依賴：
 <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
 -顏色是從下面網站copy來的 http://www.wrappixel.com/demos/admin-templates/elegant-admin/main/index2.html
 -echarts範例看這：https://echarts.apache.org/examples/zh/editor.html?c=scatter-single-axis
 -author:Rolence
 -example:
 <v-echarts-scattersingleaxis-dt id="scat2"
 :maxsymbolsize='"50"'
 :xlabeltype="dtype"
 :data="area_data"
 :plotheight="300">

 </v-echarts-scattersingleaxis-dt>
 ******************************************/

Vue.component("v-echarts-scattersingleaxis-dt", {
    props: ["data", "xlabeltype", "maxsymbolsize", "plotheight"],
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
                    return 'labeltype屬性沒設值出錯了'
            }
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

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            var xlabels = this.data.map(function (d) {
                return thiscomp.get_xlable_by_type(d[dimkey], thiscomp.xlabeltype);
            });//日期
            var ylabels = meskeys;//量值的總類

            //data的結構是[ylabes索引，xlabels索引，數值]
            var r = 0, c = 0
            var data = []
            this.data.forEach(function (d, r, arr) {
                for (c = 0; c < meskeys.length; c++) {
                    v = d[meskeys[c]]
                    data.push([c, r, v])
                }
            })

            var vals = []
            this.data.forEach(function (d, idx, arr) {
                meskeys.forEach(function (mes, idxm, arrm) {
                    vals.push(d[mes])
                })
            })

            var maxSymbolSize = 48
            if (this.maxsymbolsize != undefined) {
                maxSymbolSize = this.maxsymbolsize //預設最大數的點大小px
            }
            var max = Math.max(...vals)
            var symboldiv = max / maxSymbolSize


            var option = {
                tooltip: {
                    position: 'top',
                    //提示的格式化函式在這裏
                    formatter: function (d) {
                        return d.data[1]
                    }
                },
                color: ["#7460ee", "#009efb", "#f62d51", "#36bea6", "#ffbc34",],
                title: [],
                singleAxis: [],
                series: []
            };


            echarts.util.each(ylabels, function (ylabel, idx) {
                option.title.push({
                    textBaseline: 'middle',
                    top: (idx + 0.3) * 100 / ylabels.length + '%',
                    text: ylabel
                });
                option.singleAxis.push({
                    left: 150,
                    type: 'category',
                    boundaryGap: false,
                    data: xlabels,
                    top: (idx * 100 / ylabels.length + 5) + '%',
                    height: (100 / ylabels.length - 20) + '%',
                });
                option.series.push({
                    singleAxisIndex: idx,
                    coordinateSystem: 'singleAxis',
                    type: 'scatter',
                    data: [],
                    symbolSize: function (dataItem) {
                        return dataItem[1] / symboldiv;
                        //return 90
                    },
                    itemStyle: {
                        // normal: {
                        //     shadowBlur: 10,
                        //     shadowColor: 'rgba(120, 36, 50, 0.2)',
                        //     shadowOffsetY: 5
                        // }
                    }
                });
            });

            echarts.util.each(data, function (dataItem) {
                option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
            });


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