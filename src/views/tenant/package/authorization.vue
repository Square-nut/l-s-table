<template>
    <div
        :loading="loading"
        class="tenant-package-auth"
    >
        <div>
            <hos-input
                :placeholder="$t('common.placeholder.key')"
                v-model="filterText"
                suffix-icon="hos-icom-find"
                clearable
            ></hos-input>
        </div>
        <div class="ptb10">
            <hos-checkbox
                :label="$t('tenant.chooseAll')"
                v-model="chooseCheck"
                @change="allOnChange"
            >
            </hos-checkbox>
            <hos-checkbox
                :label="$t('common.expandOrCollapse')"
                v-model="allCheck"
                @change="epandOnChange"
            >
            </hos-checkbox>
            <!-- <hos-checkbox :label="$t('tenant.parentSonLink')" v-model="linkCheck" @change="linkOnChange">
            </hos-checkbox> -->
        </div>

        <hos-tree
            :check-strictly="parentSonLink"
            :default-expand-all="expandNode"
            :filter-node-method="filterNode"
            show-checkbox
            :data="treeData"
            node-key="id"
            :props="defaultProps"
            @node-click="clickNode"
            ref="authTree"
            class="authtree"
        >
        </hos-tree>
        <div
            slot="footer"
            class="dialog-footer"
        >
            <hos-button
                @click="closeDialog()"
                type="primary"
            >{{
        $t("operation.cancel")
      }}</hos-button>
            <hos-button
                type="success"
                @click="submitForm()"
            >{{
        $t("operation.save")
      }}</hos-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "authorization",
    props: ["id"],
    data() {
        return {
            // 半选节点数组
            halfNode: [],
            loading: false,
            parentSonLink: false,
            filterText: "",
            selectTreeId: null,
            allCheck: false,
            chooseCheck: false,
            linkCheck: false,
            treeData: [],
            defaultProps: {
                children: "children",
                label: "label",
            },
            expandNode: false,
        };
    },
    created() {
        this.$api("sys_resource.getTenantResourceTree").then((res) => {
            this.treeData = res.data;
            this.getHalfNode(this.treeData);
            this.$nextTick(() => {
                this.$api("tenant_package.getTree", this.id)
                    .then((res) => {
                        if (res && res.code == 200) {
                            this.setCheckedNode(res.data, this.halfNode);
                            // this.$refs.authTree.setCheckedKeys(res.data);
                        }
                    })
                    .catch(() => {
                        this.$message.error(res.data);
                    });
            });
        });
        // this.$api('tenant_package.getTree', this.id).then(res => {
        //     this.treeData = res.data;
        //     // 将为true的节点置选中
        //     this.$nextTick(() => {
        //     let nodeArr = [];
        //     let checkdArr = [];
        //     nodeArr = this.$refs.authTree.getAllNodes();
        //     console.log(nodeArr)
        //     for(var index in nodeArr){
        //         if(nodeArr[index].data.isCheck == true){
        //             checkdArr.push(nodeArr[index].key)
        //         }
        //     };
        //     this.$refs.authTree.setCheckedKeys(checkdArr);
        // })
        // });
    },
    watch: {
        filterText(val) {
            this.$refs.authTree.filter(val);
        },
    },
    methods: {
        getHalfNode(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].children) {
                    this.halfNode.push(data[i].id);
                    this.getHalfNode(data[i].children);
                }
            }
        },
        setCheckedNode(arr, halfNode) {
            let checkedHlafNode = [];
            let checkedKeys = [];
            for (var i = 0; i < arr.length; i++) {
                if (halfNode.indexOf(arr[i]) != -1) {
                    checkedHlafNode.push(arr[i]);
                } else {
                    checkedKeys.push(arr[i]);
                }
            }
            this.$refs.authTree.setCheckedKeys(checkedKeys);
        },
        // 关键字搜索节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        clickNode() {},
        checkChange(data, not) {
            let isCheck = false;
            if (not.checkedKeys.includes(data.id)) {
                isCheck = true;
            }

            let nodes = this.$refs.authTree.getAllNodes();
            if (this.linkCheck == true) {
                let pIdStr = "," + data.id + ",";
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].data.parentId != "0") {
                        if (pIdStr.indexOf(nodes[i].data.parentId) > -1) {
                            pIdStr = pIdStr + "," + nodes[i].data.id + ",";
                            nodes[i].checked = isCheck;
                        }
                    }
                }
            } else {
                if (isCheck) {
                    let pIdStr = this.getParentIdNoteID(nodes, data.parentId);

                    for (let i = 0; i < nodes.length; i++) {
                        if (pIdStr.indexOf(nodes[i].data.id) > -1) {
                            nodes[i].checked = isCheck;
                        }
                    }
                }
            }
        },
        getParentIdNoteID(data, pId) {
            let ret = "pId";
            if (pId != "0") {
                for (let i = 0; i < data.length; i++) {
                    if (pId == data[i].data.id) {
                        ret = ret + "," + data[i].data.id + ",";
                        if (data[i].data.parentId != 0) {
                            let rStr = this.getParentIdNoteID(
                                data,
                                data[i].data.parentId
                            );
                            if (rStr != "") {
                                ret = ret + "," + rStr + ",";
                            }
                        }
                    }
                }
            }

            return ret;
        },
        epandOnChange(value) {
            if (value == true) {
                this.$refs.authTree.expandAll();
            } else {
                this.$refs.authTree.collapseAll();
            }
        },
        allOnChange(value) {
            if (value == true) {
                let nodeArr = [];
                for (var index in this.treeData) {
                    nodeArr.push(this.treeData[index].id);
                }
                console.log(nodeArr);
                this.$refs.authTree.setCheckedKeys(nodeArr);
            } else {
                this.$refs.authTree.setCheckedKeys([]);
            }
        },
        linkOnChange(value) {
            if (value == true) {
                // 父子联动处理
                this.parentSonLink = false;
                this.linkCheck = true;
            } else {
                this.parentSonLink = true;
                this.linkCheck = false;
            }
        },
        closeDialog() {
            this.$store.commit("CLOSE_DIALOG", { _uid: "packageAuthDialog" });
        },
        submitForm() {
            this.loading = true;
            // 获取授权数据
            let res = this.$refs.authTree.getCheckedNodes();
            let halfRes = this.$refs.authTree.getHalfCheckedNodes();
            let arr = [];
            res.forEach((item) => {
                arr.push(item.id);
            });
            halfRes.forEach((item) => {
                arr.push(item.id);
            });
            let resourceIds = arr.join(",");
            this.$api("tenant_package.saveAuth", {
                packageId: this.id,
                resourceIds: resourceIds,
            })
                .then((res) => {
                    if (res && res.code == 200) {
                        this.$message.success(this.$t("operation.success"));
                        this.loading = false;
                        this.closeDialog();
                    } else {
                        this.$message.error(this.$t("operation.error"));
                    }
                })
                .catch((err) => {
                    this.$message.error(this.$t("operation.error"));
                    this.loading = false;
                });
        },
    },
};
</script>
