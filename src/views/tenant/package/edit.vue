<template>
    <div :loading="loading">
        <hos-form
            ref="packageDialogForm"
            :model="packageDialogForm"
            :inline="false"
            :rules="rules"
            label-width="auto"
        >
            <hos-row>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:package:code',
                        formRule: rules,
                        elModel: 'code',
                    }"
                >
                    <hos-form-item
                        :label="$t('common.code')"
                        prop="code"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.code')"
                            :disabled="$m.isDisabled(status + 'base:tenant:package:code')"
                            v-model="packageDialogForm.code"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:package:name',
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
                            :disabled="$m.isDisabled(status + 'base:tenant:package:name')"
                            v-model="packageDialogForm.name"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:package:actived',
                        formRule: rules,
                        elModel: 'actived',
                    }"
                >
                    <hos-form-item
                        :label="$t('common.isActived')"
                        prop="actived"
                    >
                        <hos-switch
                            :disabled="$m.isDisabled(status + 'base:tenant:package:actived')"
                            v-model="packageDialogForm.actived"
                            :active-text="$t('common.actived.activedTrue')"
                            :inactive-text="$t('common.actived.activedFalse')"
                            inner-label
                        ></hos-switch>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{
                        key: status + 'base:tenant:package:remark',
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
                            :disabled="$m.isDisabled(status + 'base:tenant:package:remark')"
                            v-model="packageDialogForm.remark"
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
                v-has-permi="{ key: 'base:tenant:package:cancel' }"
                @click="cancel()"
                type="primary"
            >{{ $t("operation.cancel") }}</hos-button>
            <hos-button
                v-has-permi="{ key: 'base:tenant:package:save' }"
                type="success"
                @click="save()"
                :loading="loading"
            >{{ $t("operation.save") }}</hos-button>
        </div>
    </div>
</template>

<script>
import { validNoZh } from "@sys/utils/validateUtil.js";
export default {
    props: ["id", "status"],
    data() {
        var activedCheck = (rule, value, callback) => {
            if (this.id && value == false) {
                this.$api("tenant_package.validPackageUsed", {
                    ids: this.id,
                }).then((res) => {
                    if (res && res.code == 200 && res.data == true) {
                        callback();
                    } else {
                        callback(
                            new Error(this.$t("tenant.tipMessage.packageIsUse"))
                        );
                    }
                });
            } else {
                callback();
            }
        };
        var codeCheck = (rule, value, callback) => {
            if (value && value != "") {
                const result = validNoZh(value);
                if (result == true) {
                    this.$api("tenant_package.validCode", {
                        id: this.id ? this.id : "",
                        code: value,
                    }).then((res) => {
                        if (res && res.code == 200 && res.data == true) {
                            callback();
                        } else {
                            callback(
                                new Error(this.$t("tenant.rules.doubleCode"))
                            );
                        }
                    });
                } else {
                    callback(new Error(this.$t("common.rule.code.noZh")));
                }
            } else {
                callback(new Error(this.$t("tenant.rules.code")));
            }
        };
        return {
            loading: false,
            packageDialogForm: {},
            rules: {
                code: [
                    { required: true, trigger: "blur", validator: codeCheck },
                ],
                name: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value.length < 37) {
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
                actived: [
                    {
                        required: true,
                        trigger: "change",
                        validator: activedCheck,
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
        };
    },
    mounted() {
        // 新增和编辑的弹窗初始化
        if (this.id) {
            this.$api("tenant_package.getById", this.id).then((res) => {
                if (res) {
                    this.packageDialogForm = res.data;
                }
            });
        } else {
            this.packageDialogForm = {
                actived: true,
            };
        }
    },
    methods: {
        // 保存修改
        save() {
            this.$refs.packageDialogForm.validate((valid) => {
                if (valid) {
                    this.loading = false;
                    const obj = JSON.parse(
                        JSON.stringify(this.packageDialogForm)
                    );
                    console.log(obj);
                    if (this.id) {
                        this.$api("tenant_package.update", obj).then((res) => {
                            this.loading = false;
                            if (res) {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.$store.commit("CLOSE_DIALOG", {
                                    _uid: "packageEditDialog",
                                });
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "packageTable",
                                });
                            } else {
                                this.$message.error(this.$t("operation.error"));
                            }
                        });
                    } else {
                        this.$api("tenant_package.insert", obj).then((res) => {
                            if (res && res.code == 200) {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.$store.commit("CLOSE_DIALOG", {
                                    _uid: "packageAddDialog",
                                });
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "packageTable",
                                });
                            } else {
                                this.$message.error(this.$t("operation.error"));
                            }
                        });
                    }
                }
            });
        },
        cancel() {
            if (this.id) {
                this.$store.commit("CLOSE_DIALOG", {
                    _uid: "packageEditDialog",
                });
            } else {
                this.$store.commit("CLOSE_DIALOG", {
                    _uid: "packageAddDialog",
                });
            }
            this.loading = false;
        },
    },
};
</script>
