<template>
    <div class="animated fadeIn">
        <Button type="primary" @click="handleSubmit('formInline')">查询</Button>
        <h3>框架在手，天下我有</h3>
        <p>好用的框架决定了一个程序员的效率</p>
        <Table :columns="columns1" :data="data1"></Table>
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
                data1: []
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
                queryLine(1, 1, 20, function (data) {
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
                });
            }
        }
    };
</script>

