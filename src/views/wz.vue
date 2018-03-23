<template>
    <div class="animated fadeIn">
        <Button type="primary" @click="handleSubmit('formInline')">查询</Button>
        <Button type="primary" @click="jumpToMap()">进入地图</Button>

        <Table height="700"
               :stripe=true
               :border=true
               :columns="columns1"
               :data="data1">
        </Table>
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
</template>
<script>
    import {queryLine} from "api/line";

    export default {
        data() {
            return {
                columns1: [
                    {
                        title: "姓名",
                        key: "name"
                    },
                    {
                        title: "年龄",
                        key: "age"
                    },
                    {
                        title: "地址",
                        key: "address"
                    },
                    {
                        title: "操作",
                        key: "action",
                        align: "center",
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
                                                this.show(params.index);
                                            }
                                        }
                                    },
                                    "查看"
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
                data1: [],
                pageInfo: {
                    pageSize: 20,
                    currentPage: 1,
                    total: 0
                }
            };
        },
        created: function () {
            this.handleSubmit();
        },
        methods: {
            show(index) {
                this.$Modal.info({
                    title: "用户信息",
                    content: `姓名：${this.data1[index].name}<br>年龄：${
                        this.data1[index].age
                        }<br>地址：${this.data1[index].address}`
                });
            },
            remove(index) {
                this.data1.splice(index, 1);
            },
            handleSubmit() {
                var that = this;
                queryLine(1, that.pageInfo.currentPage, that.pageInfo.pageSize, function (data) {
                    console.log("终于获得结果了");
                    console.log(data);
                    var newData = [];
                    for (var i = 0; i < data.records.length; i++) {
                        var tmpData = {};
                        tmpData.name = data.records[i].lineName;
                        tmpData.age = data.records[i].lineName;
                        tmpData.address = data.records[i].created;
                        newData.push(tmpData);
                    }
                    that.data1 = newData;
                    that.pageInfo.total = data.total;
                });
            },
            jumpToMap() {
                this.$router.push("/wz/map");
            },
            getNextPage(page) {
                console.log(page)
                this.pageInfo.currentPage = page;
                this.handleSubmit();
            },
            changeSize(pageSize) {
                console.log(pageSize)
                this.pageInfo.pageSize = pageSize;
                this.handleSubmit();
            }
        }
    };
</script>

