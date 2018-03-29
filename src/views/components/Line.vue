<template>
    <div class="animated fadeIn">
        <div style="text-align: left;">
            <Form inline :label-width="60">
                <FormItem label="线路名称">
                    <Input type="text" v-model="queryForm.lineName" placeholder="线路名称"></Input>
                </FormItem>
                <FormItem label="起始城市">
                    <Input type="text" v-model="queryForm.startCityName" placeholder="起始城市"></Input>
                </FormItem>
                <FormItem label="目的城市">
                    <Input type="text" v-model="queryForm.endCityName" placeholder="目的城市"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="queryLine">查询</Button>
                    <Button type="primary" @click="showForm=true">新增新路</Button>
                </FormItem>
            </Form>
        </div>
        <div style="margin-bottom: 15px">
            <Table :loading="loading"
                   :stripe="true"
                   :border="true"
                   :columns="lineColumn"
                   :data="lineData">
            </Table>
        </div>


        <div style="text-align: right;">
            <Page :total="pageInfo.total"
                  show-sizer
                  show-elevator
                  show-total
                  :current="pageInfo.currentPage"
                  :page-size="pageInfo.pageSize"
                  @on-change="getNextPage"
                  @on-page-size-change="changeSize">
            </Page>
        </div>
        <Modal
                v-model="showForm"
                title="编辑线路"
                ok-text="保存"
                :mask-closable=false
                @on-ok="ok"
                @on-cancel="cancel">
            <div>
                <Row>
                    <Col span="23">
                    <div>
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="75">
                            <Form-item label="线路名称" prop="lineName">
                                <Input v-model="formValidate.lineName" placeholder="请输入线路名称"></Input>
                            </Form-item>
                            <Form-item label="出发城市" prop="startCityName">
                                <Input v-model="formValidate.startCityName" placeholder="请输入起始地"></Input>
                            </Form-item>
                            <Form-item label="目的城市" prop="endCityName">
                                <Input v-model="formValidate.endCityName" placeholder="请输入目的地"></Input>
                            </Form-item>
                            <Form-item label="车牌号" prop="truckNo">
                                <Input v-model="formValidate.truckNo" placeholder="请输入车牌号"></Input>
                            </Form-item>
                            <Form-item label="联系人" prop="contacts">
                                <Input v-model="formValidate.contacts" placeholder="请输入联系人"></Input>
                            </Form-item>
                            <Form-item label="联系方式" prop="contactWay">
                                <Input v-model="formValidate.contactWay" placeholder="请输入联系方式"></Input>
                            </Form-item>
                            <Form-item label="介绍" prop="desc">
                                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                                       placeholder="请输入线路介绍..."></Input>
                            </Form-item>
                        </Form>
                    </div>
                    </Col>
                </Row>
            </div>
        </Modal>

        <Modal
                v-model="showQrcode"
                :mask-closable=true
                :width="180"
                :height="150"
                @on-ok="ok"
                @on-cancel="cancel">
            <div style="text-align: center;height: 100%;width: 100%">
                <img :src="qrcodeUrl">
            </div>
        </Modal>
    </div>
</template>
<script>
    import {deleteLine, queryLine, saveLine} from "api/line";

    var that;

    export default {
        mounted: function () {
            that = this;
        },
        data() {
            return {
                lineColumn: [
                    {
                        title: "线路名称",
                        key: "lineName",
                        width: 300
                    },
                    {
                        title: "起始城市",
                        key: "startCityName",
                        width: 150
                    },
                    {
                        title: "目的城市",
                        key: "endCityName",
                        width: 150
                    },
                    {
                        title: "车牌号",
                        key: "truckNo"
                    },
                    {
                        title: "联系人",
                        key: "contacts"
                    },
                    {
                        title: "联系方式",
                        key: "contactWay"
                    },
                    {
                        title: "操作",
                        key: "action",
                        align: "center",
                        width: 240,
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                that.show(params.index);
                                            }
                                        }
                                    },
                                    "编辑"
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "success",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                this.jumpToMap(params.index);
                                            }
                                        }
                                    },
                                    "线路"
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "info",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                this.showQrcodeModal(params.index);
                                            }
                                        }
                                    },
                                    "二维码"
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "error",
                                            size: "small"
                                        },
                                        on: {
                                            click: () => {
                                                this.remove(params.index);
                                            }
                                        }
                                    },
                                    "删除"
                                )
                            ]);
                        }
                    }
                ],
                lineData: [],
                loading: false,
                pageInfo: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },

                //新增线路表单相关数据
                showForm: false,
                formValidate: {
                    id: "",
                    lineName: "",
                    startCityName: "",
                    endCityName: "",
                    truckNo: "",
                    contacts: "",
                    contactWay: "",
                    desc: ""
                },
                ruleValidate: {
                    lineName: [
                        {required: true, message: "线路名称不能为空", trigger: "blur"}
                    ]
                },

                //删除线路使用的表单数据
                deleteFrom: {
                    id: null
                },

                //查询线路列表相关
                queryForm: {
                    userId: 1,
                    lineName: null,
                    startCityName: null,
                    endCityName: null,
                    currentPage: 1,
                    pageSize: 10
                },
                //展示二维码
                showQrcode: false,
                qrcodeUrl: null,
            };
        },
        created: function () {
            that = this;
            that.queryLine();
        },
        methods: {
            show(index) {
                that.formValidate = that.lineData[index];
                that.showForm = true;
            },
            remove(index) {
                that.deleteFrom.id = that.lineData[index].id;
                deleteLine(that.deleteFrom, function (response) {
                    if (response.success) {
                        that.$Message.success("删除成功");
                        that.queryLine();
                    }
                });

            },
            queryLine: function () {
                that.loading = true;
                that.queryForm.currentPage = that.pageInfo.currentPage;
                that.queryForm.pageSize = that.pageInfo.pageSize;
                queryLine(that.queryForm, function (data) {
                    that.lineData = data.result.records;
                    that.pageInfo.total = data.result.total;
                    that.loading = false;
                });
            },
            getNextPage(page) {
                that.pageInfo.currentPage = page;
                that.queryLine();
            },
            changeSize(pageSize) {
                that.pageInfo.pageSize = pageSize;
                that.handleSubmit();
            },

            //表单相关方法
            ok: function () {
                saveLine(that.formValidate, function (result) {
                    if (result.success) {
                        that.$Message.success(result.message);
                    }
                });
            },
            cancel: function () {

            },
            jumpToMap: function (index) {
                var line = that.lineData[index];
                that.$router.push({
                    path: "/line/route",
                    query: {
                        lineId: line.id,
                        lineName: line.lineName
                    }
                });
            },
            showQrcodeModal: function (index) {
                that.showQrcode = true;
                that.qrcodeUrl = process.env.BASE_API + "/lineRoute/qrcode?lineId=" + that.lineData[index].id;
            }
        }
    };
</script>
<style>
    .ivu-form-item {
        margin-bottom: 10px;
    }
</style>

