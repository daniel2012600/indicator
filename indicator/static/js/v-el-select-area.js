/*
元件：
    v-el-select-area
描述:
    brabrabra
屬性:
    porp1:xxx
    porp2:xxx
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
    <v-el-select-area :porp1='' @event1=''></v-el-select-area>
*/
Vue.component("v-el-select-area", {
    props: {
        value: String,
        placeholder: String,
        demo_owner: String
    },
    template: `
    <el-select
        v-model="model"
        :placeholder="placeholder"
        @change="onchange">
        <el-option
            v-for="(val, idx) in opts"
            :key="'select-area-'+idx"
            :label="val"
            :value="val">
        </el-option>
    </el-select>
    `,
    delimiters: ['[[', ']]'],
    data(){
        return {
            model: [],
            opts: []
        }
    },
    methods:{
        onchange(){
            this.$emit('input', this.model);
            this.$emit('onchange', this.model); 
        },
        set_opts(data){
            this.opts = _.keys(_.groupBy(data, 'store_area'));
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
                this.$emit('init_opts', this.opts); 
            }, 'json')
        } else {
            $.post(`/lookup/area_store_by_role`, result => {
                this.set_opts(result);
                this.$emit('init_opts', this.opts); 
            }, 'json')
        }
    }
});