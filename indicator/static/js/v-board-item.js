
/*
元件：
    v-board-item
描述:
    滑鼠過去會有邊框的，圖文框
屬性:
    title:標題文字
    fontaws_class:font aws 的圖標
    active:背景變成高亮
事件:
    click:按鈕觸發事件
插槽:
    slot1:xxxx
    slot2:xxx
相依：
    script1:xxx
    script2:xxx
限制:
範例:
    <v-board-item :porp1='' @event1=''></v-board-item>
*/
Vue.component("v-board-item", {
    delimiters: ['[[', ']]'],
    props: {
        id: {
            type: String,
            default: "id"
        },
        item_id: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: "19999"
        },
        fontaws_class: {
            type: String,
            default: "/report/order"
        },
        active:{
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    watch: {
     
    },
    template: `
    <div>
    <div class="grid-content">
        <div class="boardlist__item" :class="{act_board_item: active ,conceal: disabled}" @click="on_click">
            <div class="boardlist__heading">
                <div class="boardlist__title">[[title]]</div>
            </div>
            <div class="boardlist__imgbox">
                <a class="boardlist__link"  title="詳情">
                <md-icon :class="fontaws_class"></md-icon>
                </a>
                    </div>
        </div>
    </div>
    </div>
        `,
    data() {
        return {};
    },
    methods: {
        on_click(){
            this.$emit("click", this.item_id)
        }

    },
    mounted: function () {

    },
})
;