<template>
    <div :loading="loading">
        <hos-form
            ref="customFieldDialogForm"
            :model="customFieldDialogForm"
            :inline="false"
            :rules="rules"
            label-width="100px"
        >
            <hos-tabs  v-model="activeName" @tab-click="handleClick">
                <hos-tab-pane :label="$t('common.tab.baseMessage')" name="first">
                    <!-- 编码 -->
                    <hos-col :span="12" v-has-permi="{key:status+'base:sys:expand:code',
                    formRule: rules,elModel:'code'}">
                        <hos-form-item :label="$t('common.code')" prop="code">
                            <hos-input :disabled="$m.isDisabled(status+'base:sys:expand:code')"
                            v-model="customFieldDialogForm.code" :placeholder="$t('common.placeholder.code')"></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <!-- 名称 -->
                    <hos-col :span="12" v-has-permi="{key:status+'base:sys:expand:name',
                    formRule: rules,elModel:'name'}">
                        <hos-form-item :label="$t('common.name')" prop="name">
                            <hos-input :disabled="$m.isDisabled(status+'base:sys:expand:name')"
                            v-model="customFieldDialogForm.name" :placeholder="$t('common.placeholder.name')"></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <!-- 显示类型 -->
                    <hos-col :span="12" v-has-permi="{key:status+'base:sys:expand:type',
                    formRule: rules,elModel:'code'}">
                        <hos-form-item :label="$t('expand.type')" prop="type">
                            <hos-select v-model="customFieldDialogForm.type"
                            :placeholder="$t('expand.placeholder.placeholder')">
                                <hos-option v-for="(item,index) in typeArr" :key="index"
                                :label="item.label" :value="item.value"></hos-option>
                            </hos-select>
                        </hos-form-item>
                    </hos-col>
                    <!-- 默认值 -->
                    <hos-col :span="12" v-has-permi="{key:status+'base:sys:expand:defaultData',
                    formRule: rules,elModel:'defaultData'}">
                        <hos-form-item :label="$t('expand.defaultData')" prop="defaultData">
                            <hos-input :disabled="$m.isDisabled(status+'base:sys:expand:defaultData')"
                             v-model="customFieldDialogForm.defaultData"
                             :placeholder="$t('common.placeholder.defaultData')"></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <!-- 数据集合 -->
                    <hos-col :span="12" v-has-permi="{key:status+'base:sys:expand:typeSetting',
                    formRule: rules,elModel:'typeSetting'}" v-if="customFieldDialogForm.type=='select'">
                        <hos-form-item :label="$t('expand.dataSource')" prop="typeSetting">
                            <hos-tree-select :disabled="$m.isDisabled(status+'base:sys:expand:typeSetting')"
                             v-model="customFieldDialogForm.typeSetting" :flat="true"
                            :options="treeData" :placeholder="$t('expand.placeholder.placeholder')"></hos-tree-select>
                        </hos-form-item>
                    </hos-col>
                    <!-- 日期格式 -->
                    <hos-col :span="12" v-has-permi="{key:status+'base:sys:expand:dateFormat',
                    formRule: rules,elModel:'dateFormat'}" v-if="customFieldDialogForm.type == 'DatePicker'">
                        <hos-form-item :label="$t('expand.dateFormat')" prop="dateFormat"
                        >
                            <hos-input :disabled="$m.isDisabled(status+'base:sys:expand:dateFormat')"
                            v-model="customFieldDialogForm.dateFormat"
                            :placeholder="$t('common.placeholder.dateFormat')"></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <!-- 备注 -->
                    <hos-col :span="24" v-has-permi="{key:status+'base:sys:expand:remark',
                    formRule: rules,elModel:'remark'}">
                        <hos-form-item :label="$t('common.remark')" prop="remark">
                            <hos-input :disabled="$m.isDisabled(status+'base:sys:expand:remark')"
                             v-model="customFieldDialogForm.remark" type="textarea"
                             :placeholder="$t('common.placeholder.remark')"></hos-input>
                        </hos-form-item>
                    </hos-col>
                </hos-tab-pane>
                <hos-tab-pane :label="$t('expand.tab.validator')" name="second">
                    <hos-col :span="8" v-for="item,i in customFieldDialogForm.validatorTypeArr" :key="item.prop">
                        <hos-form-item label-width="20px" style="display: inline-block">
                            <hos-checkbox @change="validChange(item)" v-model="item.checkd">{{item.label}}</hos-checkbox>
                        </hos-form-item>
                        <hos-form-item label-width="20px" v-if="item.prop=='max'" :prop="`${i}`+'@'+item.checkd"
                        :rules="rules.max" style="display: inline-block">
                            <hos-input class="hos_input" v-model="item.max"></hos-input>
                        </hos-form-item>
                        <hos-form-item label-width="20px" v-if="item.prop=='min'" :prop="`${i}`+'@'+item.checkd"
                         :rules="rules.min" style="display: inline-block">
                            <hos-input class="hos_input" v-model="item.min"></hos-input>
                        </hos-form-item>
                        <hos-form-item label-width="20px" v-if="item.prop=='len'" :prop="`${i}`+'@'+item.checkd"
                        :rules="rules.value" style="display: inline-block">
                            <hos-input class="hos_input" v-model="item.value"></hos-input>
                        </hos-form-item>
                        <hos-form-item label-width="20px" v-if="item.prop=='numRange'" :prop="`${i}`+'@'+item.checkd"
                        :rules="rules.min" style="display: inline-block">
                            <hos-input class="hos_input" v-model="item.min"></hos-input>
                        </hos-form-item>
                        <hos-form-item label-width="20px" v-if="item.prop=='numRange'" :prop="`${i}`+'@'+item.checkd"
                        :rules="rules.max" style="display: inline-block">
                            <hos-input class="hos_input"  v-model="item.max"></hos-input>
                        </hos-form-item>
                    </hos-col>
                </hos-tab-pane>
            </hos-tabs>
        </hos-form>
         <div slot="footer" class="dialog-footer">
            <hos-button type="primary" @click="cancel">{{$t('operation.cancel')}}</hos-button>
            <hos-button type="success" @click="save">{{$t('operation.save')}}</hos-button>
        </div>
    </div>
</template>

<script>
import {validNoZh} from '@sys/utils/validateUtil.js'
export default {
    props: ["id", "status", "tableId"],
    data() {
        var codeCheck = (rule, value, callback) => {
            if (value && value !== '') {
                if(value.length <= 40){
                    const result = validNoZh(value)
                    if(result == true){
                        let valideObj = {
                            code: value,
                            tableId: this.tableId,
                            id: this.id?this.id:''
                        }
                        this.$api('sys_expand.validateCode', valideObj).then(res => {
                            // 资源编码重复校验
                            if(res && res.code == 200 && res.data == true){
                                callback()
                            }else {
                                this.activeName = 'first'
                                callback(new Error(this.$t('common.rule.code.validate')))
                            }
                        })
                    }else{
                        this.activeName = 'first'
                        callback(new Error(this.$t('common.rule.code.noZh')))
                    }
                }else{
                    this.activeName = 'first'
                    callback(new Error(this.$t('common.rule.length.noLength', [this.$t('common.code')])))
                }
            } else {
                this.activeName = 'first'
                callback(new Error(this.$t('common.rule.code.required')))
            }
        };
        return {
            //枚举字段类型
            typeArr: [{
                value: 'input',
                label: this.$t('expand.input')
            },{
                value: 'inputNumber',
                label: this.$t('expand.inputNumber')
            },{
                value: 'textarea',
                label: this.$t('expand.textarea')
            },{
                value: 'DatePicker',
                label: this.$t('expand.DatePicker')
            },{
                value: 'select',
                label: this.$t('expand.select')
            },{
                value: 'switch',
                label: this.$t('expand.switch')
            },
            /*{
                value: 'radio',
                label: '单选框'
            },{
                value: 'checkbox',
                label: '多选框'
            },
            {
                value: 'timePicker',
                label: '时间选择器'
            },{
                value: 'timePickeRange',
                label: '时间范围选择器'
            },{
                value: 'DatePickerRange',
                label: '日期范围选择器'
            },{
                value: 'DateTimePicker',
                label: '日期时间选择器'
            },{
                value: 'DateTimePicker',
                label: '日期时间范围选择器'
            },{
                value: 'Cascader',
                label: '级联选择器'
            },{
                value: 'ColorPicker',
                label: '颜色选择器'
            },{
                value: 'tree',
                label: '树形选择'
            },{
                value: 'image',
                label: '图片'
            },{
                value: 'file',
                label: '文件'
            }*/],
            // 数据源数据
            treeData: [],
            loading: false,
            // 表单绑定的值
            customFieldDialogForm: {},
            // tab页签的标记
            activeName: 'first',
            // 已选中的验证规则
            checkList: [],
            // 验证规则枚举
            validatorTypeArr: [{
                label: this.$t('expand.menu.required'),
                prop: "required",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.validateUpperCase'),
                prop: "validateUpperCase",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.validateLowerCase'),
                prop: "validateLowerCase",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.numRange'),
                prop: "numRange",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.isPassword'),
                prop: "isPassword",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.validatePhone'),
                prop: "validatePhone",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.validateTelphone'),
                prop: "validateTelphone",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.validatePhoneTwo'),
                prop: "validatePhoneTwo",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.len'),
                prop: "len",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.max'),
                prop: "max",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.min'),
                prop: "min",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.validateIdNo'),
                prop: "validateIdNo",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.validateEMail'),
                prop: "validateEMail",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.validateIP'),
                prop: "validateIP",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            },{
                label: this.$t('expand.menu.validateURL'),
                prop: "validateURL",
                min: '',
                max: '',
                message: '',
                vaule: '',
                checkd: false
            }],
            rules: {
                code: [{required: true, trigger: 'blur', validator: codeCheck}],
                name: [{required: true, trigger: 'blur', validator: (rule,value,callback) => {
                    if(value && value !=''){
                        if(value.length<=37){
                            callback()
                        }else{
                            this.activeName = 'first'
                            callback(new Error(this.$t('common.rule.name.length')))
                        }
                    }
                }}],
                type: [{required: true, trigger: 'change', message: this.$t('expand.message.type')}],
                min: [{required: false, trigger: 'blur', validator: (rule,value,callback) => {

                    if(rule.field.split("@")[1]!='false'){
                        var val=this.customFieldDialogForm.validatorTypeArr[Number(rule.field.split("@")[0])].min;
                        if(val && val!=''&&val!=undefined){
                            if(!(/(^[1-9]\d*$)/.test(val))){
                                callback(new Error(this.$t('common.rule.Integer')))
                            }else{
                                callback()
                            }
                        }else{
                            callback(new Error(this.$t('common.rule.checkbox.required')))
                        }
                    }else{callback()}
                }}],
                max: [{required: false, trigger: 'blur', validator: (rule,value,callback) => {
                    if(rule.field.split("@")[1]!='false'){
                        var val=this.customFieldDialogForm.validatorTypeArr[Number(rule.field.split("@")[0])].max;
                        if(val && val!=''&&val!=undefined){
                            if(!(/(^[1-9]\d*$)/.test(val))){
                                callback(new Error(this.$t('common.rule.Integer')))
                            }else{
                                callback()
                            }
                        }else{
                            callback(new Error(this.$t('common.rule.checkbox.required')))
                        }
                    }else{callback()}
                }
                }],
                value: [{trigger: 'blur', validator: (rule,value,callback) => {
                    if(rule.field.split("@")[1]!='false'){
                         var val=this.customFieldDialogForm.validatorTypeArr[Number(rule.field.split("@")[0])].value;
                        if(val && val!=''&&val!=undefined){
                            if(!(/(^[1-9]\d*$)/.test(val))){
                                callback(new Error(this.$t('common.rule.Integer')))
                            }else{
                                callback()
                            }
                        }else{
                            callback(new Error(this.$t('common.rule.checkbox.required')))
                        }
                    }else{callback()}
                }}],
            }
        }
    },
    created() {
        this.$api('sys_dict.dictCategoryDictTree').then(res => {
            this.treeData = res.data
            this.disabledNode(this.treeData, 'sort');
        })
    },
    mounted() {
        if(this.id){
            // 编辑状态，获取需要显示的验证规则并且勾选上
            this.$api('sys_expand.getFieldById', this.id).then(res => {
                if(res && res.code == 200){
                    this.customFieldDialogForm = res.data;
                    for(let i =0;i<this.customFieldDialogForm.validateType.length;i++){
                        // 让对应的四个值显示到页面上
                        for(let j=0;j<this.validatorTypeArr.length;j++){
                            if(this.customFieldDialogForm.validateType[i].prop ==
                            this.validatorTypeArr[j].prop){
                                this.validatorTypeArr[j].value = this.customFieldDialogForm.validateType[i].value
                                this.validatorTypeArr[j].max = this.customFieldDialogForm.validateType[i].max
                                this.validatorTypeArr[j].min = this.customFieldDialogForm.validateType[i].min
                                this.validatorTypeArr[j].message = this.customFieldDialogForm.validateType[i].messgae;
                                this.validatorTypeArr[j].checkd = true;
                                break;
                            }
                        }
                    }
                     // 表单中加入这个属性是为了显示验证规则和方便校验
                    this.$set(this.customFieldDialogForm, 'validatorTypeArr', this.validatorTypeArr)
                }
            })
        }else{
            // 新增的话默认全部不勾选
            this.$set(this.customFieldDialogForm, 'validatorTypeArr', this.validatorTypeArr)
        }
    },
    methods: {
        disabledNode(treeData,str) {
          //禁选
          treeData.forEach(item => {
            if(item.type == str) {
              item["isDisabled"] = true;
              if(item.children && item.children.length>0){
                this.disabledNode(item.children, str)
              }
              return ;
          }})
        },
        cancel() {
            if(this.id){
                this.$store.commit("CLOSE_DIALOG", {_uid: 'customFieldEditDialog'});
            }else{
                this.$store.commit("CLOSE_DIALOG", {_uid: 'customFieldAddDialog'});
            }
            this.loading = false;
        },
        save() {
            this.$refs.customFieldDialogForm.validate(valid => {
                if(valid) {
                    this.loading = false;
                    const validateType = this.checkListToForm();
                    if(validateType == undefined){
                        validateType = []
                    }
                    this.$set(this.customFieldDialogForm, 'validateType', validateType);
                    this.$set(this.customFieldDialogForm, 'tableId', this.tableId);
                    delete this.customFieldDialogForm.validatorTypeArr;
                    const obj = JSON.parse(JSON.stringify(this.customFieldDialogForm));
                    if(this.id){
                        this.$api('sys_expand.update', obj).then(res => {
                            this.loading = false
                            if(res && res.code == 200) {
                                this.$store.commit("CLOSE_DIALOG", {_uid: 'customFieldEditDialog'});
                                this.$store.commit("UPDATE_TABLE",{_uid: 'customFieldTable'});
                            }else {
                                this.$message.error(this.$t('operation.error'));
                            }
                        })
                    }else {
                        this.$api('sys_expand.insert', obj).then(res => {
                            if(res && res.code == 200){
                                this.$store.commit("CLOSE_DIALOG", {_uid: 'customFieldAddDialog'});
                                this.$store.commit("UPDATE_TABLE",{_uid: 'customFieldTable'});
                            }else {
                                this.$message.error(this.$t('operation.error'));
                            }
                        })
                    }
                }
            })
        },
        // 将数组里面勾选的验证规则转变成表单的内容
        checkListToForm() {
            const listArr = [];
            for(let i=0;i<this.customFieldDialogForm.validatorTypeArr.length;i++){
                if(this.customFieldDialogForm.validatorTypeArr[i].checkd == true){
                    listArr.push(this.customFieldDialogForm.validatorTypeArr[i])
                }
            };
            return listArr;
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        validChange(item){
            if(item.checkd == true){
                if(item.prop=='max'){
                    this.rules.max[0].required = true;
                }else if(item.prop=='min'){
                    this.rules.min[0].required = true;
                }else if(item.prop=='len'){
                    this.rules.value[0].required = true;
                }else if(item.prop=='numRange'){
                    this.rules.min[0].required = true;
                    this.rules.max[0].required = true;
                }
            }else{
                if(item.prop=='max'){
                    this.rules.max[0].required = false;
                }else if(item.prop=='min'){
                    this.rules.min[0].required = false;
                }else if(item.prop=='len'){
                    this.rules.value[0].required = false;
                }else if(item.prop=='numRange'){
                    this.rules.min[0].required = false;
                    this.rules.max[0].required = false;
                }
            }
        }
    }
}
</script>

<style scoped>
.hos_col {
    height: 55px
}
.hos_input {
    width: 50px;
    padding-left: 20px;
}
</style>
