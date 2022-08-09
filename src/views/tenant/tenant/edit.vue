<template>
    <div
        :loading="loading"
        class="h-fit"
    >
        <hos-form
            ref="tenantDialogForm"
            :model="tenantDialogForm"
            :inline="false"
            :rules="rules"
            label-width="auto"
        >
            <hos-row>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:tenant:name',
                        formRule: rules,
                        elModel: 'name',
                    }"
                >
                    <hos-form-item
                        :label="$t('common.name')"
                        prop="name"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.name')"
                            :disabled="$m.isDisabled(status + 'base:tenant:tenant:name')"
                            v-model="tenantDialogForm.name"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:tenant:packageId',
                        formRule: rules,
                        elModel: 'packageId',
                    }"
                >
                    <hos-form-item
                        :label="$t('tenant.package')"
                        prop="packageId"
                    >
                        <hos-tree-select
                            :disabled="$m.isDisabled(status + 'base:tenant:tenant:packageId')"
                            v-model="tenantDialogForm.packageId"
                            :options="tenantTreeData"
                            :normalizer="normalizer"
                            :placeholder="$t('tenant.placeholder.packageId')"
                        >
                        </hos-tree-select>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:tenant:linkman',
                        formRule: rules,
                        elModel: 'linkman',
                    }"
                >
                    <hos-form-item
                        :label="$t('tenant.linkman')"
                        prop="linkman"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.linkman')"
                            :disabled="$m.isDisabled(status + 'base:tenant:tenant:linkman')"
                            v-model="tenantDialogForm.linkman"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:tenant:address',
                        formRule: rules,
                        elModel: 'address',
                    }"
                >
                    <hos-form-item
                        :label="$t('tenant.address')"
                        prop="address"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.address')"
                            :disabled="$m.isDisabled(status + 'base:tenant:tenant:address')"
                            v-model="tenantDialogForm.address"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:tenant:contactNumber',
                        formRule: rules,
                        elModel: 'contactNumber',
                    }"
                >
                    <hos-form-item
                        :label="$t('tenant.contactNumber')"
                        prop="contactNumber"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.contactNumber')"
                            :disabled="$m.isDisabled(status + 'base:tenant:tenant:contactNumber')"
                            v-model="tenantDialogForm.contactNumber"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:tenant:expireTime',
                        formRule: rules,
                        elModel: 'expireTime',
                    }"
                >
                    <hos-form-item
                        :label="$t('tenant.expireTime')"
                        prop="expireTime"
                    >
                        <hos-date-picker
                            :picker-options="pickerOptions"
                            :disabled="$m.isDisabled(status + 'base:tenant:tenant:expireTime')"
                            :placeholder="$t('tenant.placeholder.time')"
                            v-model="tenantDialogForm.expireTime"
                            class="w-fit"
                        ></hos-date-picker>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:tenant:domain',
                        formRule: rules,
                        elModel: 'domain',
                    }"
                >
                    <hos-form-item
                        :label="$t('tenant.domain')"
                        prop="domain"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.domain')"
                            :disabled="$m.isDisabled(status + 'base:tenant:tenant:domain')"
                            v-model="tenantDialogForm.domain"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:tenant:actived',
                        formRule: rules,
                        elModel: 'actived',
                    }"
                >
                    <hos-form-item
                        :label="$t('common.isActived')"
                        prop="actived"
                    >
                        <hos-switch
                            :disabled="$m.isDisabled(status + 'base:tenant:tenant:actived')"
                            v-model="tenantDialogForm.actived"
                            active-text="是"
                            inactive-text="否"
                            inner-label
                        ></hos-switch>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{
                        key: status + 'base:tenant:tenant:remark',
                        formRule: rules,
                        elModel: 'remark',
                    }"
                >
                    <hos-form-item
                        :label="$t('common.remark')"
                        prop="remark"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.remark')"
                            :disabled="$m.isDisabled(status + 'base:tenant:tenant:remark')"
                            v-model="tenantDialogForm.remark"
                            type="textarea"
                            rows="3"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
            </hos-row>
        </hos-form>
        <div
            slot="footer"
            class="dialog-footer"
        >
            <hos-button
                @click="cancel()"
                type="primary"
            >{{
        $t("operation.cancel")
      }}</hos-button>
            <hos-button
                @click="save()"
                type="success"
            >{{
        $t("operation.save")
      }}</hos-button>
        </div>
    </div>
</template>
<script>
import {
    validPhone,
    validTelPhone,
    validDoMain,
} from "@sys/utils/validateUtil.js";
export default {
    props: ["id", "status"],
    data() {
        var domainCheck = (rule, value, callback) => {
            if (value && value !== "") {
                const result = validDoMain(value);
                if (result == true) {
                    callback();
                } else {
                    callback(new Error(this.$t("tenant.tipMessage.domain")));
                }
            } else {
                callback();
            }
        };
        return {
            // 传给初始化数据接口的id
            tenantId: "",
            Updated: false,
            tenantTreeData: [],
            tenantDialogForm: {},
            loading: false,
            rules: {
                name: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value.length <= 37) {
                                    callback();
                                } else {
                                    callback(
                                        new Error(
                                            this.$t("common.rule.name.length")
                                        )
                                    );
                                }
                            } else {
                                callback(
                                    new Error(
                                        this.$t("common.rule.name.required")
                                    )
                                );
                            }
                        },
                    },
                ],
                packageId: [
                    {
                        required: true,
                        message: this.$t("tenant.rules.packageId"),
                    },
                ],
                domain: [
                    { required: true, trigger: "blur", validator: domainCheck },
                ],
                linkman: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value.indexOf(" ") < 0) {
                                    if (value.length <= 20) {
                                        callback();
                                    } else {
                                        callback(
                                            new Error(
                                                this.$t(
                                                    "tenant.rules.linkman.length"
                                                )
                                            )
                                        );
                                    }
                                } else {
                                    callback(
                                        new Error(
                                            this.$t(
                                                "tenant.rules.linkman.noSpace"
                                            )
                                        )
                                    );
                                }
                            } else {
                                callback(
                                    new Error(
                                        this.$t("tenant.rules.linkman.required")
                                    )
                                );
                            }
                        },
                    },
                ],
                address: [
                    {
                        required: false,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value.length <= 60) {
                                    callback();
                                } else {
                                    callback(
                                        new Error(
                                            this.$t("tenant.rules.address")
                                        )
                                    );
                                }
                            } else {
                                callback();
                            }
                        },
                    },
                ],
                contactNumber: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                let result = validPhone(value);
                                let result1 = validTelPhone(value);
                                if (result == true || result1 == true) {
                                    const obj = {
                                        id: this.id ? this.id : "",
                                        tel: value,
                                    };
                                    this.$api(
                                        "tenant_tenant.validPhone",
                                        obj
                                    ).then((res) => {
                                        if (
                                            res &&
                                            res.code == 200 &&
                                            res.data == true
                                        ) {
                                            callback();
                                        } else {
                                            callback(
                                                new Error(
                                                    this.$t(
                                                        "tenant.tipMessage.doublePhone"
                                                    )
                                                )
                                            );
                                        }
                                    });
                                } else {
                                    callback(
                                        new Error(
                                            this.$t("tenant.tipMessage.phone")
                                        )
                                    );
                                }
                            } else {
                                callback(
                                    new Error(
                                        this.$t("tenant.tipMessage.nullPhone")
                                    )
                                );
                            }
                        },
                    },
                ],
                remark: [
                    {
                        required: false,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value.length <= 1000) {
                                    callback();
                                } else {
                                    callback(
                                        new Error(
                                            this.$t("common.rule.remark.length")
                                        )
                                    );
                                }
                            } else {
                                callback();
                            }
                        },
                    },
                ],
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                },
            },
            normalizer(node) {
                return {
                    id: node.value,
                };
            },
        };
    },
    created() {
        // 初始化表单
        if (this.id) {
            this.$api("tenant_tenant.getById", this.id).then((res) => {
                if (res && res.code == 200) {
                    console.log(res.data);
                    this.tenantId = res.data.tenantId;
                    this.tenantDialogForm = res.data;
                }
            });
        } else {
            this.tenantDialogForm = {
                actived: true,
            };
        }
        // 表单的租户包选择从接口获取
        this.$api("tenant_package.packageTreeData").then((res) => {
            if (res && res.code == 200) {
                this.tenantTreeData = res.data;
                if (this.id == null && res.data[0]) {
                    // 新增时默认选中一个租户包
                    this.tenantDialogForm.packageId = res.data[0].value;
                }
            } else {
                this.$message.error(this.$t("tenant.tipMessage.package"));
            }
        });
    },
    mounted() {},
    methods: {
        save() {
            this.$refs.tenantDialogForm.validate((valid) => {
                if (valid) {
                    this.loading = false;
                    const obj = JSON.parse(
                        JSON.stringify(this.tenantDialogForm)
                    );
                    console.log(obj);
                    if (this.id) {
                        this.$api("tenant_tenant.update", obj).then((res) => {
                            if (res && res.code == 200) {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.$store.commit("CLOSE_DIALOG", {
                                    _uid: "tenantEditDialog",
                                });
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "tenantTable",
                                });
                            } else {
                                this.$message.error(this.$t("operation.error"));
                            }
                        });
                    } else {
                        // 新增实体
                        if (this.Updated == true) {
                            // 已经新增的实体，再次保存为编辑
                            this.$api("tenant_tenant.update", obj).then(
                                (res) => {
                                    if (res && res.code == 200) {
                                        this.$message.success(
                                            this.$t("operation.success")
                                        );
                                        this.$store.commit("UPDATE_TABLE", {
                                            _uid: "tenantTable",
                                        });
                                        this.$store.commit("CLOSE_DIALOG", {
                                            _uid: "tenantAddDialog",
                                        });
                                    } else {
                                        this.$message.error(
                                            this.$t("operation.error")
                                        );
                                    }
                                }
                            );
                        } else {
                            this.$api("tenant_tenant.insert", obj).then(
                                (res) => {
                                    if (res && res.code == 200) {
                                        // 置编辑状态
                                        this.Updated = true;
                                        this.tenantId = res.data;
                                        this.$message.success(
                                            this.$t("operation.success")
                                        );
                                        this.$store.commit("UPDATE_TABLE", {
                                            _uid: "tenantTable",
                                        });
                                        this.$store.commit("CLOSE_DIALOG", {
                                            _uid: "tenantAddDialog",
                                        });
                                    } else {
                                        this.$message.error(
                                            this.$t("operation.error")
                                        );
                                    }
                                }
                            );
                        }
                    }
                }
            });
        },
        cancel() {
            if (this.id) {
                this.$store.commit("CLOSE_DIALOG", {
                    _uid: "tenantEditDialog",
                });
            } else {
                this.$store.commit("CLOSE_DIALOG", { _uid: "tenantAddDialog" });
            }
            this.loading = false;
        },
    },
};
</script>
