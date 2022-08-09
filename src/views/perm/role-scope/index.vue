<template>
  <hos-container class="base h-fit base-perm-scope">
    <hos-aside class="brd4 hidden" v-if="baseScopeResource=='true'">
			<hos-card shadow="never" class="box-card" :title="$t('permRoleScope.secondAdminTree')">
        <div class="pt10 pr10">
          <hos-input
            :placeholder="$t('common.placeholder.key')"
            suffix-icon="hos-icom-find"
            v-model="filterText"
          ></hos-input>
          <hos-button-group class="hos">
            <hos-button  icon="hos-icom-add" @click="addDialog()" v-if="isAddShow===true"  v-has-permi="{key:'base:perm:role-scope:add'}"></hos-button>
            <hos-button  icon="hos-icom-edit" @click="editDialog()" v-if="isEditShow===true" v-has-permi="{key:'base:perm:role-scope:edit'}"></hos-button>
            <hos-button  icon="hos-icom-cancel" @click="deleteRole()" v-has-permi="{key:'base:perm:role-scope:del'}"></hos-button>
            <hos-button icon="hos-icom-trans-pat" @click="assignUser()" v-if="isEditShow===true" v-has-permi="{key:'base:perm:role-scope:assignUser'}"></hos-button>
            <i type="cut" v-has-permi="{key: ['base:perm:role-scope:del','base:perm:role-scope:assignUser']}"></i>
            <hos-button @click="expand(true)" icon="hos-icon-folder-opened">{{ $t('operation.expand')}}</hos-button>
            <hos-button @click="expand(false)" icon="hos-icon-folder">{{$t('operation.collapse')}}</hos-button>
          </hos-button-group>
        </div>
        
        <hos-tree
          class="main-tree"
          :data="treeData"
          node-key="id"
          :default-expand-all="false"
          @node-click="treeNodeClick"
          :props="props"
          ref="tree"
          :filter-node-method="filterNode"
          :check-strictly="true"
          check-on-click-node
        ></hos-tree>
      </hos-card>
      <!-- <span class="pb10" style="display: inline-block">{{
        $t('permRoleScope.secondAdminTree')
      }}</span> -->
      
    </hos-aside>
    <hos-main class="tabs-table h-fit" v-if="baseScopeResource=='true'&&isEditShow==true">
      <!--  :before-leave="logActiveName" -->
      <hos-tabs
        type="system"
        class="userTab tabs-table brd4 hidden h-fit box"
        v-model="activeName" 
        @tab-click="handleClick"
      >
        <hos-tab-pane name="resource">
          <span slot="label"
            ><i class="hos-icom-format-line-dott"></i>&nbsp;{{
              $t('permRoleScope.resource')
            }}</span
          >
          <hos-input
            clearable
            :placeholder="$t('common.placeholder.key')"
            suffix-icon="hos-icom-find"
            v-model="filterTextResource"
          ></hos-input>
          <div class="mb10 mt10">
            <hos-checkbox
              @change="resourceCheckStatusChanged"
              v-model="resourceIsCheckAll"
              >{{ $t('common.isChooseAll') }}</hos-checkbox
            >
            <hos-checkbox @change="resourceExpand">{{
              $t('common.expandOrCollapse')
            }}</hos-checkbox>
            <!-- <hos-checkbox v-model="resourceCheckStrictly">{{$t('common.FatherOrSonLinkage')}}</hos-checkbox> -->
          </div>
          <!--  @check="resourcecheckClick" -->
          <div class="resource-tree-wrap">
            <hos-tree
              class="h-fit"
              :data="resourceTreeData"
              node-key="id"
              :default-expand-all="false"
              :props="props"
              ref="treeResource"
              :check-strictly="false"
              :filter-node-method="filterNode"
              show-checkbox
            ></hos-tree>
          </div>
          <div class="tc">
            <hos-button
            type="success"
            @click="save"
            size="mini"
            v-has-permi="{ key: 'base:perm:scope:save' }"
            >{{ $t('operation.save') }}</hos-button
          >
          </div>
        </hos-tab-pane>
        <hos-tab-pane name="role">
          <span slot="label"
          ><i class="hos-icon-user"></i>&nbsp;{{
            $t('permRoleScope.role')
          }}</span
        >
          <hos-input
            clearable
            :placeholder="$t('common.placeholder.key')"
            suffix-icon="hos-icom-find"
            v-model="filterTextRole"
          ></hos-input>
          <div class="mt10 mb10">
            <hos-checkbox
              @change="roleCheckStatusChanged"
              v-model="roleIsCheckAll"
              >{{ $t('common.isChooseAll') }}</hos-checkbox
            >
            <hos-checkbox @change="roleExpand">{{
              $t('common.expandOrCollapse')
            }}</hos-checkbox>
            <!-- <hos-checkbox v-model="roleCheckStrictly">{{$t('common.FatherOrSonLinkage')}}</hos-checkbox> -->
          </div>
          <!-- @check="roleCheckClick" -->
          <div class="resource-tree-wrap">
            <hos-tree
              :data="roleTreeData"
              node-key="id"
              :default-expand-all="false"
              :props="props"
              ref="treeRole"
              :check-strictly="true"
              :filter-node-method="filterNode"
              show-checkbox            
            ></hos-tree>
          </div>
          <div class="tc">
            <hos-button
            type="success"
            @click="save"
            size="mini"
            v-has-permi="{ key: 'base:perm:scope:save' }"
            >{{ $t('operation.save') }}</hos-button
          >
          </div>
        </hos-tab-pane>
      </hos-tabs>
    </hos-main>
    <div v-if="baseScopeResource=='false'||isEditShow==false" class="backg">
      <img src="../../../assets/images/noData.png" />
      <div v-if="baseScopeResource=='false'">{{ $t('permRoleScope.nodata') }}</div>
      <div v-if="isEditShow==false">{{ $t('permRoleScope.noPermissionTemporarily') }}</div>
    </div>
    <hos-biz-dialog :title="editDialogTitle" width="800px" uid="editDialog" :close-on-click-modal="false"></hos-biz-dialog>
  </hos-container>
</template>
<script type="text/javascript">
export default {
  props: ['roleId'],
  data() {
    return {
      activeName_sub: 'resource',
      leftCheckRoleId: '',
      activeName: 'resource',
      resourceIsCheckAll: false,
      roleIsCheckAll: false,
      treeData: [], // 次级角色树结构数据
      resourceTreeData: [], //资源树
      roleTreeData: [], //角色树
      filterText: '', // 树检索框默认显示
      filterTextResource: '', // 资源树检索框默认显示
      filterTextRole: '', // 角色树检索框默认显示
      resourceIsExpand: false,
      roleIsExpand: false,
      loading: false,
      resourceCheckStrictly: false,
      roleCheckStrictly: false,
      baseScopeResource:null,
      editDialogTitle: "", //弹框名称
      props: {
        id: 0,
        isLeaf: 'leaf',
      },
      isAddShow: null,
      isEditShow:null,
     };
  },
  watch: {
    // 监听树结构的过滤条件
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    filterTextResource(val) {
      this.$refs.treeResource.filter(val);
    },
    filterTextRole(val) {
      this.$refs.treeRole.filter(val);
    },
  },
  created() {
    this.loadTreeNodes();
    this.loadResourceTreeNodes();
    this.loadRoleTreeNodes(); 
  },
  mounted(){
     this.baseScopeResource =this.$store.getters.baseScopeResource;
  },
  methods: {
    // 树检索过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 展开/折叠
    expand(type) {
      this.isExpand = type;
      const nodes = this.$refs.tree.getAllNodes();
      for (let i in nodes) {
        nodes[i].expanded = this.isExpand;
      }
    },
    //左侧树复选框点击事件
    roleClick(data, not) {
      //取消其他选中,只选中自身
      let nodes = this.$refs.tree.getAllNodes();
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].data.value != data.value) {
          nodes[i].checked = false;
        }
      }
      if (not.checkedKeys.length > 0) {
        this.leftCheckRoleId = data.id;
      } else {
        this.leftCheckRoleId = '';
      }
    },
    //左侧树node点击事件
    treeNodeClick(data, note, obj) {
       //禁用不能新增的
       this.isAddShow = data.add;
       this.isEditShow = data.edit;   
       this.leftCheckRoleId = data.id;
       this.name=data.label;
       if(this.isEditShow==true){
          if (this.activeName == 'resource') {
            this.loadResourceCheckNodes(data.id);
          } else if (this.activeName == 'role') {
            this.loadRoleCheckNodes(data.id);
          }
       }
      
    },
    assignUser() {
				this.$router.push({
					path: "/base-perm-role-assign-user",
					query: {
						roleId: this.leftCheckRoleId,
						title:this.name,
						type:2
					},
				});
			},
    //右侧页签点击
    handleClick() {
      if (this.treeData && this.treeData.length > 0) {
        if (this.activeName == 'resource') {
          this.loadResourceCheckNodes(this.leftCheckRoleId);
        } else if (this.activeName == 'role') {
          this.loadRoleCheckNodes(this.leftCheckRoleId);
        }
      }
    },
    // 初始化次级角色树树
    loadTreeNodes() {
      this.$api('perm_role_scope.getRoleTree', '').then((res) => {
        if (res && res.code == 200) {
          this.treeData = res.data;
          this.$nextTick(() => {
            let firstNode = document.querySelector('.hos-tree-node');
            firstNode && firstNode.click();
          });
        } else {
          this.$message.error(this.$t('operation.error'));
        }
      });
    },
    // 初始化资源树
    loadResourceTreeNodes(node, resolve) {
      let userId = 0;
      this.$api('sys_resource.getTreeNodes', '').then((res) => {
        if (res && res.code == 200) {
          this.resourceTreeData = res.data;
        } else {
          this.$message.error(this.$t('operation.error'));
        }
      });
    },
    // 初始化角色树
    loadRoleTreeNodes(node, resolve) {
      let userId = 0;
      this.$api('perm_role.getTreeNodes', '').then((res) => {
        if (res && res.code == 200) {
          this.roleTreeData = res.data;
        } else {
          this.$message.error(this.$t('operation.error'));
        }
      });
    },
    // 新增角色
			addDialog() {
				this.editDialogTitle = this.$t("operation.add") + this.$t("role.title");
				this.$store.commit("OPEN_DIALOG", {
					component: require("./edit.vue").default,
					_uid: "editDialog",
					props: {
            id:"",
						roleId: this.leftCheckRoleId,
            type:"add",
						status: "add:",
            initTreeMethod: this.loadTreeNodes,
					},
				});
			},
    //修改角色
			editDialog() {
				this.editDialogTitle = this.$t("operation.edit") + this.$t("role.title");
				this.$store.commit("OPEN_DIALOG", {
					component: require("./edit.vue").default,
					_uid: "editDialog",
					props: {
            id:this.leftCheckRoleId,
						roleId:this.leftCheckRoleId,
            type:"edit",
						status: "edit:",
            initTreeMethod: this.loadTreeNodes,
					},
				});
			},
      //删除
      deleteRole(){
        if(this.leftCheckRoleId!=null&&this.leftCheckRoleId!=""){
          this.$confirm(this.$t("common.confirm.deleteAll"),this.$t("operation.delete"),{type: "warning"})
							.then(() => {
								this.$api("perm_role.deletion", {ids:this.leftCheckRoleId}).then((res) => {
									if(res && res.code == '200') {
										this.loadTreeNodes();
										this.$message.success(this.$t("operation.success"));
									} else if(res.code=="A0006"){
										this.$message.error(res.msg);
										}else {
										this.$message.error(this.$t("operation.error"));
									}
								});
							})
        }else{
          this.$message.warning(this.$t('common.confirm.dataNull'));
        }
      },
      //角色选中的资源加载
    loadResourceCheckNodes(id) {
      this.$api('perm_role_scope.getResourceCheckNodes', id).then((res) => {
        if (res && res.code == 200) {
          //this.resourceExpand(true);
          // this.resourceCheckStatusChanged(false);
          let menuIdList = res.data;
            if(menuIdList==null||menuIdList.length==0||menuIdList==undefined||menuIdList[0]==""){
              this.$refs.treeResource.setCheckedKeys([]);
            }
        /*   if (this.$refs.treeResource.getAllNodes().length == menuIdList.length) {
            this.resourceIsCheckAll = true;
          } else {
            this.resourceIsCheckAll = false;
          }  */
          if (menuIdList != null && menuIdList.length > 0) {
            menuIdList = menuIdList.filter((menuId) => {
              let node = this.$refs.treeResource.getNode(menuId);
              return node ? node.isLeaf : false;
            });
            this.$refs.treeResource.setCheckedKeys(menuIdList, true);
          }
          /* let checkR = ',' + res.data + ',';
					const nodes = this.$refs.treeResource.getAllNodes();
					for (let i in nodes) {
						let idStr = ',' + nodes[i].data.id + '';
						if (checkR.indexOf(idStr) > -1) {
							nodes[i].checked = true;
						}
					} */
        } else {
          this.$message.error(this.$t('operation.error'));
        }
      });
    },
    // 资源树展开/折叠
    resourceExpand(type) {
      this.resourceIsExpand = !this.resourceIsExpand;
      if (type != null && type != undefined) {
        this.resourceIsExpand = type;
      }
      const nodes = this.$refs.treeResource.getAllNodes();
      for (let i in nodes) {
        nodes[i].expanded = this.resourceIsExpand;
      }
    },
    // 资源树全选/全部选
    resourceCheckStatusChanged() {
      // this.resourceIsCheckAll = !this.resourceIsCheckAll;
      // if (this.resourceIsCheckAll) {
      //   //this.resourceExpand(true);
      // }
      // if (type != null && type != undefined) {
      //   this.resourceIsCheckAll = type;
      // }
      // let nodes = this.$refs.treeResource.getAllNodes();
      // for (let i = 0; i < nodes.length; i++) {
      //   nodes[i].checked = this.resourceIsCheckAll;
      // }
      if (this.resourceIsCheckAll) {
        this.$nextTick(() => {
          this.$refs.treeResource.setCheckedNodes(this.resourceTreeData);
        });
      } else {
        this.$nextTick(() => {
          this.$refs.treeResource.setCheckedKeys([]);
        });
      }
    },
    /* //资源树父子联动
    resourcecheckClick(data, not) {
      let isCheck = false;
      if (not.checkedKeys.includes(data.id)) {
        isCheck = true;
      }

      let nodes = this.$refs.treeResource.getAllNodes();
      if (nodes.length == not.checkedKeys.length) {
        this.resourceIsCheckAll = true;
      } else {
        this.resourceIsCheckAll = false;
      }
      if (this.resourceCheckStrictly) {
        let pIdStr = ',' + data.id + ',';
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].data.parentId != '0') {
            if (pIdStr.indexOf(nodes[i].data.parentId) > -1) {
              pIdStr = pIdStr + ',' + nodes[i].data.id + ',';
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
    }, */
    roleCheckClick(data, not) {
      let nodes = this.$refs.treeRole.getAllNodes();
      if (nodes.length == not.checkedKeys.length) {
        this.roleIsCheckAll = true;
      } else {
        this.roleIsCheckAll = false;
      }
    },
    //找到该节点的父节点的id
    // getParentIdNoteID(data, pId) {
    //   let ret = 'pId';
    //   if (pId != '0') {
    //     for (let i = 0; i < data.length; i++) {
    //       if (pId == data[i].data.id) {
    //         ret = ret + ',' + data[i].data.id + ',';
    //         if (data[i].data.parentId != 0) {
    //           let rStr = this.getParentIdNoteID(data, data[i].data.parentId);
    //           if (rStr != '') {
    //             ret = ret + ',' + rStr + ',';
    //           }
    //         }
    //       }
    //     }
    //   }

    //   return ret;
    // },
    //次级角色选中的资源加载
    loadRoleCheckNodes(id) {
      this.$api('perm_role_scope.getRoleCheckNodes', id).then((res) => {
        if (res && res.code == 200) {
          let menuIdList = res.data;
            if(menuIdList==null||menuIdList.length==0||menuIdList==undefined||menuIdList[0]==""){
            this.$refs.treeRole.setCheckedKeys([]);
          } 
          /* if (
            this.$refs.treeRole.getAllNodes().length == menuIdList.length
          ) {
            this.roleIsCheckAll = true;
          } else {
            this.roleIsCheckAll = false;
          }  */
          if (menuIdList != null && menuIdList.length > 0) {
            menuIdList = menuIdList.filter((menuId) => {
              let node = this.$refs.treeRole.getNode(menuId);
              return node ? node.isLeaf : false;
            });
            this.$refs.treeRole.setCheckedKeys(menuIdList, true);
          }
        } else {
          this.$message.error(this.$t('operation.error'));
        } 
        });
    },
    // 角色树展开/折叠
    roleExpand(type) {
      this.roleIsExpand = !this.roleIsExpand;
      if (type != null && type != undefined) {
        this.roleIsExpand = type;
      }
      const nodes = this.$refs.treeRole.getAllNodes();
      for (let i in nodes) {
        nodes[i].expanded = this.roleIsExpand;
      }
    },
    // 角色全选/全部选
    roleCheckStatusChanged(type) {
      // this.roleIsCheckAll = !this.roleIsCheckAll;
      // if (this.roleIsCheckAll) {
      //   this.roleExpand(true);
      // }
      // if (type != null && type != undefined) {
      //   this.roleIsCheckAll = type;
      // }
      // let nodes = this.$refs.treeRole.getAllNodes();
      // for (let i = 0; i < nodes.length; i++) {
      //   nodes[i].checked = this.roleIsCheckAll;
      // }
      if (this.roleIsCheckAll) {
        this.$nextTick(() => {
          this.$refs.treeRole.setCheckedNodes(this.roleTreeData);
        });
      } else {
        this.$nextTick(() => {
          this.$refs.treeRole.setCheckedKeys([]);
        });
      }
    },
    //保存
    save() {
      if (this.leftCheckRoleId == '') {
        this.$message.error(this.$t('permRoleScope.leftNotCheckTip'));
        return;
      }
      let ids = '';
      let api = '';
      let trees = null;
      let trees1 = null;
      if (this.activeName == 'resource') {
        trees1 = this.$refs.treeResource.getHalfCheckedNodes();
        trees = this.$refs.treeResource.getCheckedNodes();
         //半选
        if (trees1.length > 0) {
          for (var i = 0; i < trees1.length; i++) {
            if (
              trees1[i].id != '' &&
              trees1[i].id != null &&
              trees1[i].id != undefined
            ) {
              if (ids == '') {
                ids = trees1[i].id;
              } else {
                ids = ids + ',' + trees1[i].id;
              }
            }
          }
        }
        api = 'perm_role_scope.saveResourceCheckNodes';
      } else if (this.activeName == 'role') {
        trees = this.$refs.treeRole.getCheckedNodes();
        api = 'perm_role_scope.saveRoleCheckNodes';
      }
      if (trees.length > 0) {
        for (var i = 0; i < trees.length; i++) {
          if (
            trees[i].id != '' &&
            trees[i].id != null &&
            trees[i].id != undefined
          ) {
            if (ids == '') {
              ids = trees[i].id;
            } else {
              ids = ids + ',' + trees[i].id;
            }
          }
        }
      }
     
      let obj = {
        roleId: this.leftCheckRoleId,
        resourceIds: ids,
        scopeRoleIds: ids,
      };
      this.$api(api, obj).then((res) => {
        if (res && res.code == 200) {
          this.$message.success(this.$t('operation.success'));
        } else {
          this.$message.error(this.$t('operation.error'));
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.base-perm-scope ::v-deep .hos-tree-node .hos-tree-node__expand-icon.hos-icon-document{
  margin-right:0;
}
</style>