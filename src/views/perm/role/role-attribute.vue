<template>
    <div :loading="loading" class="roleatt">
        <hos-form
            ref="dialogForm"
            :model="dialogForm"
            :rules="rules"
            label-width="110px"
            label-position="right"
        >
            <hos-row>
                <hos-col
                    v-has-permi="{
                        key: status + 'base:perm:role:tokenEffective',
                        formRule: rules,
                        elModel: 'tokenEffective',
                    }"
                >
                    <hos-form-item
                        :label="$t('role.tokenTime')"
                        prop="tokenEffective"
                    >
                        <hos-InputNumber
                            v-model="dialogForm.tokenEffective"
                            size="medium"
                            :disabled="
                                $m.isDisabled(
                                    status + 'base:perm:role:tokenEffective'
                                )
                            "
                        ></hos-InputNumber>
                        <span class="ml10">{{ $t("role.min") }}</span>
                    </hos-form-item>
                </hos-col>
            </hos-row>
            <hos-row>
                <hos-col
                    v-has-permi="{
                        key: status + 'base:perm:role:defaultHomePage',
                        formRule: rules,
                        elModel: 'defaultPage',
                    }"
                >
                    <hos-form-item
                        :label="$t('role.defaultPage')"
                        prop="defaultHomePage"
                    >
                        <hos-tree-select
                            v-model="dialogForm.defaultHomePage"
                            :disabled="
                                $m.isDisabled(
                                    status + 'base:perm:role:defaultHomePage'
                                )
                            "
                            clearable
                            :options="treeData"
                            :flat="true"
                            :placeholder="$t('common.confirm.menu')"
                        ></hos-tree-select>
                    </hos-form-item>
                </hos-col>
            </hos-row>
        </hos-form>
        <div slot="footer" class="dialog-footer">
            <hos-button
                type="primary"
                @click="cancel"
                v-has-permi="{ key: 'base:perm:role:propertyCancel' }"
                >{{ $t("operation.cancel") }}</hos-button
            >
            <hos-button
                type="success"
                @click="save"
                :loading="loading"
                v-has-permi="{ key: 'base:perm:role:propertySave' }"
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
                tokenEffective: 30,
                defaultHomePage: null,
            },
            loading: false,
            treeData: [],
            rules: {},
        };
    },
    created() {
        this.getRoleAttr();
    },
    mounted() {},
    methods: {
        // 初始化数据
        getRoleAttr() {
            if (this.id) {
                this.$api("perm_role.getTreeResource", this.id).then((res) => {
                    if (res && res.code == "200") {
                        this.treeData = res.data;
                        this.disabledNode(this.treeData, "C");
                    }
                });
                this.$api("perm_role.getPropertiesId", this.id).then((res) => {
                    if (res && res.code == "200") {
                        if (res.data != null) {
                            this.dialogForm = res.data;
                        }
                    }
                });
            }
        },
        // 指定节点禁用
        disabledNode(treeData, type) {
            //禁选
            treeData.forEach((item) => {
                if (item.type === type) {
                    item["isDisabled"] = true;
                } else {
                    item["isDisabled"] = false;
                }
                if (item.children && item.children.length > 0) {
                    this.disabledNode(item.children, type);
                }
            });
        },
        // 保存dialog
        save() {
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let data = {
                        properties: this.dialogForm,
                        id: this.id,
                    };
                    this.$api("perm_role.saveProperties", data).then((res) => {
                        this.loading = false;
                        if (res && res.code == "200") {
                            this.$message.success(this.$t("operation.success"));
                            this.cancel();
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
        //取消按钮
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "roleAttrDialog",
            });
            this.loading = false;
        },
    },
};
</script>
