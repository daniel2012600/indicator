/******************************************
-元件名：v-morris-area
-描述：繪出橫軸為時間，蹤軸為任意量值的走勢圖
-html attr必要屬性
    id : 注意，不是屬性，元性的id，同一個頁面要有唯一性，裏面會用到，一定要設

-屬性：
 xlabeltype : x軸顯示的時間，一樣必須設，可能以下幾字
    y :代表只顯示年份, ex 2017
    m :代表只顯示月份, ex 一月
    ym :代表只顯示年月, ex 2017-11
    d:　代表只顯示日期, ex 2017-1-1
data :[ {dt:'yyyy-mm-dd', 量值１:22, 量值2:44 }], 注意，dt為保留字，限制為橫軸的鍵名，但方便編程，其他的都是量值
-限制，特別說明：
    data裏面一定要有dt
    如果要改變data的值，一定要整個data是全新的data，不能只改data裏面的某個值這樣不會反應新圖，因為data是陣列
-依賴：
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">
    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js"></script>
-author:Rolence
******************************************/

Vue.component("v-morris-area", {
    props: ["data", "xlabeltype"],
    watch: {
        xlabeltype: function (newVal, oldVal) {
            this.render()
        },
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
            <div id="this.$attrs['id']"></div>
        `,
    data() {
        return {
            prv_morris: null,
            innerprop_data: [], //技巧，例用它來watch data的改變，請看☆☆
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
        };
    },
    methods: {
        //取得xlabl的顯示字串
        get＿xlable＿by＿type(x, type) {
            switch (type) {
                case 'y':
                    return new Date(x).getFullYear();
                    break;
                case 'm':
                    var month = this.months[new Date(x).getMonth()];
                    return month;
                    break;
                case 'ym':
                    dt = new Date(x)
                    return dt.getFullYear() + "/" + (dt.getMonth() + 1);
                    break;
                case 'd':
                    return new Date(x).toISOString().slice(0, 10);
                    break;
                default:
                    return 'labeltype屬性沒設值出錯了'
            }
        },
        render() {
            //防止重覆呼叫，所以先清掉內文
            document.getElementById(this.$attrs['id']).innerHTML = "";

            var months = this.months
            //動態偵測key ykeys by item[0]
            var ykeys = [];
            for (var k in this.data[0]) if (k != 'dt') ykeys.push(k);

            //取得xlabletype
            var xlabeltype = this.xlabeltype
            get＿xlable＿by＿type = this.get＿xlable＿by＿type;

            this.prv_morris = Morris.Area({
                element: this.$attrs['id'] //取得html attrs id
                , data: this.data
                , xkey: 'dt'
                , ykeys: ykeys
                , labels: ykeys
                , xLabelFormat: function (x) { // <--- dt的值
                    return get＿xlable＿by＿type(x, xlabeltype);
                },
                dateFormat: function (x) {
                    return get＿xlable＿by＿type(x, xlabeltype);
                }
                , pointSize: 0
                , fillOpacity: 0
                , pointStrokeColors: ['#f62d51', '#7460ee', '#009efb']
                , behaveLikeLine: true
                , gridLineColor: '#f6f6f6'
                , lineWidth: 2
                , hideHover: 'auto'
                , lineColors: ['#36bea6', '#7460ee', '#009efb']
                , resize: true
            });
        }
    },
    mounted: function () {
        this.render()
    },


})
;