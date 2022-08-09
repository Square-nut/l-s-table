<template>
  <m-layout noBorder noPadding v-loading="loading">
    <m-form ref="tenantPackageForm" v-model="tenantPackageForm">
      <el-row>
        <el-col :span="12">
          <m-input label="编码" name="code" placeholder="请输入租户包编码"></m-input>
        </el-col>
        <el-col :span="12">
          <m-select label="名称" name="name" placeholder="请选择租户包名称"></m-select>
        </el-col>
        <el-col :span="12">
          <m-switch label="是否启用" name="actived"></m-switch>
        </el-col>
        <el-col :span="24">
          <m-input label="描述" name="remark" type="textarea" placeholder="请输入描述"></m-input>
        </el-col>
      </el-row>
      <template slot="footer">
        <m-button type="primary" @click="sunbmitForm('tenantPackageForm')" v-repeatForm>保存</m-button>
        <m-button @click="closeDialog()">关闭</m-button>
      </template>
    </m-form>
  </m-layout>
</template>

<script>
import api from '../../../axios/index'
export default {
    nama: 'tenantPackageEdit',
    data() {
        return {
            tenantPackageForm: {},
            loading: true,
            rules: {
              code: [{
                trigger: 'blur', validator: (rule, value, callback) => {
                  if (value && value !== '') {
                      api.request('tenantPackage.validCode',{code: this.tenantPackageForm.code}).then(res => {
                      if(res.data.success){
                        callback();
                      }else{
                        callback(new Error(res.data.info))
                      }
                    })
                  } else {
                    callback()
                  }
                }
              }]
            }
        }
    },
    created() {
      this.initForm();
    },
    methods: {
      initForm() {
        if(this.$attrs.tenantPackageId){
          api.request('tenantPackage.getById', {id: this.$attrs.tenantPackageId}).then(res => {
          this.tenantPackageForm = res.data
        })
        }else {
          this.tenantPackageForm = {
            id: undefined,
            code: undefined,
            name: undefined,
            actived: true,
            remark: undefined
          };
        }
        this.loading = false
      },
      closeDialog() {
          this.$m.dialog.close(this.$attrs.dialogKey)
      },
      sunbmitForm(formName) {
        this.$refs[formName].validate(valid => {
          if(valid){
            if(this.$attrs.tenantPackageId){     //传入Id的为修改表单
            
              // 修改租户包
              api.request('tenantPackage.update', {form: this.tenantPackageForm}).then(res => {
                if(res.code != 200){
                  this.closeDialog()
                }else{
                  this.$m.msg.success(res.msg);
                  this.closeDialog();
                }
              }).catch(err => {
                console.log(err)
              })
            }else {
              // 新建租户包
              api.request('tenantPackage.insert', {form: this.tenantPackageForm}).then(res => {
                if(res.code != 200){
                  this.$m.msg.error(res.msg)
                }else {
                  this.$m.msg.success(res.msg);
                  this.closeDialog()
                }
              })
            }
          }
        })
      }
    }
}
</script>