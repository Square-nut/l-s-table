<template>
    <div
        :loading="loading"
        class="p10 sys-perm-page"
    >
        <hos-table
            :data="tableData"
            :roleId="roleId"
            :pageId="pageId"
            :uid="uid"
            default-expand-all
            class="w-fit"
            height="400"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <hos-table-column
                prop="name"
                :label="$t('page.permName')"
                min-width="26%"
            />
            <hos-table-column
                prop="permCode"
                :label="$t('page.permCode')"
                min-width="43%"
            />
            <hos-table-column
                :label="$t('page.permType')"
                min-width="20%"
            >
                <template slot-scope="scope">
                    {{ typeCollection[scope.row.type] }}
                </template>
            </hos-table-column>
            <hos-table-column
                :label="statusMap[status]"
                v-for="status in permList"
                :key="status"
                align="center"
            >
                <hos-table-column
                    :label="val.value"
                    v-for="(val, number) of permRadioList"
                    :key="number"
                    :min-width="withValue"
                >
                    <template slot-scope="scope">
                        <span v-if="val.key == 2 && scope.row.type != '1'">--</span>
                        <hos-radio
                            v-model="
                scope.row.permList.filter((item) => item.status == status)[0]
                  .visibleStatus
              "
                            :label="val.key"
                            v-if="!(val.key == 2 && scope.row.type != '1')"
                        >{{ undefined }}</hos-radio>
                    </template>
                </hos-table-column>
            </hos-table-column>
        </hos-table>
        <div
            slot="footer"
            class="dialog-footer sys-perm-page-padding"
        >
            <hos-button
                type="primary"
                @click="cancel"
            >
                {{ $t("operation.cancel") }}
            </hos-button>
            <hos-button
                type="success"
                @click="savePerm"
            >
                {{ $t("operation.save") }}
            </hos-button>
        </div>
    </div>
</template>
<script>
//页面元素
import {
    typeCollection,
    statusMap,
    permRadioList,
} from "../../../enum/permCollectionEnum";
export default {
    props: ["pageId", "roleId", "uid"],
    mixins: [typeCollection, statusMap, permRadioList],
    name: "perm",
    data() {
        return {
            loading: false,
            tableData: [],
            permList: [],
        };
    },
    computed: {
        withValue() {
            return 27 / this.permList.length + "%";
        },
    },
    watch: {
        pageId(ordId, newId) {
            if (ordId != newId) {
                this.loadPerm();
            }
        },
    },
    created() {
        this.loadPerm();
    },
    methods: {
        loadPerm() {
            this.$api("sys_page_pre.columnPermList", {
                pageId: this.pageId,
                roleId: this.roleId,
            }).then((res) => {
                if (res && res.code == 200) {
                    this.permList = [];
                    this.tableData = [];
                    this.tableData = res.data.records;
                    var list = [];
                    if (this.tableData.length > 0) {
                        this.tableData[0].permList.forEach((element) => {
                            list.push(element.status);
                        });
                    }
                    //排序
                    if (list.length > 0) {
                        if (list.includes("add")) this.permList.push("add");
                        if (list.includes("edit")) this.permList.push("edit");
                        if (list.includes("view")) this.permList.push("view");
                        if (list.includes("")) this.permList.push("");
                    }
                }
            });
        },
        savePerm() {
            var list = [];
            this.tableData
                .filter((item) => item.permList.length > 0)
                .forEach((item) => {
                    list.push.apply(list, item.permList);
                    if (item.hasOwnProperty("children")) {
                        item.children
                            .filter((child) => child.permList.length > 0)
                            .forEach((child) => {
                                list.push.apply(list, child.permList);
                            });
                    }
                });
            this.$api("sys_page_pre.submit", {
                pageId: this.pageId,
                roleId: this.roleId,
                permList: list,
            }).then((res) => {
                if (res && res.code == 200) {
                    this.cancel();
                    this.$message.success(this.$t("operation.success"));
                } else {
                    this.$message.error(this.$t("operation.error"));
                }
            });
        },
        //关闭窗口
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: this.uid,
            });
        },
    },
};
</script>