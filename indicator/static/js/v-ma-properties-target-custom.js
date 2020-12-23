/*
元件：
    v-ma-properties-target-custom
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
    <v-ma-properties-target-custom :cdi='' @save=''></v-ma-properties-target-custom>
*/


Vue.component("v-ma-properties-target-custom", {
    delimiters: ['[[', ']]'],
    props: ["cid", "cdata", "disable_save"],
    template: `
    <v-ma-properties-card :id="'properties' + cid" @close="on_close" @save="on_save" :disabled_save="Boolean(disable_save) || !is_valid()" :isshow="true" :txtshow="true">
        <el-form :model="form_data" label-position="top"　label-width="70px" :rules="rules" @submit.native.prevent>

            <el-form-item label="來源">
                <el-input type="text" v-model="rule_where" readonly></el-input>
            </el-form-item>
            <el-form-item label="受眾名稱">
                <el-input type="text" v-model="form_data.rule_name" readonly></el-input>
            </el-form-item>
            <el-form-item label="受眾說明">
                <el-input type="textarea" v-model="form_data.rule_desc" readonly></el-input>
            </el-form-item>
        </el-form>
    </v-ma-properties-card>
    `,
    data() {
        return {
            form_data: $.extend(true, {}, this.cdata.data.task_opts),
            rules: {}
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
    computed: {
        rule_where() {
            if (this.form_data.where == 'smart') return "智慧名單"
            else if (this.form_data.where == 'custom') return "自訂受眾"
            else return ''
        }
    },
    methods:{
        is_valid(){
            //是否驗證通過
            return false;
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
});