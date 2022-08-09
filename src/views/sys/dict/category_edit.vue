<template>
	<div :loading="loading">
		<hos-form ref="dialogForm"  :model="dialogForm" :rules="rules" label-width="auto" label-position="right">
			<hos-row>
				<hos-col :span="12" v-has-permi="{key: status+'base:sys:category:code',formRule: rules,elModel:'code'}">
					<hos-form-item :label="$t('common.code')" prop="code">
						<hos-input v-model="dialogForm.code" clearable :placeholder="$t('common.placeholder.code')" :disabled="$m.isDisabled(status+'base:sys:category:code')"></hos-input>
					</hos-form-item>
				</hos-col>
				<hos-col :span="12" v-has-permi="{key: status+'base:sys:category:name', formRule: rules,elModel:'name'}">
					<hos-form-item label-width="60px" :label="$t('common.name')" prop="name">
						<hos-input v-model="dialogForm.name" clearable :placeholder="$t('common.placeholder.name')" :disabled="$m.isDisabled(status+'base:sys:category:name')"></hos-input>
					</hos-form-item>
				</hos-col>
				<hos-col :span="24" v-has-permi="{key: status+'base:sys:category:parentId'}">
					<hos-form-item :label="$t('common.module')" prop="parentId">
						<hos-tree-select v-model="dialogForm.parentId" clearable :placeholder="$t('dict.placeholder.dictCategory')" :options="treeData" :disabled="$m.isDisabled(status+'base:sys:category:parentId')"></hos-tree-select>
					</hos-form-item>
				</hos-col>
				<hos-col :span="12" v-has-permi="{key: status+'base:sys:category:weight'}">
					<hos-form-item :label="$t('common.weight')" prop="weight">
						<hos-InputNumber :min="0" v-model="dialogForm.weight" clearable :disabled="$m.isDisabled(status+'base:sys:category:weight')"></hos-InputNumber>
					</hos-form-item>
				</hos-col>
				<hos-col :span="24" v-has-permi="{key: status+'base:sys:category:remark',formRule: rules,elModel:'remark'}">
					<hos-form-item :label="$t('common.remark')" prop="remark">
						<hos-input v-model="dialogForm.remark" type="textarea" :rows="3" :placeholder="$t('common.placeholder.remark')" :disabled="$m.isDisabled(status+'base:sys:category:remark')"></hos-input>
					</hos-form-item>
				</hos-col>
			</hos-row>
		</hos-form>
		<div slot="footer" class="dialog-footer">
			<hos-button type="primary" @click="cancel"  v-has-permi="{key: status+'base:sys:category:cancel'}">{{$t('operation.cancel')}}</hos-button>
			<hos-button type="success" @click="save"  v-has-permi="{key: status+'base:sys:category:save'}">{{$t('operation.save')}}</hos-button>
		</div>
	</div>
</template>
<script>
	export default {
		props: ['id', 'initTreeMethod', 'treeData', 'status'],
		components: {},
		data() {
			const that = this;
			//验证编码
			const validated = (rule, value, callback) => {
				if(value && value !== "") {
					this.$api('sys_dict.validatedCode', {
						code: value,
						id: that.id
					}).then(response => {
						if(response) {
							if(response.data == false) {
								callback(new Error(this.$t("common.rule.code.validate")));
							} else {
								callback();
							}
						}
					})
				} else {
					callback(new Error(this.$t("common.rule.code.required")));
				}
			}//不能输入中文的验证
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
			return {
				dialogForm: {
					weight: 0
				},
				loading: false,
				rules: {
					code: [{
						required: true,
						message: this.$t("common.rule.code.required"),
						trigger: 'blur'
					},{
						required: true,
						validator: validCode,
						trigger: 'blur'
					}, {
						validator: validated,
						trigger: 'blur'
					},{
						max: 40,
						required: true,
						message: this.$t("common.rule.length.noLength",[this.$t("common.code")]),
						trigger: 'blur'
						}],
					name: [{
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
				},
			};
		},
		created() {
			this.getTreeNodes();
		},
		mounted() {},
		methods: {
			// 初始化数据
			getTreeNodes() {
				/* this.$api('sys_dict.getTreeNodes', this.id).then(res => {
					if(res && res.code == '200') {
						this.treeData = res.data;
					}
				}); */
				if(this.id) {
					this.$api('sys_dict.getCategoryById', this.id).then(res => {
						if(res && res.code == '200') {
							this.dialogForm = res.data;
							if(this.dialogForm.parentId == '0') {
								this.dialogForm.parentId = null
							}
						}
					})
				}
			},
			// 保存dialog
			save() {
				this.$refs.dialogForm.validate(valid => {
					if(valid) {
						this.loading = true;
						this.$api(
							this.id ? "sys_dict.update" : "sys_dict.insert",
							this.dialogForm
						).then(res => {
							this.loading = false;
							if(res && res.code == '200') {
								this.$message.success(this.$t('operation.success'));
								this.initTreeMethod();
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
			//取消按钮
			cancel() {
				this.$store.commit("CLOSE_DIALOG", {
					_uid: 'addDialog'
				});
			}
		}
	};
</script>