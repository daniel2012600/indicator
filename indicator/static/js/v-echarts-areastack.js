/*************************************
- 元件名:
       v-echarts-areastack
- 描述:
       堆疊區域圖
- 維度量值:
       維度1個，量值n個；維度是y軸，量值分顏色
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ data : [{y軸維度:'abc', 量值1:44 , 量值2:44 , 量值3:44},....]
- 依賴:
       <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
- 作者:
       Steven
- 展示:
       https://echarts.apache.org/examples/zh/editor.html?c=area-stack
- 使用範例:
       <v-echarts-areastack id="bs3" :data="curr_data" :isneslcolor="false"></v-echarts-areastack>
- 日期:
       2018-09-21 17:24
*************************************/

Vue.component("v-echarts-areastack", {
    props:{
        data: Array,
        colors: Array,
        plotheight: {
            type: Number,
            default: 450
        }
    },
    watch: {
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
            <div id="this.$attrs['id']" style="width: 100%;"  :style="{height: plotheight+'px'}"></div>
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
        get_series(meskeys) {
            var i = -1
            var series = meskeys.map(meskeys => {
                i++
                return {
                    name: meskeys,
                    type: 'line',
                    stack: '總量',
                    areaStyle: {},
                    label: {
                        normal: {
                            show: false,
                            //position: 'insideRight',
                            formatter: function (p) {return this.fKNum(p.value);
                            }
                        }
                    },
                    data: this.data.map(d => d[meskeys])
                };
            });
            return series;
        },
        render() {
            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            //動態偵測key ykeys by item[0]
            var allkeys = Object.keys(this.data[0])
            var meskeys = allkeys.slice(1,allkeys.length)
            var dimkey = allkeys[0] //第零個是維度
            var origin_date = this.data.map(d => d[dimkey])
            var weekdays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");
            var e_date = _.map(origin_date,d=>{ 
                var week = weekdays[new Date(d).getDay()].split('星期')[1]
                var date_edition = d + ' '+'('+week+')'+ ' '
                        return date_edition  })
                
            if( this.colors == undefined){
                 this.colors =  ["#36bea6", "#7460ee", "#009efb", "#f62d51", "#ffbc34"]
            }

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: parms => {
                        label = ""
                        total = _.map(parms, 'value').reduce((a,b) => a + b);
                        parms.forEach(p => {
                            color = p["marker"];
                            text = p["seriesName"];
                            value = p["value"];
                            num = value / total * 100;
                            perc = this.fKNum(parseFloat(num.toFixed(2))) + '%';
                            label += `${color}${text}:${this.fKNum(value)} (${perc})</br>`
                        });
                        return label;
                    }
                },
                color: this.colors,
                legend: {
                    data: meskeys,
                    top:"90%"
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {show: true, title: '保存為圖片'}
                    }
                },
                grid: {
                    // left: '3%',
                    // right: '4%',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap : false,
                    data: e_date
                },
                yAxis: {
                    type: 'value'
                },
                series: this.get_series(meskeys)
            };

            // 使用刚指定的配置项和数据显示图表。
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
            if(this._chart){
                this._chart.resize();
            }
        });
    },
});