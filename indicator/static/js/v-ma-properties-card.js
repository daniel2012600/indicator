/*
元件：
    v-ma-properties-card
描述:
    屬性面版的外框
屬性:
    disabled_save:是否允許點擊儲存
    
事件:
    close:右上角關閉
    save:最下方儲存鈕
插槽:
    slot1:xxxx
    slot2:xxx
相依：
    script1:xxx
    script2:xxx
限制:
範例:
    < :porp1='' @event1=''></>
*/


Vue.component("v-ma-properties-card", {
    delimiters: ['[[', ']]'],
    props: ["id","disabled_save", "isshow", "txtshow"],
    template: `
    <div :id="id" class="properties">
        <div class="close">
            <i class="el-icon-close" @click="on_click_close"></i>
        </div>
        <p class="header2" v-if="txtshow">設定</p>
    
        <el-row class="proplist" style="margin-right:20px">
            <el-col :span="24">
                <slot></slot>
            </el-col>
        </el-row>
        <div class="divisionthing"></div>
        <div class="saveblock" v-if="isshow">
            <el-row type="flex" justify="center">
                <el-col :span="24">
                    <el-button type="primary" style="width:287px" @click="on_click_save" :disabled="disabled_save">
                    儲存設定
                    </el-button>
                </el-col>
            </el-row>
            
        </div>
        
    </div>
    `,
    data() {
        return {
          
        };
    }
    ,methods:{
        on_click_close(){
            this.$emit('close')
        },
        on_click_save(){
            // debugger
            this.$emit('save')
        }
    }
});