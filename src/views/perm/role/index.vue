<template>
    <div class="h-fit">
        <hos-biz-table
            :selection="selection"
            uid="table"
            ref="roleTable"
            @select-all="selectAll"
            row-key="id"
            :cols="cols"
            :data="selectPage"
            :page="false"
            :form="form"
            @selection-change="changeSelection"
        >
            <!-- 检索区域 -->
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
                            <hos-biz-button run="form.search" type="primary"
                                >{{ $t("operation.query") }}
                            </hos-biz-button>
                            <hos-biz-button run="form.reset" type="primary"
                                >{{ $t("operation.reset") }}
                            </hos-biz-button>
                            <hos-button
                                @click="bizLog()"
                                class="fr"
                                type="success"
                                >{{ $t("operation.bizLog") }}
                            </hos-button>
                        </hos-form-item>
                    </hos-col>
                </hos-row>
            </template>
            <!-- 表格上方按钮 -->
            <template #toolbar>
                <hos-button-group class="hos">
                    <hos-button
                        @click="addDialog()"
                        icon="hos-icom-add"
                        v-has-permi="{ key: 'base:perm:role:add' }"
                        >{{ $t("operation.add") }}</hos-button
                    >
                    <hos-button
                        @click="deletion()"
                        icon="hos-icom-cancel"
                        v-has-permi="{ key: 'base:perm:role:delete' }"
                        >{{ $t("operation.delete") }}</hos-button
                    >
                    <i
                        type="cut"
                        v-has-permi="{
                            key: [
                                'base:perm:role:add',
                                'base:perm:role:delete',
                            ],
                        }"
                    ></i>
                    <hos-button
                        icon="hos-icom-import"
                        @click="uploadRole()"
                        v-has-permi="{ key: 'base:perm:role:upload' }"
                        >{{ $t("operation.import") }}
                    </hos-button>
                    <hos-button
                        icon="hos-icom-export"
                        @click="exportRole()"
                        v-has-permi="{ key: 'base:perm:role:export' }"
                        >{{ $t("operation.export") }}
                    </hos-button>
                    <i
                        type="cut"
                        v-has-permi="{
                            key: [
                                'base:perm:role:upload',
                                'base:perm:role:export',
                            ],
                        }"
                    ></i>
                    <hos-button
                        icon="hos-icom-sample-stat"
                        @click="timeLine()"
                        v-has-permi="{ key: 'base:perm:role:timeLine' }"
                        >{{ $t("operation.timeline") }}
                    </hos-button>
                </hos-button-group>
            </template>
            <!-- 操作列按钮 -->
            <template #operation="{ row }">
                <hos-tooltip
                    class="pl5 pr5"
                    v-if="
                        row.code != 'everyone' &&
                        row.code != 'sub-admin' &&
                        row.type != '1'
                    "
                    :content="$t('operation.edit')"
                    v-has-permi="{ key: 'base:perm:role:edit' }"
                >
                    <i class="hos-icom-edit" @click="editDialog(row)"></i>
                </hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    v-if="
                        row.code != 'everyone' &&
                        row.code != 'sub-admin' &&
                        row.type != '1'
                    "
                    :content="$t('operation.add')"
                    v-has-permi="{ key: 'base:perm:role:add' }"
                >
                    <i class="hos-icom-add" @click="addDialog(row)"></i>
                </hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    v-if="row.code != 'everyone' && row.code != 'sub-admin'"
                    :content="$t('role.assignUser')"
                    v-has-permi="{ key: 'base:perm:role:assignUser' }"
                >
                    <i class="hos-icom-trans-pat" @click="assignUser(row)"></i>
                </hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    :content="$t('tenant.auth')"
                    v-has-permi="{ key: 'base:perm:role:auth' }"
                >
                    <i class="hos-icom-stamp-pass" @click="authDialog(row)"></i>
                </hos-tooltip>
                <hos-tooltip
                    class="pl5 pr5"
                    v-if="row.code != 'everyone' && row.code != 'sub-admin'"
                    :content="$t('role.roleAttr')"
                    v-has-permi="{ key: 'base:perm:role:roleAttr' }"
                >
                    <i
                        class="hos-icom-slice-only"
                        @click="roleAttrDialog(row)"
                    ></i>
                </hos-tooltip>
            </template>
        </hos-biz-table>
        <!-- 弹框 -->
        <hos-biz-dialog
            :title="editDialogTitle"
            width="800px"
            uid="editDialog"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('operation.authorize.menu')"
            @close="closeDialog"
            :width="dialogWidth"
            uid="authDialog"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('role.roleAttr')"
            width="600px"
            uid="roleAttrDialog"
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
        <hos-biz-dialog
            :title="timeLineDialogTitle"
            width="40%"
            uid="timeLineDialog"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
    </div>
</template>
<script>
import { BASE_USER_ORG_ROLE } from "@sys/store/mutation-types";
import { params } from "@components/hos-biz/utils/store-config";
export default {
    props: [],
    components: {},
    data() {
        return {
            loading: false,
            selection: [],
            parentId: null,
            row: "",
            //角色类型
            dataScopeTypeMap: {
                1: "超管角色",
                2: "次级管理角色",
                3: "普通角色",
            },
            form: {
                //inline: true,
                labelWidth: "auto",
                model: {
                    code: "",
                    name: "",
                },
            },
            cols: [
                {
                    type: "selection",
                    align: "center",
                    width: "50",
                    //everyone不能新增
                    selectable: (row, index) => {
                        if (
                            row.code == "everyone" ||
                            row.code == "sub-admin" ||
                            row.type == "1"
                        ) {
                            return false;
                        } else {
                            return true;
                        }
                    },
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
                    prop: "type",
                    label: this.$t("common.type"),
                    formatter: (row, column, value) => {
                        return this.dataScopeTypeMap[value];
                    },
                },
                {
                    label: this.$t("common.isActived"),
                    width: "120px",
                    prop: ({ row }, h) => {
                        return h("hos-switch", {
                            props: {
                                type: "switch",
                                disabled:
                                    row.code == "everyone" || row.type == "1"
                                        ? true
                                        : false,
                                value: row.actived,
                                activeText: this.$t("common.is"),
                                inactiveText: this.$t("common.deny"),
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
                    width: "200px",
                    prop: "operation",
                    slotName: "operation",
                    /* prop: ({
							row
						}, h) => {
							// row 该行的数据 <hos-tooltip class="pl5 pr5"  content="角色规则"><i class="hos-icom-user-black" on-click={() => {this.roleRule(row);}}></i></hos-tooltip>
							return(
								row.code != 'everyone' ? (
									<div>
										 <hos-tooltip class="pl5 pr5"  content="编辑"><i class="hos-icom-edit" on-click={() => { this.editDialog(row);}}></i></hos-tooltip>
										 <hos-tooltip class="pl5 pr5"  content="新增"><i class="hos-icom-add" on-click={() => {this.addDialog(row);}}></i></hos-tooltip>
										 <hos-tooltip class="pl5 pr5"  content="分配用户"><i class="hos-icom-trans-pat" on-click={() => { this.assignUser(row);}}></i></hos-tooltip>
										 <hos-tooltip class="pl5 pr5"  content="授权"><i class="hos-icon-c-scale-to-original" on-click={() => {this.authDialog(row);}}></i></hos-tooltip>
										 <hos-tooltip class="pl5 pr5"  content="角色属性"><i class="hos-icom-slice-only" on-click={() => {this.roleAttrDialog(row);}}></i></hos-tooltip>

									</div>) : (
									 <hos-tooltip class="pl5 pr5"  content="授权">
											<i class="hos-icon-c-scale-to-original"on-click={() => {this.authDialog(row);}}></i>
										</hos-tooltip>
								)
							);
						}, */
                },
            ],
            dialogForm: {},
            dialogWidth: "400px", //弹框初始宽度
            page: {
                current: 1,
                size: 10,
                total: 0,
            },
            editDialogTitle: "", //弹框名称
            names: "", //选中数据名称
            timeLineDialogTitle: "", //生命周期弹窗名
            baseUserOrg: "",
        };
    },
    created() {},
    mounted() {
        this.$api("listConfig").then((res) => {
            if (res.code == "200") {
                res.data.forEach((item) => {
                    if (item.code == "base-user-org-role") {
                        sessionStorage.setItem(BASE_USER_ORG_ROLE, item.value);
                        this.baseUserOrg = item.value;
                    }
                });
            }
        });
    },
    methods: {
        //查询表格
        selectPage(params) {
            return this.$api("perm_role.list", params);
        },
        closeDialog() {
            this.handleWidth("400px");
        },
        //树表格形态勾选问题
        selectAll() {
            this.checkedKeys = !this.checkedKeys;
            this.splite(this.$refs.roleTable.tableData, this.checkedKeys);
        },
        splite(data, flag) {
            data.forEach((row) => {
                this.$nextTick(() => {
                    this.$refs.roleTable.$children[2].$refs[
                        "hos-table-lq"
                    ].toggleRowSelection(row, flag);
                });

                if (row.children != undefined) {
                    this.splite(row.children, flag);
                }
            });
        },
        //修改激活状态
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
                { type: "warning" }
            )
                .then(() => {
                    this.$api("perm_role.updateActived", {
                        id: row.id,
                        actived: row.actived,
                    }).then((res) => {
                        if (res && res.code == "200") {
                            this.$message.success(this.$t("operation.success"));
                        } else {
                            row.actived = !row.actived;
                            this.$message.error(this.$t("operation.error"));
                        }
                    });
                })
                .catch(() => {
                    row.actived = !row.actived;
                    //this.$message.error(this.$t("operation.error"));
                });
        },
        // 新增角色
        addDialog(row) {
            this.editDialogTitle =
                this.$t("operation.add") + this.$t("role.title");
            if (row == undefined) {
                if (this.ids != undefined) {
                    if (this.ids.length > 1) {
                        this.parentId = null;
                        this.$message.warning(
                            this.$t("role.placeholder.placeParentId")
                        );
                        return;
                    } else if (this.ids.length == 0) {
                        this.parentId = null;
                    } else {
                        this.parentId = this.ids.toString();
                    }
                }
            } else {
                this.parentId = row.id;
            }

            this.$store.commit("OPEN_DIALOG", {
                component: require("./edit.vue").default,
                _uid: "editDialog",
                props: {
                    id: "",
                    parentId: this.parentId,
                    status: "add:",
                },
            });
        },
        //修改角色
        editDialog(row) {
            this.editDialogTitle =
                this.$t("operation.edit") + this.$t("role.title");
            this.$store.commit("OPEN_DIALOG", {
                component: require("./edit.vue").default,
                _uid: "editDialog",
                props: {
                    id: row.id,
                    parentId: row.parentId,
                    status: "edit:",
                },
            });
        },
        // 数据日志页面
        bizLog() {
            // 数据日志组件
            this.$router.push({
                path: "/base-monitor-business-log",
                query: {
                    tableName: "t_perm_role",
                    path: "/base-perm-role",
                    title: this.$t("role.roleTitle"),
                },
            });
        },
        // 生命周期
        timeLine() {
            this.timeLineDialogTitle = this.$t("timeline.title") + this.names;
            if (this.ids !== undefined && this.ids.length > 0) {
                if (this.ids.length > 1) {
                    this.$message.warning(this.$t("timeline.warning"));
                    return;
                }
            } else {
                this.$message.warning(this.$t("timeline.please"));
                return;
            }
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/time-line/index.vue")
                    .default,
                _uid: "timeLineDialog",
                props: {
                    id: this.ids[0],
                    tableName: "t_perm_role",
                },
            });
        },
        //导入弹框
        uploadRole() {
            // 导入组件
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/upload/index.vue").default,
                _uid: "uploadDialog",
                props: {
                    uploadUrl: "/perm/role/upload",
                    templateUrl: "/perm/role/template",
                    afterSubmit: this.refresh,
                },
            });
        },
        // 导出弹框
        exportRole() {
            // 导出组件
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/export/index.vue").default,
                _uid: "exportDialog",
                props: {
                    // 可支持的所有导出列，可以考虑后端提供一个接口？
                    option: [
                        {
                            label: "主键id",
                            value: "id",
                        },
                        {
                            label: "角色编码",
                            value: "code",
                        },
                        {
                            label: "角色名称",
                            value: "name",
                        },
                        {
                            label: "父级角色主键",
                            value: "parentId",
                        },
                        {
                            label: "父级角色编码",
                            value: "parentCode",
                        },
                        {
                            label: "父级角色名称",
                            value: "parentName",
                        },
                        {
                            label: "角色类型",
                            value: "type",
                        },
                        {
                            label: "是否激活",
                            value: "actived",
                        },
                        {
                            label: "角色属性",
                            value: "properties",
                        },
                        {
                            label: "备注",
                            value: "remark",
                        },
                    ],
                    // 默认勾选中需要导出的列
                    default: [
                        "code",
                        "name",
                        "type",
                        "actived",
                        "parentCode",
                        "remark",
                    ],
                    // 导出角色接口地址
                    exportUrl: "/perm/role/export",
                },
            });
        },
        // 刷新表格
        refresh() {
            this.$store.commit("UPDATE_TABLE", {
                _uid: "table",
            });
        },
        //授权弹框
        authDialog(row) {
            // 编辑
            this.$store.commit("OPEN_DIALOG", {
                component: require("./auth.vue").default,
                _uid: "authDialog",
                props: {
                    id: row.id,
                    code: row.code,
                    callback: this.handleWidth,
                    status: "auth",
                },
            });
        },
        //弹框宽度的修改
        handleWidth(value) {
            this.dialogWidth = value;
        },
        //角色属性弹框
        roleAttrDialog(row) {
            // 编辑
            this.$store.commit("OPEN_DIALOG", {
                component: require("./role-attribute.vue").default,
                _uid: "roleAttrDialog",
                props: {
                    id: row.id,
                    status: "roleAttr",
                },
            });
        },
        //分配用户
        assignUser(row) {
            this.$router.push({
                path: "/base-perm-role-assign-user",
                query: {
                    roleId: row.id,
                    title: row.name,
                    type: row.type,
                },
            });
        },

        roleRule(row) {
            this.$router.push({
                path: "/base-perm-role-roleRule",
                query: {
                    roleId: row.id,
                },
            });
        },
        // 多选框选中数据
        changeSelection(selection) {
            this.ids = selection.map((item) => item.id);
            this.names = selection.map((item) => item.name);
            this.batchDeleteButtonDisabled = !selection.length;
        },
        //删除角色
        deletion() {
            if (this.ids != undefined) {
                if (this.ids.length > 0) {
                    this.$confirm(
                        this.$t("common.confirm.deleteAll"),
                        this.$t("operation.delete"),
                        { type: "delete" }
                    )
                        .then(() => {
                            this.$api("perm_role.deletion", {
                                ids: this.ids.join(","),
                            }).then((res) => {
                                if (res && res.code == "200") {
                                    this.$store.commit("UPDATE_TABLE", {
                                        _uid: "table",
                                    });
                                    this.$message.success(
                                        this.$t("operation.success")
                                    );
                                } else if (res.code == "A0006") {
                                    this.$message.error(res.msg);
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
    },
};
</script>
