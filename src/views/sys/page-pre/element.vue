<template>
    <!-- <hos-card class="card-table" shadow="never"> -->
    <div class="h-fit">
        <hos-biz-table
            @selection-change="handleSelectionChange"
            :selection="selection"
            uid="table"
            :cols="cols"
            :data="selectPage"
            :form="form"
            pagePos="top"
            :page="false"
            :default-expand-all="false"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <template #form>
                <hos-row :gutter="20">
                    <hos-col :span="6">
                        <hos-form-item :label="$t('common.code')">
                            <hos-input
                                v-model="form.model.permCode"
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
                    <hos-col :span="6">
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
                                @click="closeTab()"
                                type="success"
                            >{{ $t("operation.close") }}
                            </hos-button>
                        </hos-form-item>
                    </hos-col>
                </hos-row>
            </template>
            <template #toolbar>
                <hos-button-group class="hos">
                    <hos-button
                        @click="addDialog()"
                        icon="hos-icon-circle-plus-outline"
                        :title="$t('operation.add')"
                        v-has-permi="{ key: 'base:sys:page-pre-element:add' }"
                    >{{ $t("operation.add") }}
                    </hos-button>
                    <hos-button
                        @click="deletion(null)"
                        icon="hos-icom-cancel"
                        :title="$t('operation.delete')"
                        v-has-permi="{ key: 'base:sys:page-pre-element:delete' }"
                    >
                        {{ $t("operation.delete") }}
                    </hos-button>
                    <i
                        type="cut"
                        v-has-permi="{key: ['base:sys:page-pre-element:add', 'base:sys:page-pre-element:delete']}"
                    ></i>
                    <hos-button
                        icon="hos-icom-import"
                        v-has-permi="{ key: 'base:sys:page-pre-element:upload' }"
                        @click="uploadColumn()"
                    >{{ $t("operation.import") }}
                    </hos-button>
                    <hos-button
                        icon="hos-icom-export"
                        v-has-permi="{ key: 'base:sys:page-pre-element:export' }"
                        @click="exportColumn()"
                    >{{ $t("operation.export") }}
                    </hos-button>
                </hos-button-group>
            </template>
            <template #operation="{ row }">
                <hos-tooltip
                    class="pl5 pr5"
                    v-if="row.propelled"
                    :content="$t('operation.delete')"
                    v-has-permi="{ key: 'base:sys:page-pre-element:elementDel' }"
                >
                    <i
                        class="hos-icom-cancel"
                        @click="deletion(row)"
                    ></i>
                </hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    v-if="!row.propelled"
                    :content="$t('operation.edit')"
                    v-has-permi="{ key: 'base:sys:page-pre-element:edit' }"
                >
                    <i
                        class="hos-icom-edit"
                        @click="editDialog(row)"
                    ></i>
                </hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    v-if="!row.propelled"
                    :content="$t('operation.delete')"
                    v-has-permi="{ key: 'base:sys:page-pre-element:elementDel' }"
                >
                    <i
                        class="hos-icom-cancel"
                        @click="deletion(row)"
                    ></i>
                </hos-tooltip>
            </template>
        </hos-biz-table>
        <hos-biz-dialog
            :title="editDialogTitle"
            width="500px"
            uid="editDialog"
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
    </div>
    <!-- </hos-card> -->
</template>
<script>
import loader from "@sys/axios/loader";
import { typeCollection } from "../../../enum/permCollectionEnum";
export default {
    inject: ["closeCurrent"],
    mixins: [typeCollection],
    data() {
        return {
            optionsShow: [],
            options: [],
            editDialogTitle: "",
            selection: [],
            selectedIds: [],
            importUrl: "",
            loading: false,

            form: {
                //inline: true,
                labelWidth: "auto",
                model: {
                    permCode: "",
                    name: "",
                    pageId: "",
                },
            },
            pageId: "",
            id: "",
            cols: [
                {
                    prop: "id",
                    type: "selection",
                    align: "center",
                    width: "50px",
                },
                {
                    prop: "name",
                    label: this.$t("common.name"),
                },
                {
                    prop: "type",
                    label: this.$t("common.type"),
                    formatter: (row, column, value) => {
                        return this.typeCollection[value];
                    },
                },
                {
                    prop: "permCode",
                    label: this.$t("page.permCode"),
                },
                {
                    prop: "weight",
                    label: this.$t("page.weight"),
                    width: "80px",
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
    watch() {},
    mounted() {
        this.pageId = this.$route.query.pageId;
        this.optionsShow = this.$route.query.optionsShow;
        this.options = this.$route.query.options;
        this.form.model.pageId = this.$route.query.pageId;
        //找到实际路径，将实际路径拼成上传路径
        //let urlMap=loader("sys_page_pre.columnImport")
        //this.importUrl=urlMap.config.baseURL+"sys/page-preset/column/import/"+this.pageId
    },
    methods: {
        //检索右侧的页面
        selectPage(params) {
            return this.$api("sys_page_pre.columnList", params);
        },

        //弹出添加窗口
        addDialog() {
            // 新增
            if (this.pageId != "") {
                this.editDialogTitle =
                    this.$t("operation.add") + this.$t("page.meta");
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./element-edit.vue").default,
                    _uid: "editDialog",
                    props: {
                        pageId: this.pageId,
                        status: "add:",
                        type: this.typeCollection,
                    },
                });
            } else {
                this.$message.success(this.$t("common.confirm.menu"));
            }
        },

        //修改页面
        editDialog(data) {
            this.editDialogTitle =
                this.$t("operation.edit") + this.$t("page.meta");
            this.$store.commit("OPEN_DIALOG", {
                component: require("./element-edit.vue").default,
                _uid: "editDialog",
                props: {
                    id: data.id,
                    pageId: this.pageId,
                    type: this.typeCollection,
                    status: "edit:",
                },
            });
        },

        //删除
        deletion(row) {
            if (this.selectedIds.length > 0 || row) {
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
                    let obj = {};
                    if (row) {
                        obj = {
                            ids: row.id,
                        };
                    } else {
                        obj = {
                            ids: this.selectedIds.join(","),
                        };
                    }
                    this.$api("sys_page_pre.columnDeletion", obj).then(
                        (res) => {
                            if (res && res.code == 200) {
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "table",
                                });
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                            } else if (res.code == "A0006") {
                                this.$message.error(res.msg);
                            } else {
                                this.$message.error(this.$t("operation.error"));
                            }
                        }
                    );
                });
            } else {
                this.$message.warning(this.$t("common.confirm.dataNull"));
            }
        },
        //关闭tab页签
        closeTab() {
            //todo
            this.$router.push({
                path: "/base-sys-page-pre",
            });
            this.closeCurrent();
        },

        //选中的集合
        handleSelectionChange(rows) {
            this.selectedIds = rows.map((item) => item.id);
        },
        //上传文件成功
        exportColumn() {
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
                            value: this.pageId,
                        },
                    ],
                },
            });
        },
        //导入弹框
        uploadColumn() {
            // 导入组件
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/upload/index.vue").default,
                _uid: "uploadDialog",
                props: {
                    uploadUrl: "/sys/page-preset/column/import",
                    templateUrl: "/sys/page-preset/column/template",
                    afterSubmit: this.refresh,
                    data: {
                        pageId: this.pageId,
                    },
                },
            });
        },
        // 刷新表格
        refresh() {
            this.$store.commit("UPDATE_TABLE", { _uid: "table" });
        },
        //导出页面元素
        columnExport() {
            let urlMap = loader("sys_page_pre.columnExport");
            let param = "";
            for (var key in this.form.model) {
                param += "&" + key + "=" + this.form.model[key];
            }
            let url =
                urlMap.config.baseURL +
                "sys/page-preset/column/export?" +
                param;
            window.open(url);
        },
    },
};
</script>
