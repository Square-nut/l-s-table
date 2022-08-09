<template>
    <!-- <hos-card class="card-table" shadow="never"> -->
    <div class="h-fit">
        <hos-biz-table
            @selection-change="handleSelectionChange"
            :page="true"
            :selection="selection"
            uid="packageTable"
            :cols="cols"
            :data="packageData"
            :form="form"
            pagePos="top"
        >
            <!-- 顶部按钮组 -->
            <template #toolbar>
                <hos-button-group class="hos">
                    <hos-button
                        v-has-permi="{ key: 'base:tenant:package:insert' }"
                        @click="addOrEdit()"
                        icon="hos-icom-add"
                    >{{ $t("operation.add") }}</hos-button>
                    <hos-button
                        v-has-permi="{ key: 'base:tenant:package:del' }"
                        @click="deletePackage()"
                        icon="hos-icom-cancel"
                    >{{ $t("operation.delete") }}</hos-button>
                    <i
                        type="cut"
                        v-has-permi="{key: ['base:tenant:package:insert', 'base:tenant:package:del']}"
                    ></i>
                    <hos-button
                        v-has-permi="{ key: 'base:tenant:package:lifetime' }"
                        icon="hos-icom-sample-stat"
                        @click="timeLine()"
                    >{{ $t("operation.timeline") }}</hos-button>
                </hos-button-group>
            </template>
            <!-- 检索表单 -->
            <template #form>
                <hos-row :gutter="20">
                    <hos-col :span="6">
                        <hos-form-item :label="$t('common.code')">
                            <hos-input
                                v-model="form.model.code"
                                clearable
                                :placeholder="$t('common.placeholder.code')"
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="6">
                        <hos-form-item :label="$t('common.name')">
                            <hos-input
                                v-model="form.model.name"
                                clearable
                                :placeholder="$t('common.placeholder.name')"
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="12">
                        <hos-form-item label-width="20px">
                            <hos-biz-button
                                run="form.search"
                                type="primary"
                            >{{ $t("operation.query") }}
                            </hos-biz-button>
                            <hos-biz-button
                                @click="reset()"
                                type="primary"
                            >{{ $t("operation.reset") }}
                            </hos-biz-button>
                            <hos-button
                                v-has-permi="{ key: 'base:tenant:package:log' }"
                                @click="bizLog()"
                                type="success"
                                class="fr"
                            >{{ $t("operation.bizLog") }}
                            </hos-button>
                        </hos-form-item>
                    </hos-col>
                </hos-row>
            </template>
            <template #operation="{ row }">
                <hos-tooltip
                    class="pl5 pr5"
                    :content="$t('operation.edit')"
                    v-has-permi="{ key: 'base:tenant:package:edit' }"
                >
                    <i
                        class="hos-icom-edit"
                        @click="addOrEdit(row)"
                    ></i>
                </hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    :content="$t('operation.authorization')"
                    v-has-permi="{ key: 'base:tenant:package:scope' }"
                >
                    <i
                        class="hos-icom-stamp-pass"
                        @click="authorization(row)"
                    ></i>
                </hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    :content="$t('operation.delete')"
                    v-has-permi="{ key: 'base:tenant:package:del' }"
                >
                    <i
                        class="hos-icom-cancel"
                        @click="deletePackage(row)"
                    ></i>
                </hos-tooltip>
            </template>
        </hos-biz-table>
        <hos-biz-dialog
            :title="$t('operation.add') + $t('tenant.package')"
            width="50%"
            uid="packageAddDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('operation.edit') + $t('tenant.package')"
            width="50%"
            uid="packageEditDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('operation.authorize.package')"
            width="400px"
            uid="packageAuthDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title="timeLineDialogTitle"
            width="40%"
            uid="timeLineDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
    </div>
    <!-- </hos-card> -->
</template>

<script>
export default {
    data() {
        return {
            // 数据日志标题
            timeLineDialogTitle: "",
            // 选中资源的名称
            names: "",
            selectedTableIds: [],
            selection: [],
            form: {
                labelWidth: "auto",
                model: {
                    name: "",
                    code: "",
                },
            },
            page: {
                size: 10,
                current: 0,
            },
            cols: [
                {
                    type: "selection",
                    width: "50px",
                    align: "center",
                },
                {
                    prop: "code",
                    label: this.$t("common.code"),
                    width: "150",
                },
                {
                    prop: "name",
                    label: this.$t("common.name"),
                    width: "200",
                },
                {
                    prop: "createTime",
                    label: this.$t("common.createTime"),
                    width: "200",
                },
                {
                    prop: "remark",
                    label: this.$t("common.remark"),
                },
                {
                    label: this.$t("common.isActived"),
                    width: "100px",
                    prop: ({ row }, h) => {
                        return h("hos-switch", {
                            props: {
                                type: "switch",
                                value: row.actived,
                                activeText: this.$t(
                                    "common.actived.activedTrue"
                                ),
                                inactiveText: this.$t(
                                    "common.actived.activedFalse"
                                ),
                                innerLabel: true,
                            },
                            on: {
                                change: (value) => {
                                    row.actived = value;
                                    this.updateActived(row);
                                },
                            },
                        });
                    },
                },
                {
                    label: this.$t("common.operation"),
                    width: "120px",
                    prop: "operation",
                    slotName: "operation",
                },
            ],
        };
    },
    methods: {
        packageData(params) {
            // 初始加载表格数据
            return this.$api("tenant_package.selectPage", params);
        },
        // 更新状态
        updateActived(row) {
            this.$confirm(
                this.$t("common.confirm.actived")
                    .replace(
                        "{0}",
                        row.actived
                            ? this.$t("common.actived.true")
                            : this.$t("common.actived.false")
                    )
                    .replace("{1}", row.name),
                this.$t("login.label.info"),
                {
                    type: "warning",
                }
            ).then(
                () => {
                    this.$api("tenant_package.updateStats", {
                        id: row.id,
                        actived: row.actived,
                    }).then((res) => {
                        if (res && res.code == 200 && res.data == true) {
                            this.$message.success(this.$t("operation.success"));
                        } else {
                            this.$message.error(
                                this.$t("common.tipMessage." + res.code, [
                                    this.$t("tenant.package"),
                                    row.name,
                                    res.msg,
                                ])
                            );
                            row.actived = !row.actived;
                        }
                    });
                },
                () => {
                    row.actived = !row.actived;
                }
            );
        },
        // 新增或编辑
        addOrEdit(row) {
            if (row) {
                // 编辑
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./edit.vue").default,
                    _uid: "packageEditDialog",
                    props: {
                        id: row.id,
                        status: "edit:",
                    },
                });
            } else {
                console.log("open");
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./edit.vue").default,
                    _uid: "packageAddDialog",
                    props: {
                        status: "add:",
                    },
                });
            }
        },
        // 授权页面
        authorization(row) {
            if (row.actived == false) {
                this.$message.warning(this.$t("tenant.tipMessage.packageStop"));
            } else {
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./authorization.vue").default,
                    _uid: "packageAuthDialog",
                    props: {
                        id: row.id,
                    },
                });
            }
        },
        // 删除租户包
        deletePackage(row) {
            if (row || this.names.length > 0) {
                this.$confirm(
                    this.$t(
                        "common.confirm." + (row ? "delete" : "deleteAll"),
                        [row ? row.name : ""]
                    ),
                    this.$t("operation.delete"),
                    {
                        type: "delete",
                    }
                ).then(() => {
                    if (row) {
                        this.$api("tenant_package.deleteById", {
                            ids: row.id,
                        }).then((res) => {
                            if (res && res.code == 200) {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "packageTable",
                                });
                            } else {
                                this.$message.error(
                                    this.$t("common.tipMessage." + res.code, [
                                        this.$t("tenant.package"),
                                        row.name,
                                        res.msg,
                                    ])
                                );
                            }
                        });
                    } else {
                        let selectIds = this.selectedTableIds.join(",");
                        if (selectIds) {
                            this.$api("tenant_package.deleteById", {
                                ids: selectIds,
                            }).then((res) => {
                                if (res && res.code == 200) {
                                    this.$message.success(
                                        this.$t("operation.success")
                                    );
                                    this.$store.commit("UPDATE_TABLE", {
                                        _uid: "packageTable",
                                    });
                                } else {
                                    this.$message.error(
                                        this.$t(
                                            "common.tipMessage." + res.code,
                                            [
                                                this.$t("tenant.package"),
                                                this.$t(
                                                    "tenant.choosedPackage"
                                                ),
                                                res.msg,
                                            ]
                                        )
                                    );
                                }
                            });
                        } else {
                            this.$message.error(
                                this.$t("tenant.tipMessage.nullData")
                            );
                        }
                    }
                });
            } else {
                this.$message.warning(this.$t("common.confirm.dataNull"));
            }
        },
        handleSelectionChange(selection) {
            this.selectedTableIds = selection.map((item) => item.id);
            this.names = selection.map((item) => item.name);
        },
        reset() {
            this.form.model = {
                name: "",
                package: "",
            };
            this.$store.commit("UPDATE_TABLE", { _uid: "packageTable" });
        },
        timeLine() {
            if (
                this.selectedTableIds !== undefined &&
                this.selectedTableIds.length > 0
            ) {
                if (this.selectedTableIds.length > 1) {
                    this.$message.warning(this.$t("timeline.warning"));
                    return;
                }
            } else {
                this.$message.warning(this.$t("timeline.please"));
                return;
            }
            this.timeLineDialogTitle =
                this.$t("timeline.title") + this.names[0];
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/time-line/index.vue")
                    .default,
                _uid: "timeLineDialog",
                props: {
                    id: this.selectedTableIds[0],
                    tableName: "t_tenant_package",
                },
            });
        },
        bizLog() {
            // 数据日志组件
            this.$router.push({
                path: "/base-monitor-business-log",
                query: {
                    title: this.$t("tenant.packageManage"),
                    tableName: "t_tenant_package",
                    path: "/base-tenant-package",
                },
            });
        },
    },
};
</script>