<template>
    <div class="h-fit add-user">
        <hos-form
            ref="dialogForm"
            :model="dialogForm"
            :rules="rules"
            label-position="right"
            label-width="100px"
        >
            <!--			<hos-collapse v-model="activeNames" class="userPverflow">-->
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
                                clearable
                                :placeholder="$t('role.placeholder.placeType')"
                            >
                                <hos-option
                                    v-for="(
                                        item, key, index
                                    ) in userTypeOptions"
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
                                        status + 'base:sys:user:invalidTime'
                                    )
                                "
                                learable
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
                                :inactive-text="$t('common.deny')"
                                inner-label
                            >
                            </hos-switch>
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
                </hos-row>
            </hos-card>
            <hos-card
                class="user_card"
                :title="$t('user.JobInformation')"
                name="2"
            >
                <div
                    v-for="(item, index) in dialogForm.userOrgRoles"
                    :key="index"
                    :span="23"
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
                            <hos-form-item prop="mained" label-width="10px">
                                <hos-checkbox
                                    v-model="item.mained"
                                    :disabled="
                                        $m.isDisabled(
                                            status + 'base:sys:user:mained'
                                        )
                                    "
                                    @change="checkChange(item.mained, index)"
                                ></hos-checkbox>
                            </hos-form-item>
                        </hos-col>
                        <hos-col
                            :span="6"
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
                                class="is-required treeuser2"
                                :error="item.msgOrg"
                                label-width="70px"
                            >
                                <hos-tree-select
                                    v-model="item.orgId"
                                    :disabled="
                                        $m.isDisabled(
                                            status + 'base:sys:user:mainOrgId'
                                        )
                                    "
                                    :appendToBody="true"
                                    zIndex="10000"
                                    clearable
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
                                    :flat="true"
                                    :options="userOptions"
                                    :placeholder="
                                        $t('role.placeholder.placeOrg')
                                    "
                                ></hos-tree-select>
                            </hos-form-item>
                        </hos-col>
                        <hos-col
                            :span="6"
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
                                class="is-required treeuser2"
                                :error="item.msgOrg"
                                label-width="70px"
                            >
                                <hos-tree-select
                                    v-model="item.orgId"
                                    :disabled="
                                        $m.isDisabled(
                                            status + 'base:sys:user:orgId'
                                        )
                                    "
                                    :appendToBody="true"
                                    zIndex="10000"
                                    clearable
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
                                    :flat="true"
                                    :options="userOptions"
                                    :placeholder="
                                        $t('role.placeholder.placeOrg')
                                    "
                                ></hos-tree-select>
                            </hos-form-item>
                        </hos-col>
                        <hos-col
                            :span="6"
                            v-has-permi="{
                                key: status + 'base:sys:user:roleId',
                                formRule: rules,
                                elModel: 'roleId',
                            }"
                        >
                            <hos-form-item
                                :label="$t('role.title')"
                                prop="roleId"
                                class="is-required treeuser2"
                                label-width="70px"
                                :error="item.msgRole"
                            >
                                <hos-tree-select
                                    v-model="item.roleId"
                                    :disabled="
                                        $m.isDisabled(
                                            status + 'base:sys:user:roleId'
                                        )
                                    "
                                    :appendToBody="true"
                                    :flat="true"
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
                                    :options="treeOptions"
                                    clearable
                                    :placeholder="
                                        $t('role.placeholder.placeRole')
                                    "
                                ></hos-tree-select>
                            </hos-form-item>
                        </hos-col>
                        <hos-col :span="1" class="tc ml30">
                            <i
                                class="hos-icom-add circulate pl10"
                                v-if="
                                    dialogForm.userOrgRoles.length == index + 1
                                "
                                @click="insertRow(item)"
                                :class="{ 'add-show': isShow }"
                            ></i>
                            <i
                                class="hos-icom-cancel circulate"
                                @click="delelteRow(item, index)"
                            ></i>
                        </hos-col>
                    </hos-row>
                </div>
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
            </hos-card>
            <!--			</hos-collapse>-->
        </hos-form>
        <div slot="footer" class="dialog-footer">
            <hos-button
                type="primary"
                @click="cancel"
                v-has-permi="{ key: 'base:sys:user:cancel' }"
                >{{ $t("operation.cancel") }}</hos-button
            >
            <hos-button
                type="success"
                @click="save(dialogForm)"
                v-if="activeName != 'four'"
                v-has-permi="{ key: 'base:sys:user:save' }"
            >
                {{ $t("operation.save") }}</hos-button
            >
            <hos-button
                type="success"
                @click="save(dialogForm)"
                v-if="activeName === 'four'"
                v-has-permi="{ key: 'base:sys:user:save' }"
            >
                {{ $t("user.recover") }}</hos-button
            >
        </div>
    </div>
</template>

<script>
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
    name: "userRoleNo",
    data() {
        return {
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
                userOrgRoles: [
                    {
                        invalidTime: "",
                        orgId: null,
                        roleId: null,
                        inexpireTime: "",
                        mained: true,
                        msgRole: null,
                        msgOrg: null,
                        jobId: "",
                        userOrgId: null,
                        userRoleId: null,
                        institutionId: "",
                    },
                ],
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
                        // ????????????????????????
                        return time.getTime() < Date.now();
                    }
                },
            },
            roleIds: [],
            isShow: true,
            isValid: true,
            /* pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      }, */
            activeNames: ["1", "2", "3"],
            baseUserOrg: "",
            newData: "",
            orgData: "",
            /* msg:null, */
        };
    },
    created() {
        this.$emit("disabledNode", this.userOptions, "ins");
        this.$emit("disabledNode1", this.treeEmployeeTree, "employee");
        this.$emit("disabledNode2", this.treeOptions, false);
        this.initData();
        //??????usable???false
        for (let i = 0; i < this.userTypeOptions.length; i++) {
            if (this.userTypeOptions[i].usable === true) {
                this.userTypeOptions[i].disabled = false;
            } else {
                this.userTypeOptions[i].disabled = true;
            }
        }
    },
    mounted() {},
    methods: {
        //????????????????????????
        userOrgIds(item, index) {
            this.isShow = true;
            this.isValid = true;
            // ????????????
            const currentOrgRoles = this.dialogForm.userOrgRoles[index];
            if (!currentOrgRoles.roleId && !currentOrgRoles.orgId) {
                // ???????????? ??? ????????????; ??????????????????
                currentOrgRoles.msgOrg = null;
                currentOrgRoles.msgRole = null;
                this.isValid = true;
            } else if (currentOrgRoles.orgId && !currentOrgRoles.roleId) {
                // ??????????????? ??? ????????????; ?????? ??????????????????
                currentOrgRoles.msgRole = this.$t("role.rule.org.orgNull");
                this.isValid = false;
            } else if (!currentOrgRoles.orgId && currentOrgRoles.roleId) {
                // ???????????? ??? ??????????????? ?????? ??????????????????
                currentOrgRoles.msgOrg = this.$t("role.rule.org.roleNull");
                this.isValid = false;
            } else {
                // ?????????????????? ?????????????????????????????????
                currentOrgRoles.msgOrg = null;
                currentOrgRoles.msgRole = null;
                this.isShow = false;
                this.isValid = true;
                this.dialogForm.userOrgRoles.forEach((userOrgRole, i) => {
                    if (i !== index) {
                        if (
                            userOrgRole.roleId == currentOrgRoles.roleId &&
                            userOrgRole.orgId == currentOrgRoles.orgId
                        ) {
                            this.isShow = true;
                            currentOrgRoles.msgOrg = this.$t(
                                "role.rule.org.orgEqual"
                            );
                            currentOrgRoles.msgRole = this.$t(
                                "role.rule.org.orgEqual"
                            );
                            userOrgRole.msgOrg = this.$t(
                                "role.rule.org.orgEqual"
                            );
                            userOrgRole.msgRole = this.$t(
                                "role.rule.org.orgEqual"
                            );
                            this.isValid = false;
                        } else {
                            userOrgRole.msgOrg = null;
                            userOrgRole.msgRole = null;
                            this.isValid = true;
                        }
                    }
                });
            }
        },
        //???????????????
        initData() {
            if (this.id) {
                this.$api("sys_user.selectById", this.id).then((res) => {
                    if (res && res.code == "200") {
                        this.dialogForm = res.data;
                        //?????????????????????????????????????????????
                        if (this.dialogForm.userOrgRoles == null) {
                            this.dialogForm.userOrgRoles = [
                                {
                                    orgId: null,
                                    roleId: null,
                                    msgRole: null,
                                    msgOrg: null,
                                    mained: true,
                                    inexpireTime: "",
                                    invalidTime: "",
                                },
                            ];
                        }
                        //?????????????????????????????????????????????
                        if (this.dialogForm.userEmployee == null) {
                            this.dialogForm.userEmployee = {
                                employeeId: null,
                                employeeCode: "",
                            };
                        }
                    }
                });
            }
        },
        //?????????????????????????????????
        checkChange(item, index) {
            if (item) {
                if (
                    this.dialogForm.userOrgRoles &&
                    this.dialogForm.userOrgRoles.length > 0
                ) {
                    this.dialogForm.userOrgRoles.forEach((userOrg, i) => {
                        if (index == i) {
                            this.dialogForm.userOrgRoles[i].mained = item;
                        } else {
                            this.dialogForm.userOrgRoles[i].mained = !item;
                        }
                    });
                }
            }
        },
        //??????????????????
        insertRow(item, index) {
            this.isShow = true;
            let isTrue = 1;
            for (let i = 0; i < this.dialogForm.userOrgRoles.length; i++) {
                for (let j = 0; j < this.dialogForm.userOrgRoles.length; j++) {
                    if (i != j) {
                        if (
                            this.dialogForm.userOrgRoles[i].roleId ==
                                this.dialogForm.userOrgRoles[j].roleId &&
                            this.dialogForm.userOrgRoles[i].orgId ==
                                this.dialogForm.userOrgRoles[j].orgId
                        ) {
                            isTrue = 0;
                            this.dialogForm.userOrgRoles[i].msgOrg = this.$t(
                                "role.rule.org.orgEqual"
                            );
                            this.dialogForm.userOrgRoles[i].msgRole = this.$t(
                                "role.rule.org.orgEqual"
                            );
                            //this.$message.error(this.$t("user.rule.userType.msgAdd"));
                            this.isShow = true;
                        } else {
                            this.dialogForm.userOrgRoles[i].msgOrg = null;
                            this.dialogForm.userOrgRoles[i].msgRole = null;
                        }
                    }
                }
            }
            /* return isTrue; */
            if (
                item.orgId != null &&
                item.orgId != undefined &&
                item.roleId != null &&
                item.roleId != undefined &&
                isTrue != 0
            ) {
                let obj = {
                    invalidTime: "",
                    orgId: null,
                    roleId: null,
                    inexpireTime: "",
                    mained: false,
                    msgRole: null,
                    msgOrg: null,
                    jobId: "",
                    userOrgId: null,
                    userRoleId: null,
                    institutionId: "",
                };
                this.dialogForm.userOrgRoles.push(obj);
            } else {
                this.isShow = true;
                //this.$message.error(this.$t("user.rule.userType.msgAdd"));
            }
        },
        //?????????
        delelteRow(item, index) {
            if (this.dialogForm.userOrgRoles.length <= 1) {
                item.orgId = null;
                item.roleId = null;
                return;
            }
            this.dialogForm.userOrgRoles.splice(index, 1);
            for (let i = 0; i < this.dialogForm.userOrgRoles.length; i++) {
                this.dialogForm.userOrgRoles[i].msgOrg = null;
                this.dialogForm.userOrgRoles[i].msgRole = null;
                this.isShow = false;
            }
        },
        save(form) {
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    // ???????????????????????????????????????????????????
                    for (
                        var i = 0;
                        i < this.dialogForm.userOrgRoles.length;
                        i++
                    ) {
                        this.userOrgIds(i, i);
                        /* 	if(this.dialogForm.userOrgRoles[i].msgOrg!=null||this.dialogForm.userOrgRoles[i].msgRole!=null){
								isValid = false;
							} */
                    }
                    if (this.isValid == true) {
                        this.flag = false;
                        for (var i = 0; i < form.userOrgRoles.length; i++) {
                            if (form.userOrgRoles[i].mained == true) {
                                this.flag = true;
                            }
                        }
                        if (this.flag == false) {
                            this.$message.warning(
                                this.$t("user.placeholder.isMainOrgNall")
                            );
                        } else {
                            if (form.id != "") {
                                this.dialogForm.userOrgRoles.userOrgId =
                                    form.userOrgRoles.userOrgId;
                                this.dialogForm.userOrgRoles.userRoleId =
                                    form.userOrgRoles.userRoleId;
                            } else {
                                this.dialogForm.userOrgRoles.userOrgId = null;
                                this.dialogForm.userOrgRoles.userRoleId = null;
                            }
                            this.dialogForm.userOrgRoles = form.userOrgRoles;
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
                                        this.cancel(),
                                            this.$emit("handleClick");
                                    } else {
                                        this.$message.error(
                                            this.$t("operation.error")
                                        );
                                    }
                                });
                            } else {
                                this.$api(
                                    this.id
                                        ? "sys_user.update"
                                        : "sys_user.insert",
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
                }
            });
        },
        //????????????
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "addUserDialog",
            });
            this.loading = false;
        },
    },
};
</script>
