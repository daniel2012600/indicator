/*
元件：
    v-ma-properties-buy-name
描述:
    有購買什麼
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
    <v-ma-properties-buy-name :cdi='' @save=''></v-ma-properties-buy-name>
*/


Vue.component("v-ma-properties-buy-name", {
    delimiters: ['[[', ']]'],
    props: ["cid", "cdata", "disable_save"],
    template: `
    <v-ma-properties-card :id="'properties' + cid" @close="on_close" @save="on_save" :disabled_save="Boolean(disable_save) || !is_valid()" :isshow="true" :txtshow="true">
        <el-form ref="buy-name" :model="form_data" label-position="top"　label-width="70px" :rules="rules" @submit.native.prevent>
            <el-form-item label="有購買產品名稱包含" prop="prd_name">
                <el-input v-model="form_data.prd_name" autocomplete="off"></el-input>
            </el-form-item>
            <!--<el-input-number v-model="form_data.time_span" controls-position="right"></el-input-number>-->
        </el-form>
        <el-divider></el-divider>
        <h5>
            說明
        </h5>
        <p>
            判斷有無購買指定產品。
        </p>
    </v-ma-properties-card>
    `,
    data() {
        return {
            form_data: $.extend(true, {}, this.cdata.data.task_opts),
            rules: {
                prd_name: [{ required: true, message: '字串不得為空', trigger: 'blur'}]
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
            if (this.$refs["buy-name"]) {
                this.$refs["buy-name"].validate((valid) => {
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