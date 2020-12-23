/*************************************
- 元件名:
       v-orderfilter
- 描述:
       包含「受眾人群」、「日期區間」的複合元件
       
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ ta_list : 人群下拉單的字串陣列
           
- 事件：
    　　ⓞ onchange(val)當回傳值發生改變時觸發
            ta:"",//受眾人群
            dr1:"" //區間  
- 依賴:
       vue element
       vue materaial

- 作者:
       Rolence
- 展示:
       see demo_selectmultiext.html
- 使用範例:
      
- 日期:
       2018-12-04 
- 特別注意：
    要加以下css，否則月歷元件會破版，兩個套件相衝突
    .el-range-separator
    {
        
        width:27px !important;
    }
*************************************/
document.write('<script src="/static/js/v-el-date-picker.js"></script>');
document.write('<script src="/static/js/dallor-ksep-float2-percent.js"></script>');

Vue.component("v-tafilter", {
    template: `
    <div class="filter mb-4">
        <div class="filter__wrap">
        <!-- 下拉選單 -->
            <div class="filter__selectgroup filter__selectgroup--1">
                <div class="filter__selectbox">
                    <div class="row">
                        <div class="col col-4">
                            <div class="el-form-item">
                                <label class="el-form-item__label">受眾</label>
                                <div class="el-form-item__content">
                                    <el-select 
                                        v-model="result.ta"
                                        @change="onchange" 
                                        placeholder="請選擇一個人群" 
                                        style="width:100%">
                                        <el-option-group
                                            v-for="group in ta_list"
                                            :key="group.label"
                                            :label="group.label">
                                            <el-option
                                                class="md-list-item"
                                                v-for="item in group.options"
                                                :key="ta_opts(group, item).key"
                                                :value="ta_opts(group, item).key"
                                                :label="ta_opts(group, item).value">
                                                {{ ta_opts(group, item).value }}
                                            </el-option>
                                        </el-option-group>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 日期選擇 -->
                <div class="filter__datebox">
                    <div class="row">
                        <div class="col">
                            <div class="el-form-item">
                                <label class="el-form-item__label">區間</label>
                                <div class="el-form-item__content">
                                    <v-el-date-picker
                                        v-model="result.dr"
                                        @onchange="onchange">
                                    </v-el-date-picker>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="filter__submitbox">
                <el-button type="primary" @click="oncommit" style="padding-top: 13px;">查詢</el-button>
            </div>
        </div>
    </div>
    `,
    props: ["ta_list"],
    data(){
        return {
            result: {
                ta: `${ta_list[0].key}_${ta_list[0].options[0].ruleid}`,
                dr: [
                    moment().subtract(7, 'days').format('YYYY-MM-DD'),
                    moment().format('YYYY-MM-DD')
                ],             // 查詢區間 (預設近一週)
                compare_dr: [] // 比較區間
            },
        }
    },
    mounted(){
        this.result.compare_dr = this.get_compare_dr;  // 計算比較區間
       
        this.oncommit();
    },
    computed: {
        get_compare_dr() {
            var start_date = moment(this.result.dr[0], 'YYYY-MM-DD');
            var end_date = moment(this.result.dr[1], 'YYYY-MM-DD');
            var diff_day = end_date.diff(start_date, 'days') + 1;
            return [
                start_date.subtract(diff_day, 'days').format('YYYY-MM-DD'), 
                end_date.subtract(diff_day, 'days').format('YYYY-MM-DD'), 
            ];
        },
    },
    methods:{
        ta_opts(group, item) {
            return { key: `${group.key}_${item.ruleid}`, value: `${item.name} ${rep_k(item.rowcnt)} 人` }
        },
        onchange(){
            this.result.compare_dr = this.get_compare_dr;
            // 更新v-model預設值
            this.$emit("input", this.result);
            this.$emit('onchange', this.result); 
        },
        oncommit(){
            this.$emit("input", this.result);
            this.$emit('oncommit', this.result);
        },
    }
 });