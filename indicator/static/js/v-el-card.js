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
    <script src="/static/js/v-el-card.js"></script>
    <script src="/static/js/v-sparkline-dt.js"></script>
    <script src="/static/js/v-value-card.js"></script>
限制:
範例:
    <v-el-card :porp1='' @event1=''></v-el-card>
*/


Vue.component("v-el-card", {
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
        tooltip: {
            type: String,
            default: "這是提醒"
        },
        tooltip_second_line: {
            type: String,
            default: "這是提醒"
        },
        //是否顯示沒有資料，若true, body就不顯示
        isempty: {　
            type: Boolean,
            default: false
        },
        // [6/28新增] 是否顯示今日資料同步中，若true, body就不顯示 
        //整個card的高度
        height: {
            type: Number,
            default: 450
        },
        loading: {
            type: Boolean,
            default: false
        },
        emptystyle: {
            type: String,
            default: null
        },
        isshow_header: {
            type: Boolean,
            default: true
        },
        title_span: {
            type: Array,
            default: () => [8, 16]
        },
        show_tooltip: {
            type: Boolean,
            default: false
        }
    },
    template: `
    <el-card shadow="never" class="box-card" :style="{'min-height': height  + 'px'}" v-loading="loading" element-loading-text="資料計算中．．．">
        <div slot="header" v-if="isshow_header">
            <el-row type="flex" justify="space-between" align="middle" :gutter="25">
                <el-col :span="title_span[0]">
                    <div class="grid-content d-flex align-items-center">
                        <span class="h2">[[title]]</span>
                        <slot name="content"></slot>
                        <el-tooltip v-if="show_tooltip" class="item" placement="right" effect="dark" >
                            <div slot="content">
                                [[tooltip]] <br/>
                                [[tooltip_second_line]]
                            </div>
                            <span class="info-tooltip material-icons">info</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="title_span[1]">
                    <div class="grid-content">
                        <slot name="right"></slot>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="md-empty-state-container" v-if="isempty" :style=emptystyle>
            <i class="md-icon md-icon-font md-empty-state-icon md-theme-default">insert_chart_outlined</i>
            <strong class="md-empty-state-label">無法查看此圖表</strong>
            <p class="md-empty-state-description">沒有資料</p>
        </div>
        <slot name="body"></slot>
    </el-card>  
    `,
    data() {
        return {};
    },
    mounted() {
    },
});