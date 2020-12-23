/*

- Props: 
        ⓞ dpdate: 傳入Date 格式為: [yyyy-MM-dd]

- Events:
        ⓞ oncommit: 當oncommit觸發時回傳dtrange

*/

Vue.component("v-el-date-picker", {
    props: ["value", "default_dr", "disabled", "clearable", "size"],
    template: `
        <el-date-picker 
            v-model="dtrange" 
            type="daterange"
            start-placeholder="開始日期"
            range-separator="至" 
            end-placeholder="結束日期" 
            value-format="yyyy-MM-dd" 
            :size="size"
            :picker-options="dtpickerOptions"
            :disabled="disabled"
            :clearable="clearable"
            @change="onchange"
            unlink-panels>
        </el-date-picker>
    `,
    data() {
        return {
            dtrange: [],
            dtpickerOptions: {
                shortcuts: [
                    {
                        text: "本週",
                        onClick(picker) {
                            const start = new Date(moment().startOf('isoweek'));
                            const end = new Date(moment().endOf('isoweek'));
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "本月",
                        onClick(picker) {
                            const start = new Date(moment().startOf('month'));
                            const end = new Date(moment().endOf('month'));
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "上週",
                        onClick(picker) {
                            const start = new Date(moment().subtract(1, 'week').startOf('isoweek'));
                            const end = new Date(moment().subtract(1, 'week').endOf('isoweek'));
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "上月",
                        onClick(picker) {
                            const start = new Date(moment().subtract(1, 'month').startOf('month'));
                            const end = new Date(moment().subtract(1, 'month').endOf('month'));
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近7天",
                        onClick(picker) {
                            const start = new Date(moment().subtract(7, 'day'));
                            const end = new Date(moment().subtract(1, 'day'));
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近30天",
                        onClick(picker) {
                            const start = new Date(moment().subtract(30, 'day'));
                            const end = new Date(moment().subtract(1, 'day'));
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            }
        };
    },
    methods: {
        onchange() {
            this.$emit("input", this.dtrange);
            this.$emit("onchange", this.dtrange);
        }
    },
    watch: {
        value(val){
            this.dtrange = this.value;
        }
    },
    mounted() {
        // 預設本週
        var start = moment().subtract(7, 'day').format('YYYY-MM-DD');
        var end = moment().subtract(1, 'day').format('YYYY-MM-DD');
        if (this.default_dr != undefined) {
            this.dtrange = this.default_dr;
        } else {
            this.dtrange = [start, end];
        }
        // 更新v-model預設值
        this.$emit("input", this.dtrange);
    }
});
