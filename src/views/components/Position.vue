<template>
    <div>
        <div>
            <div style="width: 420px;height: 780px;float: left">
                <div id="myPageTop">
                    <input style="width: 100%" type="text" placeholder="请输入关键字进行搜索" id="tipinput">
                    <Row style="text-align: right;margin-top: 5px;margin-bottom: 5px">
                        <Button type="success" @click="handleSubmit('formValidate')">标记为起点</Button>
                        <Button type="primary" @click="handleSubmit('formValidate')">标记为途径</Button>
                        <Button type="error" @click="handleSubmit('formValidate')">标记为终点</Button>
                    </Row>
                </div>
                <Table height="730"
                       :stripe=true
                       :border=true
                       :columns="titleInfo"
                       :data="addressArray">
                </Table>
            </div>
            <div id="container" style="width: 1200px;height: 780px;float: left"></div>
            <div id="panel" hidden></div>
            <input type="hidden" readonly="true" id="lnglat">
        </div>
    </div>
</template>
<link rel="stylesheet" href="http://cache.amap.com/lbs/static/main1119.css"/>

<script>

    import AMap from "AMap"
    import Input from "iview/src/components/input/input";

    var marker, map, truckOptions, driving, geocoder, geolocation, that, markers = [];

    export default {
        components: {Input},
        mounted: function () {
            that = this;
            this.init()
        },
        created: function () {

        },
        data() {
            return {
                titleInfo: [
                    {
                        title: "地址",
                        key: "addressName"
                    },
                    // {
                    //     title: "纬度",
                    //     key: "lat"
                    // }
                    {
                        title: "操作",
                        key: "action",
                        align: "center",
                        width: 100,
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "error",
                                            size: "small"
                                        },
                                        on: {
                                            click: () => {
                                                that.removeAddress(params.index);
                                            }
                                        }
                                    },
                                    "删除"
                                )
                            ]);
                        }
                    }
                ],
                positionArray: [],
                addressArray: [],
                currentMarker: null,
                addressName: ""
            }
        },
        methods: {
            init: function () {
                var that = this;
                map = new AMap.Map("container", {
                    resizeEnable: true,
                    zoom: 13,//地图显示的缩放级别
                    keyboardEnable: false
                });
                //地图中添加地图操作ToolBar插件
                map.plugin(["AMap.ToolBar"], function () {
                    //设置地位标记为自定义标记
                    var toolBar = new AMap.ToolBar();
                    map.addControl(toolBar);
                });

                //初始化标记
                that.initMarkers();

                //卡车形式路线查询
                truckOptions = {
                    map: map,
                    policy: 0,
                    size: 1,
                    city: "beijing",
                    panel: "panel"
                };
                driving = new AMap.TruckDriving(truckOptions);

                //逆地址解析
                geocoder = new AMap.Geocoder({
                    radius: 500,
                    extensions: "all"
                });

                //为地图注册click事件获取鼠标点击出的经纬度坐标
                var clickEventListener = map.on("click", function (e) {
                    document.getElementById("lnglat").value = e.lnglat.getLng() + "," + e.lnglat.getLat()
                    console.log(e.lnglat.getLng() + "," + e.lnglat.getLat())
                    var position = {};
                    position.long = e.lnglat.getLng();
                    position.lat = e.lnglat.getLat();
                    that.positionArray.push(position);
                    that.addMarker(position);
                    that.route();
                    that.resolvePosition(position);

                });

                var auto = new AMap.Autocomplete({
                    input: "tipinput"
                });

                AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发

                function select(e) {
                    if (e.poi && e.poi.location) {
                        map.setZoom(15);
                        map.setCenter(e.poi.location);
                        console.log(e.poi.location);
                        if (that.currentMarker != undefined) {
                            that.currentMarker.setMap(null);
                        }
                        marker = new AMap.Marker({
                            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                            position: [e.poi.location.lng, e.poi.location.lat],
                            //draggable: true,  //是否可拖动
                        });
                        marker.setMap(map);
                        that.currentMarker = marker;

                    }
                }
            },
            initMarkers: function () {
                if (markers.length > 0) {
                    for (var i = 0; i < markers.length; i++) {
                        markers[i].setMap(map);
                    }
                }
            },
            //实例化点标记
            addMarker: function (position) {
                marker = new AMap.Marker({
                    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    position: [position.long, position.lat],
                    //draggable: true,  //是否可拖动
                });
                marker.setMap(map);
                markers.push(marker);
            },
            route: function () {
                var startPoint;
                var endPoint;
                var path = [];
                if (that.positionArray.length < 1) {
                    that.init();
                    return;
                }
                if (that.positionArray.length == 1) {
                    return;
                }
                if (that.positionArray.length >= 2) {
                    startPoint = that.positionArray[0];
                    path.push({lnglat: [startPoint.long, startPoint.lat]});//起点
                    for (var i = 1; i < that.positionArray.length - 1; i++) {
                        var tempPosition = that.positionArray[i];
                        path.push({lnglat: [tempPosition.long, tempPosition.lat]});//途径
                    }
                    endPoint = that.positionArray[that.positionArray.length - 1];
                    path.push({lnglat: [endPoint.long, endPoint.lat]});//终点
                }
                driving.search(path, function (status, result) {
                    //TODO something
                });
            },
            resolvePosition: function (position) {
                var that = this;
                var lnglatXY = [position.long, position.lat]; //已知点坐标
                geocoder.getAddress(lnglatXY, function (status, result) {
                    if (status === "complete" && result.info === "OK") {
                        console.log(result);
                        var address = {};
                        address.addressName = result.regeocode.formattedAddress;
                        that.addressArray.push(address);
                    }
                });
            },
            removeAddress: function (index) {
                var tmpArray = [];
                for (var i = 0; i < that.addressArray.length; i++) {
                    if (i != index) {
                        tmpArray.push(that.addressArray[i]);
                    }
                }
                var tempPositionArray = [];
                for (var j = 0; j < that.positionArray.length; j++) {
                    if (j != index) {
                        tempPositionArray.push(that.positionArray[j]);
                    }
                }
                var tempMarkerArray = [];
                for (var k = 0; k < markers.length; k++) {
                    if (k != index) {
                        tempMarkerArray.push(markers[k]);
                    } else {
                        markers[k].setMap(null);
                    }
                }
                that.addressArray = tmpArray;
                that.positionArray = tempPositionArray;
                markers = tempMarkerArray;
                if (that.positionArray.length <= 1) {
                    that.init();
                } else {
                    that.route();
                }
            }
        }
    }
</script>