<template>
    <div class="h-fit">
        <hos-biz-table
            @selection-change="handleSelectionChange"
            :page="true"
            :selection="selection"
            uid="onLineTable"
            :cols="cols"
            :data="onLineData"
            :form="form"
            pagePos="top"
        >
            <template #toolbar>
                <hos-button-group class="hos">
                    <hos-button
                        @click="Offline()"
                        icon="hos-icon-download"
                        v-has-permi="{ key: 'base:monitor:online:Offline' }"
                        >{{ $t("onLine.Offline") }}</hos-button
                    >
                </hos-button-group>
            </template>
            <template #operation="{ row }">
                <hos-tooltip class="pl5 pr5" :content="$t('onLine.Offline')">
                    <i
                        class="hos-icon-download"
                        @click="Offline(row)"
                        v-has-permi="{ key: 'base:monitor:online:Offline' }"
                    ></i>
                </hos-tooltip>
            </template>
            <template #form>
                <hos-row :gutter="20">
                    <hos-col :span="6">
                        <hos-form-item :label="$t('onLine.name')">
                            <hos-input
                                clearable
                                v-model="form.model.userName"
                                :placeholder="
                                    $t('onLine.placeholder.pleaseName')
                                "
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="6">
                        <hos-form-item :label="$t('onLine.loginName')">
                            <hos-input
                                clearable
                                v-model="form.model.loginName"
                                :placeholder="
                                    $t('role.placeholder.placeLoginName')
                                "
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="6">
                        <hos-form-item label-width="20px">
                            <hos-biz-button run="form.search" type="primary">{{
                                $t("operation.query")
                            }}</hos-biz-button>
                            <hos-biz-button run="form.reset" type="primary">{{
                                $t("operation.reset")
                            }}</hos-biz-button>
                        </hos-form-item>
                    </hos-col>
                </hos-row>
            </template>
        </hos-biz-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            checkLoginName: [],
            checkmd5Token: [],
            selectedTableIds: [],
            selection: [],
            page: {
                size: 10,
                current: 0,
            },
            form: {
                //inline: true,
                labelWidth: "auto",
                model: {
                    loginName: "",
                    userName: "",
                },
            },
            cols: [
                {
                    type: "selection",
                    width: "50",
                    align: "center",
                },
                {
                    prop: "loginName",
                    label: this.$t("onLine.loginName"),
                },
                {
                    prop: "userName",
                    label: this.$t("onLine.name"),
                },
                {
                    prop: "orgName",
                    label: this.$t("onLine.orgName"),
                },
                {
                    prop: "positionName",
                    label: this.$t("onLine.positionName"),
                },
                {
                    prop: "host",
                    label: this.$t("onLine.host"),
                },
                {
                    prop: "os",
                    label: this.$t("onLine.os"),
                    showOverflowTooltip: true,
                },
                {
                    prop: "startTime",
                    label: this.$t("onLine.loginTime"),
                    showOverflowTooltip: true,
                    width: "200",
                },
                {
                    prop: "browser",
                    label: this.$t("onLine.browser"),
                    width: "120",
                },
                {
                    label: this.$t("common.operation"),
                    width: "60px",
                    prop: "operation",
                    slotName: "operation",
                    /* prop: ({row}, h) => {
                    return h('div', [
                         h("hos-tooltip",{
                                props:{
                                content:"强制下线"
                                },
                            },[
                            h("i", {
                                class: "hos-icon-bottom",
                                on: {
                                    click: () => {
                                    this.Offline(row);
                                    },
                                },
                            })
                        ]),
                    ])
                } */
                },
            ],
        };
    },
    watch: {},
    mounted() {},
    methods: {
        onLineData(primary) {
            return this.$api("on_line.selectPage", primary);
        },
        // checkbox框选中事件
        handleSelectionChange(selection) {
            //console.
            this.selectedTableIds = selection.map((item) => item.id);
            this.checkLoginName = selection.map((item) => item.loginName);
            this.checkmd5Token = selection.map((item) => item.refreshTokenMd5);
        },
        Offline(row) {
            if (this.selectedTableIds.length > 0 || row != undefined) {
                this.$confirm(
                    this.$t("onLine.OfflineTip"),
                    this.$t("login.label.info"),
                    { type: "warning" }
                ).then(() => {
                    let loginNameStr = "";
                    let md5TokenStr = "";
                    let list = [];
                    if (row) {
                        let obj = {
                            loginName: row.loginName,
                            md5Token: row.refreshTokenMd5,
                        };
                        list.push(obj);
                    } else {
                        for (let i = 0; i < this.checkLoginName.length; i++) {
                            let obj = {
                                loginName: this.checkLoginName[i],
                                md5Token: this.checkmd5Token[i],
                            };
                            list.push(obj);
                        }
                    }

                    this.$api("on_line.kick", list)
                        .then((res) => {
                            if (res && res.code == 200) {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "onLineTable",
                                });
                            } else {
                                this.$message.error(this.$t("operation.error"));
                            }
                        })
                        .catch((error) => {
                            //this.$message.error(this.$t("operation.error"));
                        });
                });
            } else {
                this.$message.warning(this.$t("common.confirm.dataNull"));
            }
        },
    },
};
</script>
