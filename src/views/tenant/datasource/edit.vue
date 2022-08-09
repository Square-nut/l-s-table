<template>
    <div :loading="loading">
        <hos-form
            ref="datasourceDialogForm"
            :model="datasourceDialogForm"
            :inline="false"
            :rules="rules"
            label-position="right"
            label-width="auto"
        >
            <hos-row>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:datasource:name',
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
                            clearable
                            :disabled="$m.isDisabled(status + 'base:tenant:datasource:name')"
                            v-model="datasourceDialogForm.name"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:datasource:driverClass',
                        formRule: rules,
                        elModel: 'driverClass',
                    }"
                >
                    <hos-form-item
                        :label="$t('datasource.driverClass')"
                        prop="driverClass"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.driverClass')"
                            clearable
                            :disabled="$m.isDisabled(status + 'base:tenant:datasource:driverClass')"
                            v-model="datasourceDialogForm.driverClass"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:datasource:username',
                        formRule: rules,
                        elModel: 'username',
                    }"
                >
                    <hos-form-item
                        :label="$t('datasource.username')"
                        prop="username"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.username')"
                            clearable
                            auto-complete="new-password"
                            :disabled="$m.isDisabled(status + 'base:tenant:datasource:username')"
                            v-model="datasourceDialogForm.username"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:tenant:datasource:password',
                        formRule: rules,
                        elModel: 'password',
                    }"
                >
                    <hos-form-item
                        :label="$t('datasource.password')"
                        prop="password"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.password')"
                            clearable
                            auto-complete="new-password"
                            type="password"
                            show-password
                            :disabled="$m.isDisabled(status + 'base:tenant:datasource:password')"
                            v-model="datasourceDialogForm.password"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{
                        key: status + 'base:tenant:datasource:url',
                        formRule: rules,
                        elModel: 'url',
                    }"
                >
                    <hos-form-item
                        :label="$t('datasource.url')"
                        prop="url"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.url')"
                            clearable
                            :disabled="$m.isDisabled(status + 'base:tenant:datasource:url')"
                            v-model="datasourceDialogForm.url"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{
                        key: status + 'base:tenant:datasource:remark',
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
                            clearable
                            :disabled="$m.isDisabled(status + 'base:tenant:datasource:remark')"
                            v-model="datasourceDialogForm.remark"
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
                v-has-permi="{ key: status + 'base:tenant:datasource:cancel' }"
                @click="cancel"
                type="primary"
            >{{ $t("operation.cancel") }}</hos-button>
            <hos-button
                v-has-permi="{ key: status + 'base:tenant:datasource:save' }"
                type="success"
                @click="save"
            >{{ $t("operation.save") }}</hos-button>
        </div>
    </div>
</template>
<script>
export default {
    props: ["id", "status"],
    data() {
        var domainCheck = (rule, value, callback) => {
            if (value && value !== "") {
                this.$api("datasource_datasource.validator", {
                    domain: value,
                }).then((res) => {
                    callback();
                });
            } else {
                callback(new Error(this.$t("datasource.rules.domain")));
            }
        };

        return {
            datasourceTreeData: [],
            datasourceDialogForm: {},
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
                                    new Error(this.$t("datasource.rules.name"))
                                );
                            }
                        },
                    },
                ],
                driverClass: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value.length <= 50) {
                                    callback();
                                } else {
                                    callback(
                                        new Error(
                                            this.$t(
                                                "datasource.rules.tipMessage.driverClass"
                                            )
                                        )
                                    );
                                }
                            } else {
                                callback(
                                    new Error(
                                        this.$t("datasource.rules.driverClass")
                                    )
                                );
                            }
                        },
                    },
                ],
                url: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value.length < 256) {
                                    callback();
                                } else {
                                    callback(
                                        new Error(
                                            this.$t(
                                                "datasource.rules.url.length"
                                            )
                                        )
                                    );
                                }
                            } else {
                                callback(
                                    new Error(
                                        this.$t("datasource.rules.url.required")
                                    )
                                );
                            }
                        },
                    },
                ],
                username: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value.length <= 50) {
                                    callback();
                                } else {
                                    callback(
                                        new Error(
                                            this.$t(
                                                "datasource.rules.tipMessage.username"
                                            )
                                        )
                                    );
                                }
                            } else {
                                callback(
                                    new Error(
                                        this.$t("datasource.rules.username")
                                    )
                                );
                            }
                        },
                    },
                ],
                password: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value.length <= 50) {
                                    callback();
                                } else {
                                    callback(
                                        new Error(
                                            this.$t(
                                                "datasource.rules.tipMessage.password"
                                            )
                                        )
                                    );
                                }
                            } else {
                                callback(
                                    new Error(
                                        this.$t("datasource.rules.password")
                                    )
                                );
                            }
                        },
                    },
                ],
            },
        };
    },
    created() {
        // 表单的数据源包选择从接口获取
    },
    mounted() {
        // 初始化表单
        if (this.id) {
            this.$api("tenant_datasource.getById", this.id).then((res) => {
                if (res) {
                    this.datasourceDialogForm = res.data;
                }
            });
        } else {
            this.datasourceDialogForm = {};
        }
    },
    methods: {
        save() {
            this.$refs.datasourceDialogForm.validate((valid) => {
                if (valid) {
                    this.loading = false;
                    const obj = JSON.parse(
                        JSON.stringify(this.datasourceDialogForm)
                    );
                    if (this.id) {
                        this.$api("tenant_datasource.update", obj).then(
                            (res) => {
                                this.loading = false;
                                if (res && res.code == 200) {
                                    this.$message.success(
                                        this.$t("operation.success")
                                    );
                                    this.$store.commit("CLOSE_DIALOG", {
                                        _uid: "datasourceEditDialog",
                                    });
                                    this.$store.commit("UPDATE_TABLE", {
                                        _uid: "datasourceTable",
                                    });
                                } else {
                                    this.$message.error(
                                        this.$t("common.tipMessage." + res.code)
                                    );
                                }
                            }
                        );
                    } else {
                        // 新增实体
                        this.$api("tenant_datasource.insert", obj).then(
                            (res) => {
                                if (res && res.code == 200) {
                                    this.$message.success(
                                        this.$t("operation.success")
                                    );
                                    this.$store.commit("CLOSE_DIALOG", {
                                        _uid: "datasourceAddDialog",
                                    });
                                    this.$store.commit("UPDATE_TABLE", {
                                        _uid: "datasourceTable",
                                    });
                                } else {
                                    this.$message.error(
                                        this.$t("common.tipMessage." + res.code)
                                    );
                                }
                            }
                        );
                    }
                }
            });
        },
        cancel() {
            if (this.id) {
                this.$store.commit("CLOSE_DIALOG", {
                    _uid: "datasourceEditDialog",
                });
            } else {
                this.$store.commit("CLOSE_DIALOG", {
                    _uid: "datasourceAddDialog",
                });
            }
            this.loading = false;
        },
    },
};
</script>