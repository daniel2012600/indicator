/******************************************
 -元件名：v-sparkline-dt
 -描述：小的圖表
 -html attr必要屬性
     id : 注意，不是屬性，元性的id，同一個頁面要有唯一性，裏面會用到，一定要設

 -屬性：
     data :[ {dt:'yyyy-mm-dd', 量值１:22 },....], 注意，dt為保留字，限制為橫軸的鍵名，但方便編程，其他的都是量值
     type :  'line' , 'bar', 'tristate', 'discrete', 'bullet', 'pie'  'box'
     meskey:data可能有很多量值，這裏指定要用哪一個，沒指定的話就取第一個捉到的量值

 -限制，特別說明：

     data裏面一定要有dt, dt格式一定'yyyy-mm-dd', 一定要放第一個
     量值只支援一個
     注意：與bootstrap合用，tooltip樣式跑版解決方法，加入以下樣式
            .jqstooltip {
                -webkit-box-sizing: content-box;
                -moz-box-sizing: content-box;
                box-sizing: content-box;
            }

 -依賴：
 <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min.js"></script>
 -author:Rolence
 ******************************************/

Vue.component("v-sparkline-dt", {
    props: ["data", "type", "color", "meskey", "height", "width", "linecolor", "y_label_format"],
    watch: {
        data: function (newVal, oldVal) {
            this.render();
        }
    },
    template: `
           <div class="mainbox__chart" id="this.$attrs['id']" ></div>
        `,
    data() {
        return {};
    },
    computed: {
        flatmap(){
            if(this.data.length == 1){
                return _.flatMap(this.data, item => [item,item])
            }
            else return this.data
        }
    },
    methods: {
        render() {
            var sparkline_data = this.flatmap
            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";

            var [xkey, ykey] = this.meskey;
            //預設key皆為 'dt'
            var xvalues = _.map(sparkline_data, xkey);
            var yvalues = _.map(sparkline_data, ykey);

            $(`#${this.$attrs.id}`).sparkline(yvalues, {
                type: this.type,
                height: this.height,
                width: this.width,
                resize: true,
                chartRangeMin:0,
                // ==========[bar]==========
                barWidth: (100 / xvalues.length) + '%',
                barSpacing: "10",
                barColor: this.linecolor,
                // ==========[bar-end]==========
                sliceColors: [ "#735fed", "#009efb", "#f62d51", "#36bea6", "#ffbc34" ],
                // marker的半徑長度
                fillColor: this.color,
                lineColor: this.linecolor,
                highlightSpotColor: this.linecolor,
                highlightLineColor: "gray",
                spotColor: false,
                minSpotColor: false,
                maxSpotColor: false,
                spotRadius: 3, 
                drawNormalOnTop: true,
                tooltipFormatter: (sparkline, options, fields) => {
                    if(this.type == 'pie'){
                        var item = sparkline_data[fields.offset];
                        return `${this.y_label_format(item[xkey], xkey)}: ${this.y_label_format(item[ykey], ykey)}`;
                    } else if (this.type == 'bar') {
                        var item = sparkline_data[fields[0].offset];

                    } else {
                        var item = sparkline_data[fields.x];
                    }
                    return `${xkey}: ${this.y_label_format(item[xkey], xkey)}<br>${ykey}: ${this.y_label_format(item[ykey], ykey)}`;
                } ,
                // map value
                tooltipValueLookups: {
                    "key": xvalues,
                }
            });
        }
    },
    mounted: function () {
        this.render();
    }
});