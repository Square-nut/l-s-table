<template>
    <div class="user-add-tree" :loading="loading">
        <hos-input
            :placeholder="$t('common.placeholder.key')"
            clearable
            suffix-icon="hos-icom-find"
            v-model="filterText"
        ></hos-input>
        <div class="user-checkbox">
            <!-- <hos-checkbox v-model="isCheckAll" @change="checkStatusChanged">{{$t('common.isChooseAll')}}</hos-checkbox> -->
            <hos-checkbox @change="expand">{{
                $t("common.expandOrCollapse")
            }}</hos-checkbox>
            <!-- <hos-checkbox v-model="menuCheckStrictly" @change="handleChecked($event, 'menu')">{{$t('common.FatherOrSonLinkage')}}</hos-checkbox> -->
        </div>
        <hos-tree
            ref="treeRef"
            :data="treeData"
            @check-change="getTree"
            :check-strictly="true"
            show-checkbox
            node-key="id"
            :default-expand-all="false"
            :filter-node-method="filterNode"
        ></hos-tree>
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
    props: ["id", "activeName", "userId"],
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
            let nodes = this.$refs.treeRef.getAllNodes();
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].checked = this.isCheckAll;
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
        disabledNode(treeData, str) {
            treeData.forEach((item) => {
                if (item.type === str) {
                    item.disabled = false;
                } else {
                    item.disabled = true;
                }
                if (item.children && item.children.length > 0) {
                    this.disabledNode(item.children, str);
                }
            });
        },
        /* //树的点击事键
			 clickNode(data) {
				
				// 选中树节点
					this.id1= data.id
			}, */
        /* 	// 树权限（父子联动js部分）
			handleChecked (value, type) {
			this.menuCheckStrictly = value ? true : false
			}, */
        // 初始化树
        initTree() {
            this.$api("sys_user.getEmployeeTree", this.id).then((response) => {
                this.treeData = response.data;
                //回显
                let treeSelect = [];
                treeSelect.push(this.id);
                this.$refs.treeRef.setCheckedKeys(treeSelect, false);
                //禁用除人员以外的
                this.disabledNode(this.treeData, "employee");
            });
        },
        //树只能单选的处理
        getTree(data, checked) {
            if (checked == false) {
                this.ids = "";
            } else {
                this.ids = data.id;
                if (data.type === "employee") {
                    this.ids = data.id;
                    if (checked) {
                        this.$refs.treeRef.setCheckedKeys([data.id]);
                    }
                }
            }
        },
        //取消按钮
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "addOrgPersonDialog",
            });
            this.loading = false;
        },
        //保存
        save(checked) {
            if (this.ids != null && this.ids != undefined) {
                /*  if(this.ids==undefined){
						this.ids=""
					}  */
                let obj = {
                    userId: this.userId,
                    employeeId: this.ids,
                };
                this.$api("sys_user.RelationPerson", obj).then((res) => {
                    if (res && res.code == "200") {
                        this.loading = false;
                        this.$message.success(this.$t("operation.success"));
                        this.cancel();
                        if (this.activeName == "first") {
                            this.$store.commit("UPDATE_TABLE", {
                                _uid: "table1",
                            });
                        } else if (this.activeName == "second") {
                            this.$store.commit("UPDATE_TABLE", {
                                _uid: "table2",
                            });
                        } else if (this.activeName == "third") {
                            this.$store.commit("UPDATE_TABLE", {
                                _uid: "table3",
                            });
                        } else {
                            this.$store.commit("UPDATE_TABLE", {
                                _uid: "table4",
                            });
                        }
                    } else {
                        this.$message.error(this.$t("operation.error"));
                    }
                });
            } else {
                this.$message.error(
                    this.$t("role.placeholder.placeRelationPerson")
                );
            }
        },
    },
};
</script>