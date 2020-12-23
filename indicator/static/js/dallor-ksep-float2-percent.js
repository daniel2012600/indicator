/**
 * [[40128 | k]] => 40,128
 * [[ 4003506 | k | $]] = > $4,003,506
 * [[(4003506/5285945*100) | f2]] = > 75.74
 * [[(4003506/5285945*100) | f2 | % ]] = > 75.74%
 */
function rep_k(strNum) {

    if (strNum == null) return ''

    strNum = (!isNaN(parseFloat(strNum)) && isFinite(strNum)) ? strNum.toString() : strNum

    //千分位逗號
    if (strNum.length <= 3) return strNum;
    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) return strNum;
    var a = RegExp.$1,
        b = RegExp.$2,
        c = RegExp.$3;
    var re = new RegExp();
    re.compile("(\\d)(\\d{3})(,|$)");
    while (re.test(b)) {
        b = b.replace(re, "$1,$2$3");
    }
    return a + "" + b + "" + c;
}

function rep_f0(num) {
    if (typeof(num)!='number') return 0;
    return parseFloat(num.toFixed(0))
}

function rep_f2(num) {
    if (typeof(num)!='number') return 0;
    return parseFloat(num.toFixed(2))
}

function rep_updn(num) {
    if (typeof(num)=='number') num = String(num);
    if (typeof(num)!='string') return 0;
    var regexp = /[\.|\-|\d+]/g;
    var floatNum = parseFloat([...num.matchAll(regexp)].join(''));
    return floatNum > 0 ? '▲' + num : floatNum < 0 ? '▼' + Math.abs(parseFloat(num)).toString() + '%' : num
}

Vue.filter('%', val => val + '%')
Vue.filter('persen', val => val + '%')
Vue.filter('$', val => '$' + val)
Vue.filter('k', val => rep_k(val))
Vue.filter('f0', val => rep_f0(val))
Vue.filter('f2', val => rep_f2(val))
Vue.filter('updn', val => rep_updn(val))