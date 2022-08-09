<template>
	<div :loading="loading">
		<hos-form ref="dialogForm"  :model="dialogForm" :rules="rules" label-width="auto" label-position="right">
			<hos-row>
				<hos-col :span="12" v-has-permi="{key: status+'base:sys:config:code',formRule: rules,elModel:'code'}">
					<hos-form-item :label="$t('common.code')" prop="code">
						<hos-input :disabled="$m.isDisabled(status+'base:sys:config:code')" clearable v-model="dialogForm.code" :placeholder="$t('common.placeholder.code')"></hos-input>
					</hos-form-item>
				</hos-col>
				<hos-col :span="12" v-has-permi="{key: status+'base:sys:config:name',formRule: rules,elModel:'name'}">
					<hos-form-item  label-width="60px" :label="$t('common.name')" prop="name">
						<hos-input :disabled="$m.isDisabled(status+'base:sys:config:name')" clearable v-model="dialogForm.name" :placeholder="$t('common.placeholder.name')"></hos-input>
					</hos-form-item>
				</hos-col>
			</hos-row>
			<hos-row>
				<hos-col :span="24" v-has-permi="{key: status+'base:sys:config:value'}">
					<hos-form-item :label="$t('sysConfig.keyValue')" prop="value">
						<hos-input :disabled="$m.isDisabled(status+'base:sys:config:value')" clearable v-model="dialogForm.value" :placeholder="$t('sysConfig.placeholder.keyValue')"></hos-input>
					</hos-form-item>
				</hos-col>
			</hos-row>
			<hos-row>
				<hos-col :span="24" v-has-permi="{key: status+'base:sys:config:remark',formRule: rules,elModel:'remark'}">
					<hos-form-item :label="$t('common.remark')">
						<hos-input :disabled="$m.isDisabled(status+'base:sys:config:remark')" clearable v-model="dialogForm.remark" type="textarea" :rows="3" :placeholder="$t('common.placeholder.remark')"></hos-input>
					</hos-form-item>
				</hos-col>
			</hos-row>
		</hos-form>
		<!-- <div class="tc dialog-footer">
			<hos-button type="primary" @click="cancel"  v-has-permi="{key: status+'base:sys:config:cancel'}">{{$t('operation.cancel')}}</hos-button>
			<hos-button type="success" @click="save()"  v-has-permi="{key: status+'base:sys:config:save'}">{{$t('operation.save')}}</hos-button>
		</div> -->
		<div slot="footer" class="dialog-footer tc">
			<hos-button type="primary" @click="cancel"  v-has-permi="{key: status+'base:sys:config:cancel'}">{{$t('operation.cancel')}}</hos-button>
			<hos-button type="success" @click="save()"  v-has-permi="{key: status+'base:sys:config:save'}">{{$t('operation.save')}}</hos-button>
		</div>
	</div>
</template>
<script>
	export default {
		props: ['id', "status"],
		components: {},
		data() {
			const that = this;
			//验证编码
			const validated = (rule, value, callback) => {
				if(value && value !== "") {
					this.$api('sys_config.validated', {
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
			return {
				dialogForm: {},
				loading: false,
				rules: {
					code: [{
							required: true,
							validator: validated,
							trigger: 'blur'
						}, {
							required: true,
							validator: validCode,
							trigger: 'blur'
						},
						{
							max: 40,
							required: true,
							message: this.$t("common.rule.length.noLength",[this.$t("common.code")]),
							trigger: 'blur'
						}
					],

					name: [{
						required: true,
						message: this.$t("common.rule.name.required")
					},
					{
						max: 40,
						required: true,
						message: this.$t("common.rule.length.noLength",[this.$t("common.name")]),
						trigger: 'blur'
					}],
					value: [{
						required: true,
						message: this.$t("sysConfig.rule.keyValue.required")
					},{
						max: 100,
						required: true,
						message: this.$t("common.rule.length.lengthValue",[this.$t("sysConfig.keyValue")]),
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
               		}}]
				},
			};
		},
		created() {
			this.initData();
		},
		mounted() {},
		methods: {
			// 初始化数据
			initData() {
				if(this.id) {
					this.$api('sys_config.selectById', this.id).then(res => {
						if(res && res.code == '200') {
							this.dialogForm = res.data;
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
							this.id ? "sys_config.update" : "sys_config.insert",
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
			//取消按钮
			cancel() {
				this.$store.commit("CLOSE_DIALOG", {
					_uid: 'editDialog'
				});
			}
		}
	};
</script>