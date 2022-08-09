<template>
	<div :loading="loading" class="base-sys-dict-edit">
		<hos-form ref="dialogForm"  :model="dialogForm" :rules="rules" label-width="auto" label-position="right">
			<hos-row>
				<hos-col :span="8" v-has-permi="{key: status+'base:sys:dict:code',formRule: rules,elModel:'code'}">
					<hos-form-item :label="$t('common.code')" prop="code">
						<hos-input v-model="dialogForm.code" clearable :placeholder="$t('common.placeholder.code')" :disabled="$m.isDisabled(status+'base:sys:dict:code')"></hos-input>
					</hos-form-item>
				</hos-col>
				<hos-col :span="8" v-has-permi="{key: status+'base:sys:dict:dictValue'}">
					<hos-form-item :label="$t('common.name')" prop="dictValue">
						<hos-input v-model="dialogForm.dictValue" clearable :disabled="$m.isDisabled(status+'base:sys:dict:dictValue')" :placeholder="$t('common.placeholder.name')"></hos-input>
					</hos-form-item>
				</hos-col>
				<hos-col :span="8" v-has-permi="{key: status+'base:sys:dict:dictCategoryId'}">
					<hos-form-item :label="$t('common.module')" prop="dictCategoryId">
						<hos-tree-select v-model="dialogForm.dictCategoryId" clearable :placeholder="$t('dict.placeholder.dictCategory')" :options="treeData" :disabled="$m.isDisabled(status+'base:sys:dict:dictCategoryId')"></hos-tree-select>
					</hos-form-item>
				</hos-col>
				<hos-col :span="8" v-has-permi="{key: status+'base:sys:dict:actived'}">
					<hos-form-item :label="$t('common.isActived')" prop="actived">
						<hos-switch v-model="dialogForm.actived" :active-text="$t('common.is')" :inactive-text="$t('common.deny')" inner-label :disabled="$m.isDisabled(status+'base:sys:dict:actived')"></hos-switch>
					</hos-form-item>
				</hos-col>
				<hos-col :span="8" v-has-permi="{key: status+'base:sys:dict:weight'}">
					<hos-form-item :label="$t('common.weight')" prop="weight">
						<hos-InputNumber :min="0" v-model="dialogForm.weight" :disabled="$m.isDisabled(status+'base:sys:dict:weight')"></hos-InputNumber>
					</hos-form-item>
				</hos-col>
				<hos-col :span="24" v-has-permi="{key: status+'base:sys:dict:remark',formRule: rules,elModel:'remark'}">
					<hos-form-item :label="$t('common.remark')" prop="remark">
						<hos-input v-model="dialogForm.remark" :rows="2" clearable :placeholder="$t('common.placeholder.remark')" :disabled="$m.isDisabled(status+'base:sys:dict:remark')"></hos-input>
					</hos-form-item>
				</hos-col>
				<hos-col :span="24">
					<hos-table class="tableData" :data="dialogForm.tableData" ref="dictItemtable"  height="350" tooltip-effect="dark" stripe @selection-change='selectRow'>
						<hos-table-column :label="$t('dict.dictKey')">
							<template slot-scope="scope">
								<hos-form-item label-width="0" :prop="scope.$index+'dict'">
									<hos-input class="require_des" clearable  @blur="blurMounse" v-model="scope.row.dictKey"></hos-input>
								</hos-form-item>
								<!-- <hos-form-item  label-width="0" :prop="'tableData['+scope.$index+'].dictKey'" :rules = "[{validator: myValidate, trigger: 'blur'}]">
									<hos-input class="require_des" clearable  @blur="blurMounse" v-model="scope.row.dictKey"></hos-input>
								</hos-form-item> -->
							</template>
						</hos-table-column>
						<hos-table-column :label="$t('dict.dictName')">
							<template slot-scope="scope">
								<hos-form-item label-width="0" :prop="'tableData['+scope.$index+'].dictValue'" :rules="[{validator: myValidateValue, trigger: 'blur'}]">
									<hos-input class="require_des" clearable  @blur="blurMounse" v-model="scope.row.dictValue"></hos-input>
								</hos-form-item>
								<!-- <hos-form-item label-width="0">
									<hos-input class="remark"  clearable v-model="scope.row.dictValue"></hos-input>
								</hos-form-item> -->
							</template>
						</hos-table-column>
						<hos-table-column :label="$t('common.weight')" width="120">
							<template slot-scope="scope">
								<hos-form-item label-width="0">
									<hos-InputNumber :min="0" class="remark w100" v-model="scope.row.weight" ></hos-InputNumber>
								</hos-form-item>
							</template>
						</hos-table-column>
						<hos-table-column :label="$t('common.isActived')" width="100">
							<template slot-scope="scope">
								<hos-form-item label-width="0">
									<hos-switch class="actived" size="small" :active-text="$t('common.is')" :inactive-text="$t('common.deny')" inner-label v-model="scope.row.actived"></hos-switch>
								</hos-form-item>
							</template>
						</hos-table-column>
						<hos-table-column align="center" width="100">
							<template slot="header" slot-scope="scope">
								<i @click="addRow(scope.row, scope.$index)" v-has-permi="{key: 'base:sys:dict:add'}" class="hos-icom-add cursor-pointer"></i>
							</template>
							<template slot-scope="scope">
								<i v-has-permi="{key: 'base:sys:dict:delete'}" @click.prevent="delData(scope.$index, scope.row)" class="hos-icom-cancel cursor-pointer"></i>
							</template>
						</hos-table-column>
					</hos-table>
				</hos-col>
			</hos-row>
		</hos-form>
		<div slot="footer" class="dialog-footer">
			<hos-button type="primary" @click="cancel"  v-has-permi="{key: status+'base:sys:dict:cancel'}">{{$t('operation.cancel')}}</hos-button>
			<hos-button type="success" @click="save"  v-has-permi="{key: status+'base:sys:dict:save'}">{{$t('operation.save')}}</hos-button>
		</div>
	</div>
</template>
<script>
	export default {
		props: ['id', 'dictCategoryId', 'treeData', 'status'],
		components: {},
		data() {
			//验证编码
			const that = this;
			//验证编码
			const validated = (rule, value, callback) => {
				if(value && value !== "") {
					this.$api('sys_dict.validated', {
						code: value,
						id: that.id
					}).then(res => {
						if(res) {
							if(res.data == false && res && res.code == '200') {
								callback(new Error(this.$t("common.rule.code.validate")));
							} else {
								callback();
							}
						}
					})
				} else {
					callback(new Error(this.$t("common.rule.code.required")));
				}
			}
			//不能输入中文的验证
			var validCode = (rule, value, callback) => {
				if(value) {
					if(/[\u4E00-\u9FA5]/g.test(value)) {
						callback(new Error(this.$t("common.rule.code.notInputChinese")));
					} else {
						// 验证通过
						callback();
					}
					callback();
				}
			};
			//验证字典key
			const validatedKey = (rule, value, callback) => {
				if(that.dictKeyData == "") {
					that.isAllowAdd = false;
					that.kevt += "1",
						callback(new Error(this.$t("common.rule.code.required")));
				}
				var flag = 1;
				if(that.dialogForm.code == that.dictKeyData) {
					flag = 3;
					that.isAllowAdd = false;
					that.kevt += "1",
						callback(new Error(this.$t("dict.rule.module.required")));
				}
				for(var index in that.newTableData) {
					var obj = that.newTableData[index];
					if(obj.dictKey == that.dictKeyData) {
						flag = 2;
						break;
					}
				}
				if(flag == 1) {
					that.isAllowAdd = true;
					callback();

				} else if(flag == 2) {
					that.isAllowAdd = true;
					that.kevt += "1",
						callback(new Error(this.$t("dict.rule.module.validate")));
				}

			}
			return {
				dialogForm: {
					weight: 0,
					actived: true,
					tableData: []
				},
				//tableData: [],
				selectlistRow: [],
				rowNum: 1,
				isAllowAdd: true,
				loading: false,
				dictKeyData: '',
				newTableData: [],
				kevt: "",
				validatedKey: validatedKey,
				rules: {
					code: [{
						required: true,
						validator: validated,
						trigger: 'blur'
					},{
						required: true,
						validator: validCode,
						trigger: 'blur'
					},
					{
						max: 40,
						required: true,
						message: this.$t("common.rule.length.noLength",[this.$t("common.code")]),
						trigger: 'blur'
						}],
					dictValue: [{
						required: true,
						message: this.$t("common.rule.name.required")
					},{
						max: 40,
						required: true,
						message: this.$t("common.rule.length.noLength",[this.$t("common.name")]),
						trigger: 'blur'
					}],
					remark: [{required: false, trigger: 'blur', validator: (rule,value,callback) => {
						if(value && value != ''){
							if(value.length <= 1000){
								callback()
							}else{
								callback(new Error(this.$t('common.rule.remark.length')))
							}
						}else{
							callback()
						}
					}}],
					dictKey: [{
						required: true,
						trigger: 'blur',
						validator: validatedKey,
					},{
						max: 40,
						required: true,
						message: this.$t("common.rule.length.noLength",[this.$t("dict.dictKey")]),
						trigger: 'blur'
					}],
					dictCategoryId: [{
						required: true,
						message: this.$t("common.rule.module.required")
					}],
				},
			};
		},
		created() {
			if(this.id == '' && this.dictCategoryId != '') {
				this.dialogForm.dictCategoryId = this.dictCategoryId
			}
			this.getTreeNodes();
		},
		computed: {
			myValidateValue: function() {
				let that = this;
				return function(rule, value, callback) {
					if(value == "") {
						callback(new Error(that.$t("common.rule.name.required")));
					} else {
						callback();
					}
				}
			},
		},
		mounted() {},
		methods: {
			// 初始化数据
			getTreeNodes() {
				if(this.id) {
					this.$api('sys_dict.selectById', this.id).then(res => {
						if(res && res.code == '200') {
							this.dialogForm = res.data;
							this.dialogForm.tableData = this.dialogForm.options;
						}
					})
				}
			},
			// 保存dialog
			save() {
				this.kevt = ""
				this.blurMounse()
				this.$refs.dialogForm.validate(valid => {
					if(valid && this.kevt.indexOf("1") == -1) {
						this.loading = true;
						this.dialogForm["options"] = this.dialogForm.tableData;
						this.$api(
							this.id ? "sys_dict.updateDict" : "sys_dict.insertDict",
							this.dialogForm
						).then(res => {
							this.loading = false;
							if(res && res.code == '200') {
								this.$message.success(this.$t('operation.success'));
								this.cancel();
								this.$store.commit("UPDATE_TABLE", {
									_uid: 'table'
								});
							} else {
								this.$message.error(this.$t('operation.error'));
							}
						});
					}
				});
			},
			// 获取表格选中时的数据
			selectRow(val) {
				this.selectlistRow = val
			},
			blurMounse() {
				for(var index in this.dialogForm.tableData) {
					var obj = this.dialogForm.tableData[index];
					if(this != undefined) {
						this.newTableData = []
						this.newTableData = this.dialogForm.tableData.filter(v => v != obj);
						this.dictKeyData = obj.dictKey
						var rule = [{
							validator: this.rules.dictKey[0].validator,
						}]
						this.$set(this.rules, index + "dict", rule)
						this.$refs.dialogForm.validateField(index + "dict", (res) => {
							this.$delete(this.rules, index + "dict")
						});
					}
				}
			},
			addRow() {
				if(this.isAllowAdd) {
					let list = {
						dictKey: '',
						dictValue: '',
						weight: 0,
						actived: true,
						defaulted: false,
						parentId: this.id,
						deleted: false,
						dictCategoryId: this.dialogForm.dictCategoryId,
					};
					this.dialogForm.tableData.push(list)
				} else {
					this.$message.error(this.$t('dict.placeholder.validateKey'));
				}
				this.blurMounse();
				// this.$refs.dialogForm.clearValidate()
			},
			// 删除选中行
			delData(index, row) {
				this.dialogForm.tableData.splice(index, 1)
				this.isAllowAdd = true
        this.blurMounse()
				// this.$refs.dialogForm.clearValidate()
			},
			//取消按钮
			cancel() {
				this.$store.commit("CLOSE_DIALOG", {
					_uid: 'editDialog'
				});
				this.dialogForm.tableData = [];
				this.loading = false;
			}
		}
	};
</script>
<style lang="scss">
.cursor-pointer{
  cursor: pointer;
}
</style>