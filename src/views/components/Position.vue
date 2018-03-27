<template>
    <div>
        <div>
            <div :style="tableStyle">
                <div id="myPageTop" style="margin-bottom: 15px">
                    <input style="width: 333px;margin-right: 10px" type="text" placeholder="请输入关键字进行搜索" id="tipinput">
                    <ButtonGroup>
                        <Button type="primary" icon="ios-skipbackward" size="small" @click="forwardPosition"></Button>
                        <Button type="primary" icon="ios-skipforward" size="small" @click="backwardPosition"></Button>
                    </ButtonGroup>
                </div>
                <Table :height="tableHeight"
                       :columns="titleInfo"
                       :data="positionArray"
                       :row-class-name="rowClassName"
                       @on-row-click="selectOneRow"
                       @on-row-dblclick="showEditForm">
                </Table>
            </div>
            <div id="container" :style="mapStyle"></div>
            <div id="panel" hidden></div>
            <input type="hidden" readonly="true" id="lnglat">
        </div>
        <Modal
                v-model="modal1"
                title="编辑地点"
                @on-ok="ok"
                @on-cancel="cancel">
            <div>
                <Row>
                    <Col span="23">
                    <div>
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60">
                            <Form-item label="地址" prop="name">
                                <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
                            </Form-item>
                            <!--<Form-item label="选择时间">-->
                            <!--<Row>-->
                            <!--<Col span="12">-->
                            <!--<TimePicker v-model="formValidate.time" format="HH:mm" type="timerange" placement="bottom-end"-->
                            <!--placeholder="选择时间" style="width: 150px"></TimePicker>-->
                            <!--</Col>-->
                            <!--</Row>-->
                            <!--</Form-item>-->
                            <Form-item label="备注" prop="desc">
                                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                                       placeholder="请输入..."></Input>
                            </Form-item>
                            <Form-item>
                                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置
                                </Button>
                            </Form-item>
                        </Form>
                    </div>
                    </Col>
                </Row>
            </div>
        </Modal>

    </div>
</template>
<link rel="stylesheet" href="http://cache.amap.com/lbs/static/main1119.css"/>

<script>

    import AMap from "AMap"

    var marker, map, truckOptions, driving, geocoder, geolocation, that, markers = [];

    export default {
        mounted: function () {
            that = this;
            that.init();
            that.changeMapSize();
            window.addEventListener("resize", that.changeMapSize);
        },
        created: function () {

        },
        data() {
            return {
                titleInfo: [
                    {
                        title: "地址",
                        key: "addressName",
                        render: (h, params) => {
                            return h("div", [
                                h("strong", params.row.addressName)
                            ]);
                        }
                    },
                    // {
                    //     title: "纬度",
                    //     key: "lat"
                    // }
                    {
                        title: "操作",
                        key: "action",
                        align: "center",
                        width: 80,
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
                                ),
                            ]);
                        }
                    }
                ],
                positionArray: [],
                currentMarker: null,
                currentPosition: null,
                startPosition: null,
                endPosition: null,
                addressName: "",
                mapStyle: "",
                tableStyle: "",
                tableHeight: "",
                selectRowIndex: null,

                //编辑地点相关
                modal1: false,
                formValidate: {
                    name: "",
                    // time: '00:00 00:00',
                    desc: ""
                },
                ruleValidate: {
                    name: [
                        {required: true, message: "姓名不能为空", trigger: "blur"}
                    ],
                    // time: [
                    //     {required: true, type: "time", message: "请选时间", trigger: "change"}
                    // ],
                    desc: [
                        {required: false, message: "请输入个人介绍", trigger: "blur"},
                        {type: "string", message: "请填写备注信息", trigger: "blur"}
                    ]
                }
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
                    var position = {};
                    position.lng = e.lnglat.getLng();
                    position.lat = e.lnglat.getLat();
                    that.addPosition(position);
                });

                var auto = new AMap.Autocomplete({
                    input: "tipinput"
                });

                AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发

                function select(e) {
                    if (e.poi && e.poi.location) {
                        map.setZoom(15);
                        map.setCenter(e.poi.location);
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
                        that.currentPosition = e.poi.location;
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
                    position: [position.lng, position.lat],
                    //draggable: true,  //是否可拖动
                });
                marker.setMap(map);
                marker.lng = position.lng;
                marker.lat = position.lat;
                markers.push(marker);
            },
            route: function (callback, position) {
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
                    path.push({lnglat: [startPoint.lng, startPoint.lat]});//起点
                    for (var i = 1; i < that.positionArray.length - 1; i++) {
                        var tempPosition = that.positionArray[i];
                        path.push({lnglat: [tempPosition.lng, tempPosition.lat]});//途径
                    }
                    endPoint = that.positionArray[that.positionArray.length - 1];
                    path.push({lnglat: [endPoint.lng, endPoint.lat]});//终点
                }
                var zoom = map.getZoom();
                driving.search(path, function (status, result) {
                    if (callback != undefined) {
                        callback(position);
                    }
                });
            },

            removeAddress: function (index) {
                var tempPositionArray = [];
                var removePosition = that.positionArray[index];
                for (var j = 0; j < that.positionArray.length; j++) {
                    if (j != index) {
                        tempPositionArray.push(that.positionArray[j]);
                    }
                }
                var tempMarkerArray = [];
                for (var k = 0; k < markers.length; k++) {
                    var temMarker = markers[k];
                    if (removePosition.lng === temMarker.lng && removePosition.lat === temMarker.lat) {
                        markers[k].setMap(null);
                    } else {
                        tempMarkerArray.push(markers[k]);
                    }
                }
                that.positionArray = tempPositionArray;
                markers = tempMarkerArray;
                if (that.positionArray.length <= 1) {
                    that.init();
                } else {
                    that.route();
                }
                that.selectRowIndex = null;
            },
            changeMapSize: function () {
                let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                var mapHeight = h - (55 + 46 + 25);
                var mapWidth = w - (200 + 15 * 2) - 400;
                that.tableStyle = "width:400px;height:" + mapHeight + "px;float: left";
                that.mapStyle = "width: " + mapWidth + "px;height:" + mapHeight + "px;float: left";
                that.tableHeight = mapHeight - 40;
            },
            addPosition: function (position) {
                var lnglatXY = [position.lng, position.lat]; //已知点坐标
                geocoder.getAddress(lnglatXY, function (status, result) {
                    if (status === "complete" && result.info === "OK") {
                        position.addressName = result.regeocode.formattedAddress;
                        that.positionArray.push(position);
                        that.addMarker(position);
                        that.route(that.setCenter, position);
                    }
                });

            },
            selectOneRow: function (select, row) {
                that.selectRowIndex = row;
            },

            changePosition: function (currentIndex, targetIndex) {
                var tmpPosition = that.positionArray.slice();
                var currentPosition = tmpPosition[currentIndex];
                var targetPosition = tmpPosition[targetIndex];
                tmpPosition[targetIndex] = currentPosition;
                tmpPosition[currentIndex] = targetPosition;
                that.positionArray = tmpPosition;
                that.route();
                // map.setCenter([currentPosition.lng,currentPosition.lat]);
            },
            forwardPosition: function () {
                if (that.selectRowIndex > 0) {
                    that.changePosition(that.selectRowIndex, that.selectRowIndex - 1);
                    that.selectRowIndex--;
                }
            },

            backwardPosition: function () {
                if (that.selectRowIndex < that.positionArray.length - 1) {
                    that.changePosition(that.selectRowIndex, that.selectRowIndex + 1);
                    that.selectRowIndex++;
                }
            },
            rowClassName(row, index) {
                if (index === that.selectRowIndex) {
                    return "demo-table-info-row";
                }
                return "";
            },
            setCenter: function (position) {
                map.setCenter([position.lng, position.lat]);
            },
            showEditForm: function (row, index) {
                that.modal1 = true;
                that.formValidate.name = row.addressName;
            },
            ok() {
                this.modal1 = false,
                    this.$Message.info("点击了确定");
            },
            cancel() {
                this.$Message.info("点击了取消");
            },

            handleSubmit: function (name) {
                var that = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success("提交成功!");
                        console.log(that.formValidate);
                        getJson(that.formValidate, function (data) {
                            console.log("receive from backend");
                            console.log(data);
                        });
                    } else {
                        this.$Message.error("表单验证失败!");
                    }
                })
            },

            handleReset: function (name) {
                this.$refs[name].resetFields();
            },

        }
    }
</script>
<style>
    .ivu-table .demo-table-info-row td {
        background-color: #2db7f5;
        color: #fff;
    }

    .ivu-table td.demo-table-info-column {
        background-color: #2db7f5;
        color: #fff;
    }
</style>