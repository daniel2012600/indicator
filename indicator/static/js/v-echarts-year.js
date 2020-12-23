/*************************************
- 元件名:
       v-echarts-year
- 描述:
       年度月曆圖
- 維度量值:
       
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ data : [{dt:'abc', y軸維度11:44 , y軸維度2:44 , y軸維度3:44},....]
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
       <v-echarts-heatmap id="hm1" :data="heatmapdata" :plotheight="650" :fromcolor="'#f8f9fa'" :tocolor="'#009efb'"></v-echarts-heatmap>
- 日期:
       2018-08-05 17:05
*************************************/

Vue.component("v-echarts-year", {
    props: ["data", "year", "plotheight", "fromcolor", "tocolor", "colors"],
    watch: {
        year: function (newVal, oldVal) {
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
        getDataByYear(data, year){
            data_year = data.filter(word => word.dt.includes(year))
            data_last_year = data.filter(word => word.dt.includes(year-1))
            return data_year.concat(data_last_year);
        },
        getDataMax(data){
            var revs = data.map(val => val.revenue);
            return Math.max.apply(null, revs);
        },
        getDataMin(data){
            var revs = data.map(val => val.revenue);
            return Math.min.apply(null, revs);
            // return Math.min.apply(null, revs) > 0 ? Math.min.apply(null, revs) : 0;
        },
        getData(data, year) {
            var filterByYear = data.filter(word => word.dt.includes(year));;
            return filterByYear.map(dic => [dic.dt, dic.revenue]);
        },
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
        //繪出圖型
        render() {
            if (this.data.length == 0){
                return;
            }

            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            var selectData = this.getDataByYear(this.data, this.year);

            // if colors is set, ignore fromcolor & tocolor
            var thisColor;
            if (this.fromcolor === undefined && this.tocolor === undefined ) {
                thisColor = this.chartcolors;
            } else {
                thisColor = [this.fromcolor, this.tocolor];
            }

            option = {
                tooltip: {
                    position: 'top',
                    formatter: parmes => {
                        return parmes.value[0] + " 銷售額" + " : " + this.fKNum(parmes.value[1]) + "元";
                    }
                },
                visualMap: {
                    min: this.getDataMin(selectData),
                    max: this.getDataMax(selectData),
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: '3%',
                    inRange: {
                        color: thisColor
                    },
                    formatter: value => {
                        return '$' + this.fKNum(value);
                    }
                },
                calendar: [{
                    range: String(this.year-1),
                    cellSize: ['auto', 20],
                    dayLabel: {
                        firstDay: 1,
                        nameMap: ['日', '一', '二', '三', '四', '五', '六']
                    },
                    monthLabel: {
                        nameMap: 'cn',
                        margin: 5
                    },
                    itemStyle:{
                        color: {
                            colorStops: [{
                                offset: 1, color: '#DDD' // 100% 处的颜色
                            }]
                        }
                    }
                },
                {
                    top: 260,
                    range: String(this.year),
                    cellSize: ['auto', 20],
                    dayLabel: {
                        firstDay: 1,
                        nameMap: ['日', '一', '二', '三', '四', '五', '六']
                    },
                    monthLabel: {
                        nameMap: 'cn',
                        margin: 5
                    },
                    itemStyle:{
                        color: {
                            colorStops: [{
                                offset: 1, color: '#DDD' // 100% 处的颜色
                            }]
                        }
                    }
                }],
                series: [{
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    calendarIndex: 0,
                    data: this.getData(selectData, String(this.year-1))
                },{
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    calendarIndex: 1,
                    data: this.getData(selectData, String(this.year))
                }]
            };


            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            this._chart = myChart;

            //將chart元件放在window._echartskey就是這個chart的id
            if(window._echarts == undefined){window._echarts={}}
            window._echarts[this.$attrs['id']] = myChart;
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
});