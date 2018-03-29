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
    import AMap from "AMap";

    var that;

    export default {
        created: function () {
            that = this;
        },
        mounted: function () {
            that.init();
            console.log(that.$route.query)
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
            },
            getParams: function () {
                // 取到路由带过来的参数
                let routerParams = this.$route.params;
                // 将数据放在当前组件的数据内
                console.log(routerParams);
            }
        },
        watch: {
            // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
            $router: "getParams"
        }
    }
</script>
