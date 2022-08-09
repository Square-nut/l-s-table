<template>
    <div class="h-fit">
        <div v-if="baseUserOrg == '2'" class="h-fit">
            <hos-biz-table
                :selection="selection"
                uid="table1"
                row-key="id"
                :cols="cols"
                :data="selectPage"
                :form="form"
                pagePos="top"
                @selection-change="changeSelection"
            >
                <!-- 检索区域 -->
                <template #form>
                    <hos-row :gutter="20">
                        <hos-col :span="6">
                            <hos-form-item :label="$t('role.loginName')">
                                <hos-input
                                    v-model="form.model.loginName"
                                    clearable
                                    :placeholder="
                                        $t('role.placeholder.placeLoginName')
                                    "
                                ></hos-input>
                            </hos-form-item>
                        </hos-col>
                        <hos-col :span="6">
                            <hos-form-item :label="$t('user.name')">
                                <hos-input
                                    v-model="form.model.name"
                                    clearable
                                    :placeholder="$t('common.placeholder.name')"
                                ></hos-input>
                            </hos-form-item>
                        </hos-col>
                        <hos-col :span="6">
                            <hos-form-item :label="$t('role.orgId')">
                                <hos-tree-select
                                    v-model="form.model.orgId"
                                    clearable
                                    :options="treeData"
                                    :placeholder="
                                        $t('role.placeholder.placeRole')
                                    "
                                ></hos-tree-select>
                            </hos-form-item>
                        </hos-col>
                        <hos-col :span="6">
                            <hos-form-item label-width="20px">
                                <hos-biz-button
                                    run="form.search"
                                    type="primary"
                                    >{{ $t("operation.query") }}</hos-biz-button
                                >
                                <hos-biz-button
                                    run="form.reset"
                                    type="primary"
                                    >{{ $t("operation.reset") }}</hos-biz-button
                                >
                                <hos-button
                                    run="form.search"
                                    type="success"
                                    @click="closeUser()"
                                    >{{ $t("operation.close") }}</hos-button
                                >
                            </hos-form-item>
                        </hos-col>
                    </hos-row>
                </template>
                <!-- 表格上方按钮 -->
                <template #toolbar>
                    <hos-button-group class="hos">
                        <hos-button
                            @click="deletion()"
                            icon="hos-icom-cancel"
                            v-has-permi="{ key: 'base:perm:role:assignDel' }"
                            >{{ $t("operation.delete") }}</hos-button
                        >
                        <!-- <hos-divider direction="vertical"></hos-divider> -->
                        <hos-button
                            @click="addDialog()"
                            icon="hos-icom-user-black"
                            v-has-permi="{ key: 'base:perm:role:assignAdd' }"
                            >{{ $t("role.addUser") }}</hos-button
                        >
                        <i type="cut"></i>
                        <hos-button
                            icon="hos-icom-import"
                            @click="uploadRoleUser()"
                            v-has-permi="{ key: 'base:perm:role:assignImport' }"
                            >{{ $t("operation.import") }}</hos-button
                        >
                        <hos-button
                            icon="hos-icom-export"
                            @click="exportRoleUser()"
                            v-has-permi="{ key: 'base:perm:role:assignExport' }"
                            >{{ $t("operation.export") }}</hos-button
                        >
                    </hos-button-group>
                </template>
                <!-- 操作列按钮 -->
                <template #operation="{ row }">
                    <hos-tooltip
                        class="pl5 pr5"
                        :content="$t('operation.edit')"
                        v-has-permi="{ key: 'base:perm:role:assignEdit' }"
                    >
                        <i class="hos-icom-edit" @click="editDialog(row)"></i>
                    </hos-tooltip>
                    <!-- v-if="row.isMain!=true" -->
                    <hos-tooltip
                        class="pl5 pr5"
                        :content="$t('operation.delete')"
                        v-has-permi="{ key: 'base:perm:role:assignDel' }"
                    >
                        <i class="hos-icom-cancel" @click="deleteRow(row)"></i>
                    </hos-tooltip>
                </template>
            </hos-biz-table>
            <!-- 弹框 -->
            <hos-biz-dialog
                :title="editDialogTitle"
                width="400px"
                uid="addDialog"
                :close-on-click-modal="false"
            ></hos-biz-dialog>
            <hos-biz-dialog
                :title="editDialogTitle"
                width="50%"
                uid="editDialog"
                :close-on-click-modal="false"
            ></hos-biz-dialog>
            <hos-biz-dialog
                :title="$t('role.import')"
                uid="uploadDialog"
                :close-on-click-modal="false"
            ></hos-biz-dialog>
            <hos-biz-dialog
                :title="$t('role.export')"
                uid="exportDialog"
                width="40%"
                :close-on-click-modal="false"
            ></hos-biz-dialog>
        </div>
        <div v-if="baseUserOrg == '3'" class="h-fit">
            <assignUserRole></assignUserRole>
        </div>
        <div v-if="baseUserOrg == '1'" class="h-fit">
            <assignRole></assignRole>
        </div>
    </div>
</template>
<script>
import { params } from "@components/hos-biz/utils/store-config";
import { BASE_USER_ORG_ROLE } from "@sys/store/mutation-types";
import assignUserRole from "./assign-user-role.vue";
import assignRole from "./assign-role.vue";
export default {
    props: ["roleId", "type"],
    components: {
        assignUserRole,
        assignRole,
    },
    inject: ["closeCurrent"],
    data() {
        return {
            loading: false,
            selection: [],
            form: {
                labelWidth: "auto",
                model: {
                    loginName: "",
                    name: "",
                    roleId: "",
                    orgId: null,
                },
            },
            cols: [
                {
                    type: "selection",
                    align: "center",
                    width: "50",
                },
                {
                    label: this.$t("role.loginName"),
                    prop: "loginName",
                },
                {
                    label: this.$t("user.name"),
                    prop: "name",
                },
                {
                    label: this.$t("role.orgId"),
                    prop: "orgName",
                },
                {
                    label: this.$t("role.isMain"),
                    prop: "isMainDesc",
                },
                {
                    label: this.$t("common.inexpireTime"),
                    prop: "invalidTime",
                },
                {
                    label: this.$t("common.invalidTime"),
                    prop: "inexpireTime",
                },
                {
                    label: this.$t("common.operation"),
                    width: "80px",
                    prop: "operation",
                    slotName: "operation",
                    /* prop: ({
							row
						}, h) => {
							// row 该行的数据
							return(
								<div>
									 <hos-tooltip class="pl5 pr5"  content="编辑"><i class="hos-icom-edit" on-click={ () => {this.editDialog(row)} }></i></hos-tooltip>
									 <hos-tooltip class="pl5 pr5"  content="删除" v-has-permi="{key:'base:sys:config:delete'}"><i class="hos-icom-cancel" on-click={ () => {this.delete(row)} }></i></hos-tooltip>
								</div>
							)
						} */
                },
            ],
            dialogForm: {},
            page: {
                current: 1,
                size: 10,
                total: 0,
            },
            editDialogTitle: "", //弹框名称
            treeData: [],
            baseUserOrg: "",
            rowRoleId: "",
            roletype: "",
        };
    },
    created() {
        this.initData();
    },
    mounted() {
        this.rowRoleId = this.$route.query.roleId;
        this.roletype = this.$route.query.type;
        this.$api("listConfig").then((res) => {
            if (res.code == "200") {
                res.data.forEach((item) => {
                    if (item.code == "base-user-org-role") {
                        sessionStorage.setItem(BASE_USER_ORG_ROLE, item.value);
                        this.baseUserOrg = item.value;
                        //角色和用户除了123的关系默认显示2
                        if (
                            this.baseUserOrg != "1" &&
                            this.baseUserOrg != "2" &&
                            this.baseUserOrg != "3"
                        ) {
                            this.baseUserOrg = "2";
                        }
                        //超级管理角色，组织部门没有关系
                        if (this.roletype == "1") {
                            this.baseUserOrg = "1";
                        }
                    }
                });
            }
        });
    },
    methods: {
        //查询表格
        selectPage(params) {
            params.roleId = this.rowRoleId;
            return this.$api("perm_role.assignUserList", params);
        },
        //获取部门树
        initData() {
            this.$api("sys_org_ins.orgtree", "").then((res) => {
                if (res && res.code == "200") {
                    this.treeData = res.data;
                }
            });
        },
        // 新增
        addDialog() {
            this.editDialogTitle = this.$t("role.addUser");
            this.$store.commit("OPEN_DIALOG", {
                component: require("./assign-user-add.vue").default,
                _uid: "addDialog",
                props: {
                    roleId: this.rowRoleId,
                    type: this.roletype,
                },
            });
        },
        //修改页面
        editDialog(row) {
            //判断是否有关联
            this.editDialogTitle = this.$t("role.editUserRole");
            this.$store.commit("OPEN_DIALOG", {
                component: require("./assign-user-edit.vue").default,
                _uid: "editDialog",
                props: {
                    id: row.id,
                    status: "edit",
                },
            });
        },
        //返回角色页面
        closeUser() {
            this.$router.push({
                path: "/base-perm-role",
            });
            this.closeCurrent();
        },
        // 多选框选中数据
        changeSelection(selection) {
            this.ids = selection.map((item) => item.id);
            this.names = selection.map((item) => item.name);
            this.batchDeleteButtonDisabled = !selection.length;
        },
        //批量删除
        deletion() {
            if (this.ids != undefined) {
                if (this.ids.length > 0) {
                    this.$confirm(
                        this.$t("common.confirm.deleteAll"),
                        this.$t("operation.delete"),
                        { type: "delete" }
                    )
                        .then(() => {
                            this.$api("perm_role.deletionAssignUser", {
                                ids: this.ids.join(","),
                            }).then((res) => {
                                if (res && res.code == "200") {
                                    this.$store.commit("UPDATE_TABLE", {
                                        _uid: "table1",
                                    });
                                    this.$message.success(
                                        this.$t("operation.success")
                                    );
                                } else {
                                    this.$message.error(
                                        this.$t("operation.error")
                                    );
                                }
                            });
                        })
                        .catch(() => {
                            //this.$message.error(this.$t("operation.error"));
                        });
                } else {
                    this.$message.warning(this.$t("common.confirm.dataNull"));
                }
            } else {
                this.$message.warning(this.$t("common.confirm.dataNull"));
            }
        },
        //单个删除
        deleteRow(row) {
            this.$confirm(
                this.$t("common.confirm.delete", [row.name]),
                this.$t("operation.delete"),
                { type: "delete" }
            ).then(() => {
                if (row) {
                    this.$api("perm_role.deletionAssignUser", {
                        ids: row.id,
                    }).then((res) => {
                        if (res && res.code == "200") {
                            this.$message.success(this.$t("operation.success"));
                            this.$store.commit("UPDATE_TABLE", {
                                _uid: "table1",
                            });
                        } else {
                            this.$message.error(this.$t("operation.error"));
                        }
                    });
                }
            });
        },
        //导入弹框
        uploadRoleUser() {
            // 导入组件
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/upload/index.vue").default,
                _uid: "uploadDialog",
                props: {
                    uploadUrl: "/perm/role/user-role-upload",
                    templateUrl: "/perm/role/user-role-template",
                    afterSubmit: this.refresh,
                    data: {
                        roleId: this.rowRoleId,
                    },
                },
            });
        },
        // 导出弹框
        exportRoleUser() {
            // 导出组件
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/export/index.vue").default,
                _uid: "exportDialog",
                props: {
                    // 可支持的所有导出列，可以考虑后端提供一个接口？
                    option: [
                        /* {
							"label": "主键id",
							"value": "id",
						}, */ {
                            label: "登录名",
                            value: "loginName",
                        },
                        {
                            label: "名称",
                            value: "name",
                        },
                        {
                            label: "部门",
                            value: "orgName",
                        },
                        {
                            label: "生效时间",
                            value: "invalidTime",
                        },
                        {
                            label: "失效时间",
                            value: "inexpireTime",
                        },
                    ],
                    // 默认勾选中需要导出的列
                    default: [
                        "loginName",
                        "name",
                        "orgName",
                        "invalidTime",
                        "inexpireTime",
                    ],
                    // 导出角色接口地址
                    exportUrl: "/perm/role/user-role-export",
                    data: [
                        {
                            key: "ids",
                            value: this.rowRoleId,
                        },
                    ],
                },
            });
        },
    },
};
</script>
