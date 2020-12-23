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


Vue.component("v-ma-properties-example", {
    delimiters: ['[[', ']]'],
    props: ["cid", "cdata"],
    template: `
    <v-ma-properties-card :id="'properties' + cid"  @save="on_save"　:disabled_save="true" :isshow="true" :txtshow="true">
        開發中
    </v-ma-properties-card>
    `,
    data() {
        return {
            form_data: $.extend(true, {}, this.cdata.data.task_opts),
            rules: {
                sms_content: [{ required: true, message: '簡訊內容不得為空', trigger: 'blur'}]
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
            // this.$refs[formName].validate((valid) => {
            //     if (valid) {
            //         this.createAccount();
            //     } else {
            //         console.log('error submit!!');
            //         return false;
            //     }
            // });
            return true;
        }
        // ----------[事件]----------
        ,on_save(){
            // this.$message('按下儲存');
            this.$emit('prop-save', this.cid, this.form_data);
        }
    },
});