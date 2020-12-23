/******************************************
 -元件名：v-widget-1
 -描述：小元件
 -html 
 -屬性：
    icon :md icon文字，請到這裏選https://materialdesignicons.com/
    iconcolor:bootstrap _root裏面的字串，例如indigo, yellow
    text:文字
    value:數字

 -限制，特別說明：


 -依賴：
    vue material
    bootstrap css
    https://cdn.materialdesignicons.com/3.0.39/css/materialdesignicons.min.css
 -author:Rolence
 ******************************************/

Vue.component("v-widget-1", {
    props: ["icon", "iconcolor", 'text','value'],
    watch: {
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
    <div class="d-flex align-items-center m-4">
        <div>
            <span class="mr-2">
            <i  :style="'color: var(--'+ iconcolor + ', #fff) !important'" :class="'mdi mdi-'+ icon +' mdi-48px'"></i>
            
            </span>
        </div>
        <div>
            <span style="font-size:.875rem;line-height:21.6px">{{text}}</span>
            <h4 class="font-medium mb-0">{{value}}</h4>
        </div>
    </div>
        `,
    data() {
        return {};
    },
    methods: {
        render() {
           
        }
    },
    mounted: function () {
        this.render()
    }
});


Vue.component("v-widget-2", {
    props: ["icon", "iconcolor", 'text', "subtext", 'value'],
    watch: {
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
    <div class="text-center">
    <div :style="'color: var(--'+ iconcolor + ', #fff) !important'" class="mb-4">
        <i :class="'mdi mdi-'+ icon +' mdi-48px'"></i>
        <p class="font-weight-medium mt-2">{{text}}</p>
    </div>
    <h1 class="font-weight-light" style="font-family: Roboto, sans-serif;font-size: 1.875rem;">{{value}}</h1>
    <p class="mb-0" style="color: #8898aa!important;font-size:14px;font-family:'Nunito Sans', sans-serif!important;">{{subtext}}</p>
    </div>
        `,
    data() {
        return {};
    },
    methods: {
        render() {
           
        }
    },
    mounted: function () {
        this.render()
    }
});


Vue.component("v-widget-3", {
    props: ["bgcolorhex", 'title', 'text1',  'value', 'smalltext1', 'subtext'],
    watch: {
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
    <div class=" text-white card" :style="'background-color:'+ bgcolorhex + '!important'">
        <div class="card-body">
            <h5 class="card-title">{{title}}</h5>
            <div class="d-flex align-items-center mt-4">
                <div class="d-flex align-items-center">
                        <h3 v-if="smalltext1">{{text1}}</h3>
                        <h1 v-else>{{text1}}</h1>
                </div>
                <div class="ml-auto">
                    <h2 class="text-white mb-0"><i class="ti-arrow-up"></i>{{value}}</h2><span class="text-white op-5">{{subtext}}&nbsp;</span>
                </div>
            </div>
        </div>
    </div>
        `,
    data() {
        return {};
    },
    methods: {
        render() {
        }
    },
    mounted: function () {
        this.render()
    }
});


Vue.component("v-widget-order", {
    props: ["avatarcolorhex", "valuecolorhex", 'title', 'text1', 'avatartext', 'ord_id', 'bhv1', 'store_id'],
    watch: {
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
    <div class="d-flex border-top">
        <div class="p-2">
            <md-avatar v-if="avatartext != ''" class="md-avatar-icon mt-3 mr-2" :style="'background-color:'+ avatarcolorhex + '!important'">{{avatartext}}
            </md-avatar>
        </div>
        <div class="w-100 p-2">
            <h5 class="font-medium"></h5>
            <p class="mb-1 text-muted">{{title}}</p>
            <div class="comment-footer mb-1">
                <span class="text-muted small pull-right">{{text1}}</span>
                <span class="badge badge-pill text-white" :style="'background-color:'+valuecolorhex">{{ord_id}}</span>
                <span class="badge badge-pill text-white" style="background-color: rgb(108, 117, 125);">{{bhv1}}</span>
                <span class="badge badge-pill text-white" style="background-color: rgb(108, 117, 125);">{{store_id}}</span>
            </div>
        </div>
    </div>
        `,
    data() {
        return {};
    },
    methods: {
        render() {
        }
    },
    mounted: function () {
        this.render()
    }
});


Vue.component("v-widget-order-detail", {
    props: ["prd_img", 'title', 'text1', 'prd_sku', 'bhv2', 'ord_attr', 'ord_paytype'],
    watch: {
        data: function (newVal, oldVal) {
            this.render()
        }
    },
    template: `
    <div class="d-flex border-top">
        <div class="p-2">
            <img :src="prd_img" width="60" />
        </div>
        <div class="w-100 p-2">
            <h5 class="font-medium"></h5>
            <p class="mb-1 text-muted">{{title}}</p>
            <div class="comment-footer mb-1">
                <span class="text-muted small pull-right">{{text1}}</span>
                <span class="badge badge-pill text-white" style="background-color: rgb(32, 201, 151);">{{prd_sku}}</span>
                <span v-if="bhv2 != '售價'" class="badge badge-pill text-white" style="background-color: rgb(108, 117, 125);">{{bhv2}}</span>
                <span class="badge badge-pill text-white" style="background-color: rgb(108, 117, 125);">{{ord_attr}}</span>
                <span class="badge badge-pill text-white" style="background-color: #409EFF;">{{ord_paytype}}</span>
            </div>
        </div>
    </div>
        `,
    data() {
        return {};
    },
    methods: {
        render() {
        }
    },
    mounted: function () {
        this.render()
    }
});