
/*************************************
- 元件名:
       v-echarts-waterfall
- 描述:
       瀑布圖
- 維度量值:
       g, x, y
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ data : [{g:'abc', x:44 , y:44},....]
       ⓞ colcnt : 每列有多少欄
       ⓞ plotheight : 圖型的高度，一定要設，預設值300
- 依賴:
       <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
- 作者:
       Rolence
- 展示:
       http://echarts.baidu.com/examples/editor.html?c=bubble-gradient
- 使用範例:
       <v-echarts-waterfall id="bb1" :data="area_data" :plotheight="450" maxsymbolsize="100"></v-echarts-waterfall>
- 日期:
       2018-08-05 16:52
*************************************/


Vue.component("v-echarts-waterfall", {
    props: {
        data: Array,
        plotheight: Number,
        xkey: String,
        ykey: String,
        y_label_format: {
            type: Function,
            default: (val, key) => val
        }
    },
    watch: {
        data(newVal, oldVal) {
            this.render();
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
        get_xaxes(data){
            var xkey = this.xkey;
            var result =  _.map(data, function(d){
                return d[xkey];
            })
            return result;
        },
        get_series(data){
            var rev_sum_arr =[]
            var rev_sum_ttl_arr =[]
            var rev_sum_ttl = 0
            data.forEach(item => {
                rev_sum_arr.push(parseInt(item[this.ykey]));
                rev_sum_ttl_arr.push(rev_sum_ttl);
                rev_sum_ttl += parseInt(item[this.ykey]);
            });
            var ser = [{
                name: '輔助',
                type: 'bar',
                stack: '總量',
                itemStyle: {
                    normal: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    },
                    emphasis: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    }
                },
                data: rev_sum_ttl_arr
            },
            {
                name: '銷售額',
                type: 'bar',
                stack: '總量',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: p => {
                            return this.y_label_format(this.fKNum(p.value), this.ykey);
                        }
                    }
                },
                data: rev_sum_arr
            }]
            return ser;
        },
        //繪出圖型
        render() {
            //data from bq 每加分店人數訂單數營業額
            var data = this.data;

            var thiscomp = this //有些method裏面引用不到this，就用這個

            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));
         
            option = {
                color: ["#6574BB"],
                tooltip: {
                    trigger: 'axis',
                    formatter: params => {
                        var value = this.y_label_format(this.fKNum(params[1].data), params[1].seriesName);
                        return `${params[1].name}</br>${params[1].marker}${params[1].seriesName}: ${value}`
                    },
                },
                legend: {
                    data:['支出','收入']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type : 'category',
                    splitLine: {show:false},
                    data : this.get_xaxes(data),
                    axisLabel: {
                        rotate:45
                    }
                },
                yAxis: {
                    name: this.ykey,
                    type: 'value',
                    axisLabel: {
                        formatter: (value, index) => {
                            return this.y_label_format(this.fKNum(value), this.ykey);
                        }
                    }
                },
                series: this.get_series(data)
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


});