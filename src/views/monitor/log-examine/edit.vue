<template>
    <div :loading = loading>
        <hos-form
           ref="dialogForm"  
           :model="dialogForm"
            :rules="rules"
            :inline="false"
            label-position="right"
            label-width="auto"
        >
            <hos-row>
                <hos-col :span="24" >
                    <hos-form-item :label="$t('logExamine.type')"  prop="type" v-has-permi="{key: status+'base:monitor:examine:type',formRule: rules,elModel:'type'}">
                         <hos-select v-model="dialogForm.type" clearable :placeholder="$t('logExamine.RequiredTip')" :disabled="$m.isDisabled(status+'base:monitor:examine:type')">
                            <hos-option v-for="item in typeData" :key="item.value" :label="item.label" :value="item.value">
                            </hos-option>
                        </hos-select>
                    </hos-form-item>
                </hos-col>
                <hos-col :span="24" v-has-permi="{key: status+'base:monitor:examine:textarea',formRule: rules,elModel:'opinion'}">
                    <hos-form-item :label="$t('logExamine.opinion')" prop="opinion">
                        <hos-input  type="textarea"
                        v-model="dialogForm.opinion" :disabled="$m.isDisabled(status+'base:monitor:examine:textarea')"></hos-input>
                    </hos-form-item>
                </hos-col>
            </hos-row>
        </hos-form>
         <div slot="footer" class="dialog-footer">
            <hos-button type="primary" @click="cancel()" v-has-permi="{key: status+'base:monitor:examine:cancel'}">{{$t('operation.cancel')}}</hos-button>
            <hos-button type="success" @click="save()"  :loading="loading" v-has-permi="{key: status+'base:monitor:examine:save'}">{{$t('operation.save')}}</hos-button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['ids',"tableId","dialogId", 'status'],
    data () {
        return {
            loading: false,
            typeData:[],
            dialogForm: {
                type:"",
                opinion:"",
            },
           /*  type:"",
            opinion: '', */
            rules: {
                 type: [
                    { required: true, 
                    message:this.$t("logExamine.rule.type.required")}],
            }
        }
    },
    mounted() {
        this.getSelectData();
    },
    methods: {
        // 保存修改
        save() {
            	this.$refs.dialogForm.validate(valid => {
					if(valid) {
                            let obj={
                logIds:this.ids,
                state:true,
                type:this.dialogForm.type,
                opinion:this.dialogForm.opinion
            }
            this.$api('log_loginLog.saveExamine', obj).then(res => {
                if(res && res.code == 200){
                    this.$store.commit("CLOSE_DIALOG", {_uid: this.dialogId});
                    this.$store.commit("UPDATE_TABLE",{_uid: this.tableId});
                }else {
                    this.$message.error(this.$t('operation.error'));
                }
            })
                        
                        }
                })
            
        },
        getSelectData() {
            this.$api('sys_dict.selectByCode', {code: 'base-log-examine-type'}).then(res => {
                if(res && res.code == 200){
                  this.typeData=res.data;
                }else {
                    this.$message.error(res.msg);
                }
                
            }).catch(error => {
                this.$message.error(this.$t("operation.error"));
            })
        },
        cancel() {
           this.$store.commit("CLOSE_DIALOG", {_uid: this.dialogId});
           this.loading = false;
        },
    }
}
</script>
