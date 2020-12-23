/******************************************
 -元件名：v-tags
 -描述：標籤編輯器，預設呼叫遠端的api來取得標籤內容
 -html attr必要屬性
 -屬性：
    tags:[{'id':'xxxx', tag:'xxxxx'}]
    remotemethod：掛載你自已的查詢method (query) => {}
    

 -事件：
    ＠change(id, tags) : tag的內容有變時觸發
 -限制，特別說明：


 -依賴：
 <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min.js"></script>
 -author:Rolence
 ******************************************/

Vue.component("v-tags", {
    props: ["id", "tags","remotemethod","tags_remote","page"],
    watch: {
        page: function (newVal, oldVal) {
            if (newVal!=oldVal){
                this.on_canceledit();
                this.$emit("page_chagne", newVal);
            }
        }
    },
    template: `
    <div>
        <el-tag
        type="info"
        class="ml-2 mt-1"
        :key="t"
        v-for="t in tags"
        closable
        :disable-transitions="false"
        @close="ondeltag(t)">
        {{t}}
        </el-tag>

        <div class="ml-2 mt-2" v-show="mode == 'add'">
            <el-select
                style="float:left;"
                v-model="select_tags"
                size="small"
                multiple
                filterable
                allow-create
                default-first-option
                reserve-keyword
                placeholder="請輸入關鍵字"
                :loading="loading"
                @focus="setTags">
                <el-option
                v-for="t in remote_tags"
                :key="t"
                :label="t"
                :value="t">
                </el-option>
            </el-select>
            <el-button style="float:left;margin-left:4px;" size="small" @click="on_endedit">確定</el-button>
            <el-button style="float:left;" class="ml-1"  size="small" @click="on_canceledit">取消</el-button>
        </div>
        <el-button v-show="mode != 'add'" size="small" class="ml-2 mt-2" @click="mode='add'">+</el-button>
    </div>
        `,
    data() {
        return {
            mode:"view",
            add_text:"",
            loading:false,
            remote_tags:[],
            select_tags:[]
        };
    },
    methods: {
        setTags(){
            this.remote_tags = this.tags_remote.slice();
        },
        ondeltag(tag){
            this.$delete(this.tags, this.tags.indexOf(tag));
            this.$emit("change", this.id, this.tags);
        },
        // query_remoteMethod(query){
        //     //呼叫客戶端的遠端查詢程式來取得搜尋的關鍵字的tag   
        //     // if (query !== '') {
        //     //     this.loading = true;
        //     //     if (this.remotemethod != null && this.remotemethod != undefined ){
        //     //         this.remote_tags  = this.remotemethod(query)
        //     //         this.loading = false;
                    
        //     //     }else{
        //     //         this.loading = false;
        //     //     }
        //     // }
        //     this.loading = true;
        //     this.remote_tags  = this.remotemethod(query);
        //     this.loading = false;
        // },
        on_endedit(){
            var tag_index = 0;
            _.union(this.tags, this.select_tags).forEach(tag => {
                this.$set(this.tags, tag_index, tag);
                tag_index += 1;
            });
            this.remote_tags = [];
            this.select_tags = [];
            this.mode = "view";
            this.$emit("change", this.id, this.tags);
        },
        on_canceledit() {
            this.remote_tags = [];
            this.select_tags = [];
            this.mode = "view";
        }
    },
    mounted: function () {

    }
})
;