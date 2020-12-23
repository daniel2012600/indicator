
/*************************************
- 元件名:
       v-echarts-grid-line
- 描述:
       一次顯視多個走勢的圖
- 維度量值:
       g, x, y
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ data : [{g:'abc', x:44 , y:44},....]
       ⓞ colcnt : 每列有多少欄
       ⓞ plotheight : 圖型的高度，一定要設，預設值300
       ⓞ keyy : 目前y使用的量值名稱
- 依賴:
       <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
- 作者:
       Rolence
- 展示:
       http://echarts.baidu.com/examples/editor.html?c=bubble-gradient
- 使用範例:
       <v-echarts-bubblechart id="bb1" :data="area_data" :plotheight="450" maxsymbolsize="100"></v-echarts-bubblechart>
- 日期:
       2018-08-05 16:52
*************************************/


Vue.component("v-echarts-grid-line", {
    props: ["data", "plotheight", "colcnt", "keyy"],
    watch: {
        data: function (newVal, oldVal) {
            this.render()
        },
        keyy: function (newVal, oldVal) {
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
        get_grids(keys){

            var result = _.map(keys, function(m){
                return { "show": true, "borderWidth": 0, "backgroundColor": "#fff", "shadowColor": "rgba(0, 0, 0, 0.3)", "shadowBlur": 2 }
            });

            return result;
        },
        get_xaxes(data, keys){

            var minx = _.minBy(data, function(e){
                return parseInt(e["x"]);
            })["x"];
            var maxx = _.maxBy(data, function(e){
                return parseInt(e["x"]);
            })["x"];

            var gid = 0;
            result = _.map(keys, function(m){
                item =  { "type": "value", "show": false, "min": minx, "max": maxx, "gridIndex": gid }
                gid++;
                return item;
            });

            return result;
        },
        get_yaxes(data, keys){

            var keyy = this.keyy;

            var miny = _.minBy(data, function(e){
                return parseInt(e[keyy]);
            })[keyy];
            var maxy = _.maxBy(data, function(e){
                return parseInt(e[keyy]);
            })[keyy];

            var gid = 0;
            result = _.map(keys, function(m){
                item =  { "type": "value", "show": false, "min": miny, "max": maxy, "gridIndex": gid }
                gid++;
                return item;
            });

            return result;
        },
        get_series(grp, keys){

            var keyy = this.keyy;
            var gid = 0;

            result = _.map(keys, function(k){
                // console.log(k)
                serdata = _.map(grp[k], function(m){
                    
                    return [parseInt(m["x"]), parseInt(m[keyy])];
                });

                item =   { "name": "linear", "type": "line", "xAxisIndex": gid, "yAxisIndex": gid, "data": serdata, "showSymbol": false, "animationEasing": "linear", "animationDuration": 1000 }
                gid++;
                return item;
            });

            return result;
        },
        get_title(keys){

            var result = _.map(keys, function(k){
                return { "textAlign": "center", "text": k, "textStyle": { "fontSize": 12, "fontWeight": "normal" } }
            });

            return result;

        },

        //繪出圖型
        render() {
            //data from bq 每加分店人數訂單數營業額
            var data = this.data;
            var keyy = this.keyy;

            var thiscomp = this //有些method裏面引用不到this，就用這個

            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById(this.$attrs['id']));

            var grp_ = _.groupBy(data, function(e){
                return e["g"];
            });

            grp_ = _.map(grp_, function(item, key){
                sum = 0;
                _.map(item, function(i){
                    sum += i[keyy];
                });

                avg = sum / item.length;

                return {"key": key, "item": item, "avg": avg || 0};
            })

            grp_ = _.sortBy(grp_, function(i){
                return i.avg * -1;
            });

            var grp = {};
            _.map(grp_, function(item){
                grp[item['key']] = item['item'];
            })

            var keys = [];
            for( k in grp){
                keys.push(k);
            }

            var grids = this.get_grids(keys);
            // [
            //     { "show": true, "borderWidth": 0, "backgroundColor": "#fff", "shadowColor": "rgba(0, 0, 0, 0.3)", "shadowBlur": 2 }, { "show": true, "borderWidth": 0, "backgroundColor": "#fff", "shadowColor": "rgba(0, 0, 0, 0.3)", "shadowBlur": 2 },
            //     { "show": true, "borderWidth": 0, "backgroundColor": "#fff", "shadowColor": "rgba(0, 0, 0, 0.3)", "shadowBlur": 2 },
            // ];

            var xAxes = this.get_xaxes(data, keys);
            // [
            //     { "type": "value", "show": false, "min": 1, "max": 8, "gridIndex": 0 }, { "type": "value", "show": false, "min": 1, "max": 8, "gridIndex": 1 },
            //     { "type": "value", "show": false, "min": 1, "max": 8, "gridIndex": 2 }
            // ];

            var yAxes =  this.get_yaxes(data, keys);
            // [
            //         , { "type": "value", "show": false, "min": 1, "max": 103, "gridIndex": 1 },
            //     { "type": "value", "show": false, "min": 1, "max": 103, "gridIndex": 2 },
            // ];

            var series = this.get_series(grp, keys);
            // [
            //     { "name": "linear", "type": "line", "xAxisIndex": 0, "yAxisIndex": 0, "data": [[1, 23], [2, 22], [3, 31], [4, 29], [5, 33], [6, 37], [7, 35], [8, 36]], "showSymbol": false, "animationEasing": "linear", "animationDuration": 1000 },

            //     { "name": "linear2", "type": "line", "xAxisIndex": 1, "yAxisIndex": 1, "data": [[1, 63], [2, 66], [3, 66], [4, 97], [5, 65], [6, 76], [7, 103], [8, 90]], "showSymbol": false, "animationEasing": "linear", "animationDuration": 1000 },

            //     { "name": "linear2", "type": "line", "xAxisIndex": 2, "yAxisIndex": 2, "data": [[1, 28], [2, 18], [3, 18], [4, 36], [5, 29], [6, 39], [7, 44], [8, 45]], "showSymbol": false, "animationEasing": "linear", "animationDuration": 1000 }

            // ];

            var titles = this.get_title(keys);
            // [
            //     { "textAlign": "center", "text": "三重五華店", "textStyle": { "fontSize": 12, "fontWeight": "normal" } }, { "textAlign": "center", "text": "三峽和平店", "textStyle": { "fontSize": 12, "fontWeight": "normal" } },
            //     { "textAlign": "center", "text": "中和員山店", "textStyle": { "fontSize": 12, "fontWeight": "normal" } }
            // ];

            var rowNumber = this.colcnt;
            echarts.util.each(grids, function (grid, idx) {
                grid.left = ((idx % rowNumber) / rowNumber * 100 + 0.5) + '%';
                grid.top = (Math.floor(idx / rowNumber) / rowNumber * 100 + 0.5) + '%';
                grid.width = (1 / rowNumber * 100 - 1) + '%';
                grid.height = (1 / rowNumber * 100 - 1) + '%';

                titles[idx].left = parseFloat(grid.left) + parseFloat(grid.width) / 2 + '%';
                titles[idx].top = parseFloat(grid.top) + '%';
            });

            option = {
                title: titles,
                grid: grids,
                xAxis: xAxes,
                yAxis: yAxes,
                series: series,
                color:  ["#6574BB","#62CACA","#E1CCFA","#D58B23","#EED431","#999999","#253E9F","#82AF36","#6858A4","#91B6E6"],
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