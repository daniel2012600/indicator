/******************************************
 -元件名：v-echarts-taiwan
 -描述：台灣地圖
 -html attr必要屬性
 id : 注意，不是屬性，元性的id，同一個頁面要有唯一性，裏面會用到，一定要設
 -屬性：
 data : [  {name:'台灣縣市', value:數值 },....], name跟value都是保留字
 plotheight:圖型的高度，一定要設，預設300
 -限制，特別說明：
 name跟value都是保留字
 -依賴：
 jquery
 <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts.min.js"></script>
 -顏色是從下面網站copy來的 http://www.wrappixel.com/demos/admin-templates/elegant-admin/main/index2.html
 -echarts範例看這：https://echarts.apache.org/examples/zh/editor.html?c=map-usa
 -author:Rolence
 -example:
 <v-echarts-taiwan id="scat2"
 :data="area_data"
 :plotheight="300">
 </v-echarts-taiwan>
 台灣地圖json來源
 https://raw.githubusercontent.com/g0v/twgeojson/master/json/twCounty2010.geo.json
 -縣市名列表
 ['台北市',
 '新北市',
 '基隆市',
 '桃園市',
 '新竹縣',
 '新竹市',
 '苗栗縣',
 '台中市',
 '南投縣',
 '彰化縣',
 '雲林縣',
 '嘉義縣',
 '嘉義市',
 '台南市',
 '高雄市',
 '屏東縣',
 '宜蘭縣',
 '花蓮縣',
 '台東縣',
 '澎湖縣',
 '金門縣',
 '連江縣']
 ******************************************/

Vue.component("v-echarts-taiwan", {
    props: ["data", "plotheight", "maxsymbolsize"],
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
            _chart: null
        };
    },
    methods: {

        //繪出圖型
        render() {
            var thiscomp = this //有些method裏面引用不到this，就用這個

            //防止重覆呼叫，所以先清掉內文
            elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";
            elobj.removeAttribute("_echarts_instance_")

            var myChart = echarts.init(document.getElementById(this.$attrs['id']));
            myChart.showLoading();

            $.get('https://raw.githubusercontent.com/g0v/twgeojson/master/json/twCounty2010.geo.json', function (usaJson) {
                myChart.hideLoading();

                echarts.registerMap('TAIWAN', usaJson, {
                    // "金門縣":{
                    //     left: 118,
                    //
                    // },
                });
                option = {
                    title: {
                        text: 'TAIWAN',
                        subtext: 'EagleEye Tech',
                        sublink: 'http://www.census.gov/popest/data/datasets.html',
                        left: 'right'
                    },

                    tooltip: {
                        trigger: 'item',
                        showDelay: 0,
                        transitionDuration: 0.2,
                        formatter: function (params) {
                            var value = (params.value + '').split('.');
                            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                            return params.seriesName + '<br/>' + params.name + ': ' + value;
                        }
                    },
                    visualMap: {
                        left: 'right',
                        min: 500000,
                        max: 38000000,
                        inRange: {
                            color: ["#009efb", "#ffbc34",],
                        },
                        text: ['High', 'Low'],           // 文本，默认为数值文本
                        calculable: true
                    },
                    toolbox: {
                        show: true,
                        //orient: 'vertical',
                        left: 'left',
                        top: 'top',
                        feature: {
                            dataView: {readOnly: false},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    series: [
                        {
                            name: 'Taiwan',
                            type: 'map',
                            roam: true,
                            map: 'TAIWAN',
                            itemStyle: {
                                emphasis: {label: {show: true}}
                            },
                            zoom:1,
                            left:'25%', //置中
                            top:'-2%',
                            scaleLimit: {
                                min: 1.5, //初始化大小
                                max: 4
                            },

                            data: thiscomp.data
                        }
                    ]
                };

                myChart.setOption(option);
            });
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