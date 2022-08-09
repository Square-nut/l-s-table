<template>
	<hos-container class="base-container base-sys-dict h-fit">
		<hos-aside class="">
			<hos-card class="box-card" title="数据字典类型">
				<div class="pt10 pr10">
					<hos-input  :placeholder="$t('common.placeholder.key')" clearable suffix-icon="hos-icom-find" v-model="filterText"></hos-input>
					<hos-button-group class="hos">
						<hos-button  icon="hos-icom-add" @click="addOrEdit('insert')" v-has-permi="{key:'base:sys:category:add'}"></hos-button>
						<hos-button  icon="hos-icom-edit" @click="addOrEdit('update')" v-has-permi="{key:'base:sys:category:edit'}"></hos-button>
						<hos-button  icon="hos-icom-cancel" type="cut" @click="deleteCategory()" v-has-permi="{key:'base:sys:category:del'}"></hos-button>
						<!-- <hos-divider direction="vertical"></hos-divider> -->
						<i type="cut" v-has-permi="{key:'base:sys:category:del'}"></i>
						<hos-button @click="$refs.treeRef.expandAll()"  icon="hos-icon-folder-opened">{{$t("operation.expand")}}</hos-button>
						<hos-button @click="$refs.treeRef.collapseAll()"  icon="hos-icon-folder">{{$t("operation.collapse")}}</hos-button>
					</hos-button-group>
				</div>
				
				<hos-tree class="main-tree" ref="treeRef" node-key="id" :data="treeData" :defaultExpandFirst="false" @node-click="clickNode" :filter-node-method="filterNode"
				></hos-tree>
			</hos-card>
			
		</hos-aside>
		<hos-main class="brd4 hidden">
			<hos-biz-table :selection="selection" uid="table" :cols="cols" :data="selectPage" pagePos="top" :form="form" @selection-change="changeSelection">
				<!-- 检索区域 -->
				<template #form>
					<hos-row :gutter="20">
						<hos-col :span="8">
							<hos-form-item :label="$t('common.code')">
								<hos-input v-model="form.model.code" clearable :placeholder="$t('common.placeholder.code')"></hos-input>
							</hos-form-item>
						</hos-col>
						<hos-col :span="8">
							<hos-form-item :label="$t('common.name')">
								<hos-input v-model="form.model.dictValue" clearable :placeholder="$t('common.placeholder.name')"></hos-input>
							</hos-form-item>
						</hos-col>
						<hos-col :span="8">
							<hos-form-item label-width="20px">
								<hos-biz-button run="form.search" type="primary" >{{ $t("operation.query") }}</hos-biz-button>
								<hos-biz-button run="form.reset" type="primary" >{{$t("operation.reset")}}</hos-biz-button>
							</hos-form-item>
						</hos-col>

					</hos-row>
				</template>=
					<!-- 操作列按钮 -->
					<template #operation="{ row }">
						 <hos-tooltip class="pl5 pr5 cursor-pointer"  :content="$t('operation.edit')" v-has-permi="{key:'base:sys:dict:edit'}">
							<i class="hos-icom-edit" @click="editDialog(row)"></i>
						</hos-tooltip>
						 <hos-tooltip class="pl5 pr5 cursor-pointer"  :content="$t('operation.delete')" v-has-permi="{key:'base:sys:dict:delete'}">
							<i class="hos-icom-cancel" @click="deleteRow(row)"></i>
						</hos-tooltip>
					</template>
			<!-- 	<template #optSlot="{ row }"> -->
					<!--过滤不为"的" 小方块显示-->
				<!-- 	<div v-if="row.hasOwnProperty('optionDesc') &&row.optionDesc!=null"> -->
						<!-- <span v-for="(item, index) in (row.optionDesc||'').split(',')" v-bind:key="index"> -->
							<!-- <hos-tag v-for="(item, index) in (row.optionDesc||'').split(',')" :key="index" type="primary" disable-transitions class="mr5">{{item}}</hos-tag> -->
						<!-- </span> -->
				<!-- 	</div>
					<div else-if></div>
				</template> -->
				<!-- 表格上方按钮 -->
				<template #toolbar>
					<hos-button-group class="hos">
						<hos-button @click="addDialog()" icon="hos-icom-add" v-has-permi="{key: 'base:sys:dict:add'}" :title="$t('operation.add')">{{$t("operation.add")}}</hos-button>
						<hos-button @click="deletion()" icon="hos-icom-cancel" :title="$t('operation.delete')" v-has-permi="{key: 'base:sys:dict:delete'}">{{$t("operation.delete")}}</hos-button>
					</hos-button-group>
				</template>
			</hos-biz-table>
		</hos-main>
		<!-- 弹框 -->
		<hos-biz-dialog :title="addCategory" width="800px" uid="addDialog" :close-on-click-modal="false"></hos-biz-dialog>
		<hos-biz-dialog :title="editDialogTitle" width="1000px" uid="editDialog" :close-on-click-modal="false"></hos-biz-dialog>
	</hos-container>
</template>
<script>
	import { params } from '@components/hos-biz/utils/store-config';
	export default {
		props: [],
		components: {},
		data() {
			return {
				loading: false,
				// 树结构数据
				treeData: [],
				selection: [],
				// 树检索框默认显示
				filterText: "",
				form: {
					labelWidth: 'auto',
					//inline: true,
					model: {
						code: "",
						dictValue: "",
						actived: '',

					}
				},
				cols: [{
						type: "selection",
						align: "center",
						width: "50"
					},
					{
						prop: "code",
						label: this.$t("common.code"),
						//width: "200px",
					},
					{
						prop: "dictValue",
						label: this.$t("common.name"),
						//width: "200px",
					},
					/* {
						prop: "optionDesc",
						label: this.$t("dict.optionDesc"),
						slotName: "optSlot",
						showOverflowTooltip:false,
					}, */
					{
						label: this.$t("common.isActived"),
						width: "120px",
						prop: ({
							row
						}, h) => {
							return h(
								"hos-switch", {
									props: {
										type: "switch",
										value: row.actived,
										activeText: this.$t("common.is"),
										inactiveText: this.$t("common.deny"),
										innerLabel: true
									},
									on: {
										change: (value) => {
											row.actived = value;
											this.updateActived(row)
										}
									}
								},
							);
						}
					},
					{
						label: this.$t("common.operation"),
						width: "80px",
						prop: 'operation',
						slotName: 'operation',
						/* prop: ({
							row
						}, h) => {
							// row 该行的数据
							return(
								<div>
									 <hos-tooltip class="pl5 pr5"  content="编辑" v-has-permi="{key:'base:sys:dict:edit'}"><i class="hos-icom-edit" on-click={ () => {this.editDialog(row)} }></i></hos-tooltip>
									 <hos-tooltip class="pl5 pr5"  content="删除" v-has-permi="{key:'base:sys:dict:delete'}"><i class="hos-icom-cancel" on-click={ () => {this.delete(row)} }></i></hos-tooltip>
								</div>
							)
						} */
					},
				],
				dialogForm: {},
				addCategory: '',
				editDialogTitle: '',
				page: {
					current: 1,
					size: 10,
					total: 0
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
		mounted() {},
		methods: {
			// 树检索过滤
			filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			// 树点击节点
			clickNode(data) {
				if(data.id !== this.selectTreeId) {
					// 选中树节点
					this.selectTreeId = data.id;
					this.treeName= data.label,
					this.form.model.dictCategoryId = data.id;
				}
					this.$store.commit("UPDATE_TABLE", {
						_uid: 'table'
					});
			},
			// 初始化树
			initTree() {
				this.$api("sys_dict.getTreeNodes", params).then((res) => {
					if(res && res.code == '200') {
						this.treeData = res.data;
						/* this.$nextTick(() => {
							let firstNode = document.querySelector('.hos-tree-node')
							firstNode.click();
						}) */
					}
				});
			},
			//查询表格
			selectPage(params) {
				return this.$api("sys_dict.list", params);
			},
			//修改激活状态
			updateActived(row) {
				this.$confirm(
						this.$t("common.confirm.actived")
						.replace(
							"{0}",
							row.actived ?
							this.$t("common.actived.true") :
							this.$t("common.actived.false")
						)
						.replace("{1}", row.dictValue),this.$t("login.label.info"),{type: "warning"}
					)
					.then(() => {
						this.$api("sys_dict.updateActived", {
							ids: row.id,
							actived: row.actived,
						}).then((res) => {
							if(res && res.code == '200') {
								this.$message.success(this.$t("operation.success"));
							} else {
								row.actived = !row.actived
								this.$message.error(this.$t("operation.error"));
							}
						});
					})
					.catch(() => {
						row.actived = !row.actived
						//this.$message.error(this.$t("operation.error"));
					});
			},
			//左侧树的新增编辑
			addOrEdit(row) {
				let props = null
				if(row === "update") {
					// 编辑
					this.addCategory = this.$t("operation.edit") + this.$t("dict.dictCategory");
					this.$store.commit("OPEN_DIALOG", {
						component: require("./category_edit.vue").default,
						_uid: "addDialog",
						props: {
							id: this.selectTreeId,
							treeData: this.treeData,
							initTreeMethod: this.initTree,
							status: "edit:",
						}
					});
				} else {
					this.addCategory = this.$t("operation.add") + this.$t("dict.dictCategory");
					this.$store.commit("OPEN_DIALOG", {
						component: require("./category_edit.vue").default,
						_uid: "addDialog",
						props: {
							id: '',
							treeData: this.treeData,
							initTreeMethod: this.initTree,
							status: "add:",
						}
					});
				}
			},
			//删除字典分类
			deleteCategory() {
				if(this.treeName!=null&&this.treeName!=undefined){
					this.$confirm(this.$t("common.confirm.delete",[this.treeName]),this.$t("operation.delete"),{type: "delete"})
					.then(() => {
						this.$api("sys_dict.deleteCategory", this.selectTreeId).then((response) => {
							if(response && response.code == '200') {
								this.$message.success(this.$t("operation.success"));
								this.initTree();
								this.$store.commit("UPDATE_TABLE", {
									_uid: 'table'
								})
							} else if(response.code=='A0008') {
								 this.$message.error(this.$t('common.tipMessage.'+response.code,[response.msg]));
							} else {
								this.$message.error(this.$t("operation.error"));
							}
						});
					})
				}else{
					this.$message.warning(this.$t('common.confirm.dataNull'));
				}
			},
			// 新增字典弹框
			addDialog() {
				if(this.form.model.dictCategoryId != "" && this.form.model.dictCategoryId != undefined) {
					this.editDialogTitle = this.$t("operation.add") + this.$t("dict.title");
					this.$store.commit("OPEN_DIALOG", {
						component: require("./dict_edit.vue").default,
						_uid: "editDialog",
						props: {
							id: '',
							dictCategoryId: this.selectTreeId,
							treeData: this.treeData,
							//initTree: this.initTree(),
							status: "add:",
						}
					});
				} else {
					this.$message.warning(this.$t("dict.confirm.module"));
				}
			},
			editDialog(row) {
				this.editDialogTitle = this.$t("operation.edit") + this.$t("dict.title");
				this.$store.commit("OPEN_DIALOG", {
					component: require("./dict_edit.vue").default,
					_uid: "editDialog",
					props: {
						id: row.id,
						treeData: this.treeData,
						status: "edit:",
					}
				});
			},
			// 多选框选中数据
			changeSelection(selection) {
				this.ids = selection.map((item) => item.id);
				this.names = selection.map((item) => item.dictValue);
				this.batchDeleteButtonDisabled = !selection.length;
			},
			//批量删除字典
			deletion() {
				if(this.ids!=undefined){
					if(this.ids.length > 0) {
						this.$confirm(this.$t("common.confirm.deleteAll"),this.$t("operation.delete"),{type: "delete"})
							.then(() => {
								this.$api("sys_dict.deletion", {
									ids: this.ids.join(","),
								}).then((res) => {
									if(res && res.code == '200') {
										this.$store.commit("UPDATE_TABLE", {
											_uid: "table"
										});
										this.$message.success(this.$t("operation.success"));
									} else {
										this.$message.error(this.$t("operation.error"));
									}
								});
							})
							.catch(() => {
								//this.$message.error(this.$t("operation.error"));
							});
					} else {
						this.$message.warning(this.$t('common.confirm.dataNull'));
					}
				} else {
					 this.$message.warning(this.$t('common.confirm.dataNull'));
				}
			},
			//单个删除
			deleteRow(row) {
				this.$confirm(this.$t("common.confirm.delete",[row.dictValue]),this.$t("operation.delete"),{type: "delete"})
					.then(() => {
						if(row) {
							this.$api("sys_dict.deletion", {
								ids: row.id
							}).then((res) => {
								if(res && res.code == '200') {
									this.$message.success(this.$t("operation.success"));
									this.$store.commit("UPDATE_TABLE", {
										_uid: 'table'
									})
								} else {
									this.$message.error(this.$t("operation.error"));
								}
							});
						}
					})
			}

		},
	};
</script>
<style lang="scss">
.cursor-pointer{
  cursor: pointer;
}
</style>