/******************************************
 -元件名：
 -描述：
 -html attr必要屬性
 id : 注意，不是屬性，元性的id，同一個頁面要有唯一性，裏面會用到，一定要設

 -屬性：
    xlabeltype : x軸顯示的時間，一樣必須設，可能以下幾字串
        year :代表只顯示年份, ex 2017
        month :代表只顯示月份, ex 一月
        day:　代表只顯示日期, ex 2017-1-1
     data1 :
        data1 :[ {dt:'yyyy-mm-dd', q1:xxx, q2:xxx, q3:xxx, q4:xxx, q5:xxx] },....], 注意，dt為保留字
     
     barlinetypes :傳入陣列["bar", "bar", "line"]，代表第一、二個量值是用bar, 第三用line這是預設值，可以改
 -限制，特別說明：
    data裏面一定要有dt, dt格式一定'yyyy-mm-dd'
    量值最多三個
    量值一跟二用bar顯示，三一定用c

 -依賴：
 underscore
 <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
 -顏色是從下面網站copy來的 http://www.wrappixel.com/demos/admin-templates/elegant-admin/main/index2.html
 -echarts範例看這：http://echarts.baidu.com/examples/editor.html?c=mix-line-bar
 -author:Rolence
 ******************************************/

Vue.component("v-echarts-box-compare-dt", {
    props: ["data1","data2", "xlabeltype", "yaxislabel"],
    watch: {
        xlabeltype: function (newVal, oldVal) {
            this.render()

        },
        data2: function (newVal, oldVal) {
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
        //取得x軸的設定
        format_dt(x, type) {
            switch (type) {
                case 'year':
                    return new Date(x).getFullYear().toString();
                    break;
                case 'm':
                    var month = this.months[new Date(x).getMonth()];
                    return month.toString();
                    break;
                case 'month':
                    dt = new Date(x)
                    return dt.getFullYear() + "/" + (dt.getMonth() + 1);
                    break;
                case 'day':
                case 'week':
                    return new Date(x).toISOString().slice(0, 10);
                    break;
                default:
                    return 'labeltype屬性沒設值出錯了'
            }
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
        get_tooltip(param){
            var label = param.name.split("\n")[param.seriesIndex]
            return [
                '區間 ' + label + ': ' + '<br />',
                '- 最大值: ' + param.data[5],
                '- Q3: ' + param.data[4],
                '- 中位數: ' + param.data[3],
                '- Q1: ' + param.data[2],
                '- 最小值: ' + param.data[1]
            ].join('<br/>');
        },
        get_xaxis(xlabeltype){
            var self  = this;
            var xlabels = _.map(
                _.zip(
                    _.map(this.data1,function(d){ return self.format_dt(d["dt"],xlabeltype)}), 
                    _.map(this.data2,function(d){ return self.format_dt(d["dt"],xlabeltype)})
                ),function(x){
                    return x.join("\n");
                }
            );
            return xlabels;

        },
        get_yaxis(ykeys){
            return {
                type: 'value',
                name:  this.yaxislabel,
                splitArea: {
                    show: true
                }
            };
        },
        //取得series的設定
        get_series(name1, name2){
            var self = this;
            
            values1 = _.map(self.data1, function(d){ return [d["q1"],d["q2"],d["q3"],d["q4"],d["q5"]]});
            values2 = _.map(self.data2, function(d){ return [d["q1"],d["q2"],d["q3"],d["q4"],d["q5"]]});
            
            series = [];
            series.push( {
                name: name1,
                type: 'boxplot',
                data: values1,
                tooltip: {formatter: self.get_tooltip},
                //itemStyle: {color: "#BDDDEF"},
            });
            series.push( {
                name: name2,
                type: 'boxplot',
                data: values2,
                tooltip: {formatter: self.get_tooltip},
                //itemStyle: {color: "#BDDDEF"},
            })
            return series;
        },
        
        render() {
            var self = this //有些method裏面引用不到this，就用這個

            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            //動態偵測量值的欄位名
            var ykeys = []
            this.data1.forEach(element => {
                ykeys.push(Object.keys(element)[1])
            }); 
            this.data2.forEach(element => {
                ykeys.push(Object.keys(element)[1])
            }); 
            ykeys = _.uniq(ykeys)
            var dtarr1 = _.map(self.data1, function(d){ return new Date(d["dt"])});
            var dtarr2 = _.map(self.data2, function(d){ return new Date(d["dt"])});
            var name1=""
            var name2=""
            if(dtarr1.length>0){
                name1 = self.format_dt(_.min(dtarr1),self.xlabeltype) + "~" + self.format_dt(_.max(dtarr1),self.xlabeltype) 
            }
            if(dtarr2.length>0){
                name2 = self.format_dt(_.min(dtarr2),self.xlabeltype) + "~" + self.format_dt(_.max(dtarr2),self.xlabeltype) 
            }

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                color:  ["#ABC6D6", "#009efb","#f62d51", "#ffbc34", "#36bea6", "#7460ee" ],
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        saveAsImage: {show: true, title: '保存為圖片'}
                    }
                },
                legend: {
                    orient: 'vertical',
                    show:true,
                    right: 100,
                    data: [name1,name2]
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.get_xaxis(self.xlabeltype)
                        ,axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: self.get_yaxis(ykeys),
                series: self.get_series(name1, name2)
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            self._chart = myChart;

            //將chart元件放在window._echartskey就是這個chart的id
            if (window._echarts == undefined) { window._echarts={} }
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