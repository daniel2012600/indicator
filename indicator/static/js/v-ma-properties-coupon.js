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


Vue.component("v-ma-properties-coupon", {
    delimiters: ['[[', ']]'],
    props: ["cid", "cdata", "disable_save"],
    template: `
    <v-ma-properties-card :id="'properties' + cid" @close="on_close" @save="on_save" :disabled_save="Boolean(disable_save) || !is_valid()" :isshow="true" :txtshow="true">
        <el-form ref="action_coupon" :model="form_data" label-position="top"　label-width="70px" :rules="rules" @submit.native.prevent>
            <el-form-item label="發送時間" prop="time">
                <el-time-select
                    v-model="form_data.time"
                    placeholder="選擇時間"
                    :picker-options="{ start: '08:00', step: '00:15', end: '22:00'}">
                </el-time-select>
            </el-form-item>
            <el-form-item prop="coupon_selected">
                <span slot="label">優惠券列表</span>
                <el-link slot="label" style="float:right; color:#7c4f9d" class="ml-4 el-link--underline" href="https://admin.coopon.com.tw/" target="_blank">前往設定優惠券</el-link>
                <el-select v-model="form_data.coupon_selected" placeholder="請選擇優惠券" value-key="uuid" @change=on_select_change>
                    <el-option
                        v-for="coupon in coupon_list"
                        :key="coupon.uuid"
                        :label="coupon.name"
                        :value="coupon">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="簡訊內容" prop="coupon_content">
                <el-input
                    type="textarea"
                    placeholder="請輸入簡訊內容，發送簡訊時已包含優惠券連結，不需自行填入。"
                    rows="7"
                    height="500"
                    :maxlength="maxlength"
                    v-model="form_data.coupon_content">
                </el-input>
            </el-form-item>
            <span class="text" style="float: right;color: #909399;margin-right: 10px; font-size: 12px">字數 [[word]] / 70 </span>
            <el-form-item label="預覽簡訊內容">
                <el-input
                    type="textarea"
                    placeholder="請輸入簡訊內容，發送簡訊時已包含優惠券連結，不需自行填入。"
                    rows="7"
                    height="500"
                    readonly
                    v-model="descInput">
                </el-input>
            </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <h5>
            說明
        </h5>
        <p>
            優惠券領取連結將自動附加在簡訊最後，不需自行填入，並已自動扣除優惠券連結字數。請勿輸入特殊字元，將會顯示亂碼。
        </p>
    </v-ma-properties-card>
    `,
    data() {
        return {
            form_data: $.extend(true, {}, this.cdata.data.task_opts),
            rules: {
                coupon_content: [{ required: true, message: '簡訊內容不得為空', trigger: 'blur' }],
                coupon_selected: [{ required: true, message: '優惠券項目不得為空', trigger: 'blur' }],
                time: [{ required: true, message: '發送時間不得為空', trigger: 'blur' }]
            },
            coupon_list: [],
            maxlength: 70,
            word: 0,
            show_content: ""
        };
    },
    computed: {
        descInput(){
            if (!_.isEmpty(this.form_data.coupon_selected)){
                var txt = this.form_data.coupon_content
                var re = new RegExp(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g)
                if(re.exec(txt)){
                    this.word = txt.length + 3
                    this.maxlength = 67;
                } else {
                    this.word = txt.length;
                    this.maxlength = 70;
                }
                return txt
            } else {
                if(this.form_data.coupon_content){
                    this.word = this.form_data.coupon_content.length;
                } else {
                    this.word = 0;
                }
                return this.form_data.coupon_content
            }
        },
    },
    watch: {
        cdata: {
            handler(val){
                this.form_data = $.extend(true, {}, val.data.task_opts);
            },
            deep: true
        },
    },
    methods:{
        is_valid(){
            // 是否驗證通過
            var validated = false;
            if (this.$refs["action_coupon"]){
                this.$refs["action_coupon"].validate((valid) => {
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
        on_select_change(){
            this.form_data.coupon_content = this.form_data.coupon_content.concat('', 'https://redcdp.page.link/QFjGZSsujwGahyTh8')
        },
        // ----------[API]----------
        get_coupon_list(){
            var that = this;
            $.post('/ma_edit_coupon_list', function(result){
                var r = JSON.parse(result);
                that.coupon_list = r;
            })
        }
    },
    mounted(){
        this.is_valid();
        this.get_coupon_list();
    },
});