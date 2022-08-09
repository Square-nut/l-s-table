<template>
    <!-- <hos-card class="card-table" shadow="never"> -->
    <div class="h-fit">
        <hos-biz-table
            @selection-change="handleSelectionChange"
            :page="true"
            :selection="selection"
            uid="tenantTable"
            :cols="cols"
            :data="tenantData"
            :form="form"
            pagePos="top"
        >
            <template #toolbar>
                <hos-button-group class="hos">
                    <hos-button
                        v-has-permi="{ key: 'base:tenant:tenant:insert' }"
                        @click="addOrEdit()"
                        icon="hos-icom-add"
                    >{{ $t("operation.add") }}</hos-button>
                    <hos-button
                        v-has-permi="{ key: 'base:tenant:tenant:del' }"
                        @click="deleteTenant()"
                        icon="hos-icom-cancel"
                    >{{ $t("operation.delete") }}</hos-button>
                    <i
                        type="cut"
                        v-has-permi="{key: ['base:tenant:tenant:insert', 'base:tenant:tenant:del']}"
                    ></i>
                    <hos-button
                        v-has-permi="{ key: 'base:tenant:tenant:datasource' }"
                        @click="sourceDataConfig()"
                        icon="hos-icon-connection"
                    >{{ $t("tenant.dataConfig") }}</hos-button>
                    <hos-button
                        v-has-permi="{ key: 'base:tenant:tenant:lifetime' }"
                        icon="hos-icom-sample-stat"
                        @click="timeLine()"
                    >{{ $t("operation.timeline") }}</hos-button>
                </hos-button-group>
            </template>
            <template #form>
                <hos-row :gutter="20">
                    <hos-col :span="6">
                        <hos-form-item :label="$t('common.name')">
                            <hos-input
                                v-model="form.model.name"
                                clearable
                                :placeholder="$t('common.placeholder.name')"
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="6">
                        <hos-form-item :label="$t('tenant.package')">
                            <hos-select
                                v-model="form.model.packageId"
                                filterable
                                clearable
                                :placeholder="$t('common.placeholder.tenantPackage')"
                            >
                                <hos-option
                                    v-for="(item, i) in tenantTreeData"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.value"
                                ></hos-option>
                            </hos-select>
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
                                v-has-permi="{ key: 'base:tenant:tenant:log' }"
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
                    v-has-permi="{ key: 'base:tenant:tenant:edit' }"
                >
                    <i
                        class="hos-icom-edit"
                        @click="addOrEdit(row)"
                    ></i>
                </hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    :content="$t('operation.delete')"
                    v-has-permi="{ key: 'base:tenant:tenant:del' }"
                >
                    <i
                        class="hos-icom-cancel"
                        @click="deleteTenant(row)"
                    ></i>
                </hos-tooltip>
                <hos-tooltip
                    v-if="row.buildData == false"
                    class="pl5 pr5"
                    :content="$t('operation.initData')"
                    v-has-permi="{ key: 'base:tenant:tenant:initData' }"
                >
                    <i
                        class="hos-icom-init"
                        @click="initData(row)"
                    ></i>
                </hos-tooltip>
            </template>
        </hos-biz-table>
        <hos-biz-dialog
            :title="$t('operation.add') + $t('tenant.title')"
            width="50%"
            uid="tenantAddDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('operation.edit') + $t('tenant.title')"
            width="50%"
            uid="tenantEditDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('tenant.dataConfig')"
            width="400px"
            uid="sourceDataDialog"
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
            selectedDatSource: [],
            // 租户包数据的选择
            tenantTreeData: [],
            page: {
                size: 10,
                current: 0,
            },
            form: {
                labelWidth: "auto",
                model: {
                    name: "",
                    packageId: null,
                },
            },
            cols: [
                {
                    type: "selection",
                    width: "55px",
                    align: "center",
                },
                /*{
                prop: 'weight',  //顺序
                label: this.$t('tenant.weight'),
                width: '60px'
            },*/ {
                    prop: "tenantId",
                    label: this.$t("tenant.Id"),
                    width: "80px",
                },
                {
                    prop: "name",
                    label: this.$t("common.name"),
                },
                {
                    prop: "packageDesc",
                    label: this.$t("tenant.package"),
                },
                {
                    prop: "linkman",
                    label: this.$t("tenant.linkman"),
                },
                {
                    prop: "contactNumber",
                    label: this.$t("tenant.contactNumber"),
                },
                {
                    prop: "expireTime",
                    label: this.$t("tenant.expireTime"),
                },
                {
                    prop: ({ row }, h) => {
                        return h("hos-switch", {
                            props: {
                                type: "switch",
                                value: row.actived,
                                activeText: "是",
                                inactiveText: "否",
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
                    label: this.$t("common.isActived"),
                    width: "90px",
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
    created() {
        this.$api("tenant_package.packageTreeData").then((res) => {
            if (res && res.code == 200) {
                this.tenantTreeData = res.data;
            } else {
                this.$message.error(
                    this.$t("tenant.tipMessage.getPackageField")
                );
            }
        });
    },
    methods: {
        tenantData(params) {
            return this.$api("tenant_tenant.getAllTenant", params);
        },
        addOrEdit(row) {
            if (row) {
                // 编辑
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./edit.vue").default,
                    _uid: "tenantEditDialog",
                    props: {
                        id: row.id,
                        status: "edit:",
                    },
                });
            } else {
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./edit.vue").default,
                    _uid: "tenantAddDialog",
                    props: {
                        status: "add:",
                    },
                });
            }
        },
        // checkbox框选中事件
        handleSelectionChange(selection) {
            console.log(selection);
            this.selectedTableIds = selection.map((item) => item.id);
            this.selectedDatSource = selection.map((item) => item.datasourceId);
            this.names = selection.map((item) => item.name);
        },
        // 更新租户状态
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
            )
                .then(() => {
                    this.$api("tenant_tenant.updateActived", {
                        id: row.id,
                        actived: row.actived,
                    }).then((res) => {
                        if (res && res.code == 200) {
                            this.$message.success(this.$t("operation.success"));
                            // this.tenantData(params);
                        } else {
                            row.actived = !row.actived;
                            this.$message.error(this.$t("operation.error"));
                        }
                    });
                })
                .catch(() => {
                    row.actived = !row.actived;
                });
        },
        deleteTenant(row) {
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
                        this.$api("tenant_tenant.deleteTenant", {
                            ids: row.id,
                        }).then((res) => {
                            if (res && res.code == 200) {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "tenantTable",
                                });
                            } else {
                                this.$message.error(this.$t("operation.error"));
                            }
                        });
                    } else {
                        if (this.selectedTableIds.length == 0) {
                            this.$message.warning(this.$t("common.dataNull"));
                        } else {
                            let selectIds = this.selectedTableIds.join(",");
                            this.$api("tenant_tenant.deleteTenant", {
                                ids: selectIds,
                            })
                                .then((res) => {
                                    if (res && res.code == 200) {
                                        this.$message.success(
                                            this.$t("operation.success")
                                        );
                                        this.$store.commit("UPDATE_TABLE", {
                                            _uid: "tenantTable",
                                        });
                                    } else {
                                        this.$message.error(
                                            this.$t("operation.error")
                                        );
                                    }
                                })
                                .catch((err) => {
                                    this.$message.error(
                                        this.$t("operation.error")
                                    );
                                });
                        }
                    }
                });
            } else {
                this.$message.warning(this.$t("common.confirm.dataNull"));
            }
        },
        // 数据源配置
        sourceDataConfig() {
            if (this.selectedDatSource.length == 0) {
                this.$message.warning(
                    this.$t("tenant.tipMessage.chooceTenant")
                );
            } else {
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./sourceData.vue").default,
                    _uid: "sourceDataDialog",
                    props: {
                        id: this.selectedTableIds,
                        datasourceId: this.selectedDatSource,
                        datasourceCallback: this.datasourceCallback,
                    },
                });
            }
        },
        reset() {
            this.form.model = {
                name: "",
                packageId: "",
            };
            this.$store.commit("UPDATE_TABLE", { _uid: "resourceTable" });
        },
        // 修改对应行的数据源id      id是租户id的集合,datasourceId是数据源id
        datasourceCallback(id, datasourceId) {
            console.log(id);
            this.$api("tenant_tenant.saveDataSource", {
                dataSourceId: datasourceId,
                tenantIds: id,
            }).then((res) => {
                if (res && res.code == 200) {
                    this.$message.success(
                        this.$t("tenant.tipMessage.dataSourceSuccess")
                    );
                } else {
                    this.$message.error(
                        this.$t("tenant.tipMessage.dataSourceField")
                    );
                }
            });
        },
        initData(row) {
            if (row.actived == true) {
                this.$confirm(
                    this.$t("common.confirm.init"),
                    this.$t("login.label.info"),
                    {
                        type: "warning",
                    }
                )
                    .then(() => {
                        this.$api("tenant_tenant.initData", {
                            tId: row.tenantId,
                        }).then((res) => {
                            if (res && res.code == 200 && res.success == true) {
                                this.$set(row, "buildData", true);
                                this.$message.success(
                                    this.$t("tenant.tipMessage.initSuccess")
                                );
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "tenantTable",
                                });
                            } else {
                                this.$message.error(
                                    this.$t("tenant.tipMessage.initError")
                                );
                            }
                        });
                    })
                    .catch(() => {});
            } else {
                this.$message.warning(
                    this.$t("tenant.tipMessage.initDeactivate")
                );
            }
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
                    tableName: "t_tenant",
                },
            });
        },
        bizLog() {
            // 数据日志组件
            this.$router.push({
                path: "/base-monitor-business-log",
                query: {
                    title: this.$t("tenant.tenantManage"),
                    tableName: "t_tenant",
                    path: "/base-tenant",
                },
            });
        },
    },
};
</script>
