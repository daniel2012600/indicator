/*
元件：
    v-ma-properties-example
描述:
    右側面版的範例寫法
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


Vue.component("v-ma-properties-line", {
    delimiters: ['[[', ']]'],
    props: ["cid", "cdata", "disable_save"],
    template: `
    <v-ma-properties-card :id="'properties' + cid" @close="on_close" @save="on_save" :disabled_save="Boolean(disable_save) || !is_valid()" :isshow="true" :txtshow="true">
        <el-form ref="action_line" :model="form_data" label-position="top"　label-width="70px" :rules="rules" @submit.native.prevent>
            <el-form-item label="發送時間" prop="time">
                <el-time-select
                    v-model="form_data.time"
                    placeholder="選擇時間"
                    :picker-options="{ start: '08:00', step: '00:15', end: '22:00'}">
                </el-time-select>
            </el-form-item>
            <el-form-item label="訊息內容" prop="line_msg">
                <el-input
                    type="textarea"
                    placeholder="請輸入訊息內容。"
                    rows="7"
                    height="500"
                    :maxlength="500"
                    show-word-limit
                    v-model="form_data.line_msg">
                </el-input>
            </el-form-item>
            <el-divider></el-divider>
            <p style="font-size: 20px; font-family: Roboto; font-weight: bold; color: #393C44">圖片</p>
            <el-form-item prop="line_img_url">
                <span slot="label">
                    圖片位置
                    <span class="info-tooltip material-icons">info</span>
                    <el-link type="primary" class="el-link--underline" href="/" target="_blank">
                        如何取得圖片位置
                    </el-link>
                </span>
                <el-input
                    placeholder="請將圖片上傳至可以公開取得的圖床。"
                    clearable
                    v-model="form_data.line_img_url">
                </el-input>
            </el-form-item>
            <el-form-item label="圖片標題" prop="line_img_alt_text">
                <el-input
                    placeholder="將顯示於推播通知及聊天一覽中"
                    clearable
                    v-model="form_data.line_img_alt_text">
                </el-input>
            </el-form-item>
            <el-form-item label="圖片訊息">
                <el-input
                    placeholder="將顯示在圖片上"
                    clearable
                    v-model="form_data.line_img_text">
                </el-input>
            </el-form-item>
            <el-form-item label="連結">
                <el-input
                    placeholder="將自動帶入訊息及圖片"
                    clearable
                    v-model="form_data.line_link">
                </el-input>
            </el-form-item>
            <el-checkbox class="mt-2 mb-2" v-model="form_data.cdp_tracking_on">使用CDP Tracking Code</el-checkbox>
            <el-form-item v-if="form_data.cdp_tracking_on" label="Campaign Source">
                <el-input
                    placeholder=""
                    v-model="form_data.campaign_source">
                </el-input>
            </el-form-item>
            <el-form-item v-if="form_data.cdp_tracking_on" label="Campaign Medium">
                <el-input
                    placeholder=""
                    v-model="form_data.campaign_medium">
                </el-input>
            </el-form-item>
            <el-form-item v-if="form_data.cdp_tracking_on" label="Campaign Name">
                <el-input
                    placeholder=""
                    v-model="form_data.campaign_name">
                </el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="mini" style="margin-left: 8em" @click="on_preview" :disabled="Boolean(disable_save) || !is_valid()">預覽</el-button>
        <el-divider></el-divider>
        <h5>
            說明
        </h5>
        <p>
            訊息僅限輸入及追蹤一組連結，並將自動縮為短連結。
        </p>
    </v-ma-properties-card>
    `,
    data() {
        var validatePass = (rule, value, callback) => {
            // 兩項皆未填
            if (this.form_data.line_img_url === '' && this.form_data.line_msg === '') { 
                callback(new Error('圖片位置或訊息內容至少擇一填寫'));
                if(rule.field === "line_img_url"){
                        callback(new Error('圖片位置或訊息內容至少擇一填寫'));
                } else {
                        callback(new Error('圖片位置或訊息內容至少擇一填寫'));
                }
            } else {
                // 兩項擇一填
                if(!(this.form_data.line_img_url !== '' && this.form_data.line_msg !== '')){
                    if(rule.field === "line_img_url"){
                        if(value){
                            var re = new RegExp(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g)
                            if(re.exec(value)){
                                callback();
                            } else {
                                callback(new Error('請填入合格的圖片連結'));
                            }
                        } else {
                            callback();
                        }
                    } else {
                            callback();
                    }
                } else {
                    // 兩項皆有擇填
                    if(rule.field === "line_img_url"){
                        var re = new RegExp(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g)
                        if(re.exec(value)){
                            callback();
                        } else {
                            callback(new Error('請填入合格的圖片連結'));
                        }
                    } else {
                        callback();
                    }
                }
            }
        }
        var validatePicture = (rule, value, callback) => {
            if (this.form_data.line_img_url === '' && this.form_data.line_img_alt_text === '') { 
                callback();
            } else {
                // 兩項擇一填
                if(!(this.form_data.line_img_url !== '' && this.form_data.line_img_alt_text !== '')){
                    if(rule.field === "line_img_url"){
                        if(value){
                            var re = new RegExp(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g)
                            if(re.exec(value)){
                                callback();
                            } else {
                                callback(new Error('請填入合格的圖片連結'));
                            }
                        } else {
                            callback(new Error('請填入圖片位置'));
                        }
                    } else {
                        if(value){
                            callback();
                        } else {
                            callback(new Error('請填入圖片標題'));
                        }
                    }
                } else {
                    callback();
                }
            }
        }
        return {
            form_data: $.extend(true, {}, this.cdata.data.task_opts),
            rules: {
                line_msg: [{ validator: validatePass, trigger: 'change' }],
                line_img_url: [{ validator: validatePass, validator: validatePicture, trigger: 'change' }],
                line_img_alt_text: [{ validator: validatePicture, trigger: 'change' }],
                time: [{ required: true, trigger: 'change' }],
            },
        };
    },
    watch: {
        cdata: {
            handler(val){
                this.form_data = $.extend(true, {}, val.data.task_opts);
            },
            deep: true
        },
        'form_data.cdp_tracking_on'(val) {
            if(val){
                var is_source_equal = _.isEmpty(this.cdata.data.task_opts.campaign_source)
                var is_medium_equal = _.isEmpty(this.cdata.data.task_opts.campaign_medium)
                var is_name_equal = _.isEmpty(this.cdata.data.task_opts.campaign_name)
                // 初始階段Tracking ON，預設帶入CDP預設參數。
                if(is_source_equal && is_medium_equal && is_name_equal){
                    this.form_data.campaign_source = "eagleeyecdp";
                    this.form_data.campaign_medium = flowy_data.id;
                    this.form_data.campaign_name = this.cdata.cid;
                // 再起階段，帶入cdata內部參數。
                } else {
                    this.form_data.campaign_source = this.cdata.data.task_opts.campaign_source;
                    this.form_data.campaign_medium = this.cdata.data.task_opts.campaign_medium;
                    this.form_data.campaign_name = this.cdata.data.task_opts.campaign_name;
                }
            } else {
                this.form_data.campaign_source = "";
                this.form_data.campaign_medium = "";
                this.form_data.campaign_name = "";
            }
        }
    },
    methods:{
        is_valid(){
            // 是否驗證通過
            var validated = false;
            if (this.$refs["action_line"]){
                this.$refs["action_line"].validate((valid) => {
                    if(valid){
                        validated = true;
                    }
                })
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
        },
        on_preview(){
            this.$emit('prop-preview', this.cid, this.form_data);
        },
        // ----------[API]----------
    },
    mounted(){
        this.is_valid();
    },
});