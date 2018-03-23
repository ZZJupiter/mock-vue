<template>
    <div class="animated fadeIn">

        <Row>
            <Col :xs="24" :sm="24" :md="12" :lg="12">


            <Collapse v-model="now_show_panel" accordion>

                <Panel name="1">
                    maxDepth:1
                    <p slot="content">
                        <tree-view :data="sampleData1" :options="{maxDepth: 1}"></tree-view>
                    </p>
                </Panel>
                <Panel name="2">
                    maxDepth:2
                    <p slot="content">
                        <tree-view :data="sampleData1" :options="{maxDepth: 2}"></tree-view>
                    </p>
                </Panel>
                <Panel name="3">
                    maxDepth:3
                    <p slot="content">
                        <tree-view :data="sampleData1" :options="{maxDepth: 3}"></tree-view>
                    </p>
                </Panel>
            </Collapse>
            </Col>
        </Row>
    </div>
</template>

<script>


    export default {
        name: "buttons",

        data() {
            return {
                loading: false,
                loading2: false,
                now_show_panel: "1",
                sampleData1: {
                    "medications": [{
                        "aceInhibitors": [{
                            "name": "lisinopril",
                            "strength": "10 mg Tab",
                            "dose": "1 tab",
                            "route": "PO",
                            "sig": "daily",
                            "pillCount": "#90",
                            "refills": "Refill 3"
                        }],
                        "antianginal": [{
                            "name": "nitroglycerin",
                            "strength": "0.4 mg Sublingual Tab",
                            "dose": "1 tab",
                            "route": "SL",
                            "sig": "q15min PRN",
                            "pillCount": "#30",
                            "refills": "Refill 1"
                        }],
                        "anticoagulants": [{
                            "name": "warfarin sodium",
                            "strength": "3 mg Tab",
                            "dose": "1 tab",
                            "route": "PO",
                            "sig": "daily",
                            "pillCount": "#90",
                            "refills": "Refill 3"
                        }],
                        "betaBlocker": [{
                            "name": "metoprolol tartrate",
                            "strength": "25 mg Tab",
                            "dose": "1 tab",
                            "route": "PO",
                            "sig": "daily",
                            "pillCount": "#90",
                            "refills": "Refill 3"
                        }],
                        "diuretic": [{
                            "name": "furosemide",
                            "strength": "40 mg Tab",
                            "dose": "1 tab",
                            "route": "PO",
                            "sig": "daily",
                            "pillCount": "#90",
                            "refills": "Refill 3"
                        }],
                        "mineral": [{
                            "name": "potassium chloride ER",
                            "strength": "10 mEq Tab",
                            "dose": "1 tab",
                            "route": "PO",
                            "sig": "daily",
                            "pillCount": "#90",
                            "refills": "Refill 3"
                        }]
                    }],
                    "labs": [{
                        "name": "Arterial Blood Gas",
                        "time": "Today",
                        "location": "Main Hospital Lab"
                    }, {"name": "BMP", "time": "Today", "location": "Primary Care Clinic"}, {
                        "name": "BNP",
                        "time": "3 Weeks",
                        "location": "Primary Care Clinic"
                    }, {"name": "BUN", "time": "1 Year", "location": "Primary Care Clinic"}, {
                        "name": "Cardiac Enzymes",
                        "time": "Today",
                        "location": "Primary Care Clinic"
                    }, {"name": "CBC", "time": "1 Year", "location": "Primary Care Clinic"}, {
                        "name": "Creatinine",
                        "time": "1 Year",
                        "location": "Main Hospital Lab"
                    }, {
                        "name": "Electrolyte Panel",
                        "time": "1 Year",
                        "location": "Primary Care Clinic"
                    }, {"name": "Glucose", "time": "1 Year", "location": "Main Hospital Lab"}, {
                        "name": "PT/INR",
                        "time": "3 Weeks",
                        "location": "Primary Care Clinic"
                    }, {"name": "PTT", "time": "3 Weeks", "location": "Coumadin Clinic"}, {
                        "name": "TSH",
                        "time": "1 Year",
                        "location": "Primary Care Clinic"
                    }],
                    "imaging": [{
                        "name": "Chest X-Ray",
                        "time": "Today",
                        "location": "Main Hospital Radiology"
                    }, {
                        "name": "Chest X-Ray",
                        "time": "Today",
                        "location": "Main Hospital Radiology"
                    }, {"name": "Chest X-Ray", "time": "Today", "location": "Main Hospital Radiology"}]
                }
            }
        },

    }


</script>


<style type="text/css">

</style>



