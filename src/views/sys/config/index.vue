<template>
	<div class="h-fit base-sys-config">
		<hos-biz-table :selection="selection" uid="table" :cols="cols" :data="selectPage" :form="form" pagePos="top" @selection-change="changeSelection">
			<!-- 检索区域 -->
			<template #form>
				<hos-row :gutter="20">
					<hos-col :span="6">
						<hos-form-item :label="$t('common.code')">
							<hos-input v-model="form.model.code" clearable :placeholder="$t('common.placeholder.code')"></hos-input>
						</hos-form-item>
					</hos-col>
					<hos-col :span="6">
						<hos-form-item :label="$t('common.name')">
							<hos-input v-model="form.model.name" clearable :placeholder="$t('common.placeholder.name')"></hos-input>
						</hos-form-item>
					</hos-col>
					<hos-col :span="12">
						<hos-form-item label-width="20px">
							<hos-biz-button run="form.search" type="primary" >{{ $t("operation.query") }}</hos-biz-button>
							<hos-biz-button run="form.reset" type="primary" >{{ $t("operation.reset") }}</hos-biz-button>
							<hos-button @click="bizLog()" class="fr" type="success">{{ $t("operation.bizLog") }}</hos-button>
						</hos-form-item>
					</hos-col>
				</hos-row>
			</template>
			<!-- 表格上方按钮 -->
			<template #toolbar>
				<hos-button-group class="hos">
					<hos-button @click="addDialog()" icon="hos-icom-add" :title="$t('operation.add')" v-has-permi="{key: 'base:sys:config:add'}">{{$t("operation.add")}}</hos-button>
					<hos-button @click="deletion()" icon="hos-icom-cancel" :title="$t('operation.delete')" v-has-permi="{key: 'base:sys:config:delete'}">{{$t("operation.delete")}}</hos-button>
					<!-- <hos-divider direction="vertical"></hos-divider> -->
					<i type="cut" v-has-permi="{key: 'base:sys:config:delete'}"></i>
					<hos-button  icon="hos-icom-sample-stat" @click="timeLine()" v-has-permi="{key: 'base:sys:config:timeline'}">{{ $t("operation.timeline") }}</hos-button>
				</hos-button-group>
			</template>
			<!-- 操作列按钮 -->
			<template #operation="{ row }">
					<hos-tooltip v-if="row.code!='base-user-org-role'" class="pl5 pr5"  :content="$t('operation.edit')" v-has-permi="{key:'base:sys:config:edit'}">
					<i class="hos-icom-edit" @click="editDialog(row)"></i>
				</hos-tooltip>
					<hos-tooltip v-if="row.code!='base-user-org-role'" class="pl5 pr5"  :content="$t('operation.delete')" v-has-permi="{key:'base:sys:config:delete'}">
					<i class="hos-icom-cancel" @click="deleteRow(row)"></i>
				</hos-tooltip>
			</template>
		</hos-biz-table>
		<!-- 弹框 -->
		<hos-biz-dialog  class="sys-config-edit" :title="editDialogTitle" width="800px" uid="editDialog" :close-on-click-modal="false"></hos-biz-dialog>
		<hos-biz-dialog :title="timeLineDialogTitle" width="40%" uid="timeLineDialog" :close-on-click-modal="false"></hos-biz-dialog>
	</div>
</template>
<script>
	import { params } from '@components/hos-biz/utils/store-config';
	export default {
		props: [],
		components: {},
		data() {
			return {
				loading: false,
				ids: [],
				selection: [],
				row: '',
				form: {
					labelWidth: 'auto',
					//inline: true,
					model: {
						code: "",
						name: ""
					}
				},
				cols: [{
						type: "selection",
						align: "center",
						width: "50",
						selectable: (row, index) => {
							if(row.code == 'base-user-org-role'){
								return false
							}else{
								return true
							}
						}
					},
					{
						prop: "code",
						label: this.$t("common.code"),
						width: "200px",
					},
					{
						prop: "name",
						label: this.$t("common.name"),
						width: "200px",
						showOverflowTooltip:true,
					},
					{
						prop: "value",
						label: this.$t('sysConfig.keyValue'),
						width: "150px",
					},
					{
						prop: "remark",
						showOverflowTooltip:true,
						label: this.$t('common.remark'),
						showOverflowTooltip:true,
					},
					{
						label: this.$t('common.operation'),
						width: "80px",
						prop: 'operation',
						slotName: 'operation',
					},
				],
				dialogForm: {},
				editDialogTitle: '',
				timeLineDialogTitle: "", //生命周期弹窗名
				names: "", //选中数据名称
				page: {
					current: 1,
					size: 10,
					total: 0
				},
			};
		},
		created() {},
		mounted() {},
		methods: {
			//查询表格
			selectPage(params) {
				return this.$api("sys_config.list", params);
			},
			// 新增
			addDialog() {
				this.editDialogTitle = this.$t("operation.add") + this.$t("sysConfig.title");
				this.$store.commit("OPEN_DIALOG", {
					component: require("./edit.vue").default,
					_uid: "editDialog",
					props: {
						id: '',
						status: "add:",
					}
				});
			},
			//修改页面
			editDialog(row) {
				this.editDialogTitle = this.$t("operation.edit") + this.$t("sysConfig.title");
				this.$store.commit("OPEN_DIALOG", {
					component: require("./edit.vue").default,
					_uid: "editDialog",
					props: {
						id: row.id,
						status: "edit:",
					}
				});
			},
			// 多选框选中数据
			changeSelection(rows) {
				this.ids = rows.map((item) => item.id);
				this.names = rows.map((item) => item.name);
			},
			//批量删除
			deletion() {
				if(this.ids!=undefined){
					if(this.ids.length > 0) {
						this.$confirm(this.$t("common.confirm.deleteAll"),this.$t("login.label.info"),{type: "delete"})
							.then(() => {
								this.$api("sys_config.deletion", {
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
				this.$confirm(this.$t("common.confirm.delete",[row.name]),this.$t("operation.delete"),{type: "delete"})
					.then(() => {
						if(row) {
							this.$api("sys_config.deletion", {
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
			},
			// 数据日志页面
			bizLog() {
				// 数据日志组件
				this.$router.push({
					path: "/base-monitor-business-log",
					query: {
						tableName: "t_sys_config",
						title:this.$t("sysConfig.sysConfig"),
						path: "/base-sys-config"
					},
				});
			},
			// 生命周期
			timeLine() {
				this.timeLineDialogTitle = this.$t("timeline.title") + this.names;
				if(this.ids !== undefined && this.ids.length > 0) {
					if(this.ids.length > 1) {
						this.$message.warning(this.$t("timeline.warning"));
						return;
					}
				} else {
					this.$message.warning(this.$t("timeline.please"));
					return;
				}
				this.$store.commit("OPEN_DIALOG", {
					component: require("@sys/components/time-line/index.vue").default,
					_uid: "timeLineDialog",
					props: {
						id: this.ids[0],
						tableName: "t_sys_config"
					},
				});
			},
		},
	};
</script>
