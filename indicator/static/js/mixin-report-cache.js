//自動儲存指定的資料
// 初始化，呼叫init_ls來自動載入上次儲存的資料，如果裏面有資料的話
// 初始化後，此元件會自動監控初始化傳入的資料名稱，如果有變動的話，自動儲存到localstroage
// ↓以下為範例, key在全站要有唯一性
// this.init_ls("key_" , hash, ["your_data1", "your_data2"])
//----------------------
// this.is_init_ls 用來判斷是否已經呼叫過init_ls方法了
//=====================
//以下是完整範例
// if(this.is_init_ls == false){
//     //使用mixinLocalStorage來載入資料快取
//     this.init_ls("rpt_newreturn", ["chartdata","datalist"]);
//     if(this.chartdata.length!=0 && this.datalist.length!=0){
//         return;
//     }
// }
var mixin_report_cache = {
    data: {
        is_init_ls: false, //是否已初始化, 如果已經叫用了init_ls()就會是true
        ls_dataset: [] //陣列，要自動儲存的data
    },
    computed: {
        orderFilterHash(){
            var fd = $.extend(true, {}, this.filter_data);
            return CryptoJS.HmacSHA256(JSON.stringify(fd), "Key").toString();
        }
    },
    methods: {
        ls_size() {
            var _lsTotal=0,_xLen,_x;for(_x in localStorage){ if(!localStorage.hasOwnProperty(_x)){continue;} _xLen= ((localStorage[_x].length + _x.length)* 2);_lsTotal+=_xLen; console.log(_x.substr(0,50)+" = "+ (_xLen/1024).toFixed(2)+" KB")};console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
        },
        clear_oldest() {
            var items = [];
            _.mapValues(localStorage, (v,k) => 
                _.map(JSON.parse(v), d => {
                    d.ls_key = k;
                    if (d.dt)
                        items.push(d);
                })
            );
            var min_item = _.minBy(items, 'dt');
            var f_item = _.filter(JSON.parse(
                    localStorage[min_item.ls_key]), d => d.sub_key != min_item.sub_key);
            if (f_item.length)
                localStorage[min_item.ls_key] = JSON.stringify(f_item);
            else
                localStorage.removeItem(min_item.ls_key)
        },
        clear_all() {
            localStorage.clear();
        },
        init_ls(key, hash, save_props) {
            if (!this.is_init_ls) {
                var that = this;
                _.forEach(save_props, (vn) => {
                    this.$watch(vn, val => {
                        //watch prop change then save to ls
                        var temp_data = localStorage[key];
                        var sub_key = that[hash];
                        var cdt = new Date().getTime();
                        var seach_obj = _.zipObject(["cdt", "sub_key", vn], [cdt, sub_key, val]);

                        (function init_setItem() {
                            try{
                                if (temp_data){
                                    var parse_data = JSON.parse(temp_data);
                                    var desc = _.filter(parse_data, d=>d.sub_key==sub_key);
                                    var src = _.reject(parse_data, d=>d.sub_key==sub_key);
                                    if (desc[0])
                                        src.push(_.extend(desc[0], seach_obj));
                                    else
                                        src.push(seach_obj);
                                    if (src.length>3)
                                        src.shift();
                                    localStorage[key] = JSON.stringify(src);
                                }else{
                                    localStorage[key] = JSON.stringify([seach_obj]);
                                }
                            } catch (e){
                                if (e.name = 'QuotaExceededError') {
                                    that.clear_oldest();
                                    init_setItem();
                                }
                            }
                        })();
                    }, {deep: true});
                });
            }

            this.is_init_ls = true;

            if (localStorage[key]) {
                var desc = _.find(JSON.parse(localStorage[key]), d => d.sub_key==this[hash]);
                if (desc) {  // 判斷有資料
                    if (new Date(desc.cdt).getDate() == new Date().getDate()) {  // 判斷同一天
                        _.forEach(save_props, d => {
                            this[d] = desc[d];
                        });
                        return true;
                    }
                }
            }
        }
    }
}