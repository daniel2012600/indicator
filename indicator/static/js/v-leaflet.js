/******************************************
 -元件名：v-leaflet
 -描述：地圖icon元件，自動顯示cnt，第一名的
 -範例：<v-leaflet :data="rpt_data" :onrenderpop="onrenderpop"></v-leaflet> 
 -屬性：
    iconurl :可以到這裏https://loading.io/icon/, 選download，在右邊取預覽圖的svg下載來用
    data:陣列 每個元件為 {name:'xyz', let: 25.04, lng:121.57, sz: 'xs', cnt : 1200 } 
    上面的iconsize是字串，由大到小依序為
    - xl, l , m, s, xs, xxs
    -onrenderpop:傳入method, 
       item: 為的某一個item，回傳html字串
       isTop : true or undefind，是否為第一名

 -限制，特別說明：
    以台灣為中心點

 -依賴：
    <style type="text/css">
        #map {
            height: 800px;
    }
    </style>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css" integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js" integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA==" crossorigin=""></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js"></script>
 -author:Rolence
 ******************************************/
Vue.component("v-leaflet", {
    props: [
        "iconurl",
        "data",
        "geo_data",
        "onrenderpop",
        "namekey",
        "size_key",
        "color_key",
        "size",
        "color",
        "size_scale",
        "color_scale",
        "legend_key",
    ],
    watch: {
        data() {
            this.render();
        }
    },
    template: `<div id="map" style="height:600px"></div>`,
    data() {
        return {
            icons:[], //準備用來畫icon的陣列，六種尺寸
            map :null
        };
    },
    methods: {
        nFormatter(num, digits) {
            const si = [
                { value: 1, symbol: "" },
                { value: 1E3, symbol: "K" },
                { value: 1E6, symbol: "M" },
                { value: 1E9, symbol: "G" },
            ];
            const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
            let i;
            for (i = si.length - 1; i > 0; i--) {
                if (num >= si[i].value) {
                    break;
                }
            }
            return (num / si[i].value).toFixed(digits).replace(rx, "$1") + ' ' + si[i].symbol;
        },
        render() {
            var thiscomp = this;
            if(this.data.length == 0) return;
            if(this.map) this.map.remove();

            // https://www.openstreetmap.org/export#map=7/24.978/123.861
            // center of the map
            var center = [23.863, 121.038];
            // Create the map
            this.map = L.map('map',{
                scrollWheelZoom: false
            }).setView(center,8);
            L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 18
                }).addTo(this.map);
            L.control.scale().addTo(this.map);

            var color = d3.scaleLinear().range(this.color).domain(this.color_scale);
            var size =  d3.scaleLinear().range(this.size).domain(this.size_scale);
            var legend_key = this.legend_key
            var sizeLegend = _.map([
                d3.quantile(this.size_scale, 0), 
                d3.quantile(this.size_scale, 0.25), 
                d3.quantile(this.size_scale, 0.5), 
                d3.quantile(this.size_scale, 0.75), 
                d3.quantile(this.size_scale, 1)
            ], i => parseInt(i));

            var colorLegend = _.map([
                d3.quantile(this.color_scale, 0), 
                d3.quantile(this.color_scale, 0.25), 
                d3.quantile(this.color_scale, 0.5), 
                d3.quantile(this.color_scale, 0.75), 
                d3.quantile(this.color_scale, 1)
            ], i => i > 1 ? parseInt(i) : parseFloat(i));

            if(legend_key['size']){
                var legend1 = L.control({position: "bottomright"});
                legend1.onAdd = function(map){
                    var div = L.DomUtil.create("div", "legend1");
                    var circle_i = '';
                    var circle_txt = '';
                    for (var i = 0; i < sizeLegend.length; i++){
                        var from  = sizeLegend[i];
                        sizeStyle = `width:${8 + 8 * i}px;` + 
                            `height: ${8 + 8 * i}px;` +
                            `background: rgba(199, 199, 199,1);` +
                            `border-radius: 50%;` +
                            `margin-left: ${25 - (4 + 4 * i)}px;` +
                            `margin-top: ${20 - (4 + 4 * i)}px; `;
                        circle_i += `
                        <div style="width: 50px; height: 40px; float: left;">
                            <i style="${sizeStyle}"></i>
                        </div>`
                        circle_txt += `
                        <i style="width: 50px; text-align: center; height: 20px; margin-top: 5px;">
                            ${thiscomp.nFormatter(from, 1)}
                        </i>`
                    }
                    var legendHtml = `
                        <div style="height: 40px;">
                            <i style="height: 40px; width: 100px; float: left"></i>
                            ${circle_i}
                        </div>
                        <div class="mt-1" style="height: 30px;">
                            <i style="width: 100px; float: left; font-size: 14px; text-indent: 10px;">
                                ${legend_key['size']}
                            </i>
                            ${circle_txt}
                        </div>
                    `;
                    div.innerHTML += legendHtml
                    return div;
                };
                legend1.addTo(this.map);
            }

            if(legend_key['color']){
                var legend2 = L.control({position: "bottomright"});
                legend2.onAdd = function(map){
                    var div2 = L.DomUtil.create("div2", "legend2");
                    var circle_i = '';
    
                    var start  = colorLegend[0];
                    var end = (colorLegend.slice(-1)[0] < 1 && colorLegend.slice(-1)[0] > 0) 
                            ? colorLegend.slice(-1)[0].toLocaleString('en-US', {style: 'percent', maximumSignificantDigits: 2})
                            : colorLegend.slice(-1)[0] 

                    for (var i = 0; i < colorLegend.length; i++){
                        colorStyle = `width:41px;` + 
                        `height: 20px;` +
                        `background: ${color(colorLegend[i])};` +
                        `margin-top: 10px; `;
                        circle_i += `
                        <div style="height: 40px; float: left;">
                        <i style="${colorStyle}"></i>
                        </div>`
                    }
                    var barTextStart = `
                        <i style="width: 100px; text-align: left; height: 20px; margin-top: 5px;">
                            ${start}
                        </i>`
                    var barTextEnd = `
                        <i style="width: 100px; text-align: right; height: 20px; margin-top: 5px;">
                            ${end}
                        </i>`
                    var legendHtml = `
                        <div style="height: 40px;">
                            <i style="height: 40px; width: 120px; float: left"></i>
                            ${circle_i}
                        </div>
                        <div class="mt-1" style="height: 30px;">
                            <i style="width: 120px; float: left; font-size: 14px; text-indent: 10px;">
                                ${legend_key['color']}
                            </i>
                            ${barTextStart} ${barTextEnd}
                        </div>
                    `;
                    div2.innerHTML += legendHtml
                    return div2;
                };
                legend2.addTo(this.map);
            }
            this.map.on('click', function(m) { m.sourceTarget.scrollWheelZoom.enable(); });
            this.map.on('mouseout', function(m) { m.sourceTarget.scrollWheelZoom.disable(); });
            // console.log(this.map)
            if(this.geo_data){
                function onEachFeature(feature, layer) {
                    // Loop inside each features of your geojson file
                    //creation of the popup
                    layer.bindPopup(`<h5>${feature['properties']['name']}</h5><br>
                                    <h3>滲透率: ${feature['properties']['pid_penetrate_perc_format']}</h3><br>
                                    <h3>消費會員數: ${(feature['properties']['dcnt_pid']).toLocaleString()} </h3><br>
                                    <h3>消費金額: ${(feature['properties']['rev']).toLocaleString('zh-TW',{style:'currency',currency: 'TWD',  minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,})}</h3><br>
                                    <h3>地區總人口: ${feature['properties']['population']}</h3>`
                                    )
                    // Set default layer style
                    layer.setStyle({
                        opacity: 0.8,
                        fillOpacity: 0.8,
                        color: color(feature['properties']['pid_penetrate_perc']),
                    });
                    // When layer hovered
                    layer.on('mouseover', function () {
                        layer.setStyle({
                            color: '#EF5365',
                            opacity: 0.8,
                            fillOpacity: 0.8,
                        });
                    });
                    // Then when your mouse is out change back
                    layer.on('mouseout', function () {
                        layer.setStyle({
                            color: color(feature['properties']['pid_penetrate_perc']),
                            opacity: 0.8,
                            fillOpacity: 0.8,
                        });
                    });
                };
                geo_data = this.geo_data
                L.geoJSON(geo_data,{
                    onEachFeature: onEachFeature
                }).addTo(this.map);

            } else {
                _.filter(this.data, itm => itm[this.namekey]).forEach(itm => {
                    L.circleMarker(
                        [itm.lat, itm.lng], 
                        {
                            radius: size(itm[this.size_key]), 
                            opacity:0, 
                            fillColor: color(itm[this.color_key]), 
                            fillOpacity: 0.3
                        }
                    ).addTo(this.map).bindPopup(this.onrenderpop(itm));
                });
            }
        },
    },
    mounted: function () {
        this.render();
    }
});