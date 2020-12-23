/*
元件：
    v-ma-properties-wait
描述:
    等待幾天設定面版
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


Vue.component("v-ma-properties-wait", {
    delimiters: ['[[', ']]'],
    props: ["cid", "cdata", "disable_save"],
    template: `
    <v-ma-properties-card :id="'properties' + cid" @close="on_close" @save="on_save" :disabled_save="Boolean(disable_save) || !is_valid()" :isshow="true" :txtshow="true">
    <el-form ref="wait" :model="form_data" label-position="top"　label-width="70px" :rules="rules" @submit.native.prevent>
        <el-form-item label="等待幾天" prop="wait_day">
            <el-input-number v-model="form_data.wait_day" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <h5>
        說明
    </h5>
    <p>
        等待幾天後，再接續執行下個流程。
    </p>
    </v-ma-properties-card>
    `,
    data() {
        return {
            form_data: $.extend(true, {}, this.cdata.data.task_opts),
            rules: {
                wait_day: [
                    { required: true, message: '天數不得為空'},
                    { type: 'number', message: '天數必須為數字'},
                    { validator: (rule, v, cb) => {
                        if (v >= 1 && v <= 30) {
                            return cb();
                        } else {
                            return cb(new Error('等待天數必須在1~30天之間'));
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
            if (this.$refs["wait"]) {
                this.$refs["wait"].validate((valid) => {
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