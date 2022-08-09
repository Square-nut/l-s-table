<template>
    <div class="resource-attr">
        <hos-table
            border
            class="tableData"
            :data="tableData"
        >
            <hos-table-column
                prop="attrName"
                :label="$t('resource.attrName')"
            >
                <template slot-scope="scope">
                    <hos-input v-model="scope.row.attrName"></hos-input>
                </template>
            </hos-table-column>
            <hos-table-column
                prop="attrValue"
                :label="$t('resource.attrValue')"
            >
                <template slot-scope="scope">
                    <hos-input v-model="scope.row.attrValue"></hos-input>
                </template>
            </hos-table-column>
            <hos-table-column
                prop="attrRemark"
                :label="$t('resource.attrRemark')"
            >
                <template slot-scope="scope">
                    <hos-input v-model="scope.row.attrRemark"></hos-input>
                </template>
            </hos-table-column>
            <hos-table-column
                align="center"
                width="100"
            >
                <template
                    slot="header"
                    slot-scope="scope"
                >
                    <i
                        @click="addRow(scope)"
                        class="hos-icon-circle-plus-outline"
                    ></i>
                </template>
                <template slot-scope="scope">
                    <i
                        @click="delRow(scope.$index)"
                        class="hos-icon-circle-close"
                    ></i>
                </template>
            </hos-table-column>
        </hos-table>
        <div
            slot="footer"
            class="dialog-footer tc"
        >
            <hos-button
                type="primary"
                class="mt10"
                @click="save"
            >{{$t('operation.save')}}</hos-button>
        </div>
    </div>

</template>
<script>
export default {
    props: {
        pageCallback: Function,
        pageValue: Array,
    },
    data() {
        return {
            // 页面属性从index页面获取
            tableData: [],
        };
    },
    created() {
        // 新增或者页面属性不存在的时候为空数组
        if (this.pageValue == null) {
            this.tableData = [];
            console.log(this.tableData);
            // 把pageValue取出来,放到对应的表格里面
            // let valArray = this.pageValue.split(';');
            // for(var i=0;i<valArray.length;i++){
            //     let subArr = valArray[i].split(':');
            //     let key = subArr[0];
            //     let value = subArr[1];
            //     this.tableData.push({attrName: key, attrValue: value})
            // }
        } else {
            this.tableData = this.pageValue;
        }
    },
    watch: {},
    methods: {
        addRow(scope) {
            this.tableData.push({
                attrName: "",
                attrValue: "",
                attrRemark: "",
            });
        },
        //删除一行
        delRow(index) {
            this.tableData.splice(index, 1);
        },
        save() {
            if (this.tableData.length > 0) {
                if (
                    this.tableData[this.tableData.length - 1].attrName == "" ||
                    this.tableData[this.tableData.length - 1].attrValue == ""
                ) {
                    this.$message.error(this.$t("resource.tipMessage.row"));
                    return;
                }
            }
            this.pageCallback(this.tableData);
            this.$store.commit("CLOSE_DIALOG", { _uid: "pageAttrDialog" });
        },
    },
};
</script>