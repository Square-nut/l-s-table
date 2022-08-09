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
                    >{{ $t("operation.collapse") }}</hos-button>
                </hos-button-group>
            </div>

            <hos-tree
                ref="tree"
                node-key="id"
                :data="treeData"
                :defaultExpandFirst="false"
                :default-expand-all="false"
                @node-click="clickNode"
                :filter-node-method="filterNode"
            ></hos-tree>
        </hos-aside>
        <hos-main>
            <!-- <hos-card class="card-table" shadow="never"> -->
            <div class="h-fit">
                <hos-biz-table
                    @selection-change="handleSelectionChange"
                    :selection="selection"
                    uid="scopeTable"
                    :cols="cols"
                    :data="selectPage"
                    :form="form"
                    pagePos="top"
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
                                        @click="reset()"
                                        type="primary"
                                    >{{ $t("operation.reset") }}
                                    </hos-biz-button>
                                    <hos-button
                                        v-has-permi="{ key: 'base:perm:data-scope:log' }"
                                        @click="bizLog()"
                                        type="success"
                                        class="fr"
                                    >{{ $t("operation.bizLog") }}</hos-button>
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
                                v-has-permi="{ key: 'base:perm:data-scope:add' }"
                            >{{ $t("operation.add") }}</hos-button>
                            <hos-button
                                @click="deletion()"
                                icon="hos-icom-cancel"
                                :title="$t('operation.delete')"
                                v-has-permi="{ key: 'base:perm:data-scope:delete' }"
                            >{{ $t("operation.delete") }}</hos-button>
                            <i
                                type="cut"
                                v-has-permi="{key: ['base:perm:data-scope:add', 'base:perm:data-scope:delete']}"
                            ></i>
                            <hos-button
                                v-has-permi="{ key: 'base:perm:data-scope:lifetime' }"
                                @click="timeLine"
                                icon="hos-icom-sample-stat"
                            >{{ $t("operation.timeline") }}</hos-button>
                        </hos-button-group>
                    </template>
                    <template #operation="{ row }">
                        <hos-tooltip
                            class="pl5 pr5"
                            :content="$t('operation.edit')"
                            v-has-permi="{ key: 'base:perm:data-scope:edit' }"
                        >
                            <i
                                class="hos-icom-edit"
                                @click="editDialog(row.id)"
                            ></i>
                        </hos-tooltip>
                    </template>
                </hos-biz-table>
            </div>
            <!-- </hos-card> -->
        </hos-main>
        <hos-biz-dialog
            :title="editDialogTitle"
            width="65%"
            uid="editDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
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
            selection: [],
            selectedIds: [],
            filterText: "",
            editDialogTitle: "",
            timeLineDialogTitle: "",
            pageRowNames: [],
            form: {
                labelWidth: "auto",
                model: {
                    code: "",
                    name: "",
                    resourceId: "",
                },
            },
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
                // {
                //   prop: "visibleField",
                //   label: this.$t("datascope.visibleField"),
                // },
                {
                    prop: "router",
                    label: this.$t("datascope.router"),
                },
                {
                    label: this.$t("common.operation"),
                    width: "50px",
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
            //this.$store.getters.userInfo.roleId 获取角色
            this.$api("sys_resource.authedResource", "").then((res) => {
                if (res && res.code == 200) {
                    this.treeData = res.data;
                }
            });
        },
        //打开业务日志
        bizLog() {
            this.$router.push({
                path: "/base-monitor-business-log",
                query: {
                    tableName: "t_perm_scope_data",
                    path: "/base-perm-data-scope",
                    title: this.$t("datascope.header"),
                },
            });
        },
        // 树点击节点加载左侧表格
        clickNode(data) {
            this.form.model.resourceId = "";
            if (data.type == "M" || data.type == "m") {
                this.form.model.resourceId = data.id;
                this.$store.commit("UPDATE_TABLE", { _uid: "scopeTable" });
            }
        },
        //检索右侧的页面
        selectPage(params) {
            return this.$api("perm_data_scope.list", params);
        },
        // 树检索过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //弹出添加窗口
        addDialog() {
            // 新增
            if (this.form.model.resourceId != "") {
                this.editDialogTitle =
                    this.$t("operation.add") + this.$t("datascope.header");
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./edit.vue").default,
                    _uid: "editDialog",
                    props: {
                        resourceId: this.form.model.resourceId,
                        id: "",
                        status: "add:",
                    },
                });
            } else {
                this.$message.warning(this.$t("common.confirm.menu"));
            }
        },
        //维护数据权限
        editDialog(id) {
            this.editDialogTitle =
                this.$t("operation.edit") + this.$t("datascope.header");
            this.$store.commit("OPEN_DIALOG", {
                component: require("./edit.vue").default,
                _uid: "editDialog",
                props: {
                    id: id,
                    resourceId: this.form.model.resourceId,
                    status: "edit:",
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
                    tableName: "t_perm_scope_data",
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
                        this.$api("perm_data_scope.deletion", {
                            ids: this.selectedIds.join(","),
                        }).then((res) => {
                            if (res && res.code == 200) {
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "scopeTable",
                                });
                                this.$message.success(
                                    this.$t("operation.success")
                                );
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
        //选中的集合
        handleSelectionChange(rows) {
            this.selectedIds = rows.map((item) => item.id);
            this.pageRowNames = rows.map((item) => item.name);
        },
    },
};
</script>