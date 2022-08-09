<template>
    <div class="h-fit">
        <hos-biz-table
            @selection-change="handleSelectionChange"
            :page="true"
            :selection="selection"
            uid="cacheTable"
            :cols="cols"
            :data="cacheData"
            :form="form"
            :row-style="rowStyle"
            pagePos="top"
        >
            <template #toolbar>
                <hos-button-group class="hos">
                    <hos-button
                        @click="clear()"
                        icon="hos-icon-brush"
                        v-has-permi="{ key: 'base:monitor:cache:clear' }"
                        >{{ $t("operation.detetion") }}</hos-button
                    >
                </hos-button-group>
            </template>
            <!-- 操作列按钮 -->
            <template #operation="{ row }">
                <hos-tooltip
                    class="pl5 pr5"
                    :content="$t('operation.detetion')"
                >
                    <i
                        class="hos-icon-brush"
                        @click="clear(row)"
                        v-has-permi="{ key: 'base:monitor:cache:clear' }"
                    ></i
                ></hos-tooltip>
            </template>
            <template #form>
                <hos-row :gutter="20">
                    <hos-col :span="8">
                        <hos-form-item :label="$t('cache.code')">
                            <hos-input
                                clearable
                                v-model="form.model.cacheName"
                                :placeholder="
                                    $t('cache.placeholder.pleaseCode')
                                "
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="8">
                        <hos-form-item :label="$t('cache.name')">
                            <hos-input
                                clearable
                                v-model="form.model.cacheTitle"
                                :placeholder="$t('common.placeholder.name')"
                            ></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="8">
                        <hos-form-item label-width="20px">
                            <hos-biz-button run="form.search" type="primary">{{
                                $t("operation.query")
                            }}</hos-biz-button>
                            <hos-biz-button run="form.reset" type="primary">{{
                                $t("operation.reset")
                            }}</hos-biz-button>
                        </hos-form-item>
                    </hos-col>
                </hos-row>
            </template>
        </hos-biz-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedTableIds: [],
            isCheckRed: false,
            selection: [],
            page: {
                size: 10,
                current: 0,
            },
            form: {
                //inline: true,
                labelWidth: "auto",
                model: {
                    cacheName: "",
                    cacheTitle: "",
                },
            },
            cols: [
                {
                    type: "selection",
                    width: "50px",
                    align: "center",
                },
                {
                    prop: "cacheName",
                    label: this.$t("cache.code"),
                },
                {
                    prop: "cacheTitle",
                    label: this.$t("cache.name"),
                },
                {
                    prop: "cacheDesc",
                    label: this.$t("cache.desc"),
                    width: "500px",
                    showOverflowTooltip: true,
                },
                {
                    prop: "timeToLiveSeconds",
                    label: this.$t("cache.time"),
                },
                {
                    label: this.$t("common.operation"),
                    width: "60px",
                    prop: "operation",
                    slotName: "operation",
                    /*  prop: ({row}, h) => {
                    return h('div', [
                         h("hos-tooltip",{
                                props:{
                                content:"清空"
                                },
                            },[
                            h("i", {
                                class: "hos-icon-brush",
                                on: {
                                    click: () => {
                                    this.clear(row);
                                    },
                                },
                            })
                        ]),
                    ])
                } */
                },
            ],
        };
    },
    watch: {},
    mounted() {},
    methods: {
        rowStyle(obj) {
            let bb = {
                color: "red",
            };
            if (obj.row.important) {
                return bb;
            }
        },
        cacheData(primary) {
            return this.$api("cache.selectPage", primary);
        },
        // checkbox框选中事件
        handleSelectionChange(selection) {
            this.selectedTableIds = selection.map((item) => item.cacheName);
            selection.map((item) => {
                if (item.important) {
                    this.isCheckRed = true;
                }
            });
        },
        clear(row) {
            let tip = this.$t("cache.clearTip");
            let idStr = "";
            if (row) {
                idStr = row.cacheName;
                if (row.important) {
                    tip = this.$t("cache.clearTip2");
                }
                this.$confirm(tip, this.$t("login.label.info"), {
                    type: "warning",
                }).then(() => {
                    this.$api("cache.clear", { cacheNames: idStr })
                        .then((res) => {
                            if (res && res.code == 200) {
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                                this.$store.commit("UPDATE_TABLE", {
                                    _uid: "cacheTable",
                                });
                            } else {
                                this.$message.error(this.$t("operation.error"));
                            }
                        })
                        .catch((error) => {
                            //this.$message.error(this.$t("operation.error"));
                        });
                });
            } else {
                if (this.selectedTableIds != undefined) {
                    if (this.selectedTableIds.length > 0) {
                        if (this.isCheckRed) {
                            tip = this.$t("cache.clearTip2");
                        }
                        this.$confirm(tip, this.$t("login.label.info"), {
                            type: "warning",
                        }).then(() => {
                            this.$api("cache.clear", { cacheNames: idStr })
                                .then((res) => {
                                    if (res && res.code == 200) {
                                        this.$message.success(
                                            this.$t("operation.success")
                                        );
                                        this.$store.commit("UPDATE_TABLE", {
                                            _uid: "cacheTable",
                                        });
                                    } else {
                                        this.$message.error(
                                            this.$t("operation.error")
                                        );
                                    }
                                })
                                .catch((error) => {
                                    //this.$message.error(this.$t("operation.error"));
                                });
                        });
                    } else {
                        this.$message.warning(
                            this.$t("common.confirm.dataNullClear")
                        );
                    }
                } else {
                    this.$message.warning(
                        this.$t("common.confirm.dataNullClear")
                    );
                }

                /*  } */
            }
        },
        reset() {
            this.form.model = {
                cacheName: "",
                cacheTitle: "",
            };
            this.$store.commit("UPDATE_TABLE", { _uid: "cacheTable" });
        },
    },
};
</script>
