/*
元件：
    v-el-card
描述:
    卡片
屬性:
    title:這是標題
    tooltip:這是提醒
    isempty：是否顯示沒有資料，若true, body就不顯示
    height:card高度
    loading：載入中
事件:

插槽:
    body:內容
    right:右上
相依：
    <script src="/static/js/v-el-card.js">
    </script>

    <script src="/static/js/v-sparkline-dt.js">
    </script>

    <script src="/static/js/v-value-card.js">
    </script>

限制:
範例:
    <v-el-card :porp1='' @event1=''>
    </v-el-card>

*/


Vue.component("v-ma-task-card", {
    delimiters: ['[[', ']]'],
    props: {
        id: {
            type: String,
            default: "id"
        },
        title: {
            type: String,
            default: "這是標題"
        },
        desc: {
            type: String,
            default: "這是提醒"
        },
        isempty: {　//是否顯示沒有資料，若true, body就不顯示
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: "1"
        },
        task_type: {
            type: String,
            default: "Target"
        }
    },
    template: `
    <div class="blockelem create-flowy noselect">
        <input type="hidden" name="blockelemtype" class="blockelemtype" :value="value">
        <div class="grabme">
            <img src="/static/style/ma-flowy/assets/grabme.svg" ondragstart="return false;">
        </div>
        <div class="blockin">
            <div class="blockico">
                <span></span>
                <img v-if="task_type=='Target'" src="/static/style/ma-flowy/assets/eye.svg" ondragstart="return false;">
                <img v-if="task_type=='Action'" src="/static/style/ma-flowy/assets/action.svg" ondragstart="return false;">
                <img v-if="task_type=='Wait'" src="/static/style/ma-flowy/assets/time.svg" ondragstart="return false;">
            </div>
            <div class="blocktext">
                <p class="blocktitle">[[title]]</p>
                <p class="blockdesc">[[desc]]</p>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            xyz: "abc"
        };
    }
});