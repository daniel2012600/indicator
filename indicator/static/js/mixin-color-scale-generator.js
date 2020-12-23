var mixin_color_generator = {
    data: {
    },
    methods: {
        generate_rainbow_colors(domain){
            var index_to_color_0to1 = d3.scaleLinear().range([0,1]).domain([0, domain])
            var colors = {  "item1": "#6574BB", "item2": "#62CACA",
                            "item3": "#E1CCFA", "item4": "#D58B23",
                            "item5": "#EED431", "item6": "#999999",
                            "item7": "#253E9F", "item8": "#82AF36",
                            "item9": "#6858A4", "item10": "#91B6E6"
                        };
            for (i = 11; i < domain+11; i++){
                var key = `item${i}`
                var res = {[key]: d3.interpolateSinebow([index_to_color_0to1(i)])}
                colors = Object.assign(colors, res);
            }
            return colors
        }
        
    }
}