/*
元件：
    v-page-title
描述:
    brabrabra
屬性:
    porp1:xxx
    porp2:xxx
事件:
    event1:xxx
    event2:xxx
插槽:
    slot1:xxxx
    slot2:xxx
相依：
    script1:xxx
    script2:xxx
限制:
範例:
    <v-page-title :porp1='' @event1=''></v-page-title>
*/
Vue.component("v-page-title", {
    delimiters: ['[[', ']]'],
    props: {
        id: {
            type: String,
            default: "id"
        },
        title: {
            type: String,
            default: "標題"
        },
        size: {
            type: String,
            default: "h1"
        },
        backcolor:{
            type: String,
            default: "#eee"
        }
    },
    template: `
    <el-row type="flex" justify="space-between" :gutter="25" class="pb-4 pt-3 sticky-top" :style="{'background-color':backcolor}">
        <el-col :span="8">
            <div class="grid-content">
                <span :class=size>[[title]]</span>
                <!-- <el-link type="info" @click="on_help_click">說明</el-link> -->
            </div>
        </el-col>
        <el-col :span="16">
            <div class="grid-content">
            <slot name="right"></slot>
            </div>
        </el-col>
    </el-row>
    `,
    data() {
        return {
            xyz:"abc"
        };
    },
    methods: {
        on_help_click(){
            this.$emit("click_help");
        }
    },
});