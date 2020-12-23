var mixin_chart_img = {
    methods: {
        get_imgs_base64() {
            //on ready 時呼叫
            //回傳 [ {id:xxx, base64:xxxx} ]

            var imgs_base64 = []
            debugger;
            Object.keys(window._echarts).forEach(c => {
                var base64 = window._echarts[c].getDataURL({
                    pixelRatio: 2,
                    backgroundColor: '#fff'
                });
                imgs_base64.push({"id" : c, "base64" : base64});
            });
            return imgs_base64;
        }
    }
}