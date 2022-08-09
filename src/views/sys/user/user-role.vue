<template>
    <div class="h-fit add-user">
        <hos-form
            ref="dialogForm"
            :model="dialogForm"
            :rules="rules"
            label-position="right"
            label-width="100px"
        >
            <!--			<hos-collapse v-model="activeNames">-->
            <hos-card
                class="user_card"
                :title="$t('user.basicInformation')"
                name="1"
            >
                <hos-row>
                    <hos-col
                        :span="6"
                        v-has-permi="{
                            key: status + 'base:sys:user:loginName',
                            formRule: rules,
                            elModel: 'loginName',
                        }"
                    >
                        <hos-form-item
                            :label="$t('role.loginName')"
                            prop="loginName"
                        >
                            <hos-input
                                v-model="dialogForm.loginName"
                                :disabled="
                                    $m.isDisabled(
                                        status + 'base:sys:user:loginName'
                                    )
                                "
                                clearable
                                :placeholder="
                                    $t('role.placeholder.placeLoginName')
                                "
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col
                        :span="6"
                        v-has-permi="{
                            key: status + 'base:sys:user:name',
                            formRule: rules,
                            elModel: 'name',
                        }"
                    >
                        <hos-form-item :label="$t('user.name')" prop="name">
                            <hos-input
                                v-model="dialogForm.name"
                                :disabled="
                                    $m.isDisabled(status + 'base:sys:user:name')
                                "
                                clearable
                                :placeholder="
                                    $t('user.placeholder.placeUserName')
                                "
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col
                        :span="6"
                        v-has-permi="{
                            key: status + 'base:sys:user:userType',
                            formRule: rules,
                            elModel: 'userType',
                        }"
                    >
                        <hos-form-item
                            :label="$t('user.userType')"
                            prop="userType"
                        >
                            <hos-select
                                v-model="dialogForm.userType"
                                :disabled="
                                    $m.isDisabled(
                                        status + 'base:sys:user:userType'
                                    ) && disabled
                                "
                                :placeholder="$t('role.placeholder.placeType')"
                            >
                                <hos-option
                                    v-for="(
                                        item, key, index
                                    ) in userTypeOptions"
                                    clearable
                                    :disabled="item.disabled"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                ></hos-option>
                            </hos-select>
                        </hos-form-item>
                    </hos-col>
                    <hos-col
                        :span="6"
                        v-has-permi="{
                            key: status + 'base:sys:user:weight',
                            formRule: rules,
                            elModel: 'weight',
                        }"
                    >
                        <hos-form-item
                            :label="$t('common.weight')"
                            prop="weight"
                        >
                            <hos-InputNumber
                                v-model="dialogForm.weight"
                                :min="0"
                                clearable
                                :disabled="
                                    $m.isDisabled(
                                        status + 'base:sys:user:weight'
                                    )
                                "
                            ></hos-InputNumber>
                        </hos-form-item>
                    </hos-col>
                    <hos-col
                        :span="6"
                        v-has-permi="{
                            key: status + 'base:sys:user:invalidTime',
                            formRule: rules,
                            elModel: 'invalidTime',
                        }"
                    >
                        <hos-form-item
                            :label="$t('common.inexpireTime')"
                            prop="invalidTime"
                        >
                            <hos-date-picker
                                v-model="dialogForm.invalidTime"
                                :disabled="
                                    $m.isDisabled(
                                        status + 'base:sys:user:invalidTime'
                                    )
                                "
                                clearable
                                type="date"
                                :picker-options="starttime"
                                value-format="yyyy-MM-dd"
                                :placeholder="$t('user.selectDate')"
                            >
                            </hos-date-picker>
                        </hos-form-item>
                    </hos-col>
                    <hos-col
                        :span="6"
                        v-has-permi="{
                            key: status + 'base:sys:user:inexpireTime',
                            formRule: rules,
                            elModel: 'inexpireTime',
                        }"
                    >
                        <hos-form-item
                            :label="$t('common.invalidTime')"
                            prop="inexpireTime"
                        >
                            <hos-date-picker
                                v-model="dialogForm.inexpireTime"
                                :disabled="
                                    $m.isDisabled(
                                        status + 'base:sys:user:inexpireTime'
                                    )
                                "
                                clearable
                                type="date"
                                value-format="yyyy-MM-dd"
                                :placeholder="$t('user.selectDate')"
                                :picker-options="pickerOptions"
                            >
                            </hos-date-picker>
                        </hos-form-item>
                    </hos-col>
                    <hos-col
                        :span="6"
                        v-has-permi="{
                            key: status + 'base:sys:user:actived',
                            formRule: rules,
                            elModel: 'actived',
                        }"
                    >
                        <hos-form-item
                            :label="$t('common.isActived')"
                            prop="actived"
                        >
                            <hos-switch
                                v-model="dialogForm.actived"
                                :disabled="
                                    $m.isDisabled(
                                        status + 'base:sys:user:actived'
                                    )
                                "
                                :active-text="$t('common.is')"
                                clearable
                                :inactive-text="$t('common.deny')"
                                inner-label
                            ></hos-switch>
                        </hos-form-item>
                    </hos-col>
                    <hos-col
                        :span="6"
                        v-has-permi="{
                            key: status + 'base:sys:user:nextReset',
                            formRule: rules,
                            elModel: 'nextReset',
                        }"
                    >
                        <hos-form-item label="" prop="nextReset">
                            <hos-checkbox
                                v-model="dialogForm.nextReset"
                                :disabled="
                                    $m.isDisabled(
                                        status + 'base:sys:user:nextReset'
                                    )
                                "
                                >{{ $t("user.updataPassword") }}</hos-checkbox
                            >
                        </hos-form-item>
                    </hos-col>
                    <hos-col
                        :span="24"
                        v-has-permi="{
                            key: status + 'base:sys:user:remark',
                            formRule: rules,
                            elModel: 'remark',
                        }"
                    >
                        <hos-form-item
                            :label="$t('common.remark')"
                            prop="remark"
                        >
                            <hos-input
                                type="textarea"
                                v-model="dialogForm.remark"
                                :rows="3"
                                :disabled="
                                    $m.isDisabled(
                                        status + 'base:sys:user:remark'
                                    )
                                "
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <!-- expandParams用于赋值，fields用于布局 ,permCode是tab页的权限编码，根据权限编码去找布局-->
                    <!-- 在已经定义好的tab下面，需要自己去给权限编码赋值 -->
                    <!-- 	<customField v-if="useComponent==true" :expandParams="dialogForm.expandParams"
          :permCode="'111111'" :fields="fields"
          @changeForm="changeForm"></customField> -->
                </hos-row>
            </hos-card>
            <hos-card
                class="user_card"
                :title="$t('user.JobInformation')"
                name="2"
            >
                <hos-row>
                    <hos-col :span="7">
                        <div
                            v-for="(item, index) in dialogForm.userOrgs"
                            :key="index"
                            :span="24"
                        >
                            <hos-row>
                                <hos-col
                                    :span="1"
                                    class="mained"
                                    v-has-permi="{
                                        key: status + 'base:sys:user:mained',
                                        formRule: rules,
                                        elModel: 'mained',
                                    }"
                                >
                                    <hos-form-item
                                        prop="mained"
                                        label-width="10px"
                                    >
                                        <hos-checkbox
                                            v-model="item.mained"
                                            :disabled="
                                                $m.isDisabled(
                                                    status +
                                                        'base:sys:user:mained'
                                                )
                                            "
                                            @change="
                                                checkChange(item.mained, index)
                                            "
                                        ></hos-checkbox>
                                    </hos-form-item>
                                </hos-col>
                                <hos-col
                                    :span="19"
                                    v-if="item.mained === true"
                                    v-has-permi="{
                                        key: status + 'base:sys:user:mainOrgId',
                                        formRule: rules,
                                        elModel: 'mainOrgId',
                                    }"
                                >
                                    <hos-form-item
                                        :label="$t('role.mainOrgId')"
                                        prop="orgId"
                                        label-width="70px"
                                        class="is-required treeuser2"
                                        :error="item.msgOrg"
                                    >
                                        <hos-tree-select
                                            v-model="item.orgId"
                                            :disabled="
                                                $m.isDisabled(
                                                    status +
                                                        'base:sys:user:mainOrgId'
                                                )
                                            "
                                            :appendToBody="true"
                                            zIndex="10000"
                                            @input="
                                                (value) => {
                                                    userOrgIds(value, index);
                                                }
                                            "
                                            @close="
                                                (value) => {
                                                    userOrgIds(value, index);
                                                }
                                            "
                                            clearable
                                            :flat="true"
                                            :options="userOptions"
                                            :placeholder="
                                                $t('role.placeholder.placeOrg')
                                            "
                                        ></hos-tree-select>
                                    </hos-form-item>
                                </hos-col>
                                <hos-col
                                    :span="19"
                                    v-if="item.mained === false"
                                    v-has-permi="{
                                        key: status + 'base:sys:user:orgId',
                                        formRule: rules,
                                        elModel: 'orgId',
                                    }"
                                >
                                    <hos-form-item
                                        :label="$t('role.orgId')"
                                        prop="orgId"
                                        label-width="70px"
                                        class="is-required treeuser2"
                                        :error="item.msgOrg"
                                    >
                                        <hos-tree-select
                                            v-model="item.orgId"
                                            :disabled="
                                                $m.isDisabled(
                                                    status +
                                                        'base:sys:user:orgId'
                                                )
                                            "
                                            :appendToBody="true"
                                            zIndex="10000"
                                            @input="
                                                (value) => {
                                                    userOrgIds(value, index);
                                                }
                                            "
                                            @close="
                                                (value) => {
                                                    userOrgIds(value, index);
                                                }
                                            "
                                            clearable
                                            :flat="true"
                                            :options="userOptions"
                                            :placeholder="
                                                $t('role.placeholder.placeOrg')
                                            "
                                        ></hos-tree-select>
                                    </hos-form-item>
                                </hos-col>
                                <hos-col :span="4" class="tc userrole">
                                    <i
                                        class="hos-icom-add circulate pl10"
                                        v-if="
                                            dialogForm.userOrgs.length ==
                                            index + 1
                                        "
                                        :class="{ 'add-show': isShow }"
                                        @click="insertRow(item)"
                                    ></i>
                                    <i
                                        class="hos-icom-cancel circulate"
                                        @click="delelteRow(item, index)"
                                    ></i>
                                </hos-col>
                            </hos-row>
                        </div>
                    </hos-col>
                    <hos-col :span="6">
                        <hos-form-item
                            :label="$t('role.title')"
                            label-width="50px"
                            prop="roleId"
                            class="treeuser2"
                            v-has-permi="{
                                key: status + 'base:sys:user:roleId',
                                formRule: rules,
                                elModel: 'roleId',
                            }"
                        >
                            <hos-tree-select
                                v-model="roleIds"
                                :appendToBody="true"
                                :disabled="
                                    $m.isDisabled(
                                        status + 'base:sys:user:roleId'
                                    )
                                "
                                zIndex="10000"
                                :flat="true"
                                clearable
                                :options="treeOptions"
                                :multiple="true"
                                :placeholder="$t('role.placeholder.placeRole')"
                            ></hos-tree-select>
                        </hos-form-item>
                    </hos-col>
                </hos-row>
            </hos-card>
            <hos-card
                class="user_card"
                :title="$t('user.associatedPerson')"
                name="3"
            >
                <hos-row>
                    <hos-col
                        :span="6"
                        v-has-permi="{
                            key: status + 'base:sys:user:employeeId',
                            formRule: rules,
                            elModel: 'employeeId',
                        }"
                    >
                        <hos-form-item
                            :label="$t('user.selectPerson')"
                            prop="employeeId"
                        >
                            <hos-tree-select
                                v-model="dialogForm.userEmployee.employeeId"
                                :disabled="
                                    $m.isDisabled(
                                        status + 'base:sys:user:employeeId'
                                    )
                                "
                                :appendToBody="true"
                                zIndex="10000"
                                clearable
                                :flat="true"
                                :options="treeEmployeeTree"
                                :placeholder="
                                    $t('role.placeholder.placePerson')
                                "
                            ></hos-tree-select>
                            <!-- 	<hos-input v-model="dialogForm.userEmployee.employeeId"></hos-input> -->
                        </hos-form-item>
                    </hos-col>
                </hos-row>
                <!-- 	<hos-col :span="6">
          <hos-form-item label="人员姓名:">
            <hos-input v-model="dialogForm.name"></hos-input>
          </hos-form-item>
        </hos-col> -->
            </hos-card>
            <!-- <hos-card class="user_card" v-for="item in tabGroup" :key="item.permCode" :title="item.group">
        <customField v-if="useComponent==true" :expandParams="dialogForm.expandParams" :fields="fields"
        :permCode="item.permCode" @changeForm="changeForm" @addRules="addRules"></customField>
      </hos-card> -->
            <!--			</hos-collapse>-->
        </hos-form>
        <div slot="footer" class="dialog-footer">
            <hos-button
                type="primary"
                @click="cancel"
                v-has-permi="{ key: 'base:sys:user:cancel' }"
            >
                {{ $t("operation.cancel") }}</hos-button
            >
            <hos-button
                type="success"
                @click="save"
                v-if="activeName != 'four'"
                v-has-permi="{ key: 'base:sys:user:save' }"
            >
                {{ $t("operation.save") }}</hos-button
            >
            <hos-button
                type="success"
                @click="save"
                v-if="activeName === 'four'"
                v-has-permi="{ key: 'base:sys:user:save' }"
            >
                {{ $t("user.recover") }}</hos-button
            >
        </div>
    </div>
</template>
<script>
import customField from "../../../components/customField/customField.vue";
export default {
    props: [
        "id",
        "activeName",
        "userOptions",
        "treeOptions",
        "userTypeOptions",
        "rules",
        "treeEmployeeTree",
        "status",
    ],
    components: {
        customField,
    },
    name: "userRole",
    data() {
        return {
            // 渲染组件的标志
            useComponent: false,
            // 字段的布局
            fields: [],
            // 需要新建tab的分组
            tabGroup: [],
            isShow: true,
            isValid: true,
            dialogForm: {
                loginName: "",
                name: "",
                actived: true,
                userType: "",
                nextReset: false,
                weight: 0,
                invalidTime: "",
                inexpireTime: "",
                remark: "",
                userEmployee: {
                    employeeId: null,
                    employeeCode: "",
                },
                userRoles: [],
                userOrgs: [
                    {
                        id: null,
                        userId: null,
                        msgOrg: null,
                        institutionId: null,
                        orgId: null,
                        mained: true,
                        jobId: "",
                    },
                ],
                // 自定义字段的值
                expandParams: {},
            },
            starttime: {
                disabledDate: (time) => {
                    if (this.dialogForm.inexpireTime) {
                        return (
                            time.getTime() >
                            new Date(this.dialogForm.inexpireTime).getTime()
                        );
                    }
                },
            },
            pickerOptions: {
                disabledDate: (time) => {
                    if (this.dialogForm.invalidTime) {
                        return (
                            time.getTime() <
                                new Date(
                                    this.dialogForm.invalidTime
                                ).getTime() || time.getTime() < Date.now()
                        );
                    } else {
                        // 不能大于当前日期
                        return time.getTime() < Date.now();
                    }
                },
            },
            roleIds: [],
            mained: true,
            /* pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      }, */
            activeNames: ["1", "2", "3"],
        };
    },
    created() {
        /* this.disabledNode(this.userOptions,"ins"),
    this.disabledNode1(this.treeEmployeeTree,"employee") */
        // 先查询布局，才能渲染数据
        this.$api("sys_expand.getEntityPosition", {
            tableClass: "com.mediway.hos.base.sys.model.entity.User",
        }).then((res) => {
            if (res && res.code == 200) {
                this.fields = res.data;
                this.useComponent = true;
                // 把已经存在的tab给过滤
                this.tabGroup = this.tabGrouping(this.fields, []);
                console.log(this.tabGroup);
            }
        });
        //禁选usable为false
        for (let i = 0; i < this.userTypeOptions.length; i++) {
            if (this.userTypeOptions[i].usable === true) {
                this.userTypeOptions[i].disabled = false;
            } else {
                this.userTypeOptions[i].disabled = true;
            }
        }
    },
    mounted() {
        this.$emit("disabledNode", this.userOptions, "ins");
        this.$emit("disabledNode1", this.treeEmployeeTree, "employee");
        this.$emit("disabledNode2", this.treeOptions, false);
        this.initData();
    },
    methods: {
        //判断部门不能为空
        userOrgIds(item, index) {
            this.isShow = true;
            this.isValid = true;
            // 当前对象
            const currentOrgRoles = this.dialogForm.userOrgs[index];
            if (!currentOrgRoles.orgId) {
                currentOrgRoles.msgOrg = null;
                this.isValid = true;
            } else {
                currentOrgRoles.msgOrg = null;
                this.isShow = false;
                this.isValid = true;
                this.dialogForm.userOrgs.forEach((userOrgRole, i) => {
                    if (i !== index) {
                        if (userOrgRole.orgId == currentOrgRoles.orgId) {
                            this.isShow = true;
                            currentOrgRoles.msgOrg = this.$t(
                                "role.rule.org.orgEquals"
                            );
                            userOrgRole.msgOrg = this.$t(
                                "role.rule.org.orgEquals"
                            );
                            this.isValid = false;
                        } else {
                            userOrgRole.msgOrg = null;
                            this.isValid = true;
                        }
                    }
                });
            }
        },
        // 对tab的分组
        tabGrouping(fields, permCodeArr) {
            var [...arr] = fields;
            for (var i = 0; i < fields.length; i++) {
                if (permCodeArr.includes(fields[i].permCode)) {
                    arr.splice(i, 1);
                }
            }
            return arr;
        },
        changeForm(data) {
            // 把数据修改，如果为空就赋值，给expandParams赋值
            this.dialogForm.expandParams = data;
            console.log(data);
        },
        // 添加表单校验规则
        addRules(data) {
            this.rules = Object.assign(
                JSON.stringify(this.rules),
                JSON.stringify(data)
            );
        },
        //初始化数据
        initData() {
            if (this.id) {
                this.$api("sys_user.selectById", this.id).then((res) => {
                    if (res && res.code == "200") {
                        this.dialogForm = res.data;
                        //如果用户部门为空，则初始化赋值
                        if (this.dialogForm.userOrgs.length == 0) {
                            this.dialogForm.userOrgs = [
                                {
                                    orgId: null,
                                    msgOrg: null,
                                    mained: true,
                                },
                            ];
                        }
                        //如果用户人员为空，则初始化赋值
                        if (this.dialogForm.userEmployee == null) {
                            this.dialogForm.userEmployee = {
                                employeeId: null,
                                employeeCode: "",
                            };
                        }
                        this.roleIds = this.dialogForm.userRoles.map(
                            (item) => item.roleId
                        );
                    }
                });
            }
        },
        //部门只能勾选一个的处理
        checkChange(item, index) {
            if (item) {
                if (
                    this.dialogForm.userOrgs &&
                    this.dialogForm.userOrgs.length > 0
                ) {
                    this.dialogForm.userOrgs.forEach((userOrg, i) => {
                        if (index == i) {
                            this.dialogForm.userOrgs[i].mained = item;
                        } else {
                            this.dialogForm.userOrgs[i].mained = !item;
                        }
                    });
                }
            }
        },
        //添加兼职部门
        insertRow(item) {
            this.isShow = true;
            let isTrue = 1;
            for (let i = 0; i < this.dialogForm.userOrgs.length; i++) {
                for (let j = 0; j < this.dialogForm.userOrgs.length; j++) {
                    if (i != j) {
                        if (
                            this.dialogForm.userOrgs[i].orgId ==
                            this.dialogForm.userOrgs[j].orgId
                        ) {
                            isTrue = 0;
                            this.dialogForm.userOrgs[i].msgOrg = this.$t(
                                "role.rule.org.orgEqual"
                            );
                            //this.dialogForm.userOrgs[i].msgRole= this.$t("role.rule.org.orgEqual");
                            //this.$message.error(this.$t("user.rule.userType.msgAdd"));
                            this.isShow = true;
                        } else {
                            this.dialogForm.userOrgs[i].msgOrg = null;
                            //this.dialogForm.userOrgs[i].msgRole= null;
                        }
                    }
                }
            }
            if (item.orgId != null && item.orgId != undefined && isTrue != 0) {
                let obj = {
                    id: null,
                    userId: null,
                    institutionId: null,
                    orgId: null,
                    msgOrg: null,
                    mained: false,
                    jobId: "",
                };
                this.dialogForm.userOrgs.push(obj);
            } else {
                //this.$message.error(this.$t("user.rule.userType.msgAdd"));
                this.isShow = true;
            }
        }, //删除行
        delelteRow(item, index) {
            if (this.dialogForm.userOrgs.length <= 1) {
                item.orgId = null;
                return;
            }
            this.dialogForm.userOrgs.splice(index, 1);
            //this.isShow=false
            for (let i = 0; i < this.dialogForm.userOrgs.length; i++) {
                this.dialogForm.userOrgs[i].msgOrg = null;
                this.isShow = false;
            }
        },
        save(form) {
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    for (var i = 0; i < this.dialogForm.userOrgs.length; i++) {
                        this.userOrgIds(i, i);
                        /* if(this.dialogForm.userOrgs[i].msgOrg!=null){
								isValid = false;
								} */
                    }
                    if (this.isValid == true) {
                        //库中的角色ids
                        let oldRoleIds = this.dialogForm.userRoles.map(
                            (item) => item.roleId
                        );
                        //过滤需要删除的角色id
                        this.dialogForm.userRoles =
                            this.dialogForm.userRoles.filter((item) =>
                                this.roleIds.includes(item.roleId)
                            );
                        //需要新增的角色数据
                        let addUserRoles = this.roleIds.filter(
                            (item) => !oldRoleIds.includes(item)
                        );
                        addUserRoles.forEach((item) => {
                            let obj = {
                                id: null,
                                roleId: item,
                                userId: null,
                            };
                            this.dialogForm.userRoles.push(obj);
                        });
                        this.loading = true;
                        if (this.activeName == "four") {
                            this.$api(
                                "sys_user.recoverUser",
                                this.dialogForm
                            ).then((res) => {
                                if (res && res.code == "200") {
                                    this.$message.success(
                                        this.$t("operation.success")
                                    );
                                    this.cancel();
                                    this.$emit("handleClick");
                                } else {
                                    this.$message.error(
                                        this.$t("operation.error")
                                    );
                                }
                            });
                        } else {
                            this.$api(
                                this.id ? "sys_user.update" : "sys_user.insert",
                                this.dialogForm
                            ).then((res) => {
                                this.loading = false;
                                if (res && res.code == "200") {
                                    this.$message.success(
                                        this.$t("operation.success")
                                    );
                                    this.cancel();
                                    this.$emit("handleClick");
                                } else {
                                    this.$message.error(
                                        this.$t("operation.error")
                                    );
                                }
                            });
                        }
                    }
                }
            });
        },
        //取消按钮
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "addUserDialog",
            });
            this.loading = false;
        },
    },
};
</script>
