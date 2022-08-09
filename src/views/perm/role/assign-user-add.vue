<template>
    <div class="user-add-tree" :loading="loading">
        <hos-input
            :placeholder="$t('common.placeholder.key')"
            clearable
            suffix-icon="hos-icon-search"
            v-model="filterText"
        ></hos-input>
        <div class="user-checkbox">
            <hos-checkbox v-model="isCheckAll" @change="checkStatusChanged">{{
                $t("common.isChooseAll")
            }}</hos-checkbox>
            <hos-checkbox @change="expand">{{
                $t("common.expandOrCollapse")
            }}</hos-checkbox>
            <!-- <hos-checkbox v-model="menuCheckStrictly" @change="handleChecked($event, 'menu')">{{$t('common.FatherOrSonLinkage')}}</hos-checkbox> -->
        </div>
        <hos-tree
            ref="treeRef"
            :data="treeData"
            show-checkbox
            node-key="id"
            :default-expand-all="false"
            :filter-node-method="filterNode"
        ></hos-tree>
        <!-- <hos-tree :data="treeData" node-key="id" :check-strictly="!menuCheckStrictly" :props="props" :defaultExpandFirst="false" ref="tree" highlight-current lazy
		 	:load="loadTreeNodes" :filter-node-method="filterNode" show-checkbox check-on-click-node></hos-tree> -->
        <div slot="footer" class="dialog-footer">
            <hos-button type="primary" @click="cancel">{{
                $t("operation.cancel")
            }}</hos-button>
            <hos-button type="success" @click="save">{{
                $t("operation.save")
            }}</hos-button>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    props: ["roleId", "type"],
    data() {
        return {
            isCheckAll: false,
            treeData: [], // 菜单权限树结构数据
            filterText: "", // 树检索框默认显示
            loading: false,
            menuCheckStrictly: "",
            props: {
                id: 0,
                isLeaf: "leaf",
            },
        };
    },
    watch: {
        // 监听树结构的过滤条件
        filterText(val) {
            this.$refs.treeRef.filter(val);
        },
    },
    created() {
        this.initTree();
        this.isOrgRole = this.$store.getters.baseUserOrgRole;
    },
    methods: {
        // 树检索过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        expandAllNodes() {
            this.$refs.treeRef.expandAll();
        },
        collapseAllNodes() {
            this.$refs.treeRef.collapseAll();
        },
        checkStatusChanged() {
            if (this.isCheckAll) {
                this.$nextTick(() => {
                    this.$refs.treeRef.setCheckedNodes(this.treeData);
                });
            } else {
                this.$nextTick(() => {
                    this.$refs.treeRef.setCheckedKeys([]);
                });
            }
        },
        // 展开/折叠
        expand() {
            this.isExpand = !this.isExpand;
            const nodes = this.$refs.treeRef.getAllNodes();
            for (let i in nodes) {
                nodes[i].expanded = this.isExpand;
            }
        },
        /* // 树权限（父子联动js部分）
			handleChecked(value, type) {
				this.menuCheckStrictly = value ? true : false
			}, */
        // 初始化树
        initTree() {
            this.$api("perm_role.getUserTree", {
                roleId: this.roleId,
            }).then((response) => {
                this.treeData = response.data;
                //禁用除人员以外的
                this.disabledNode(this.treeData, true);
            });
        },
        disabledNode(treeData, str) {
            treeData.forEach((item) => {
                if (item.isDisable === str) {
                    item.disabled = true;
                } else {
                    item.disabled = false;
                }
                if (item.children && item.children.length > 0) {
                    this.disabledNode(item.children, str);
                }
            });
        },
        /* loadTreeNodes(node, resolve) {
				let userId = 0;
				if(node != null && node.data.length != 0) {
					userId = node.data.id;
				}
				this.$api('perm_role.getUserTree', {
					id: userId
				}).then(res => {
					return resolve(res.data);
				})
			}, */
        //保存
        save() {
            let trees = [];
            let users = [];
            let isNullOrg = 0;

            trees = this.$refs.treeRef.getCheckedNodes();
            if (trees.length > 0) {
                for (var i = 0; i < trees.length; i++) {
                    if (trees[i].type == "user") {
                        let obj = {
                            userId: trees[i].userId,
                            roleId: this.roleId,
                            orgId: trees[i].parentId,
                        };
                        if (trees[i].parentId == "emptyDepartment") {
                            isNullOrg = 1;
                        }
                        users.push(obj);
                    }
                }
            }
            if (this.type != "1" && this.isOrgRole != "1" && isNullOrg == 1) {
                this.$message.error(this.$t("common.tipMessage.A0036"));
                return;
            }
            if (users.length > 0) {
                this.$api("perm_role.insertUser", users).then((res) => {
                    if (res && res.code == "200") {
                        this.loading = false;
                        this.$message.success(this.$t("operation.success"));
                        this.cancel(),
                            this.$store.commit("UPDATE_TABLE", {
                                _uid: "table1",
                            });
                    } else if (res.code == "A0001") {
                        this.$message.error(
                            this.$t("common.tipMessage." + res.code, [res.msg])
                        );
                    } else if (res.code == "A0036") {
                        this.$message.error(this.$t("common.tipMessage.A0036"));
                    } else {
                        this.$message.error(this.$t("operation.error"));
                    }
                });
            } else {
                this.$message.error(this.$t("role.placeholder.placePerson"));
            }
        },
        //取消按钮
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "addDialog",
            });
            this.loading = false;
        },
    },
};
</script>