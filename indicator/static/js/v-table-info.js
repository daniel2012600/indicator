
/*一個卡片，有提示，有標題，左上角，內容區, 找不到資料面版

Note:
    

Props:

Slot:
    body:內容
    right:標題右側
Event:
    

Example:
   <v-table-info title="title" tooltip="說明" :height="800"　:isempty="true"></v-table-info>

*/
Vue.component("v-table-info", {
    delimiters: ['[[', ']]'],
    props: {
        comparison_text: {
            type: String,
            default: "YOY"
        },
        dtrange_text1: {　//是否顯示沒有資料，若true, body就不顯示
            type: String,
            default: "2019年12月"
        },
        dtrange_text2: { //整個card的高度
            type: String,
            default:"2018年12月"
        },
        custom_text1: {
            type: String,
            default: "與"
        },
        hidden_comparison: {
            type: Boolean,
            default: false
        }
    },
    template: `
    <el-row type="flex" justify="space-between" :gutter="25" class="mb-4">
        <el-col :span="24">
            <div style="background-color: #f7f7f8; height:50px; border-radius:5px; line-height: 50px;">
                <div class="ml-3" style="float: left;">
                    <slot name="table_info_left"></slot>
                </div>
                <div class="mr-3" style="float: right;">
                    <span class="mr-1" v-if="!hidden_comparison">
                        <font color="#606266">比較定義: </font>
                        <font color="#7C4C9A">[[ comparison_text ]]</font>
                    </span>
                    <font class="mr-3 ml-3" v-if="!hidden_comparison">|</font>
                    <span class="mr-1">
                        <font color="#606266">比較區間: </font>
                        <font color="#7C4C9A">[[ dtrange_text1 ]]</font> 
                        <font color="#606266">[[ custom_text1 ]]</font>
                        <font color="#7C4C9A">[[ dtrange_text2 ]]</font>
                        <font color="#606266">相比</font>
                    </span>
                </div>
            </div>
        </el-col>
    </el-row>
    `,
    data() {
        return {};
    }
});