
/*放在頁首

Note:
    

Props:


Slots:
    

Event:
    click_help

Example:


*/
Vue.component("v-el-select-dr", {
    delimiters: ['[[', ']]'],
    props: {
        default_dr: {
            type: String,
            default: "上週"
        },
        ds: {
            type: String,
            default: dayjs().format('YYYY-MM-DD')
        },
        format: {
            type: String,
            default: "MM-DD"
        },
        width: {
            type: Number,
            default: 250
        }
    },
    watch: {
     
    },
    template: `
    <el-select id="sel-dr" 
        v-model="dr" 
        placeholder="請選擇" 
        style="'width': width + px;"
        @change="onchange">
        <el-option v-for="item in dr_opt" :key="item" :label="item" :value="item">
            <span style="float: left">[[ item ]]</span>
            <span style="float: right; color: #8492a6; font-size: 13px">[[ dr_desc[item] ]]</span>
        </el-option>
    </el-select>
        `,
    data() {
        return {
            dr: this.default_dr,
            dr_opt: ["昨天","本週","本月","上週","上月"],
            //----------[昨天]----------
            d: moment().subtract(1, 'day'),
            //----------[本週]----------
            w1: moment().startOf('isoweek'),
            w2: moment().endOf('isoweek'),
            //----------[上週]----------
            pw1: moment().subtract(1, 'week').startOf('isoweek'),
            pw2: moment().subtract(1, 'week').endOf('isoweek'),
            //----------[本月]----------
            m1: moment().startOf('month'),
            m2: moment().endOf('month'),
            //----------[上月]----------
            pm1: moment().subtract(1, 'month').startOf('month'),
            pm2: moment().subtract(1, 'month').endOf('month')
        }
    },
    computed: {
        dr_desc() {
            return {
                "昨天": `(${this.d.format(this.format)})`,
                "本週": `(${this.w1.format(this.format)}~${this.w2.format(this.format)})`,
                "上週": `(${this.pw1.format(this.format)}~${this.pw2.format(this.format)})`,
                "本月": `(${this.m1.format(this.format)}~${this.m2.format(this.format)})`,
                "上月": `(${this.pm1.format(this.format)}~${this.pm2.format(this.format)})`,
            }
        }
    },
    methods: {
        onchange(){
            this.$emit('onchange', this.dr); 
        }
    },
    mounted: function () {

    }
})
;