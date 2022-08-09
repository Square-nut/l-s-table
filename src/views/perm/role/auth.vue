<template>
    <hos-tabs
        v-model="activeName"
        @tab-click="handleClick"
        class="role-tabs"
    >
        <hos-tab-pane :label="$t('role.menuPermissions')" name="first">
            <hos-alert
                :title="$t('role.placeholder.authPrompt')"
                :closable="false"
                type="info"
                v-if="this.code != 'sub-admin'"
            ></hos-alert>
            <hos-alert
                :title="$t('role.placeholder.authsubAdmin')"
                :closable="false"
                type="info"
                v-if="this.code == 'sub-admin'"
            ></hos-alert>
            <!-- <span>{{}}</span> -->
            <hos-input
                class="mt10"
                :placeholder="$t('common.placeholder.key')"
                clearable
                suffix-icon="hos-icom-find"
                v-model="filterText"
            ></hos-input>
            <div class="margin10">
                <hos-checkbox
                    v-model="isCheckAll"
                    @change="checkStatusChanged"
                    >{{ $t("common.isChooseAll") }}</hos-checkbox
                >
                <hos-checkbox @change="expand">{{
                    $t("common.expandOrCollapse")
                }}</hos-checkbox>
                <!-- <hos-checkbox v-model="menuCheckStrictly">{{$t('common.FatherOrSonLinkage')}}</hos-checkbox> -->
            </div>
            <div class="user-tree">
                <hos-tree
                    ref="treeRef"
                    :data="treeData"
                    @check="checkClick"
                    show-checkbox
                    node-key="id"
                    :default-expand-all="false"
                    :filter-node-method="filterNode"
                ></hos-tree>
            </div>
            <div class="dialog-footer">
                <hos-button
                    type="primary"
                    @click="cancel"
                    v-has-permi="{ key: 'base:perm:role:grantCancel' }"
                    >{{ $t("operation.cancel") }}</hos-button
                >
                <hos-button
                    type="success"
                    @click="save"
                    v-has-permi="{ key: 'base:perm:role:grantSave' }"
                    >{{ $t("operation.save") }}</hos-button
                >
            </div>
        </hos-tab-pane>
        <hos-tab-pane
            :label="$t('role.dataPermissions')"
            name="second"
            v-if="this.code != 'sub-admin'"
        >
            <hos-alert
                :title="$t('role.placeholder.authPrompt')"
                :closable="false"
                type="info"
                v-if="this.code != 'sub-admin'"
            ></hos-alert>
            <hos-input
                class="mt10"
                :placeholder="$t('common.placeholder.key')"
                clearable
                suffix-icon="hos-icom-find"
                v-model="filterText1"
            ></hos-input>
            <div class="margin10">
                <hos-checkbox v-model="isCheckAll1" @change="checkChanged">{{
                    $t("common.isChooseAll")
                }}</hos-checkbox>
                <hos-checkbox @change="expandTree">{{
                    $t("common.expandOrCollapse")
                }}</hos-checkbox>
                <!-- <hos-checkbox v-model="menuCheckResource">{{$t('common.FatherOrSonLinkage')}}</hos-checkbox> -->
            </div>
            <div class="user-tree">
                <hos-tree
                    ref="tree"
                    :data="treeScope"
                    @check="checkClickScope"
                    show-checkbox
                    node-key="id"
                    :default-expand-all="false"
                    :filter-node-method="filterScope"
                ></hos-tree>
            </div>
            <div class="dialog-footer">
                <hos-button
                    type="primary"
                    @click="cancel"
                    v-has-permi="{ key: 'base:perm:role:grantCancel' }"
                    >{{ $t("operation.cancel") }}</hos-button
                >
                <hos-button
                    type="success"
                    @click="saveScope"
                    v-has-permi="{ key: 'base:perm:role:grantSaveScope' }"
                    >{{ $t("operation.save") }}</hos-button
                >
            </div>
        </hos-tab-pane>
        <hos-tab-pane
            :label="$t('role.pageElementPermissions')"
            name="third"
            class="authtab"
            v-if="this.code != 'sub-admin'"
        >
            <hos-container class="tab3">
                <hos-aside class="w200">
                    <hos-input
                        :placeholder="$t('common.placeholder.key')"
                        clearable
                        suffix-icon="hos-icom-find"
                        v-model="filterNodeResource"
                    ></hos-input>
                    <hos-tree
                        ref="treeResource"
                        node-key="id"
                        :data="resourceTree"
                        :default-expand-all="false"
                        :defaultExpandFirst="false"
                        @node-click="clickNode"
                        :filter-node-method="NodeResource"
                    ></hos-tree>
                </hos-aside>
                <hos-main>
                    <hos-tabs
                        type="second-level"
                        @tab-click="changeHead"
                        v-model="pageId"
                        class="tabActive mb10"
                    >
                        <hos-tab-pane
                            v-for="(item, index) in BtnArr"
                            :key="'BtnArr' + index"
                            :label="item.name"
                            :name="item.pageId"
                            class="margin1"
                        ></hos-tab-pane>
                    </hos-tabs>
                    <perm :roleId="id" :pageId="pageId" :uid="uid"></perm>
                    <!-- 	<hos-tag  v-for="(item, index) in BtnArr" :key="'BtnArr' + index" :class="active==index?'style-button':''" @click="changeHead(item.pageId,index)" class="margin1">{{item.name}}</hos-tag>
					<perm :roleId="id" :pageId="pageId" :uid="uid"></perm> -->
                </hos-main>
            </hos-container>
        </hos-tab-pane>
    </hos-tabs>
</template>
<script type="text/javascript">
import perm from "../../sys/page-pre/perm.vue";
export default {
    //props: ['id','callback'],
    props: {
        id: String,
        code: String,
        callback: Function,
        status: String,
    },
    components: {
        perm: perm,
    },
    data() {
        return {
            activeName: "first",
            active: 0,
            isTrue: false,
            isCheckAll: "", //是否选中全部
            isCheckAll1: "", //是否选中全部
            menuCheckResource: false,
            menuCheckStrictly: false,
            treeData: [], // 菜单权限树结构数据
            treePrem: [], // 数据权限树结构数据
            resourceTree: [], //已授权菜单树
            filterText: "", // 树检索框默认显示
            filterText1: "",
            filterNodeResource: "",
            loading: false,
            selection: [],
            tableData: [],
            treeScope: [],
            pageId: "",
            uid: "authDialog",
            permList: [],
            BtnArr: [],
        };
    },
    watch: {
        // 监听树结构的过滤条件
        filterText(val) {
            this.$refs.treeRef.filter(val);
        },
        filterText1(val) {
            this.$refs.tree.filter(val);
        },
        filterNodeResource(val) {
            this.$refs.treeResource.filter(val);
        },
    },

    created() {
        this.initTree();
    },
    methods: {
        handleClick(tab, event) {
            if (tab.name == "first") {
                this.dialogWidth = "400px";
            } else if (tab.name == "second") {
                this.dialogWidth = "400px";
                this.initTree();
            } else {
                this.dialogWidth = "1200px";
                this.treeResource();
            }
            this.callback(this.dialogWidth);
        },
        // 展开/折叠
        expand() {
            this.isExpand = !this.isExpand;
            const nodes = this.$refs.treeRef.getAllNodes();
            for (let i in nodes) {
                nodes[i].expanded = this.isExpand;
            }
        },
        expandTree() {
            this.isExpand = !this.isExpand;
            const nodes = this.$refs.tree.getAllNodes();
            for (let i in nodes) {
                nodes[i].expanded = this.isExpand;
            }
        },
        // 树权限（父子联动js部分）
        /* 	handleChecked (value, type) {
			this.menuCheckStrictly = value ? true : false
			}, */
        checkClick(data, not) {
            let isCheck = false;
            if (not.checkedKeys.includes(data.id)) {
                isCheck = true;
            }

            let nodes = this.$refs.treeRef.getAllNodes();
            if (this.menuCheckStrictly) {
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
        //找到该节点的父节点的id
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
        checkClickScope(data, not) {
            let isCheck = false;
            if (not.checkedKeys.includes(data.id)) {
                isCheck = true;
            }

            let nodes = this.$refs.tree.getAllNodes();
            if (this.menuCheckResource) {
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
        /* handleChecked (value, type) {
			this.menuCheckResource = value ? true : false
			}, */
        // 树检索过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        filterScope(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        NodeResource(value, data) {
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
        checkChanged() {
            if (this.isCheckAll1) {
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedNodes(this.treeScope);
                });
            } else {
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedKeys([]);
                });
            }
        },
        // 初始化树
        initTree() {
            let roleId = {
                roleId: this.id,
            };
            //获取资源树和获取已授权资源回显在树上
            this.$api("perm_role.getTree").then((response) => {
                this.treeData = response.data;
                this.$api("perm_role.getMenuTree", roleId).then((response) => {
                    let menuIdList = response.data;
                    if (menuIdList != null && menuIdList.length > 0) {
                        menuIdList = menuIdList.filter((menuId) => {
                            let node = this.$refs.treeRef.getNode(menuId);
                            return node.isLeaf;
                        });
                        this.$refs.treeRef.setCheckedKeys(menuIdList, false);
                    }
                });
            });
            //获取数据权限树
            this.$api("perm_role.getScopeTree", roleId).then((response) => {
                this.treeScope = response.data;
                this.$api("perm_role.getTreeScope", roleId).then((response) => {
                    let treeId = response.data;
                    if (treeId != null && treeId.length > 0) {
                        treeId = treeId.filter((menuId) => {
                            let node1 = this.$refs.tree.getNode(menuId);
                            return node1.isLeaf;
                        });
                        this.$refs.tree.setCheckedKeys(treeId, false);
                    }
                });
            });
        },
        //获取已授权的资源树
        treeResource() {
            let roleId = {
                roleId: this.id,
            };
            this.$api("perm_role.getTreeResource", this.id).then((response) => {
                this.resourceTree = response.data;
                this.$nextTick(() => {
                    let firstNode = document.querySelector(
                        "#pane-third .hos-tree-node"
                    );
                    firstNode.click();
                });
            });
        },
        //树的点击事键
        clickNode(data) {
            // 选中树节点
            let resourceId = {
                resourceId: data.id,
            };
            this.BtnArr = []; //清空按钮
            this.$api("perm_role.pageList", resourceId).then((res) => {
                /* this.$nextTick(() => {
						this.$refs.treeResource.setCurrentKey(res.data[0].id)
					}) */
                if (res.data.length > 0) {
                    for (var i = 0; i < res.data.length; i++) {
                        var obj = {};
                        obj.name = res.data[i].name;
                        obj.pageId = res.data[i].id;
                        this.BtnArr.push(obj);
                    }
                }
                if (res.data.length > 0) {
                    this.pageId = res.data[0].id;
                }
                //this.pagePresetList(0);
            });
        },
        //切换表单时修改表头
        changeHead(tab, event) {
            this.active = tab.index;
            this.pageId = tab.name; //this.pagePresetList(i);
        },
        //取消按钮
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "authDialog",
            });
            this.loading = false;
        },
        //保存
        save() {
            let trees1 = [];
            let trees = [];
            let ids = []; //获取选中id集合
            trees = this.$refs.treeRef.getCheckedNodes();
            trees1 = this.$refs.treeRef.getHalfCheckedNodes();
            if (trees.length > 0) {
                for (var i = 0; i < trees.length; i++) {
                    ids.push(trees[i].id);
                }
            }
            if (trees1.length > 0) {
                for (var i = 0; i < trees1.length; i++) {
                    ids.push(trees1[i].id);
                }
            }
            //转换成字符串
            let resourceIds = ids.join(",");
            let obj = {
                resourceIds: resourceIds,
                roleId: this.id,
            };
            this.$api("perm_role.getgrant", obj).then((res) => {
                if (res && res.code == "200") {
                    this.$message.success(this.$t("operation.success"));
                    //this.cancel(),
                    this.$store.commit("UPDATE_TABLE", {
                        _uid: "table1",
                    });
                } else {
                    this.$message.error(this.$t("operation.error"));
                }
            });
        },
        //保存数据权限
        saveScope() {
            let trees = [];
            let trees1 = [];
            let ids = []; //获取选中id集合
            trees = this.$refs.tree.getCheckedNodes();
            if (trees != null && trees.length > 0) {
                for (var i = 0; i < trees.length; i++) {
                    let node = trees[i];
                    if (node.type == "S") {
                        ids.push(node.id);
                    }
                }
                /* 	if(trees.length > 0) {
						for(var i = 0; i < trees.length; i++) {
							ids.push(trees[i].id);
							}
						} */
            }
            /* 	trees1 = this.$refs.tree.getHalfCheckedNodes();
				if(trees1.length > 0) {
					for(var i = 0; i < trees1.length; i++) {
						ids.push(trees1[i].id);
					}
				} */
            //转换成字符串
            let scopeDataIds = ids.join(",");
            let obj = {
                scopeDataIds: scopeDataIds,
                roleId: this.id,
            };
            this.$api("perm_role.getScope", obj).then((res) => {
                if (res && res.code == "200") {
                    this.$message.success(this.$t("operation.success"));
                    //this.cancel(),
                    this.$store.commit("UPDATE_TABLE", {
                        _uid: "table1",
                    });
                } else {
                    this.$message.error(this.$t("operation.error"));
                }
            });
        },
    },
};
</script>
