
/*有數值，小圖表，增長量的小卡片

Note:
    

Props:
    

Event:
    

Example:


*/
Vue.component("v-blank", {
    delimiters: ['[[', ']]'],
    props: {
        id: {
            type: String,
            default: "id"
        },
        p1: {
            type: String,
            default: "19999"
        },
        p2: {
            type: String,
            default: "數值1"
        }
    },
    watch: {
     
    },
    template: `
    <div>
        
    
    </div>
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