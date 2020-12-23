/*************************************
- 元件名:
       v-orderfilter
- 描述:
       包含「付費方式」、「購買方式」、「門店」、「日期區間」的複合元件
       會自動儲存「付費方式」、「購買方式」、「門店」的值
       「日期區間」自動選擇過去七天
- html:
       id:必填，元件id，要有唯一性
- 屬性:
       ⓞ opts : 預設下拉單的內容
            {
                ord_paytype:[]
                buytype:[]
                store:[]
            }
- 事件：
    　　ⓞ onchange(val)當回傳值發生改變時觸發
            - val :目前選單的選擇
            {
                ord_paytype:[],付費類型
                buytype:[],購買方式
                store:[],門店
                dr:"" 區間
            }
        ⓞ oncommit()使用者按下搜尋計算按鈕時觸發
        
- 依賴:
       vue element
       vue materaial
       v-el-select-multi元件

- 作者:
       Rolence
- 展示:
       see demo_selectmultiext.html
- 使用範例:
       使用v-model雙向綁定
       opts:預設值
       @oncommit="oncommit"　使用者按下確定鈕
       <v-orderfilter v-model="filter_data" 
                 :opts="opts" 
                 @oncommit="oncommit"></v-orderfilter>
      
- 日期:
       2018-08-05 17:05
- 特別注意：
    要加以下css，否則月歷元件會破版，兩個套件相衝突
    .el-range-separator
    {
        
        width:27px !important;
    }
*************************************/
document.write('<script src="/static/js/v-el-date-picker.js"></script>');
document.write('<script src="/static/js/v-el-select-multi.js"></script>');
document.write('<script src="/static/js/v-el-cascader-store.js"></script>');


Vue.component("v-orderfilter", {
    template: `
    <div class="filter mb-4">
        <div class="filter__wrap">
            <!-- 下拉選單 -->
            <div class="filter__selectgroup filter__selectgroup--1">
                <div class="filter__selectbox">
                    <div class="row">
                        <div class="col col-3" v-if="_.has(init_filter, 'ord_type')">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">[[ init_filter.ord_type ]]</label>
                                <div class="el-form-item__content">
                                    <v-el-select-multi 
                                        v-model="result.ord_type" 
                                        :placeholder="init_filter.ord_type" 
                                        :opts="opts.ord_type.items" 
                                        @onchange="onchange">
                                    </v-el-select-multi>
                                </div>
                            </div>
                        </div>
                        <div class="col col-3" v-if="_.has(init_filter, 'ord_paytype')">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">[[ init_filter.ord_paytype ]]</label>
                                <div class="el-form-item__content">
                                    <v-el-select-multi 
                                        v-model="result.ord_paytype"
                                        :placeholder="init_filter.ord_paytype" 
                                        :opts="opts.ord_paytype.items" 
                                        @onchange="onchange">
                                    </v-el-select-multi>
                                </div>
                            </div>
                        </div>
                        <div class="col col-3" v-if="_.has(init_filter, 'prd_cat1')">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">[[ init_filter.prd_cat1 ]]</label>
                                <div class="el-form-item__content">
                                    <v-el-select-multi 
                                        v-model="result.prd_cat1" 
                                        :placeholder="init_filter.prd_cat1" 
                                        :opts="opts.prd_cat1.items" 
                                        @onchange="onchange">
                                    </v-el-select-multi>
                                </div>
                            </div>
                        </div>
                        <div class="col col-3" v-if="_.has(init_filter, 'prd_cat2')">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">[[ init_filter.prd_cat2 ]]</label>
                                <div class="el-form-item__content">
                                    <v-el-select-multi 
                                        v-model="result.prd_cat2" 
                                        :placeholder="init_filter.prd_cat2" 
                                        :opts="opts.prd_cat2.items" 
                                        @onchange="onchange">
                                    </v-el-select-multi>
                                </div>
                            </div>
                        </div>
                        <div class="col col-3" v-if="_.has(init_filter, 'touch_C')">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">[[ init_filter.touch_C ]]</label>
                                <div class="el-form-item__content">
                                    <div>
                                        </br>
                                        <el-cascader
                                            style="width: 100%;"
                                            v-model="result.touch_C"
                                            collapse-tags
                                            clearable
                                            filterable
                                            :placeholder="init_filter.touch_C"
                                            :options="opts.touch_C.items" 
                                            :props="{multiple: true}" 
                                            @onchange="onchange">
                                        </el-cascader>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col col-3" v-if="_.has(init_filter, 'touch1')">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">[[ init_filter.touch1 ]]</label>
                                <div class="el-form-item__content">
                                    <v-el-select-multi 
                                        v-model="result.touch1" 
                                        :placeholder="init_filter.touch1" 
                                        :opts="opts.touch1.items" 
                                        @onchange="onchange">
                                    </v-el-select-multi>
                                </div>
                            </div>
                        </div>
                        <div class="col col-3" v-if="_.has(init_filter, 'touch2')">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">[[ init_filter.touch2 ]]</label>
                                <div class="el-form-item__content">
                                    <v-el-select-multi 
                                        v-model="result.touch2" 
                                        :placeholder="init_filter.touch2" 
                                        :opts="opts.touch2.items" 
                                        @onchange="onchange">
                                    </v-el-select-multi>
                                </div>
                            </div>
                        </div>
                        <div class="col col-3" v-if="_.has(init_filter, 'bhv_C')">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">[[ init_filter.bhv_C ]]</label>
                                <div class="el-form-item__content">
                                </br>
                                    <div>
                                        <el-cascader
                                            style="width: 100%;"
                                            v-model="result.bhv_C"
                                            collapse-tags
                                            clearable
                                            filterable
                                            :placeholder="init_filter.bhv_C"
                                            :options="opts.bhv_C.items" 
                                            :props="{multiple: true}" 
                                            @change="onchange">
                                        </el-cascader>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col col-3" v-if="_.has(init_filter, 'bhv1')">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">[[ init_filter.bhv1 ]]</label>
                                <div class="el-form-item__content">
                                    <v-el-select-multi 
                                        v-model="result.bhv1" 
                                        :placeholder="init_filter.bhv1" 
                                        :opts="opts.bhv1.items" 
                                        @onchange="onchange">
                                    </v-el-select-multi>
                                </div>
                            </div>
                        </div>
                        <div class="col col-3" v-if="_.has(init_filter, 'bhv2')">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">[[ init_filter.bhv2 ]]</label>
                                <div class="el-form-item__content">
                                    <v-el-select-multi 
                                        v-model="result.bhv2" 
                                        :placeholder="init_filter.bhv2" 
                                        :opts="opts.bhv2.items" 
                                        @onchange="onchange">
                                    </v-el-select-multi>
                                </div>
                            </div>
                        </div>
                        <div class="col col-3" v-if="_.has(init_filter, 'area_store')">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">[[ init_filter.area_store ]]</label>
                                <div class="el-form-item__content">
                                    <v-el-cascader-store style="width: 100%"
                                        v-model="result.area_store"
                                        :placeholder="init_filter.area_store"
                                        :props="{multiple: true, emitPath: false}"
                                        :clearable="true"
                                        @onchange="onchange">
                                    </v-el-cascader-store>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 日期選擇 -->
                <div  class="filter__datebox">
                    <div class="row">
                        <div class="col">
                            <div class="el-form-item">
                                <label  class="el-form-item__label">日期區間</label>
                                <div class="el-form-item__content">
                                    <v-el-date-picker
                                        v-model="result.dr"
                                        @onchange="onchange"
                                        :clearable="false">
                                    </v-el-date-picker>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="filter__submitbox">
            <el-button type="primary" style="height: 40px;" @click="oncommit">分析計算</el-button>
            </div>
        </div>
    </div>
    `,
    props:["fid", "init_filter"],
    delimiters: ['[[', ']]'],
    data(){
        return {
            opts: {
                area_store: { source: "area_store", items: [] },
                bhv_C: { source: "bhv", items: [] },
                bhv1: { source: "bhv", items: [] },
                bhv2: { source: "bhv", items: [] },
                ord_type: { source: "ord_type", items: [] },
                ord_paytype: { source: "ord_paytype", items: [] },
                prd_cat1: { source: "prd_cat", items: [] },
                prd_cat2: { source: "prd_cat", items: [] },
                touch_C: { source: "touch", items: [] },
                touch1: { source: "touch", items: [] },
                touch2: { source: "touch", items: [] },
            },
            result:{
                area_store: [],
                bhv_C: [],
                bhv1: [],
                bhv2: [],
                ord_type: [],
                ord_paytype: [],
                prd_cat1: [],
                prd_cat2: [],
                touch_C: [],
                touch1: [],
                touch2: [],
                dr: []
            },
            ordmem:true
        }
    },
    methods:{
        onchange(data){
            this.update_stroage(this.result);
            this.$emit('input', this.result);
            this.$emit('onchange', this.result); 
        },
        oncommit(){
            this.$emit('input', this.result);
            this.$emit('oncommit', this.result);
        },
        update_stroage(result){
            //save to local straoge
            localStorage[`ordfilter_result_${this.fid}`] = JSON.stringify(result);
        },
        // ==========[設定選項]==========
        set_area_store(data){
            this.opts.area_store.items = _.map(_.groupBy(data, 'store_area'), (stores, area) => {
                return { label: area, value: area, children: _.map(stores, st => {
                    return {
                        label: st.store_name,
                        value: st.store_id
                    }
                })}
            });
        },
        set_bhv_C(data){
            this.opts.bhv_C.items = _.map(_.groupBy(data, 'bhv1'), (val, key) => {
                return { label: key, value: key, children: _.map(val, i => {
                    return {
                        label: i.bhv2,
                        value: i.bhv2
                    }
                })}
            });
        },
        set_bhv1(data){
            this.opts.bhv1.items = _.uniq(_.map(data, 'bhv1'));
        },
        set_bhv2(data){
            this.opts.bhv2.items = _.uniq(_.map(data, 'bhv2'));
        },
        set_ord_type(data){
            this.opts.ord_type.items = _.uniq(_.map(data, 'ord_type'));
        },
        set_ord_paytype(data){
            this.opts.ord_paytype.items = _.uniq(_.map(data, 'ord_paytype'));
        },
        set_prd_cat1(data){
            this.opts.prd_cat1.items = _.uniq(_.map(data, 'prd_cat1'));
        },
        set_prd_cat2(data){
            this.opts.prd_cat2.items = _.uniq(_.map(data, 'prd_cat2'));
        },
        set_touch_C(data){
            this.opts.touch_C.items = _.map(_.groupBy(data, 'touch1'), (val, key) => {
                return { label: key, value: key, children: _.map(val, i => {
                    return {
                        label: i.touch2,
                        value: i.touch2
                    }
                })}
            });
        },
        set_touch1(data){
            this.opts.touch1.items = _.uniq(_.map(data, 'touch1'));
        },
        set_touch2(data){
            this.opts.touch2.items = _.uniq(_.map(data, 'touch2'));
        },
        // ==========[API取得參數]==========
        get_opts_from_lookup(opt){
            var path = opt == 'area_store' ? 'area_store_by_role' : opt;
            return (resolve) => {
                $.post(`/lookup/${path}`, result => {
                    resolve({source: opt, data: result});
                }, 'json')
            }
        }
    },
    mounted() {
        // 變數準備
        var f_opts = _.omit(_.pick(this.opts, _.keys(this.init_filter)), 'area_store');
        var pms = _.chain(f_opts).map(i => i.source).uniq().map(m => {
            return new Promise(this.get_opts_from_lookup(m));
        }).value();

        // 多執行序取得資料並設值
        Promise.all(pms).then((data) => {
            var data = _.keyBy(data, 'source');
            _.forEach(f_opts, (item, key) => {
                this[`set_${key}`](data[item.source].data)
            });
        });
        // 暫存
        if (localStorage[`ordfilter_result_${this.fid}`])
            this.result = JSON.parse(localStorage[`ordfilter_result_${this.fid}`]);
        this.oncommit();//自動先呼叫oncommit
    }
 });
 