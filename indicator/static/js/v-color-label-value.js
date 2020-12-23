
/*有數值，小圖表，增長量的小卡片

Note:
    

Props:
    

Event:
    

Example:


*/
Vue.component("v-color-label-value", {
    delimiters: ['[[', ']]'],
    props: {
        id: {
            type: String,
            default: "id"
        },
        color: {
            type: String,
            default: ""
        },
        label: {
            type: String,
            default: "與整體比"
        },
        value: {
            type: String,
            default: "1999"
        }
    },
    watch: {
     
    },
    template: `
    <span style="font-size: 12px;">[[label]] <span :style="'color:' + color ">[[value]]</span></span>
        `,
    data() {
        return {
            xyz:"abc"
        };
    },
    methods: {
        
    },
    mounted: function () {

    }
})
;