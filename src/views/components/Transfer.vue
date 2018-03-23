<template>
    <div>
        <Button type="primary" @click="getSelectItem()">print</Button>

        <Row span="24">
            <Col span="24">
            <Transfer
                    :data="data3"
                    :target-keys="targetKeys3"
                    :list-style="listStyle"
                    :render-format="render3"
                    :operations="['向左移动','向右移动']"
                    filterable
                    @on-change="handleChange3">
                <div :style="{float: 'right', margin: '5px'}">
                    <i-button type="ghost" size="small" @click="reloadMockData">刷新</i-button>
                </div>
            </Transfer>
            </Col>
        </Row>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                data3: this.getMockData(),
                targetKeys3: this.getTargetKeys(),
                listStyle: {
                    width: "250px",
                    height: "300px"
                }
            }
        },
        methods: {
            getMockData() {
                let mockData = [];
                for (let i = 1; i <= 20; i++) {
                    mockData.push({
                        key: i.toString(),
                        label: "内容" + i,
                        description: "内容" + i + "的描述信息",
                        disabled: Math.random() * 3 < 1
                    });
                }
                return mockData;
            },
            getTargetKeys() {
                return this.getMockData()
                    .filter(() => Math.random() * 2 > 1)
                    .map(item => item.key);
            },
            render1(item) {
                return item.label;
            },

            handleChange3(newTargetKeys) {
                this.targetKeys3 = newTargetKeys;
            },
            render3(item) {
                return item.label + " - " + item.description;
            },
            reloadMockData() {
                this.data3 = this.getMockData();
                this.targetKeys3 = this.getTargetKeys();
            },
            getSelectItem() {
                console.log(this.targetKeys3);
            }
        }
    }

</script>


