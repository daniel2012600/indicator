/*
元件：
    v-ma-properties-action-sms
描述:
    設定簡訊發送
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


Vue.component("v-ma-properties-action-sms", {
    delimiters: ['[[', ']]'],
    props: ["cid", "cdata", "disable_save"],
    template: `
    <v-ma-properties-card :id="'properties' + cid" @close="on_close" @save="on_save" :disabled_save="Boolean(disable_save) || !is_valid()" :isshow="true" :txtshow="true">
        <el-form ref="action-sms" :model="form_data" label-position="top"　label-width="70px" :rules="rules" @submit.native.prevent>
            <el-form-item label="發送時間" prop="time">
                <el-time-select
                    v-model="form_data.time"
                    placeholder="選擇時間"
                    :picker-options="{ start: '08:00', step: '00:15', end: '22:00'}">
                </el-time-select>
            </el-form-item>
            <el-form-item label="簡訊內容" prop="sms_content">
                <el-input
                    type="textarea"
                    placeholder="請輸入簡訊內容，僅限輸入及追蹤一組連結。"
                    rows="7"
                    height="500"
                    :maxlength="maxlength"
                    v-model="form_data.sms_content">
                </el-input>
                <span class="text" style="float: right;color: #909399;margin-right: 10px; font-size: 12px">字數 [[word]] / 70 </span>
            </el-form-item>
            <el-form-item label="預覽簡訊內容">
                <el-input
                    type="textarea"
                    placeholder="請輸入簡訊內容，僅限輸入及追蹤一組連結。"
                    rows="7"
                    height="500"
                    :readonly="true"
                    v-model="descInput">
                </el-input>
            </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <h5>
            說明
        </h5>
        <p>
            簡訊內僅限輸入及追蹤一組連結，並將自動縮為短連結。請勿輸入特殊字元，將會顯示亂碼。
        </p>
    </v-ma-properties-card>
    `,
    data() {
        return {
            form_data: $.extend(true, {}, this.cdata.data.task_opts),
            rules: {
                sms_content: [{ required: true, message: '簡訊內容不得為空', trigger: 'blur'}],
                time: [{ required: true, message: '發送時間不得為空', trigger: 'blur'}],
            },
            maxlength: 70,
            word: 0,
            show_content: ""
        };
    },
    computed: {
        descInput(){
            if(!_.isEmpty(this.form_data.sms_content)){
                var txt = this.form_data.sms_content;
                var re = new RegExp(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g)
                if(re.exec(txt)){
                    this.word = txt.length - re.lastIndex + txt.search(re) + 45;
                    this.maxlength = 70 + (re.lastIndex - txt.search(re) - 45) 
                } else {
                    this.word = txt.length;
                }
                this.show_content = txt.replace(re, 'https://redcdp.page.link/QFjGZSsujwGahyTh8');
                return this.show_content
            } else {
                this.word = 0;
            }
        }
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
        is_valid(){
            //是否驗證通過
            var validated = false;
            if (this.$refs["action-sms"]) {
                this.$refs["action-sms"].validate((valid) => {
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