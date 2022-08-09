<template>
    <div :loading="loading" class="assignuser">
        <hos-form
            ref="dialogForm"
            :model="dialogForm"
            :rules="rules"
            label-width="auto"
            label-position="right"
        >
            <hos-row>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:role:loginName',
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
                            clearable
                            :disabled="true"
                            :placeholder="$t('role.placeholder.placeLoginName')"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:role:name',
                        formRule: rules,
                        elModel: 'name',
                    }"
                >
                    <hos-form-item
                        label-width="80px"
                        :label="$t('user.name')"
                        prop="name"
                    >
                        <hos-input
                            v-model="dialogForm.name"
                            :disabled="true"
                            clearable
                            :placeholder="$t('common.placeholder.name')"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <!-- <hos-col :span="12">
					<hos-form-item :label="$t('common.type')" prop="type">
						<hos-select v-model="dialogForm.type" placeholder="请选择">
							<hos-option v-for="(item,index) in dataScopeTypeMap" clearable :key="index" :label="item.label" :value="item.value"></hos-option>
						</hos-select>
					</hos-form-item>
				</hos-col> -->
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:role:orgId',
                        formRule: rules,
                        elModel: 'orgId',
                    }"
                >
                    <hos-form-item :label="$t('role.orgId')" prop="orgId">
                        <hos-tree-select
                            v-model="dialogForm.orgId"
                            :disabled="true"
                            clearable
                            :options="treeData"
                            @input="clickTree()"
                            :placeholder="$t('role.placeholder.placeRole')"
                        ></hos-tree-select>
                    </hos-form-item>
                </hos-col>
                <hos-col :span="12">
                    <hos-form-item>
                        <div>&nbsp</div>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:role:inexpireTime',
                        formRule: rules,
                        elModel: 'inexpireTime',
                    }"
                >
                    <hos-form-item
                        :label="$t('common.inexpireTime')"
                        prop="invalidTime"
                    >
                        <hos-date-picker
                            v-model="dialogForm.invalidTime"
                            class="datapicker"
                            :disabled="
                                $m.isDisabled(
                                    status + 'base:perm:role:invalidTime'
                                )
                            "
                            clearable
                            type="date"
                            :picker-options="starttime"
                            value-format="yyyy-MM-dd"
                            :placeholder="
                                $t('common.placeholder.pleaseInexpireTime')
                            "
                        ></hos-date-picker>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:role:invalidTime',
                        formRule: rules,
                        elModel: 'invalidTime',
                    }"
                >
                    <hos-form-item
                        label-width="80px"
                        :label="$t('common.invalidTime')"
                        prop="inexpireTime"
                    >
                        <hos-date-picker
                            v-model="dialogForm.inexpireTime"
                            class="datapicker"
                            :disabled="
                                $m.isDisabled(
                                    status + 'base:perm:role:inexpireTime'
                                )
                            "
                            clearable
                            type="date"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions"
                            :placeholder="
                                $t('common.placeholder.pleaseInvalidTime')
                            "
                        ></hos-date-picker>
                    </hos-form-item>
                </hos-col>
            </hos-row>
        </hos-form>
        <div slot="footer" class="dialog-footer">
            <hos-button
                type="primary"
                @click="cancel"
                v-has-permi="{ key: 'base:perm:role:assignCancel' }"
                >{{ $t("operation.cancel") }}</hos-button
            >
            <hos-button
                type="success"
                @click="save"
                v-has-permi="{ key: 'base:perm:role:assignSave' }"
                >{{ $t("operation.save") }}</hos-button
            >
        </div>
    </div>
</template>
<script>
export default {
    props: ["id", "status"],
    components: {},
    data() {
        return {
            dialogForm: {
                orgId: null,
                type: 3,
            },
            loading: false,
            treeData: [],
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
                    }
                    /* else {
						// 不能大于当前日期
						//return time.getTime() > Date.now()
					}  */
                },
            },
            //角色类型
            dataScopeTypeMap: [
                {
                    value: 1,
                    label: "超管角色",
                },
                {
                    value: 2,
                    label: "次级管理角色",
                },
                {
                    value: 3,
                    label: "普通角色",
                },
            ],
            rules: {},
        };
    },
    created() {
        this.getConfig();
    },
    mounted() {},
    methods: {
        // 初始化数据
        getConfig() {
            this.$api("sys_org_ins.orgtree", "").then((res) => {
                if (res && res.code == "200") {
                    this.treeData = res.data;
                }
            });
            if (this.id) {
                this.$api("perm_role.selectUserById", this.id).then((res) => {
                    if (res && res.code == "200") {
                        this.dialogForm = res.data;
                    }
                });
            }
        },
        clickTree(data) {
            this.orgId = data.id;
        },
        // 保存dialog
        save() {
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let obj = {
                        id: this.id,
                        userId: this.id,
                        orgId: this.orgId,
                        invalidTime: this.dialogForm.invalidTime,
                        inexpireTime: this.dialogForm.inexpireTime,
                    };
                    this.$api("perm_role.updateUser", this.dialogForm).then(
                        (res) => {
                            if (res && res.code == "200") {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.cancel();
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "table1",
                                });
                            } else {
                                this.$message.error(this.$t("operation.error"));
                            }
                        }
                    );
                }
            });
        },

        //取消按钮
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "editDialog",
            });
            this.loading = false;
        },
    },
};
</script>