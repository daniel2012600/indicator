/*************************************
- 元件名:
       v-echarts-dataset-bar
- 描述:
       柱狀圖
- 維度量值:
       
- html:
       id:必填，元件id，要有唯一性
- 屬性:
              ⓞ data : [{name:'abc', value:44},....]
- 限制:
        資料一定是name, value
- 依賴:
       <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
- 作者:
       Rolence
- 展示:
       https://echarts.apache.org/examples/zh/editor.html?c=dataset-simple1
- 使用範例:
       
- 日期:
       2018-08-06 11:16
*************************************/


Vue.component("v-echarts-dataset-bar", {
    props: {
        name: { type: String, default: "product" },
        datalist: { type: Array },
        dkey: { type: Array },
        colors:  {
            type: Array,
            default: () => ["#6574BB","#62CACA","#E1CCFA","#D58B23","#EED431","#999999","#253E9F","#82AF36","#6858A4","#91B6E6"]
        },
    },
    watch: {
        datalist: function(newVal, oldVal) {
            this.render();
        }
    },
    template: `
    <div id="this.$attrs['id']" style="width: 100%; height: 450px;"></div>
    `,
    data() {
        return {
            _chart: null
        };
    },
    methods: {
        render() {
            var thiscomp = this //有些method裏面引用不到this，就用這個
            //防止重覆呼叫，所以先清掉內文
            elobj = document.getElementById(this.$attrs['id']);
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_");

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));
            var dimensions = [this.dkey[0]]
            var dt_list = _.map(this.datalist, this.dkey[1]);
            dimensions = dimensions.concat(dt_list)
            var series = _.map(dt_list, item => {
                return  {type: 'bar'}
            })
            // var source = []
            var source = _.map(this.dkey[2], item => {
                var temp = {
                    [this.dkey[0]]: item,
                };
                _.forEach(dt_list, subdt => {
                    temp[subdt] = _.find(this.datalist, [this.dkey[1], subdt])[item]
                })
                
                return temp
            })
            var option = {
                legend: {},
                tooltip: {},
                color: this.colors,
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: { show: true, title: '保存為圖片' }
                    }
                },
                dataset: {
                    dimensions:  dimensions,
                    source: source
                },
                xAxis: {type: 'category'},
                yAxis: {},
                series: series
            };

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