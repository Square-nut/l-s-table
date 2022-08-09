<template>
    <div :loading="loading" class="resource-edit">
        <hos-form
            ref="dialogForm"
            :model="dialogForm"
            :inline="false"
            :rules="rules"
            label-width="80px"
        >
            <hos-tabs v-model="activeName" @tab-click="handleClick">
                <hos-tab-pane v-has-permi="{key: 'base:sys:resource:baseInfo'}"
                :label="$t('common.tab.baseMessage')" name="first" class="p10 pb0">
                    <hos-row :gutter="3">
                    <!-- 编码 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:code',formRule: rules,elModel:'code'}">
                            <hos-form-item :label="$t('common.code')" prop="code">
                                <hos-input :disabled="$m.isDisabled(status+'base:sys:resource:code')"
                                v-model="dialogForm.code" clearable :placeholder="$t('common.placeholder.code')"></hos-input>
                            </hos-form-item>
                        </hos-col>
                        <!-- 名称 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:name',formRule: rules,elModel:'name'}">
                            <hos-form-item :label="$t('common.name')" prop="name">
                                <hos-input :disabled="$m.isDisabled(status+'base:sys:resource:name')"
                                v-model="dialogForm.name" clearable :placeholder="$t('common.placeholder.name')"></hos-input>
                            </hos-form-item>
                        </hos-col>
                        <!-- 上级资源 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:parentId',formRule: rules,elModel:'parentId'}">
                            <hos-form-item :label="$t('resource.parentId')" prop="parentId">
                                <hos-tree-select :disabled="$m.isDisabled(status+'base:sys:resource:parentId')" ref="parentId" v-model="dialogForm.parentId"
                                :options="parentTreeData" :placeholder='$t("expand.placeholder.placeholder")' clearable></hos-tree-select>
                            </hos-form-item>
                        </hos-col>
                        <!-- 资源类型 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:type',
                        formRule: rules,elModel:'type'}">
                            <hos-form-item :label="$t('resource.resourceType')" prop="type">
                                <hos-col :span="12">
                                    <hos-radio-group :disabled="$m.isDisabled(status+'base:sys:resource:type')"
                                    v-model="dialogForm.type">
                                        <hos-radio-button v-for="(item,key,index) in resourceType" :key="item + index"
                                        :label="key" >{{ item }}</hos-radio-button>
                                    </hos-radio-group>
                                </hos-col>
                                <hos-col :span="12">
                                    <hos-select v-if="this.dialogForm.type === 'C' && (this.dialogForm.parentId == null || this.dialogForm.parentId === '0')"
                                    :disabled="$m.isDisabled(status+'base:sys:resource:categoryLocation')"
                                    v-model="dialogForm.categoryLocation" clearable
                                    filterable :placeholder="$t('resource.placeholder.catalog')" class="selectDisplay">
                                        <hos-option
                                            v-for="(item,i) in treeData"
                                            :key="item.label + i"
                                            :value="item.value"
                                            :label="item.label"
                                            :disabled="!item.usable"
                                        ></hos-option>
                                    </hos-select>
                                </hos-col>
                            </hos-form-item>
                        </hos-col>
                        <!-- 路由 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:router',
                        formRule: rules,elModel:'router'}">
                            <hos-form-item :label="$t('resource.router')" prop="router">
                                <hos-input :disabled="$m.isDisabled(status+'base:sys:resource:router')"
                                v-model="dialogForm.router" clearable :placeholder="$t('common.placeholder.router')"></hos-input>
                            </hos-form-item>
                        </hos-col>
                        <!-- 图标 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:icon',
                        formRule: rules,elModel:'icon'}">
                            <hos-form-item :label="$t('resource.icon')" prop="icon">
                                <hos-col :span= "22">
                                    <hos-select filterable v-model="dialogForm.icon" :placeholder='$t("common.placeholder.icon")' clearable>
                                        <hos-option-group v-for="(group,index) in icons"
                                            :key="index"
                                            :label="group.label" class="hos-select-dropdown-current">
                                            <hos-option
                                                v-for="(item,index) in group.arr"
                                                :key="index"
                                                :value="'hos-icom-' + item"
                                                :label="'hos-icom-' + item"
                                                >
                                                    <i :class='"hos-icom-" + item'></i>
                                                </hos-option>
                                            </hos-option-group>
                                    </hos-select>
                                </hos-col>
                                <hos-col :span="2">
                                    <i :class="this.dialogForm.icon" class="pt7"></i>
                                </hos-col>
                            </hos-form-item>
                        </hos-col>
                        <!-- 打开方式 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:openType' +status,
                        formRule: rules,elModel:'openType'}">
                            <hos-form-item :label="$t('resource.openType')" prop="openType">
                                <hos-radio-group :disabled="$m.isDisabled(status+'base:sys:resource:openType')"
                                v-model="dialogForm.openType">
                                    <hos-radio-button v-for="(item,key,index) in openTypeMap" :key="item + index"
                                    :label="key">{{ item }}</hos-radio-button>
                                </hos-radio-group>
                            </hos-form-item>
                        </hos-col>
                        <!-- 是否外链 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:frame'
                        ,formRule: rules,elModel:'frame'}">
                            <hos-form-item :label="$t('resource.frame')" prop="frame">
                                <hos-switch
                                :disabled="$m.isDisabled(status+'base:sys:resource:frame')"
                                v-model="dialogForm.frame" :active-text="$t('common.actived.activedTrue')"
                                :inactive-text="$t('common.actived.activedFalse')" inner-label></hos-switch>
                            </hos-form-item>
                        </hos-col>
                        <!-- 是否激活 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:actived',
                        formRule: rules,elModel:'actived'}">
                            <hos-form-item :label="$t('common.isActived')" prop="actived">
                                <hos-switch
                                :disabled="$m.isDisabled(status+'base:sys:resource:actived')"
                                v-model="dialogForm.actived" :active-text="$t('common.actived.activedTrue')"
                                :inactive-text="$t('common.actived.activedFalse')" inner-label></hos-switch>
                            </hos-form-item>
                        </hos-col>
                        <!-- 是否可见 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:visible',
                        formRule: rules,elModel:'visible'}">
                            <hos-form-item :label="$t('resource.visible')" prop="visible">
                                <hos-switch
                                :disabled="$m.isDisabled(status+'base:sys:resource:visible')"
                                v-model="dialogForm.visible" :active-text="$t('common.actived.activedTrue')"
                                :inactive-text="$t('common.actived.activedFalse')" inner-label></hos-switch>
                            </hos-form-item>
                        </hos-col>
                        <!-- 是否缓存 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:cached',
                        formRule: rules,elModel:'cached'}">
                            <hos-form-item :label="$t('resource.cached')" prop="cached">
                                <hos-switch
                                :disabled="$m.isDisabled(status+'base:sys:resource:cached')"
                                v-model="dialogForm.cached" :active-text="$t('common.actived.activedTrue')"
                                :inactive-text="$t('common.actived.activedFalse')" inner-label></hos-switch>
                            </hos-form-item>
                        </hos-col>
                        <!-- 排序 -->
                        <hos-col :span="8" v-has-permi="{key:status+'base:sys:resource:weight',
                        formRule: rules,elModel:'weight'}">
                            <hos-form-item :label="$t('common.weight')" prop="weight">
                                <hos-input-number
                                    :disabled="$m.isDisabled(status+'base:sys:resource:weight')"
                                    v-model="dialogForm.weight"
                                    :controls="true"
                                    :min="0"
                                ></hos-input-number>
                            </hos-form-item>
                        </hos-col>
                        <!-- 页面属性 -->
                        <hos-col :span="24" v-has-permi="{key:status+'base:sys:resource:pageProperties',
                        formRule: rules,elModel:'pageProperties'}" v-if="this.dialogForm.openType==='1'||
                        this.dialogForm.openType==='3'">
                            <hos-form-item
                            :label="$t('resource.pageAttr')"
                            prop="pageProperties">
                                <hos-input :disabled="true" v-model="pageAttrShow">
                                    <hos-button slot="append" :disabled="$m.isDisabled(status+'base:sys:resource:pageProperties')"
                                    icon="hos-icon-edit" @click="pageAttrEdit(dialogForm.pageProperties)"></hos-button>
                                </hos-input>
                            </hos-form-item>
                        </hos-col>
                        <!-- 备注 -->
                        <hos-col :span="24" v-has-permi="{key:status+'base:sys:resource:remark',
                        formRule: rules,elModel:'remark'}">
                            <hos-form-item :label="$t('common.remark')" prop="remark">
                                <hos-input
                                :placeholder='$t("common.placeholder.remark")'
                                :disabled="$m.isDisabled(status+'base:sys:resource:remark')"
                                v-model="dialogForm.remark" type="textarea" :rows="3" clearable></hos-input>
                            </hos-form-item>
                        </hos-col>
                    </hos-row>
                </hos-tab-pane>
                <hos-tab-pane v-has-permi="{key: 'base:sys:resource:JS'}"
                :label="$t('resource.tab.highJS')" name="second" class="p10 pb0">
                    <hos-row>
                        <hos-col :span="24" v-has-permi="{key:status+'base:sys:resource:advancedJs',
                        formRule: rules,elModel:'advancedJs'}">
                            <hos-form-item prop="advancedJs" label-width="0">
                                <hos-input
                                v-model="dialogForm.advancedJs"
                                :disabled="$m.isDisabled(status+'base:sys:resource:advancedJs')"
                                name="text"
                                type="textarea"
                                :rows="10"
                                :placeholder="$t('resource.placeholder.JS')"
                                >
                                </hos-input>
                            </hos-form-item>
                        </hos-col>
                    </hos-row>
                </hos-tab-pane>
            </hos-tabs>
        </hos-form>
        <div slot="footer" class="dialog-footer pt20Simple pt4-hos">
            <hos-button @click="cancel" type="primary">{{$t('operation.cancel')}}</hos-button>
            <hos-button type="success" @click="save" >{{$t('operation.save')}}</hos-button>
        </div>
        <hos-biz-dialog :title="$t('resource.pageAttr')" width="50%" uid="pageAttrDialog"
        append-to-body>
        </hos-biz-dialog>
    </div>
</template>

<script>
import {validNoZh} from '@sys/utils/validateUtil.js'
export default {
    props: ["id", "dictCode", "resourceType", "openTypeMap", "status","parentId"],
    data() {
        var codeCheck = (rule, value, callback) => {
            if (value && value !== '') {
                const result = validNoZh(value);
                if(result == true){
                    if(value.length <= 37){
                        this.$api('sys_resource.validate', {id: this.dialogForm.id, code: value}).then(res => {
                            // 资源编码重复校验
                            if(res && res.code == 200 && res.data == true){
                                callback()
                            }else {
                                callback(new Error(this.$t('common.rule.code.validate')))
                            }
                        })
                    }else{
                        callback(new Error(this.$t('common.rule.code.length')))
                    }

                }else{
                    callback(new Error(this.$t('common.rule.code.noZh')))
                }
            } else {
                callback(new Error(this.$t('common.rule.code.required')))
            }
        };
        var routerCheck = (rule, value, callback) => {
            if(value && value != '') {
                if(value.length <= 250){
                    this.$api('sys_resource.validate', {id: this.dialogForm.id, router: value}).then(res => {
                        if(res && res.code == 200 && res.data == true) {
                            callback()
                        }else {
                            callback(new Error(this.$t('common.rule.router.validate')))
                        }
                    })
                }else{
                    callback(new Error(this.$t('common.rule.router.length')))
                }
            }else {
                if(rule.required == true){
                    callback(new Error(this.$t('common.rule.router.required')))
                }else{
                    callback()
                }

            }
        }
        return {
            pageAttrShow: '',
            codeKey: 'base',
            activeName: 'first',
            // 目录位置
            treeData: [],
            // 上级资源
            parentTreeData: [],
            imageUrl: '',
            // 表单初始值
            dialogForm: {},
            loading: false,
            showIcon: false,
            rules: {
                name: [{required: true, validator: (rule, value, callback) => {
                    if(value && value != ''){
                        if(value.length <= 37){
                            callback()
                        }else{
                            callback(new Error(this.$t('common.rule.name.length')))
                        }
                    }else{
                        callback(new Error(this.$t('common.rule.name.required')))
                    }
                }}],
                code: [{required: true, trigger: 'blur', validator: codeCheck}],
                type: [{required: true, message: this.$t('resource.rule.type')}],
                parentId: [{required: false, message: this.$t('resource.rule.parentId')}],
                router: [{required: true, trigger: 'blur', validator: routerCheck}],
                icon: [{required: false, trigger: 'change', validator: (rule,value,callback) => {
                    if(value && value != ''){
                        if(value.length <= 37){
                            callback()
                        }else{
                            callback(new Error(this.$t('common.rule.icon.length')))
                        }
                    }else{
                        callback()
                    }
                }}],
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
            icons: sessionStorage.getItem('icons')?JSON.parse(sessionStorage.getItem('icons')):''
        }
    },
    created() {
        // 获取上级资源和目录位置树数据
        this.$api('sys_dict.selectByCode', {code: 'base-resource-location'}).then(res => {
            this.treeData = res.data;
        });
        this.$api('sys_resource.getCategoryTree').then(res => {
            this.parentTreeData = res.data;
            this.disabledNode(this.parentTreeData,this.id);
        })
    },
    watch:{
      'dialogForm.type':{
        handler(newVal){
          if(newVal === 'C'){
            this.rules.parentId[0].required = false;
            this.rules.router[0].required = false
          }else {
            this.rules.parentId[0].required = true;
            this.rules.router[0].required = true
          }
        }
      }
    },
    mounted() {
        if(this.id) {
            this.$api('sys_resource.getById', this.id).then(res => {
                if(res && res.code == 200){
                    this.dialogForm = res.data;
                    // 将数据回显到输入框中
                    if (this.dialogForm.pageProperties) {
                      for(var i=0;i<this.dialogForm.pageProperties.length;i++){
                        this.pageAttrShow = this.pageAttrShow + this.dialogForm.pageProperties[i].attrName + ':'+
                            this.dialogForm.pageProperties[i].attrValue + ';'
                      }
                    }
                }
            })
        }else {
            this.dialogForm = {
                actived: true,
                visible: true,
                cached: true,
                frame: false,
                parentId: this.parentId[0],
                icon: 'hos-icon-menu',
                type: 'C',
                openType: '0',
                weight: 0
            }
        }
    },
    methods: {
        // 指定节点禁用
        disabledNode(treeData,id) {
          //禁选
          treeData.forEach(item => {
            if(item.id === id) {
              item["isDisabled"] = true;
              return ;
            }
            if(item.children && item.children.length>0) {
              this.disabledNode(item.children,id);
            }
          })
        },
        save() {
            this.$refs.dialogForm.validate(valid => {
                if(valid) {
                    this.loading = false;
                    if(this.dialogForm.parentId == undefined){
                        // 对上级资源做处理，否则传给后台的是undefined
                        this.dialogForm.parentId = null
                    }
                    const obj = JSON.parse(JSON.stringify(this.dialogForm));
                    if(this.id){
                        this.$api('sys_resource.update', obj).then(res => {
                            this.loading = false
                            if(res && res.code == 200) {
                                this.$message.success(this.$t('operation.success'));
                                this.$store.commit("CLOSE_DIALOG", {_uid: 'resourceEditDialog'});
                                this.$store.commit("UPDATE_TABLE",{_uid: 'resourceTable'});
                            }else {
                                this.$message.error(this.$t('operation.error'));
                            }
                        })
                    }else {
                        this.$api('sys_resource.insert', obj).then(res => {
                            if(res && res.code == 200){
                                this.$message.success(this.$t('operation.success'));
                                this.$store.commit("CLOSE_DIALOG", {_uid: 'resourceAddDialog'});
                                this.$store.commit("UPDATE_TABLE",{_uid: 'resourceTable'});
                            }else {
                                this.$message.error(this.$t('operation.error'));
                            }
                        })
                    }
                }
            })
        },
        cancel() {
            if(this.id){
                this.$store.commit("CLOSE_DIALOG", {_uid: 'resourceEditDialog'});
            }else{
                this.$store.commit("CLOSE_DIALOG", {_uid: 'resourceAddDialog'});
            }
            this.loading = false;
        },
        // 打开页面属性编辑弹出层
        pageAttrEdit(value) {
            this.$store.commit("OPEN_DIALOG", {
                _uid: 'pageAttrDialog',
                component: require('./pageAttrEdit.vue').default,
                props: {
                    pageCallback: this.pageCallback,
                    pageValue: value
                }
            })
        },
         handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleClick(tab, event) {
      },
      pageCallback(val) {
        // 获取页面属性
        let pageAttr = '';
        if (val!==undefined && val.length>0) {
          for(let i=0;i<val.length;i++){
            const attr = val[i].attrName.toString() + ':' + val[i].attrValue.toString()
            if (i === val.length-1) {
              pageAttr = pageAttr + attr;
            } else {
              pageAttr = pageAttr + attr + ';';
            }
          }
        }
        this.pageAttrShow = pageAttr
        this.dialogForm.pageProperties = val
      }
    }
}
</script>
