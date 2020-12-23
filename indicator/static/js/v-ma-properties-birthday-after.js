/*
元件：
    v-ma-properties-birthday-after
描述:
    會員幾天後生日
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
    <v-ma-properties-birthday-after :cdi='' @save=''></v-ma-properties-birthday-after>
*/


Vue.component("v-ma-properties-birthday-after", {
    delimiters: ['[[', ']]'],
    props: ["cid", "cdata", "disable_save"],
    template: `
    <v-ma-properties-card :id="'properties' + cid" @close="on_close" @save="on_save" :disabled_save="Boolean(disable_save) || !is_valid()" :isshow="true" :txtshow="true">
        <el-form ref="birthday-after" :model="form_data" label-position="top"　label-width="70px" :rules="rules" @submit.native.prevent>
            <el-form-item label="會員幾天後生日" prop="days_later">
                <el-input-number v-model="form_data.days_later" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
        </el-form>
    </v-ma-properties-card>
    `,
    data() {
        return {
            form_data: $.extend(true, {}, this.cdata.data.task_opts),
            rules: {
                days_later: [
                    { required: true, message: '天數不得為空'},
                    { type: 'number', message: '天數必須為數字'},
                    { validator: (rule, v, cb) => {
                        if (v >= 1 && v <= 30) {
                            return cb();
                        } else {
                            return cb(new Error('天數必須在1~30天之間'));
                        }
                    }}
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
        is_valid(){
            //是否驗證通過
            var validated = false;
            if (this.$refs["birthday-after"]) {
                this.$refs["birthday-after"].validate((valid) => {
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