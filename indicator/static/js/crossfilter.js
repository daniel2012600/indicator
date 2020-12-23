// Jsfiddle example: https://jsfiddle.net/JefferyXu/xmj21Lfu/
class CF {
    constructor(data) {
        this.data = data;
        this.ndx = crossfilter(data);
        this.dim = null;
        this.group = null;
    }
    get val() {
        if (!this.rdata)
            return []
        return this.rdata.top(Infinity);
    }
    _isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
    sum(args) {
        this.group = this.dim.group().reduceSum(function (d) { return d[args]; });
        this.rdata = this.group;
        return this;
    }
    count(args) {
        this.group = this.dim.group().reduceCount(function (d) { return d[args]; });
        this.rdata = this.group;
        return this;
    }
    clear(){
        this.ndx = crossfilter(this.data);
        this.dim = null;
        this.rdata = null;
        return this;
    }
    groupby(args) {
        this.dim = this.ndx.dimension(function (d) { return d[args]; });
        this.rdata = this.dim;
        return this;
    }
    where(func){
        if (this._isFunction(func)){
            this.dim = this.ndx.dimension(function (d) { return d; });
            this.dim.filterFunction(func);
            this.rdata = this.dim;
            this.ndx = crossfilter(this.val);
            return this;
        }
    }
}
