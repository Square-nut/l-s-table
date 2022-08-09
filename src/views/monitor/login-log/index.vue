<template>
    <div class="h-fit">
        <hos-biz-table
            @selection-change="handleSelectionChange"
            :page="true"
            :selection="selection"
            uid="loginLogTable"
            :cols="cols"
            :data="loginLogData"
            :form="form"
            pagePos="top"
        >
            <template #toolbar>
                <hos-button-group class="hos">
                    <hos-button
                        @click="emptyLog()"
                        icon="hos-icon-brush"
                        v-has-permi="{ key: 'base:monitor:loginLog:emptyLog' }"
                        >{{ $t("loginLog.emptyLog") }}</hos-button
                    >
                    <hos-button
                        @click="examine()"
                        icon="hos-icom-check-reg"
                        v-has-permi="{ key: 'base:monitor:loginLog:examine' }"
                        >{{ $t("loginLog.examine") }}</hos-button
                    >
                    <i
                        type="cut"
                        v-has-permi="{
                            key: [
                                'base:monitor:loginLog:emptyLog',
                                'base:monitor:loginLog:examine',
                            ],
                        }"
                    ></i>
                    <hos-button
                        icon="hos-icom-export"
                        @click="exportLog()"
                        v-has-permi="{ key: 'base:monitor:loginLog:exportLog' }"
                        >{{ $t("operation.export") }}</hos-button
                    >
                </hos-button-group>
            </template>
            <template #form>
                <hos-row :gutter="20">
                    <hos-col :span="6">
                        <hos-form-item :label="$t('loginLog.loginWay')">
                            <hos-select
                                v-model="form.model.loginWay"
                                clearable
                                :placeholder="
                                    $t('loginLog.placeholder.pleaseLoginType')
                                "
                            >
                                <hos-option
                                    v-for="item in loginWayData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </hos-option>
                            </hos-select>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="6">
                        <hos-form-item :label="$t('loginLog.loginName')">
                            <hos-input
                                clearable
                                v-model="form.model.loginName"
                                :placeholder="
                                    $t('role.placeholder.placeLoginName')
                                "
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="7" class="dataker">
                        <hos-form-item :label="$t('loginLog.loginDate')">
                            <hos-date-picker
                                class="datapicker"
                                v-model="fromR.date"
                                type="daterange"
                                :range-separator="$t('common.dateZhi')"
                                :picker-options="{
                                    disabledDate(time) {
                                        // 设置禁用状态，参数为当前日期，要求返回 Boolean
                                        return time.getTime() > Date.now();
                                    },
                                }"
                                :start-placeholder="$t('common.startDate')"
                                :end-placeholder="$t('common.endDate')"
                            >
                            </hos-date-picker>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="5">
                        <hos-form-item label-width="20px">
                            <hos-biz-button run="form.search" type="primary">{{
                                $t("operation.query")
                            }}</hos-biz-button>
                            <hos-biz-button @click="reset()" type="primary">{{
                                $t("operation.reset")
                            }}</hos-biz-button>
                        </hos-form-item>
                    </hos-col>
                </hos-row>
                <hos-row :gutter="20">
                    <hos-col :span="6">
                        <hos-form-item :label="$t('loginLog.serverIP')">
                            <hos-input
                                clearable
                                v-model="form.model.serverIP"
                                :placeholder="
                                    $t('loginLog.placeholder.pleaseServerIP')
                                "
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="6">
                        <hos-form-item :label="$t('loginLog.ip')">
                            <hos-input
                                clearable
                                v-model="form.model.ip"
                                :placeholder="
                                    $t('loginLog.placeholder.pleaseIp')
                                "
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="6">
                        <hos-form-item>
                            <hos-radio
                                v-model="form.model.examine"
                                label="true"
                                >{{ $t("operlog.examine") }}</hos-radio
                            >
                            <hos-radio
                                v-model="form.model.examine"
                                label="false"
                                >{{ $t("operlog.unExamine") }}</hos-radio
                            >
                        </hos-form-item>
                    </hos-col>
                </hos-row>
            </template>

            <template #operation="{ row }">
                <hos-tooltip
                    class="pl5 pr5"
                    :content="$t('operation.view')"
                    v-has-permi="{ key: 'base:monitor:loginLog::view' }"
                    ><i class="hos-icon-view" @click="view(row)"></i
                ></hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    :content="$t('operation.check')"
                    v-has-permi="{ key: 'base:monitor:loginLog::examine' }"
                    ><i class="hos-icom-check-reg" @click="examine(row)"></i
                ></hos-tooltip>
            </template>
        </hos-biz-table>
        <hos-biz-dialog
            :title="$t('operation.view') + $t('loginLog.info')"
            width="70%"
            uid="loginLogViewDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('logExamine.title')"
            width="40%"
            uid="logExamineDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('user.export')"
            uid="exportDialog"
            width="40%"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
    </div>
</template>

<script>
import grantTypeEnum from "../../../enum/grantTypeEnum.js";
export default {
    data() {
        return {
            selectedTableIds: [],
            examineLogNames: [],
            selection: [],
            loginWayData: grantTypeEnum.getSelectData(),
            page: {
                size: 10,
                current: 0,
            },
            form: {
                labelWidth: "auto",
                model: {
                    loginName: "",
                    loginWay: "",
                    examine: null,
                    ip: "",
                    serverIP: "",
                    loginLocation: "",
                    roleId: "",
                    orgId: "",
                    startDate: "",
                    endDate: "",
                },
            },
            fromR: {
                date: [],
                /*  examine1: false,
                examine2: false */
            },
            cols: [
                {
                    type: "selection",
                    width: "50px",
                    align: "center",
                },
                {
                    prop: "title",
                    label: this.$t("loginLog.title"),
                    width: "100px",
                    showOverflowTooltip: true,
                },
                {
                    prop: "loginName",
                    label: this.$t("loginLog.loginName"),
                    width: "100px",
                    showOverflowTooltip: true,
                },
                {
                    label: this.$t("loginLog.loginWay"),
                    prop: ({ row }, h) => {
                        return grantTypeEnum.getNameByCode(row.loginWay);
                    },
                    showOverflowTooltip: true,
                },
                {
                    prop: "ip",
                    label: this.$t("loginLog.ip"),
                    showOverflowTooltip: true,
                },
                {
                    prop: "serverIP",
                    label: this.$t("loginLog.serverIP"),
                    showOverflowTooltip: true,
                },
                {
                    prop: "visitSource",
                    label: this.$t("loginLog.visitSource"),
                },
                {
                    prop: "msg",
                    label: this.$t("loginLog.msg"),
                },
                {
                    prop: "createTime",
                    label: this.$t("loginLog.createTime"),
                    width: "150px",
                    showOverflowTooltip: true,
                },
                {
                    prop: "examineStateDesc",
                    label: this.$t("loginLog.examineState"),
                    width: "80px",
                },
                {
                    label: this.$t("common.operation"),
                    width: "80px",
                    prop: "operation",
                    slotName: "operation",
                    // prop: ({row}, h) => {
                    //     return
                    //     // h('div', [
                    //     //      h("hos-tooltip",{
                    //     //             props:{
                    //     //             content:this.$t('operation.view')
                    //     //             },
                    //     //         },[
                    //     //         h("i", {
                    //     //             class: "hos-icon-view",
                    //     //             on: {
                    //     //                 click: () => {
                    //     //                 this.view(row);
                    //     //                 },
                    //     //             },
                    //     //         })
                    //     //     ]),
                    //     //     h("hos-tooltip",{
                    //     //             props:{
                    //     //             content:this.$t('operation.check')
                    //     //             },
                    //     //         },[
                    //     //         h("i", {
                    //     //             class: "hos-icom-check-reg",
                    //     //             on: {
                    //     //                 click: () => {
                    //     //                 this.examine(row);
                    //     //                 },
                    //     //             },
                    //     //         })
                    //     //     ])
                    //     // ])
                    // }
                },
            ],
        };
    },
    watch: {},
    mounted() {
        this.fromR.date = this.getStartDate();
    },
    methods: {
        loginLogData(primary) {
            if (this.fromR.date != null && this.fromR.date != "") {
                let date1 = new Date(this.fromR.date[0]);
                let date2 = new Date(this.fromR.date[1]);
                let month1 = date1.getMonth() + 1;
                let month2 = date2.getMonth() + 1;
                if (month1 < 10) {
                    month1 = "0" + month1;
                }
                if (month2 < 10) {
                    month2 = "0" + month2;
                }

                let day1 = date1.getDate();
                let day2 = date2.getDate();
                if (day1 < 10) {
                    day1 = "0" + day1;
                }
                if (day2 < 10) {
                    day2 = "0" + day2;
                }

                primary.startDate =
                    date1.getFullYear() + "-" + month1 + "-" + day1;
                primary.endDate =
                    date2.getFullYear() + "-" + month2 + "-" + day2;
            }
            /*   primary.examine="";
            if (this.fromR.examine1&&!this.fromR.examine2)
            {
                primary.examine=true;
            }else if(!this.fromR.examine1&&this.fromR.examine2)
            {
                primary.examine=false;
            } */
            return this.$api("log_loginLog.selectPage", primary);
        },
        emptyLog() {
            this.$confirm(
                this.$t("loginLog.emptyLogTip"),
                this.$t("login.label.info"),
                { type: "warning" }
            ).then(() => {
                if (this.fromR.date != null && this.fromR.date != "") {
                    var date1 = new Date(this.fromR.date[0]);
                    var date2 = new Date(this.fromR.date[1]);
                    let month1 = date1.getMonth() + 1;
                    let month2 = date2.getMonth() + 1;
                    if (month1 < 10) {
                        month1 = "0" + month1;
                    }
                    if (month2 < 10) {
                        month2 = "0" + month2;
                    }

                    this.form.model.startDate =
                        date1.getFullYear() +
                        "-" +
                        month1 +
                        "-" +
                        date1.getDate();
                    this.form.model.endDate =
                        date2.getFullYear() +
                        "-" +
                        month2 +
                        "-" +
                        date2.getDate();

                    let day1 = date1.getDate();
                    let day2 = date2.getDate();
                    if (day1 < 10) {
                        day1 = "0" + day1;
                    }
                    if (day2 < 10) {
                        day2 = "0" + day2;
                    }

                    this.form.model.startDate =
                        date1.getFullYear() + "-" + month1 + "-" + day1;
                    this.form.model.endDate =
                        date2.getFullYear() + "-" + month2 + "-" + day2;
                }

                if (this.fromR.examine1 && !this.fromR.examine2) {
                    this.form.model.examine = true;
                } else if (!this.fromR.examine1 && this.fromR.examine2) {
                    this.form.model.examine = false;
                }

                this.$api("log_loginLog.emptyLog", this.form.model)
                    .then((res) => {
                        if (res && res.code == 200) {
                            this.$message.success(this.$t("operation.success"));
                            this.$store.commit("UPDATE_TABLE", {
                                _uid: "loginLogTable",
                            });
                        } else {
                            this.$message.error(this.$t("operation.error"));
                        }
                    })
                    .catch((error) => {
                        this.$message.error(this.$t("operation.error"));
                    });
            });
        },
        // checkbox框选中事件
        handleSelectionChange(selection) {
            this.selectedTableIds = selection.map((item) => item.id);
            this.examineLogNames = [];
            selection.map((item) => {
                if (item.examineState) {
                    this.examineLogNames.push(
                        item.loginName + "(" + item.createTime + ")"
                    );
                }
            });
        },
        examine(row) {
            let idStr = "";
            let eNames = "";
            let checkDesc = "";
            if (row) {
                idStr = row.id;
                if (row.examineState) {
                    eNames = row.loginName + "(" + row.createTime + ")";
                }
            } else {
                idStr = this.selectedTableIds.join(",");
                eNames = this.examineLogNames.join(",");
            }
            if (eNames != "") {
                this.$message.error(
                    "【" + eNames + "】" + this.$t("logExamine.haveETip")
                );
                return;
            }
            if (idStr == "") {
                this.$message.warning(
                    this.$t("common.confirm.dataExamineNull")
                );
                return;
            }
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/views/monitor/log-examine/edit.vue")
                    .default,
                _uid: "logExamineDialog",
                props: {
                    ids: idStr,
                    tableId: "loginLogTable",
                    dialogId: "logExamineDialog",
                    status: "examine:",
                },
            });
        },
        view(row) {
            row.loginWayDesc = grantTypeEnum.getNameByCode(row.loginWay);
            // 查看
            this.$store.commit("OPEN_DIALOG", {
                component: require("./view.vue").default,
                _uid: "loginLogViewDialog",
                props: {
                    obj: row,
                },
            });
        },
        reset() {
            this.form.model = {
                loginName: "",
                loginWay: "",
                examine: "",
                ip: "",
                serverIP: "",
                loginLocation: "",
                roleId: "",
                orgId: "",
                startDate: "",
                endDate: "",
            };
            (this.fromR = {
                date: "",
                examine1: false,
                examine2: false,
            }),
                this.$store.commit("UPDATE_TABLE", { _uid: "loginLogTable" });
        },
        getStartDate() {
            let date1 = new Date(),
                time1 =
                    date1.getFullYear() +
                    "-" +
                    (date1.getMonth() + 1) +
                    "-" +
                    date1.getDate(); //time1表示当前时间
            let date2 = new Date(date1);
            date2.setDate(date1.getDate() - 7);
            let time2 =
                date2.getFullYear() +
                "-" +
                (date2.getMonth() + 1) +
                "-" +
                date2.getDate();
            let ret = [];
            ret.push(time2);
            ret.push(time1);

            return ret;
        },
        // 导出弹框
        exportLog() {
            // 导出组件
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/export/index.vue").default,
                _uid: "exportDialog",
                props: {
                    // 可支持的所有导出列，可以考虑后端提供一个接口？
                    option: [
                        {
                            label: "1天内",
                            value: "1",
                        },
                        {
                            label: "3天内",
                            value: "3",
                        },
                        {
                            label: "7天内",
                            value: "7",
                        },
                        {
                            label: "15天内",
                            value: "15",
                        },
                        {
                            label: "一月内",
                            value: "30",
                        },
                        {
                            label: "三月内",
                            value: "90",
                        },
                        {
                            label: "半年内",
                            value: "180",
                        },
                        {
                            label: "一年内",
                            value: "360",
                        },
                        {
                            label: "全部",
                            value: "1000",
                        },
                    ],
                    // 默认勾选中需要导出的列
                    default: ["1"],
                    // 导出接口地址
                    exportUrl: "/monitor/login-log/export",
                },
            });
        },
    },
};
</script>
