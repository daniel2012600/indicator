/*************************************
- 元件名:
       v-echarts-barstack
- 描述:
       橫向顯示的堆疊圖
- 維度量值:
       維度1個，量值n個；維度是y軸，量值分顏色
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ data : [{y軸維度:'abc', 量值1:44 , 量值2:44 , 量值3:44},....]
- 依賴:
       <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
- 作者:
       Rolence
- 展示:
       http://echarts.baidu.com/examples/editor.html?c=bar-y-category
- 使用範例:
       <v-echarts-bar id="bs3" :data="curr_hotstore"></v-echarts-bar>
- 日期:
       2018-08-05 17:24
*************************************/

Vue.component("v-echarts-barstack", {
    props: ["data", "ylabeltype"],
    watch: {
        ylabeltype: function (newVal, oldVal) {
            this.render()

        },
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
            <div id="this.$attrs['id']" style="width:100%;height:450px;"></div>
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
        //取得series的設定
        get_series(meskeys) {
            var thiscomp = this
            var thisdata = this.data
            var i = -1
            var series = meskeys.map(function (meskeys) {
                vals = thisdata.map(function (d) {
                    return d[meskeys]
                });
                i++
                return {
                    name: meskeys,
                    type: 'bar',
                    stack: '總量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight',
                            formatter: function (p) {return thiscomp.fKNum(p.value);
                            }
                        }
                    },
                    data: vals
                };
            });
            return series;
        },
        render() {
            var thiscomp = this //有些method裏面引用不到this，就用這個

            // 沒有值不畫圖
            if (!thiscomp.data.length) return;

            //防止重覆呼叫，所以先清掉內文
            elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            //動態偵測key ykeys by item[0]
            var allkeys = Object.keys(this.data[0])
            var meskeys = allkeys.slice(1,allkeys.length)
            var dimkey = allkeys[0] //第零個是維度


            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                color:  ["#6574BB","#62CACA","#E1CCFA","#D58B23","#EED431","#999999","#253E9F","#82AF36","#6858A4","#91B6E6"],
                legend: {
                    data: meskeys,
                    top:"94%"
                },
                toolbox: {
                    show: true,
                    feature: {
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
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: this.data.map(function (d) {
                        return d[dimkey]
                    })
                },
                series: this.get_series(meskeys)
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