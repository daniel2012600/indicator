/*
描述:
趨勢圖，資料內必須有dt、總銷售額

維度量值:
dt、總銷售額

html:
id:必填，元件id，要有唯一性

屬性:
data : [{ dt:'abc', 總銷售額:44 , x:3333},....]

依賴:
https://echarts.apache.org/examples/zh/editor.html?c=wind-barb
*/

Vue.component("v-echarts-large-trend", {
    props: ["data"],
    watch: {
        // ylabeltype: function (newVal, oldVal) {
        //     this.render()

        // },
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
            <div id="this.$attrs['id']" style="width: 100%;height:450px;"></div>
        `,
    data() {
        return {
            _chart: null
        };
    },
    methods: {
        render() {
            var origin_date = this.data.map(function(d){return (d.dt)})
            var weekdays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");
            var e_date = _.map(origin_date,d=>{ 
                var week = weekdays[new Date(d).getDay()].split('星期')[1]
                var date_edition = d + ' '+'('+week+')'+ ' '
                        return date_edition  })
            var e_value = this.data.map(function(d){return (d.總銷售額)})

            var thiscomp = this //有些method裏面引用不到this，就用這個

            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            // 指定图表的配置项和数据
            option = {
                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                title: {
                    left: 'center',
                    text: '',
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: e_date
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%']
                },
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }, {
                    start: 0,
                    end: 100,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }],
                series: [
                    {
                        name:'總銷售額',
                        type:'line',
                        smooth:true,
                        symbol: 'none',
                        sampling: 'average',
                        itemStyle: {
                            color: "#6574BB"
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: "#6574BB"
                            }, {
                                offset: 1,
                                color: '#f8f9fa'
                            }])
                        },
                        data: e_value
                    }
                ]
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