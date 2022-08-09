<template>
    <!-- <hos-card class="card-table" shadow="never"> -->
    <div class="h-fit">
        <hos-biz-table
            @selection-change="handleSelectionChange"
            :page="true"
            :selection="selection"
            uid="datasourceTable"
            :cols="cols"
            :data="datasourceData"
            :form="form"
            pagePos="top"
        >
            <template #toolbar>
                <hos-button-group class="hos">
                    <hos-button
                        v-has-permi="{ key: 'base:tenant:datasource:add' }"
                        @click="addOrEdit()"
                        icon="hos-icom-add"
                    >{{ $t("operation.add") }}</hos-button>
                    <hos-button
                        v-has-permi="{ key: 'base:tenant:datasource:del' }"
                        @click="deletedatasource()"
                        icon="hos-icom-cancel"
                    >{{ $t("operation.delete") }}</hos-button>
                    <i
                        type="cut"
                        v-has-permi="{key: ['base:tenant:datasource:add', 'base:tenant:datasource:del']}"
                    ></i>
                    <hos-button
                        v-has-permi="{ key: 'base:tenant:datasource:lifetime' }"
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
                                clearable
                                v-model="form.model.name"
                                :placeholder="$t('common.placeholder.name')"
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="18">
                        <hos-form-item label-width="20px">
                            <hos-biz-button
                                run="form.search"
                                type="primary"
                            >{{$t("operation.query")}}
                            </hos-biz-button>
                            <hos-biz-button
                                @click="reset()"
                                type="primary"
                            >{{$t("operation.reset")}}
                            </hos-biz-button>
                            <hos-button
                                v-has-permi="{ key: 'base:tenant:datasource:log' }"
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
                    v-has-permi="{ key: 'base:tenant:datasource:edit' }"
                >
                    <i
                        class="hos-icom-edit"
                        @click="addOrEdit(row)"
                    ></i>
                </hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    :content="$t('operation.delete')"
                    v-has-permi="{ key: 'base:tenant:datasource:del' }"
                >
                    <i
                        class="hos-icom-cancel"
                        @click="deletedatasource(row)"
                    ></i>
                </hos-tooltip>
            </template>
        </hos-biz-table>
        <hos-biz-dialog
            :title="$t('operation.add') + $t('datasource.title')"
            width="50%"
            uid="datasourceAddDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('operation.edit') + $t('datasource.title')"
            width="50%"
            uid="datasourceEditDialog"
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
            page: {
                size: 10,
                current: 0,
            },
            form: {
                labelWidth: "auto",
                model: {
                    name: "",
                },
            },
            cols: [
                {
                    type: "selection",
                    align: "center",
                    width: "55px",
                },
                {
                    prop: "name",
                    label: this.$t("common.name"),
                    width: "250px",
                    showOverflowTooltip: true,
                },
                {
                    prop: "driverClass",
                    label: this.$t("datasource.driverClass"),
                    width: "180px",
                    showOverflowTooltip: true,
                },
                {
                    prop: "username",
                    label: this.$t("datasource.username"),
                    width: "100px",
                },
                {
                    prop: "url",
                    label: this.$t("datasource.url"),
                    showOverflowTooltip: true,
                },
                {
                    label: this.$t("common.operation"),
                    width: "80px",
                    prop: "operation",
                    slotName: "operation",
                },
            ],
        };
    },
    methods: {
        datasourceData(primary) {
            if (primary.name != "") {
                return this.$api("tenant_datasource.selectPage", primary);
            } else {
                return this.$api("tenant_datasource.selectPage", this.page);
            }
        },
        addOrEdit(row) {
            if (row) {
                // 编辑
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./edit.vue").default,
                    _uid: "datasourceEditDialog",
                    props: {
                        id: row.id,
                        status: "edit:",
                    },
                });
            } else {
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./edit.vue").default,
                    _uid: "datasourceAddDialog",
                    props: {
                        status: "add:",
                    },
                });
            }
        },
        // checkbox框选中事件
        handleSelectionChange(selection) {
            this.selectedTableIds = selection.map((item) => item.id);
            this.names = selection.map((item) => item.name);
        },
        deletedatasource(row) {
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
                    let idStr = "";
                    if (row) {
                        idStr = row.id;
                    } else {
                        idStr = this.selectedTableIds.join(",");
                    }
                    //校验被删除的数据源是否被使用;
                    this.$api("tenant_datasource.deletedatasource", {
                        ids: idStr,
                    })
                        .then((res) => {
                            if (res && res.code == 200) {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "datasourceTable",
                                });
                            } else {
                                this.$message.error(
                                    this.$t("common.tipMessage." + res.code, [
                                        this.$t("datasource.title"),
                                        row ? row.name : "所选数据",
                                        res.msg,
                                    ])
                                );
                            }
                        })
                        .catch((error) => {
                            this.$message.error(this.$t("operation.error"));
                        });
                });
            } else {
                this.$message.warning(this.$t("common.confirm.dataNull"));
            }
        },
        reset() {
            this.form.model = {
                name: "",
            };
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
                    tableName: "t_datasource",
                },
            });
        },
        bizLog() {
            // 数据日志组件
            this.$router.push({
                path: "/base-monitor-business-log",
                query: {
                    title: this.$t("datasource.datasourceManage"),
                    tableName: "t_datasource",
                    path: "/base-tenant-datasource",
                },
            });
        },
    },
};
</script>
