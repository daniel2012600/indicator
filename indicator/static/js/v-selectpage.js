
/*
元件：v-selectpage
    
描述:
    支援
    多選
    換頁
    服務器api
屬性:
    id:唯一id
    keyfield:要當鍵值的欄位
    showfiled：要顯示的欄位
    dataapi:換頁api的url
    maxSelectLimit:若設為0代表不限
事件:
    api_success:當取得api成功時觸發，參數傳入結果集
    select:當選中某一項時觸發
插槽:
    slot1:xxxx
    slot2:xxx
相依：
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/selectpage@2.19.0/selectpage.css">
    <script src="https://cdn.jsdelivr.net/npm/selectpage@2.19.0/selectpage.min.js"></script>
限制:
    預設列高15
    預設多選
範例:
    <v-selectpage :key='id' :lable='name' :data='data' @event1=''></v-selectpage>
    官方文件請看以下↓
    https://terryz.gitee.io/selectpage/demo.html

flask api 範例請看以下連結
    https://gist.githubusercontent.com/rolence0515/a74d8465bc71f4df2176ca66e9f457ee/raw/9f38a7d19c749051c2d068df7305e6d209ff2b1d/selectpage%2520flask%2520api%2520example
*/
Vue.component("v-selectpage", {
    delimiters: ['[[', ']]'],
    props: {
        id:{
            type: String,
            default: "id"
        },
        keyfield: {
            type: String,
            default: "keyfield"
        },
        showfiled: {
            type: String,
            default: "showfiled"
        },
        maxSelectLimit:{
            type: Number,
            default: 20
        },
        dataapi: {
            type: String,
            default: "/selectpage_api"
        }
        ,width:{
            type: String,
            default: "500"
        }
    },
    watch: {
     
    },
    template: `
    <div>
    <input type="text" :id="id" >
    </div>
        `,
    data() {
        return {
            
        };
    },
    methods: {
        
    },
    mounted: function () {
        
        var that = this
        //初始化插件
        $("#" +this.id).selectPage({
            showField : this.showfiled,
            keyField :this.keyfield,
            data : this.dataapi,
            listSize : 15,
            multiple : true,
            maxSelectLimit:this.maxSelectLimit,
            lang:'tw',
            eSelect:(d)=>{
                that.$emit('select', d);
            }
            // ----------[api options]----------
            ,eAjaxSuccess:function(d){
                var invalid = false;
                var invalidmsg = ""
                if(d['list'] == undefined){
                    invalid = true
                    invalidmsg += '回傳的資料必須有list';
                }
                if(d['totalRow'] == undefined){
                    invalid = true
                    invalidmsg += '回傳的資料必須有totalRow';
                }
                if(invalid){
                    alert(invalidmsg)
                }
                that.$emit('api_success', d);
                return d;
            }
        });
    }
})
;