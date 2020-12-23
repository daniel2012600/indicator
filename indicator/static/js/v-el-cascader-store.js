/*
元件：
    v-el-cascader-store
描述:
    brabrabra
屬性:
    value
    placeholder
    props
    clearable
    show_all_store
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
    <v-el-cascader-store :porp1='' @event1=''></v-el-cascader-store>
*/
Vue.component("v-el-cascader-store", {
    props: {
        value: [Array, String],
        placeholder: String,
        props: Object,
        demo_owner: String,
        clearable: {
            type: Boolean,
            default: false
        },
        show_all_store: {
            type: Boolean,
            default: false
        },
        show_all_levels:{
            type: Boolean,
            default: false
        },
    },
    template: `
    <el-cascader
        v-model="model"
        collapse-tags
        filterable
        :clearable="clearable"
        :placeholder="placeholder"
        :options="opts" 
        :props="props" 
        :show-all-levels="show_all_levels"
        @change="onchange">
        <template slot-scope="{ node, data }">
            <span>[[ data.label.split("#")[0] ]]</span>
            <span 
                style="float:right; color: #8492a6; font-size: 13px" 
                v-show="!data.children && data.value!='全店'">[[ data.value ]]
            </span>
        </template>
    </el-cascader>
    `,
    delimiters: ['[[', ']]'],
    data(){
        return {
            model: [],
            opts: []
        }
    },
    computed: {
        sel_store_name() {
            return this.$children[0].getCheckedNodes()[0].label;
        }
    },
    methods:{
        onchange(){
            this.$emit('input', this.model);
            this.$emit('onchange', this.model); 
        },
        set_opts(data){
            this.opts = _.map(_.groupBy(data, 'store_area'), (stores, area) => {
                return { label: area, value: area, children: _.map(stores, st => {
                    return {
                        label: st.store_name,
                        value: st.store_id
                    }
                })}
            });
            if (this.show_all_store) {
                this.opts.unshift({label: '全店', value: '全店'});
            }
        }
    },
    watch: {
        value(val){
            this.model = this.value;
        }
    },
    mounted () {
        this.model = this.value;
        if (this.demo_owner) {
            $.post(`/lookup/area_store`, { owner: this.demo_owner }, result => {
                this.set_opts(result);
                this.$emit('init_opts', result); 
            }, 'json')
        } else {
            $.post(`/lookup/area_store_by_role`, result => {
                this.set_opts(result);
                this.$emit('init_opts', result); 
            }, 'json')
        }
    }
});