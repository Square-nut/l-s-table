<template>
    <div>
        <hos-form
            ref="sourceDataDialogForm"
            :model="sourceDataDialogForm"
            :inline="false"
            label-position="right"
            label-width="auto"
        >
            <hos-row>
                <hos-form-item :label="$t('datasource.title')">
                    <hos-select
                        v-model="sourceDataOpt"
                        clearable
                        filterable
                        :placeholder="$t('common.placeholder.datasource')"
                    >
                        <hos-option
                            v-for="(item, index) in sourceData"
                            :key="index"
                            :value="item.id"
                            :label="item.name"
                        ></hos-option>
                    </hos-select>
                </hos-form-item>
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
                type="success"
                @click="save()"
            >{{
        $t("operation.save")
      }}</hos-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: Array,
        datasourceId: Array,
        datasourceCallback: Function,
    },
    data() {
        return {
            // 所有可用数据源
            sourceData: [],
            sourceDataDialogForm: {},
            sourceDataOpt: "",
        };
    },
    created() {
        // 1先获取数据源所有数据
        console.log(this.datasourceId);
        this.$api("tenant_tenant.sourceData").then((res) => {
            if (res && res.code == 200) {
                this.sourceData = res.data;
            }
        });
        // 如果传了多个租户id,补选中数据源Id,只有一个的话就选中它对应的数据源id
        if (this.datasourceId.length > 1) {
            this.sourceDataOpt = null;
        } else {
            this.sourceDataOpt = this.datasourceId[0];
        }
    },
    methods: {
        cancel() {
            this.$store.commit("CLOSE_DIALOG", { _uid: "sourceDataDialog" });
        },
        save() {
            let ids = this.id.join(",");
            this.datasourceCallback(ids, this.sourceDataOpt);
            this.cancel();
        },
    },
};
</script>