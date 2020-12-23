/*
元件：
    v-ma-properties-no-click-link.js
描述:
    沒有點擊某連結
屬性:
    cid:xxx
    data:xxx
事件:
    save:按下儲存事件後觸發
插槽:
    slot1:xxxx
    slot2:xxx
相依：
    v-ma-properties-card:使用此元件做為外框
限制:
範例:
    <v-ma-properties-card :cdi='' @save=''></v-ma-properties-card>
*/


Vue.component("v-ma-properties-no-click-link", {
    delimiters: ['[[', ']]'],
    props: ["cid", "cdata", "disable_save"],
    template: `
    <v-ma-properties-card :id="'properties' + cid" @close="on_close" @save="on_save" :disabled_save="Boolean(disable_save) || !is_valid()" :isshow="false" :txtshow="false">
    <el-form ref="no-click-link" :model="form_data" label-position="top" label-width="70px" :rules="rules" @submit.native.prevent>
        <!--<el-form-item label="會員沒有點擊此連結" prop="url_link">
            <el-input
                type="textarea"
                placeholder="請輸入連結URL,包含https://"
                height="500"
                show-word-limit
                maxlength="270"
                v-model="form_data.url_link">
            </el-input>
        </el-form-item>-->
        
        <!--<el-form-item>
            <el-button disabled>驗證連結有效性</el-button>
        </el-form-item>-->
    </el-form>
    <br><br><br><br>
    <h5>
        說明
    </h5>
    <p>
        將自動追蹤簡訊內之短連結。
    </p>
    </v-ma-properties-card>
    `,
    data() {
        return {
            form_data: $.extend(true, {}, this.cdata.data.task_opts),
            rules: {
                url_link: [
                    { required: true, message: '連結URL不得為空'},
                    {
                        validator: (rule, value, callback) => {
                            if (this.isValidURL(value)) {
                                callback();
                            } else {
                                callback(new Error('不是合法的 URL'));
                            }
                        }, trigger: 'blur'}
                ]
            }
        };
    },
    watch: {
        cdata: {
            handler(val){
                this.form_data = $.extend(true, {}, val.data.task_opts);
            },
            deep: true
        }
    },
    methods:{
        isValidURL(url){
            var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            if(RegExp.test(url)){
                return true;
            }else{
                return false;
            }
        },
        is_valid(){
            //是否驗證通過
            var validated = false;
            if (this.$refs["no-click-link"]) {
                this.$refs["no-click-link"].validate((valid) => {
                    if (valid) {
                        validated = true;
                    }
                });
            }
            return validated;
        },
        // ----------[事件]----------
        on_save(){
            // this.$message('按下儲存');
            this.$emit('prop-save', this.cid, this.form_data);
        },
        on_close(){
            this.$emit('prop-close', this.cid, this.form_data);
        }
    },
    mounted() {
        this.is_valid();
    },
});