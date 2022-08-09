<template>
    <div
        :loading="loading"
        class="simple-input-number"
    >
        <hos-form
            ref="dialogForm"
            label-position="right"
            label-width="auto"
            :rules="rules"
            :model="dialogForm"
        >
            <hos-row>
                <hos-col
                    :span="24"
                    v-has-permi="{ key: status + 'base:sys:page-pre-element:parent' }"
                >
                    <hos-form-item
                        :label="$t('page.parent')"
                        prop="parentId"
                    >
                        <hos-select
                            :placeholder="$t('common.placeholder.parent')"
                            v-model="dialogForm.parentId"
                            :disabled="$m.isDisabled(status + 'base:sys:page-pre:element:parent')"
                        >
                            <hos-option
                                v-for="item in parentData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </hos-option>
                        </hos-select>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{
                        key: status + 'base:sys:page-pre-element:permCode',
                        formRule: rules,
                        elModel: 'permCode',
                    }"
                >
                    <hos-form-item
                        :label="$t('page.permCode')"
                        prop="permCode"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.permCode')"
                            :disabled="$m.isDisabled(status + 'base:sys:page-pre:element:permCode')"
                            v-model="dialogForm.permCode"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{
                        key: status + 'base:sys:page-pre-element:name',
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
                            :disabled="$m.isDisabled(status + 'base:sys:page-pre:element:name')"
                            v-model="dialogForm.name"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{ key: status + 'base:sys:page-pre-element:type' }"
                >
                    <hos-form-item
                        :label="$t('common.type')"
                        prop="type"
                    >
                        <hos-select
                            :disabled="$m.isDisabled(status + 'base:sys:page-pre:element:type')"
                            v-model="dialogForm.type"
                        >
                            <hos-option
                                v-for="(item, key, index) in type"
                                :key="index"
                                :label="item"
                                :value="key"
                            >
                                {{ item }}
                            </hos-option>
                        </hos-select>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{ key: status + 'base:sys:page-pre-element:weight' }"
                >
                    <hos-form-item
                        :label="$t('common.weight')"
                        prop="weight"
                    >
                        <hos-input-number
                            v-model="dialogForm.weight"
                            :min="0"
                            :disabled="$m.isDisabled(status + 'base:sys:page-pre:element:weight')"
                        ></hos-input-number>
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
                v-has-permi="{ key: status + 'base:sys:page-pre-element:cancel' }"
            >
                {{ $t("operation.cancel") }}</hos-button>
            <hos-button
                type="success"
                @click="save(dialogForm)"
                v-has-permi="{ key: status + 'base:sys:page-pre-element:save' }"
            >{{ $t("operation.save") }}</hos-button>
        </div>
    </div>
</template>
<script>
import { validNoZh } from "@sys/utils/validateUtil.js";
export default {
    props: ["id", "pageId", "type", "status"],
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
                permCode: [
                    {
                        required: true,
                        message: this.$t("common.rule.code.required"),
                    },
                    {
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value !== "") {
                                if (validNoZh(value) == true) {
                                    const param = {
                                        permCode: value,
                                        id: this.id == undefined ? "" : this.id,
                                    };
                                    this.$api(
                                        "sys_page_pre.columnValidated",
                                        param
                                    ).then((res) => {
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
                                    });
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
                ],
            },
            parentData: [],
            dialogForm: {
                id: "",
                parentId: "0",
                permCode: "",
                name: "",
                type: "1",
                weight: 0,
                pageId: "",
            },
        };
    },
    created() {
        this.dialogForm.pageId = this.pageId;
        this.initParentData();
    },
    mounted() {
        if (this.id) {
            this.initData();
        }
    },
    methods: {
        initParentData() {
            this.$api("sys_page_pre.higherList", this.dialogForm.pageId).then(
                (res) => {
                    if (res && res.code == 200) {
                        this.parentData = res.data;
                        this.dialogForm.parentId =
                            this.dialogForm.parentId == "0"
                                ? ""
                                : this.dialogForm.parentId;
                    }
                }
            );
        },
        //初始化数据
        initData() {
            this.$api("sys_page_pre.selectColumnById", this.id).then((res) => {
                if (res && res.code == 200) {
                    this.dialogForm = res.data;
                    this.dialogForm.parentId =
                        this.dialogForm.parentId == "0"
                            ? ""
                            : this.dialogForm.parentId;
                }
            });
        },
        //保存方法
        save(form) {
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    form.parentId =
                        form.parentId == undefined ? "0" : form.parentId;
                    if (this.dialogForm.id) {
                        this.$api("sys_page_pre.columnUpdate", form).then(
                            (res) => {
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
                                } else {
                                    this.$message.error(
                                        this.$t("operation.error")
                                    );
                                }
                            }
                        );
                    } else {
                        this.$api("sys_page_pre.columnInsert", form).then(
                            (res) => {
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
                                } else {
                                    this.$message.error(
                                        this.$t("operation.error")
                                    );
                                }
                            }
                        );
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
