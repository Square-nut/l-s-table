<template>
    <div :loading="loading">
        <hos-form
            ref="dialogForm"
            label-position="right"
            :rules="rules"
            :model="dialogForm"
            label-width="auto"
        >
            <hos-row>
                <hos-col
                    :span="24"
                    v-has-permi="{
                        key: status + 'base:sys:page-pre:code',
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
                            :disabled="$m.isDisabled(status + 'base:sys:page-pre:code')"
                            v-model="dialogForm.code"
                        >
                        </hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{
                        key: status + 'base:sys:page-pre:name',
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
                            :disabled="$m.isDisabled(status + 'base:sys:page-pre:name')"
                            v-model="dialogForm.name"
                        >
                        </hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{ key: status + 'base:sys:page-pre:status' }"
                >
                    <hos-form-item
                        :label="$t('page.status')"
                        prop="status"
                    >
                        <hos-checkbox-group
                            v-model="dialogForm.status"
                            :disabled="$m.isDisabled(status + 'base:sys:page-pre:status')"
                        >
                            <hos-checkbox label="add">{{ $t("operation.add") }}</hos-checkbox>
                            <hos-checkbox label="edit">{{ $t("operation.edit") }}</hos-checkbox>
                            <hos-checkbox label="view">{{ $t("operation.view") }}</hos-checkbox>
                        </hos-checkbox-group>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{ key: status + 'base:sys:page-pre:actived' }"
                >
                    <hos-form-item
                        :label="$t('common.isActived')"
                        prop="actived"
                    >
                        <hos-switch
                            v-model="dialogForm.actived"
                            :active-text="$t('common.yes')"
                            :inactive-text="$t('common.no')"
                            inner-label
                            :disabled="$m.isDisabled(status + 'base:sys:page-pre:actived')"
                        >
                        </hos-switch>
                    </hos-form-item>
                </hos-col>
            </hos-row>
        </hos-form>
        <div
            slot="footer"
            class="dialog-footer"
        >
            <hos-button
                type="primary"
                @click="cancel"
                v-has-permi="{ key: status + 'base:sys:page-pre:cancel' }"
            >
                {{ $t("operation.cancel") }}</hos-button>
            <hos-button
                type="success"
                @click="save(dialogForm)"
                v-has-permi="{ key: status + 'base:sys:page-pre:save' }"
            >{{ $t("operation.save") }}</hos-button>
        </div>
    </div>
</template>
<script>
import { validNoZh } from "@sys/utils/validateUtil.js";
export default {
    props: ["id", "resourceId", "status"],
    data() {
        return {
            loading: false,
            rules: {
                name: [
                    {
                        required: true,
                        message: this.$t("common.rule.name.required"),
                    },
                ],
                code: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (validNoZh(value) == true) {
                                    if (value.length <= 37) {
                                        callback();
                                    } else {
                                        callback(
                                            new Error(
                                                this.$t(
                                                    "common.rule.code.length"
                                                )
                                            )
                                        );
                                    }
                                } else {
                                    callback(
                                        new Error(
                                            this.$t("common.rule.code.noZh")
                                        )
                                    );
                                }
                            } else {
                                callback(
                                    new Error(
                                        this.$t("common.rule.code.required")
                                    )
                                );
                            }
                        },
                    },
                    {
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value !== "") {
                                const param = {
                                    code: value,
                                    id: this.id == undefined ? "" : this.id,
                                };
                                this.$api("sys_page_pre.validated", param).then(
                                    (res) => {
                                        if (
                                            res &&
                                            res.code == 200 &&
                                            res.data
                                        ) {
                                            callback();
                                        } else {
                                            callback(
                                                new Error(
                                                    this.$t(
                                                        "common.rule.code.validate"
                                                    )
                                                )
                                            );
                                        }
                                    }
                                );
                            } else {
                                callback(
                                    new Error(
                                        this.$t("common.rule.code.required")
                                    )
                                );
                            }
                        },
                    },
                ],
            },
            dialogForm: {
                id: "",
                code: "",
                name: "",
                status: [],
                actived: true,
                remark: "",
                resourceId: "",
            },
        };
    },
    mounted() {
        this.dialogForm.resourceId = this.resourceId;
        if (this.id) {
            this.initData();
        }
    },
    methods: {
        //初始化数据
        initData() {
            this.$api("sys_page_pre.selectById", this.id).then((res) => {
                if (res && res.code == 200) {
                    res.data.status = res.data.status.split(",");
                    this.dialogForm = res.data;
                }
            });
        },
        //保存方法
        save(form) {
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let formStatus = form.status;
                    form.status = form.status.join(",");
                    form.status = form.status.startsWith(",")
                        ? form.status.replace(",", "")
                        : form.status;
                    if (this.id) {
                        this.$api("sys_page_pre.update", form).then((res) => {
                            if (res && res.code == 200) {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.cancel();
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "table",
                                });
                            } else if (res.code == "99001008") {
                                this.$message.error(res.msg);
                                form.status = formStatus;
                            } else {
                                this.$message.error(this.$t("operation.error"));
                                form.status = formStatus;
                            }
                        });
                    } else {
                        this.$api("sys_page_pre.insert", form).then((res) => {
                            if (res && res.code == 200) {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.cancel();
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "table",
                                });
                            } else if (res.code == "99001008") {
                                this.$message.error(res.msg);
                                form.status = formStatus;
                            } else {
                                this.$message.error(this.$t("operation.error"));
                                form.status = formStatus;
                            }
                        });
                    }
                }
            });
        },

        //关闭窗口
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "editDialog",
            });
        },
    },
};
</script>
