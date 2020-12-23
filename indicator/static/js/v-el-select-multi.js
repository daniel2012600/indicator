/*************************************
- 元件名:
       v-el-select-multi
- 描述:
       擴展element 的select 元件，
       預設為多選，
       有輸入區可輸入搜尋
       最上方有一個工具列，內有一個按鈕「選擇全部」，「清除全部」
       並預設支援搜尋功能
       資料有限制，只支援字串陣列，不支援json obj
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ placeholder :　空值的背景文字
       ⓞ opts : ['初','始','選項']
       ⓞ name : 此下拉單的名稱，最好有唯一性
       ⓞ valuelabelunit : 字串，預設空值。有設定時，會加在值的最後面
- 事件：
    　　ⓞ onchange(name,val)　：　當回傳值發生改變時觸發
            - name :屬性name
            - val :目前選單的選擇
- 依賴:
       vue element
- 作者:
       Rolence
- 展示:
       see demo_selectmultiext.html
- 使用範例:
      <v-el-select-multi
        name ="paytype"
        placeholder="付費方式"
        :opts="paytypeopts"
        @onchange="onchange"
    >
- 日期:
       2018-08-05 17:05
- 特別注意：
v-el-select-multi
*************************************/
Vue.component("v-el-select-multi", {
    template: `
        <div>
            <el-select v-model="model" @change="onchange" multiple filterable collapse-tags :placeholder="placeholder" no-match-text="無匹配資料" style="width:100%" >
                    <div style="height:30px;margin:5px 10px">
                            <el-button size="mini" @click="onselall">全選</el-button>
                            <el-button size="mini" @click="onclearall">清除全選</el-button>
                        </div>
                <el-option v-for="item in opts" :key="item" :label="item" :value="item">
                    <span style="float: left;margin-left: 20px;">{{ item }}</span>
                </el-option>
            </el-select>
        </div>
    `,
    props:[
        "value", //v-model
        "placeholder", 
        "opts"
    ],
    data(){
        return {
            model: []
        }
    },
    methods:{
        onchange(){
            this.$emit('input', this.model);
            this.$emit('onchange', this.model); 
        },
        onselall(){
            this.$emit('input', this.opts);
            this.$emit('onchange', this.opts); 
        },
        onclearall(){
            this.$emit('input', []);
            this.$emit('onchange', []); 
        }
    },
    watch: {
        value(val){
            this.model = this.value;
        }
    },
    mounted () {
        this.model = this.value;
    }
 });