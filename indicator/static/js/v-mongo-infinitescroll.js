/*************************************
- 元件名:
        v-mongo-infinitescroll
- 描述:
        顯示mongo資料庫內的資料，每次讀出"lim"筆資料
        當使用者往下滾動至底部時，自動加載下"lim"筆新資料
        若搜索完畢將顯示"資料已全部顯示"
- html:

- 屬性:
        ⓞ mongo_key : 設定要顯示的欄位
        [
            {"prop":"","label":""},
            {"prop":"","label":""}
        ]
        prop為mongodb內的key名稱
        label為顯示在表格最上方的名稱
        ⓞ data : 資料庫回傳的資料
            {
                mongo_data:[]
            }
        ⓞ lim : 每次跟資料庫拿取多少筆資料
        ⓞ path : 需要post的地方的位址 如"/test"
- 事件：

- 依賴:
        vue element
        jquery

- 展示:
        see demo_infinitescroll.html
- 使用範例:
    <v-mongo-infinitescroll 
    :data=data 
    :mongo_key=mongo_key 
    :lim=lim 
    :path=path >
    </v-mongo-infinitescroll>

*************************************/

Vue.component("v-mongo-infinitescroll",{
    template:`
    <el-row >
        
        <el-col :span="32">
            <div class="infinite-list-wrapper" style="overflow:auto height:100px overflow-y: scroll">
                <el-table  v-infinite-scroll="load"
                infinite-scroll-delay="500"
                infinite-scroll-immediate="false"
                infinite-scroll-disabled="disabled"
                v-model="data"
                :data= "data.mongo_data"
                style="width: 100% ">
                    <el-table-column v-for="{prop,label} in mongo_key" :prop="prop" :label="label" :key="prop">
                    </el-table-column>
                    <div slot="append" v-if="loading" style="font-weight:bold">讀取中</div>
                    <div slot="append" v-if="nomore" style="font-weight:bold">資料已全部顯示</div>
                </el-table>
            </div>
        </el-col>
    </el-row>
    `,
    delimiters: ['[[', ']]'],
    props:[
        "mongo_key",
        "data",
        "lim",
        "path"
    ],
    data: function(){
        return {
            loading : false,
            nomore: false,
            skip: 0
        }
    },
    methods:{
        load(){
            this.loading = true;
                this.skip += this.lim;
                if (!this.nomore){
                    $.post(this.path, {
                        lim:this.lim,
                        skip:this.skip
                    }, result => {
                        if (result != null){
                            for (var i=0;i<result.length;i++){
                            this.data.mongo_data.push(result[i]);
                            }
                        }else{
                            this.nomore = true;
                        }
                        this.loading = false;
                    }, 'json');
                }else{
                    this.loading = false;
                }
        },
        get_data(){
            this.loading = true;
            $.post(this.path, {
                lim:this.lim,
                skip:0
            }, result => {
                this.data.mongo_data = result;
                this.loading = false;
            }, 'json');
        }
    },
    computed:{
        disabled(){
            return this.loading
        }
    },
    mounted(){
        this.get_data()
    }
})