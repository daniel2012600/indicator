/*
描述:
    比較資訊，可顯示上升及下降符號
維度量值:
    維度1個，量值1個
限制:
    data裏面一定要有dt, dt格式一定'yyyy-mm-dd'
html:
    id:必填，元件id，要有唯一性
屬性:
    txt1 : 比較區間定義，預設為"同比"，ex:與前期
    val : 比較變數，預設為"1999"
    txt2 : val後的文字，預設為"相比"
    up : 大於則為 true 可用於顯示大小，若未設置則無上升下降符號
    perc : 上升(下降)百分比設置，預設為20

*/
Vue.component("v-value-card-subtext", {
  delimiters: ["[[", "]]"],
  props: {
    id: {
      type: String,
      default: "id"
    },
    txt1: {
      type: String,
      default: "同比"
    },
    val: {
      type: String,
      default: "1999"
    },
    txt2: {
      type: String,
      default: "相比"
    },
    updntype: {
      type: String,
      default: "updn"
    },
    up: {
      type: Boolean,
      default: null
    },
    perc: {
      type: Number,
      default: "20"
    },
  },
  watch: {},
  template: `
    <div class="comparebox">
    <div class="comparebox__field">[[txt1]] [[val]] [[txt2]]</div>
      <span class="comparebox__increase" :class="{'text-danger': up, 'text-success': !up}">
        [[updn_char()]][[perc]]%
      </span>
    </div>
        `,
  data() {
    return {
     
    };
  },
  methods: {
    updn_char(){
      if(this.updntype == 'updn'){
          return this.up == true ? '▲' : this.up == false ? '▼' : ''
      }else{ // +-
        return this.up == true ? '+' : this.up == false ? '-' : ''
      }
    }
  },
  mounted: function() {}
});
