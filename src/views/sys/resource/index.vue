<template>
    <div class="h-fit resource">
        <hos-biz-table
            @selection-change="handleSelectionChange"
            :page="false"
            @select-all="selectAll"
            :selection="selection"
            uid="resourceTable"
            :cols="cols"
            :data="resourceData"
            :form="form"
            pagePos="top"
            row-key="id"
            ref="resourceTable"
            :default-expand-all="false"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <template #toolbar>
                <hos-button-group class="hos">
                    <hos-button
                        v-has-permi="{ key: 'base:sys:resource:insert' }"
                        @click="addOrEdit()"
                        icon="hos-icom-add"
                    >{{ $t("operation.add") }}</hos-button>
                    <hos-button
                        v-has-permi="{ key: 'base:sys:resource:del' }"
                        @click="deleteResource()"
                        icon="hos-icom-cancel"
                    >{{ $t("operation.delete") }}</hos-button>
                    <i
                        type="cut"
                        v-has-permi="{key: ['base:sys:resource:add', 'base:sys:resource:del']}"
                    ></i>
                    <hos-button
                        v-has-permi="{ key: 'base:sys:resource:lifetime' }"
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
                        <hos-form-item :label="$t('common.code')">
                            <hos-input
                                v-model="form.model.code"
                                clearable
                                :placeholder="$t('common.placeholder.code')"
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="12">
                        <hos-form-item label-width="20px">
                            <hos-biz-button
                                run="form.search"
                                type="primary"
                            >{{$t("operation.query")}}
                            </hos-biz-button>
                            <hos-biz-button
                                type="primary"
                                @click="reset()"
                            >{{$t("operation.reset")}}
                            </hos-biz-button>
                            <hos-button
                                v-has-permi="{ key: 'base:sys:resource:log' }"
                                @click="bizLog()"
                                type="success"
                                class="fr"
                            >{{ $t("operation.bizLog") }}</hos-button>
                        </hos-form-item>
                    </hos-col>
                </hos-row>
            </template>
            <template #operation="{ row }">
                <hos-tooltip
                    class="pl5 pr5"
                    :content="$t('operation.edit')"
                >
                    <i
                        class="hos-icom-edit"
                        v-has-permi="{ key: 'base:sys:resource:edit' }"
                        @click="addOrEdit(row)"
                    ></i>
                </hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    :content="$t('operation.delete')"
                >
                    <i
                        class="hos-icom-cancel"
                        v-has-permi="{ key: 'base:sys:resource:del' }"
                        @click="deleteResource(row)"
                    ></i>
                </hos-tooltip>
            </template>
        </hos-biz-table>
        <!-- 弹出层 -->
        <hos-biz-dialog
            :title="$t('operation.add') + $t('resource.title')"
            width="1100px"
            uid="resourceAddDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('operation.edit') + $t('resource.title')"
            width="1100px"
            uid="resourceEditDialog"
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
</template>

<script>
import commonIcon from "../../../assets/commonIcon.json";
export default {
    prop: [],
    components: {},
    data() {
        return {
            checkedKeys: false,
            selectedTableIds: [],
            selection: [],
            form: {
                labelWidth: "auto",
                model: {
                    name: "",
                    code: "",
                },
            },
            cols: [
                {
                    type: "selection",
                    width: "55px",
                    align: "center",
                },
                {
                    prop: "name",
                    label: this.$t("common.name"),
                },
                {
                    prop: "code",
                    label: this.$t("common.code"),
                },
                {
                    label: this.$t("resource.icon"),
                    width: "80px",
                    prop: ({ row }, h) => {
                        return h("i", {
                            class: row.icon,
                        });
                    },
                },
                {
                    label: this.$t("common.type"),
                    width: "80px",
                    prop: ({ row }) => {
                        return this.resourceTypeMap[row.type];
                    },
                },
                {
                    prop: "router",
                    label: this.$t("resource.router"),
                },
                {
                    prop: "weight",
                    width: "80px",
                    label: this.$t("common.weight"),
                },
                {
                    label: this.$t("common.isActived"),
                    width: "120px",
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
                    prop: "operation",
                    width: "80px",
                    slotName: "operation",
                },
            ],
            // 资源类型
            resourceTypeMap: { C: "目录", M: "菜单" },
            // 打开方式
            openTypeMap: { 0: "tab", 1: "新窗口", 2: "iframe", 3: "弹窗" },
            //生命周期弹窗名
            timeLineDialogTitle: "",
            // 选中资源的类型
            types: "",
            // 选中资源的名称
            names: [],
        };
    },
    created() {
        sessionStorage.setItem("icons", JSON.stringify(commonIcon));
    },
    methods: {
        selectAll() {
            this.checkedKeys = !this.checkedKeys;
            this.splite(this.$refs.resourceTable.tableData, this.checkedKeys);
        },
        splite(data, flag) {
            data.forEach((row) => {
                this.$nextTick(() => {
                    this.$refs.resourceTable.$children[2].$refs[
                        "hos-table-lq"
                    ].toggleRowSelection(row, flag);
                });

                if (row.children != undefined) {
                    this.splite(row.children, flag);
                }
            });
        },
        //  编辑和新增共用一个方法
        addOrEdit(row) {
            if (row) {
                // 编辑
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./edit.vue").default,
                    _uid: "resourceEditDialog",
                    props: {
                        id: row.id,
                        resourceType: this.resourceTypeMap,
                        openTypeMap: this.openTypeMap,
                        status: "edit:",
                    },
                });
            } else {
                if (this.selectedTableIds.length > 1) {
                    // 判断是否选中上级目录
                    this.$message.warning(this.$t("common.confirm.parentId"));
                } else {
                    if (this.selectedTableIds.length === 1) {
                        if (this.types[0] !== "C") {
                            this.$message.warning(this.$t("resource.checkTip"));
                            return;
                        }
                    }
                    this.$store.commit("OPEN_DIALOG", {
                        component: require("./edit.vue").default,
                        _uid: "resourceAddDialog",
                        props: {
                            resourceType: this.resourceTypeMap,
                            openTypeMap: this.openTypeMap,
                            status: "add:",
                            parentId: this.selectedTableIds,
                        },
                    });
                }
            }
        },
        deleteResource(row) {
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
                        this.$api("sys_resource.deleteSingle", {
                            ids: row.id,
                        }).then((res) => {
                            if (res && res.code == 200) {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "resourceTable",
                                });
                            } else {
                                this.$message.error(
                                    this.$t("common.tipMessage." + res.code)
                                );
                            }
                        });
                    } else {
                        let selectIds = this.selectedTableIds.join(",");
                        this.$api("sys_resource.deleteSingle", {
                            ids: selectIds,
                        })
                            .then((res) => {
                                if (res && res.code == 200) {
                                    this.$message.success(
                                        this.$t("operation.success")
                                    );
                                    this.$store.commit("UPDATE_TABLE", {
                                        _uid: "resourceTable",
                                    });
                                } else {
                                    this.$message.error(
                                        this.$t("common.tipMessage." + res.code)
                                    );
                                }
                            })
                            .catch((error) => {
                                this.$message.error(this.$t("operation.error"));
                            });
                    }
                });
            } else {
                this.$message.warning(this.$t("common.confirm.dataNull"));
            }
        },
        // 组件加载时获取数据
        resourceData(params) {
            return this.$api("sys_resource.getList", params);
        },
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
                    this.$api("sys_resource.updateActived", {
                        id: row.id,
                        actived: row.actived,
                    }).then((res) => {
                        if (res && res.code == 200) {
                            this.$message.success(this.$t("operation.success"));
                        } else {
                            this.$message.error(this.$t("operation.error"));
                            row.actived = !row.actived;
                        }
                    });
                })
                .catch(() => {
                    row.actived = !row.actived;
                });
        },
        handleSelectionChange(selection) {
            this.selectedTableIds = selection.map((item) => item.id);
            this.names = selection.map((item) => item.name);
            this.types = selection.map((item) => item.type);
        },
        reset() {
            this.form.model = {
                code: "",
                name: "",
            };
            this.$store.commit("UPDATE_TABLE", { _uid: "resourceTable" });
        },
        // 生命周期
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
                    tableName: "t_sys_resource",
                },
            });
        },
        // 数据日志页面
        bizLog() {
            // 数据日志组件
            this.$router.push({
                path: "/base-monitor-business-log",
                query: {
                    tableName: "t_sys_resource",
                    title: this.$t("resource.resourceManage"),
                    path: "/base-sys-resources",
                },
            });
        },
    },
};
</script>
