<template>
    <hos-container class="base-container left-tree-right-table">
        <hos-aside width="300px">
            <div class="left-tree-search">
                <hos-input
                    :placeholder="$t('common.placeholder.key')"
                    suffix-icon="hos-icom-find"
                    v-model="filterText"
                ></hos-input>
                <hos-button-group class="hos">
                    <hos-button
                        @click="$refs.tree.expandAll()"
                        icon="hos-icon-folder-opened"
                    >{{ $t("operation.expand") }}</hos-button>
                    <hos-button
                        @click="$refs.tree.collapseAll()"
                        icon="hos-icon-folder"
                    >{{ $t("operation.collapse") }}
                    </hos-button>
                </hos-button-group>
            </div>
            <hos-tree
                ref="tree"
                node-key="id"
                :data="treeData"
                :defaultExpandFirst="false"
                @node-click="clickNode"
                :filter-node-method="filterNode"
            ></hos-tree>
        </hos-aside>
        <hos-main>
            <div class="h-fit">
                <hos-biz-table
                    @selection-change="handleSelectionChange"
                    :selection="selection"
                    uid="table"
                    :cols="cols"
                    :data="selectPage"
                    :pager-count="5"
                    :form="form"
                >
                    <template #form>
                        <hos-row :gutter="20">
                            <hos-col :span="8">
                                <hos-form-item :label="$t('common.code')">
                                    <hos-input
                                        v-model="form.model.code"
                                        clearable
                                        :placeholder="$t('common.placeholder.code')"
                                    ></hos-input>
                                </hos-form-item>
                            </hos-col>
                            <hos-col :span="8">
                                <hos-form-item :label="$t('common.name')">
                                    <hos-input
                                        v-model="form.model.name"
                                        clearable
                                        :placeholder="$t('common.placeholder.name')"
                                    ></hos-input>
                                </hos-form-item>
                            </hos-col>
                            <hos-col :span="8">
                                <hos-form-item label-width="20px">
                                    <hos-biz-button
                                        run="form.search"
                                        type="primary"
                                    >{{ $t("operation.query") }}
                                    </hos-biz-button>
                                    <hos-biz-button
                                        type="primary"
                                        @click="reset()"
                                    >{{ $t("operation.reset") }}
                                    </hos-biz-button>
                                    <hos-button
                                        class="fr"
                                        v-has-permi="{ key: 'base:sys:page-pre:log' }"
                                        @click="bizLog()"
                                        type="success"
                                    >{{ $t("operation.bizLog") }}
                                    </hos-button>
                                </hos-form-item>
                            </hos-col>
                        </hos-row>
                    </template>
                    <template #toolbar>
                        <hos-button-group class="hos">
                            <hos-button
                                @click="addDialog()"
                                icon="hos-icom-add"
                                :title="$t('operation.add')"
                                v-has-permi="{ key: 'base:sys:page-pre:add' }"
                            >{{ $t("operation.add") }}
                            </hos-button>
                            <hos-button
                                @click="deletion()"
                                icon="hos-icom-cancel"
                                :title="$t('operation.delete')"
                                v-has-permi="{ key: 'base:sys:page-pre:delete' }"
                            >{{ $t("operation.delete") }}
                            </hos-button>
                            <i
                                type="cut"
                                v-has-permi="{key: ['base:sys:page-pre:add', 'base:sys:page-pre:delete']}"
                            ></i>
                            <hos-button
                                icon="hos-icom-import"
                                v-has-permi="{ key: 'base:sys:page-pre:upload' }"
                                @click="uploadAllColumn()"
                            >{{ $t("operation.import") }}
                            </hos-button>
                            <hos-button
                                icon="hos-icom-export"
                                v-has-permi="{ key: 'base:sys:page-pre:export' }"
                                @click="exportAllColumn()"
                            >{{ $t("operation.export") }}
                            </hos-button>
                            <i
                                type="cut"
                                v-has-permi="{key: ['base:sys:page-pre:upload', 'base:sys:page-pre:export']}"
                            ></i>
                            <hos-button
                                v-has-permi="{ key: 'base:sys:page-pre:lifetime' }"
                                @click="timeLine"
                                icon="hos-icon-notebook-2"
                            >{{ $t("operation.timeline") }}
                            </hos-button>
                        </hos-button-group>
                    </template>
                    <template #operation="{ row }">
                        <hos-tooltip
                            class="pl5 pr5"
                            :content="$t('operation.edit')"
                            v-has-permi="{ key: 'base:sys:page-pre:edit' }"
                        >
                            <i
                                class="hos-icom-edit"
                                @click="editDialog(row)"
                            ></i>
                        </hos-tooltip>
                        <hos-tooltip
                            :content="$t('page.meta')"
                            class="pl5 pr5"
                        >
                            <i
                                class="hos-icom-add"
                                @click="addElementsTab(row)"
                            ></i>
                        </hos-tooltip>
                        <hos-tooltip
                            class="pl5 pr5"
                            :content="$t('operation.authorize.page')"
                        >
                            <i
                                class="hos-icon-s-operation"
                                @click="addOrEdit(row)"
                            ></i>
                        </hos-tooltip>
                    </template>
                </hos-biz-table>
            </div>
        </hos-main>
        <hos-biz-dialog
            :title="editDialogTitle"
            width="500px"
            uid="editDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title="editDialogTitle"
            width="1200px"
            uid="permDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('page.upload')"
            uid="uploadDialog"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('page.export')"
            uid="exportDialog"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
        <hos-biz-dialog
            :title="timeLineDialogTitle"
            width="40%"
            uid="timeLineDialog"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
    </hos-container>
</template>
<script>
export default {
    data() {
        return {
            treeData: [],
            filterText: "",
            editDialogTitle: "",
            selection: [],
            selectedIds: [],
            pageRowNames: [],
            timeLineDialogTitle: "",
            form: {
                //inline: true,
                labelWidth: "auto",
                model: {
                    code: "",
                    name: "",
                    resourceId: "",
                },
            },
            optionsShow: [
                "id",
                "permCode",
                "name",
                "type",
                "weight",
                "parentId",
                "pageCode",
                "pageName",
            ],
            options: [
                {
                    label: this.$t("page.id"),
                    value: "id",
                },
                {
                    label: this.$t("page.permCode"),
                    value: "permCode",
                },
                {
                    label: this.$t("common.name"),
                    value: "name",
                },
                {
                    label: this.$t("common.type"),
                    value: "type",
                },
                {
                    label: this.$t("page.parentId"),
                    value: "parentId",
                },
                {
                    label: this.$t("page.weight"),
                    value: "weight",
                },
                {
                    label: this.$t("page.pageCode"),
                    value: "pageCode",
                },
                {
                    label: this.$t("page.pageName"),
                    value: "pageName",
                },
            ],
            cols: [
                {
                    prop: "id",
                    type: "selection",
                    align: "center",
                    width: "50px",
                },
                {
                    prop: "code",
                    label: this.$t("common.code"),
                },
                {
                    prop: "name",
                    label: this.$t("common.name"),
                },
                {
                    prop: "createTime",
                    width: "200px",
                    label: this.$t("common.createTime"),
                },
                {
                    label: this.$t("common.isActived"),
                    width: "120px",
                    prop: ({ row }, h) => {
                        return h("hos-switch", {
                            props: {
                                "inner-label": true,
                                type: "switch",
                                value: row.actived,
                                "active-text": this.$t("common.yes"),
                                "inactive-text": this.$t("common.no"),
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
    watch: {
        // 监听树结构的过滤条件
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
    mounted() {
        this.initTree();
    },
    methods: {
        //默认加载资源树
        initTree() {
            this.$api("sys_resource.authedResource", "").then((res) => {
                if (res && res.code == 200) {
                    this.treeData = res.data;
                }
            });
        },

        // 树点击节点加载左侧表格
        clickNode(data) {
            this.form.model = {
                code: "",
                name: "",
                resourceId: "",
            };
            if (data.type == "M" || data.type == "m") {
                this.form.model = {
                    code: "",
                    name: "",
                    resourceId: data.id,
                };
                this.$store.commit("UPDATE_TABLE", { _uid: "table" });
            }
        },
        // 树检索过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //导入弹框
        uploadAllColumn() {
            // 导入组件
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/upload/index.vue").default,
                _uid: "uploadDialog",
                props: {
                    uploadUrl: "/sys/page-preset/column/import",
                    templateUrl: "/sys/page-preset/column/template",
                    afterSubmit: this.refresh,
                    data: {
                        pageId: "",
                    },
                },
            });
        },
        //上传文件成功
        exportAllColumn() {
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/export/index.vue").default,
                _uid: "exportDialog",
                props: {
                    option: this.options,
                    // 默认勾选中需要导出的列
                    default: this.optionsShow,
                    exportUrl: "/sys/page-preset/column/export",
                    data: [
                        {
                            key: "pageId",
                            value: "",
                        },
                    ],
                },
            });
        },
        timeLine() {
            if (this.selectedIds.length != 1) {
                this.$message.warning(this.$t("common.confirm.once"));
                return;
            }
            this.timeLineDialogTitle =
                this.$t("common.timeLine") + "-" + this.pageRowNames[0];
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/time-line/index.vue")
                    .default,
                _uid: "timeLineDialog",
                props: {
                    id: this.selectedIds[0],
                    tableName: "t_sys_page_preset",
                },
            });
        },
        //检索右侧的页面
        selectPage(params) {
            return this.$api("sys_page_pre.list", params);
        },

        //重置页面检索条件
        reset() {
            this.form.model = {
                code: "",
                name: "",
                resourceId: this.form.model.resourceId,
            };
            this.$store.commit("UPDATE_TABLE", { _uid: "table" });
        },

        //弹出添加窗口
        addDialog() {
            // 新增
            if (this.form.model.resourceId != "") {
                this.editDialogTitle =
                    this.$t("operation.add") + this.$t("page.title");
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./edit.vue").default,
                    _uid: "editDialog",
                    props: {
                        resourceId: this.form.model.resourceId,
                        status: "add:",
                    },
                });
            } else {
                this.$message.warning(this.$t("common.confirm.menu"));
            }
        },
        //维护预置内容权限
        addOrEdit(data) {
            this.editDialogTitle = this.$t("page.perm") + "/" + data.name;
            this.$store.commit("OPEN_DIALOG", {
                component: require("./perm.vue").default,
                _uid: "permDialog",
                props: {
                    pageId: data.id,
                    roleId: "",
                    uid: "permDialog",
                },
            });
        },
        //修改页面
        editDialog(data) {
            this.editDialogTitle =
                this.$t("operation.edit") + this.$t("page.title");
            this.$store.commit("OPEN_DIALOG", {
                component: require("./edit.vue").default,
                _uid: "editDialog",
                props: {
                    id: data.id,
                    status: "edit:",
                },
            });
        },

        //删除
        deletion() {
            if (this.selectedIds.length > 0) {
                this.$confirm(
                    this.$t("common.confirm.deleteAll"),
                    this.$t("operation.delete"),
                    {
                        type: "delete",
                    }
                )
                    .then(() => {
                        this.$api("sys_page_pre.deletion", {
                            ids: this.selectedIds.join(","),
                        }).then((res) => {
                            if (res && res.code == 200) {
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "table",
                                });
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                            } else if (res.code == "A0030") {
                                this.$message.error(res.msg);
                            } else {
                                this.$message.error(this.$t("operation.error"));
                            }
                        });
                    })
                    .catch(() => {});
            } else {
                this.$message.warning(this.$t("common.confirm.dataNull"));
            }
        },

        //更改状态
        updateActived(data) {
            this.$confirm(
                this.$t("common.confirm.actived", [
                    data.name,
                    data.actived
                        ? this.$t("common.actived.true")
                        : this.$t("common.actived.false"),
                ]),
                this.$t("login.label.info"),
                {
                    type: "warning",
                }
            )
                .then(() => {
                    this.$api("sys_page_pre.updateActived", {
                        id: data.id,
                        actived: data.actived,
                    }).then((res) => {
                        if (res && res.code == 200) {
                            this.$message.success(this.$t("operation.success"));
                        } else {
                            this.$message.error(this.$t("operation.error"));
                        }
                    });
                })
                .catch(() => {
                    data.actived = !data.actived;
                });
        },

        //打开一个新的tab页签，添加页面元素
        addElementsTab(data) {
            this.$router.push({
                path: "/base-sys-page-element",
                query: {
                    title: data.name,
                    pageId: data.id,
                    options: this.options,
                    optionsShow: this.optionsShow,
                },
            });
        },
        //打开业务日志
        bizLog() {
            this.$router.push({
                path: "/base-monitor-business-log",
                query: {
                    tableName: "t_sys_page_preset",
                    path: "/base-sys-page-pre",
                    title: this.$t("page.title"),
                },
            });
        },
        //选中的集合
        handleSelectionChange(rows) {
            this.selectedIds = rows.map((item) => item.id);
            this.pageRowNames = rows.map((item) => item.name);
        },
    },
};
</script>
