<template>
    <div>
        <Button type="primary" @click="goBack()">返回</Button>
        <div id="tip">
            <input style="width: 200px;"
                   type="text"
                   id="keyword"
                   name="keyword"
                   value="请输入关键字：(选定后搜索)"
                   onfocus='this.value=""'/>
        </div>
        <div id="mapContainer" style="width: 1000px;height: 800px"></div>
    </div>
</template>
<script>
    import AMap from "AMap"

    export default {
        mounted: function () {
            this.init()
        },
        methods: {
            init: function () {
                var map = new AMap.Map("mapContainer", {
                    resizeEnable: true,
                    center: [116.397428, 39.90923],//地图中心点
                    zoom: 9,//地图显示的缩放级别
                    keyboardEnable: false
                });
                AMap.plugin(["AMap.Autocomplete", "AMap.PlaceSearch"], function () {
                    var autoOptions = {
                        input: "keyword"//使用联想输入的input的id
                    };
                    var autocomplete = new AMap.Autocomplete(autoOptions);
                    var placeSearch = new AMap.PlaceSearch({
                        map: map
                    })
                    AMap.event.addListener(autocomplete, "select", function (e) {
                        //TODO 针对选中的poi实现自己的功能
                        placeSearch.setCity(e.poi.adcode);
                        placeSearch.search(e.poi.name)
                        console.log(e.poi.name)
                    });
                });
            },
            goBack: function () {
                this.$router.back();
            }

        }
    }
</script>
