/*由多個元素組成，由上而下為:
    數值(val)
    小標題(text)
    sparkline(chartdata)
    tooltip(包住slot)
    slot

Note:
        

Props:
        

Event:
        

Example:


*/
Vue.component("v-value-card", {
    delimiters: ["[[", "]]"],
    props: {
        id: {
            type: String,
            default: "id"
        },
        icon:{
            type: String,
            default: null
        },
        tooltip: {
            type: String,
            default: "這是提醒"
        },
        val: {
            type: String,
            default: "19999"
        },
        txt: {
            type: String,
            default: "數值1"
        },
        name: {
            type:String,
            default: null
        },
        //整個card的高度
        height: {
            type: Number,
            default: 213,
        },
        chartdata: {
            type: Array,
            default: () => {
                return [
                ];
            }
        },
        charttype: {
            type: String,
            default: "bar"
        },
        chartcolor: {
            type: String,
            default: "rgba(15, 219, 183, 0.4)"
        },
        // 要做漸層，所以跟chartcolor分開傳
        linecolor: {
            type: String,
            default: "rgba(15, 219, 183, 1)"
        },
        chartheight: {
            type: String,
            default: "50"
        },
        chartwidth: {
            type: String,
            default: "100%"
        },
        up: {
            type: Boolean,
            default: null
        },
        isempty: {
            type: Boolean,
            default: false
        },
        // [6/28新增] 是否顯示今日資料同步中，若true, body就不顯示 
        issyncronize: {
            type: Boolean,
            default: false
        },
        emptystyle: {
            type: String,
            default: null
        },
        meskey: {
            type: Array,
            default: () =>    ["dt", "y"]
        },
        y_label_format: {
            type: Function,
            default: (val, key) => val
        },
        unit: {
            type: String,
            default: null
        }
    },
    methods: {
        val_separator: function(type){
            switch (type) {
                case "symbol":
                    if (this.val.indexOf("▲") > -1) {
                        return "▲";
                    } else if (this.val.indexOf("▼") > -1) {
                        return "▼";
                    }
                    break;
                case "value":
                    if (this.val.indexOf("▲") > -1) {
                        return this.val.split("▲")[1];
                    } else if (this.val.indexOf("▼") > -1) {
                        return this.val.split("▼")[1];
                    }
            }
        }
    },
    template: `
    <div :id="id" class="grid-content v-value-card" :class="{'v-value-card--value-pie': charttype === 'valuepie'}">
        <el-card shadow="never" class="box-card" :style="{'height': height + 'px'}">
            <div v-if="isempty" :class="{'d-none': !isempty}">
                <md-empty-state md-description="沒有資料" :style="emptystyle" :class="{'d-none': !isempty}">
                </md-empty-state>
            </div>
            <md-card v-else class="text-center">
                <md-card-header>
                    <div class="box-title">[[txt]]</div>
                </md-card-header>
                <md-card-content>
                    <div class="chartbox">
                        <div class="mainbox">
                            <template v-if="charttype === 'valuepie'">
                                <div class="mainbox__chart">
                                    <div class="value-pie" :class="{'value-pie--up': up, 'value-pie--down': !up}">
                                    <div class="value-pie__symbol">[[val_separator('symbol')]]</div>
                                    <div class="value-pie__value">[[val_separator('value')]]</div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="mainbox__value" :style="{color: up ? 'red': up != null ? 'green' : ''}">
                                    <div class="mainbox__value-content">[[val]]</div>
                                    <div class="mainbox__value-unit">[[unit]]</div> 
                                </div>
                                <div class="mainbox__chart">
                                    <v-sparkline-dt :id="id+'_spark'" :data="chartdata" :type="charttype" :color="chartcolor"
                                        :linecolor="linecolor" :height="chartheight" :width="chartwidth"
                                        :y_label_format="y_label_format" :meskey="meskey" class="mb-6 text-center mt-3">
                                    </v-sparkline-dt>
                                </div>
                            </template>
                            <div class="mainbox__field">[[name]]</div>
                        </div>
                        <div class="md-subhead">
                            <!-- <el-tooltip content="" placement="top"> -->
                            <slot>
                            </slot>
                            <!-- </el-tooltip> -->
                        </div>
                    </div>
                </md-card-content>
            </md-card>
        </el-card>
    </div>
    `,
});
