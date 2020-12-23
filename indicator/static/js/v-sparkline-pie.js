/******************************************
 -元件名：v-sparkline-pie
 -描述：小的圖表
 -html attr必要屬性
     id : 注意，不是屬性，元性的id，同一個頁面要有唯一性，裏面會用到，一定要設

 -屬性：
    data :[{dim: '直接访问', mes: 335},{dim: '直接访问', mes: 335}]
    color:陣列 ['#xxxx','#xxxxx']
    meskey:'要取用量值的鍵值，只能一個

 -限制，特別說明：

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

Vue.component("v-sparkline-pie", {
    props: ["data", "color", 'meskey'],
    watch: {
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
           <div id="this.$attrs['id']" ></div>
        `,
    data() {
        return {};
    },
    methods: {
        render() {
            //防止重覆呼叫，所以先清掉內文
            var elobj = document.getElementById(this.$attrs['id'])
            elobj.innerHTML = "";

            var meskey = this.meskey
            var vlues = this.data.map(function (d) {
                return d[meskey]
            })

            var id="#" +this.$attrs['id']
            $(id).sparkline(vlues, {
                type: 'pie'
                , width: '15%'
                , height: '30',
                resize: true,
                sliceColors: this.color
            });
        }
    },
    mounted: function () {
        this.render()
    }

})
;