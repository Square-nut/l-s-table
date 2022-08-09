<template>
    <div>
        <hos-col :span="24">
            <hos-button-group>
                <hos-button @click="addField()" icon="hos-icon-circle-plus-outline">
                    {{$t('operation.add') + $t('expand.title')}}
                </hos-button>
                <hos-button @click="addTabs()" icon="hos-icon-circle-plus-outline">
                    {{$t('operation.add') + $t('expand.group')}}
                </hos-button>
            </hos-button-group>
            <div style="display: inline-block; float: right;padding-right: 20px;line-height: 50px">
                <hos-button plain style="border-radius: 5px" @click="closeTab()">
                    {{$t('expand.reback')}}
                </hos-button>
                <hos-button type="primary" style="border-radius: 5px" @click="save()">
                    {{$t('operation.save')}}</hos-button>
            </div>
            <hos-col v-for="(item,index) in newTabArr" :key="index" class="cardBottom">
                <hos-col :span="24" style="height: 50px; background-color: #fff;margin-bottom: 10px">
                    <hos-col :span="4">
                        <hos-input style="line-height: 50px; padding-left: 20px" 
                        v-model="item.group" :placeholder="$t('expand.message.tabName')">
                        </hos-input>
                    </hos-col>
                    <div style="float: right; margin-right: 10px">
                        <hos-button type="text" icon="hos-icon-circle-close" 
                            @click="deleteTab(item.group, index)">
                            </hos-button>
                    </div>
                </hos-col>
                <hos-col :span="24" style="min-height: 50px;background-color: #fff">
                    <draggable style="width: 100%; min-height: 30px" v-model="item.fieldData" group="code" 
                dragClass="dragClass" ghostClass=
                "ghostClass" chosenClass="chosenClass" @start="onStart()" @end="onEnd()" :distance="1">
                    <hos-col v-for="fieldItem in item.fieldData" :key="fieldItem.id" 
                    :span="fieldItem.col" class="item">
                    <hos-row>
                        <div style="display: inline-block">
                            <span style="line-height: 40px;padding-left: 20px">{{ fieldItem.fieldName }}</span>
                        </div>
                        <div style="display: inline-block;float: right;padding-right: 10px;
                        padding-left: 10px;background-color: #fff">
                            <hos-button type="text" icon="hos-icon-circle-close" 
                            @click.stop.prevent="deleteField(fieldItem.fieldName, item.group)">
                            </hos-button>
                        </div>
                        <div style="display: inline-block;float: right;padding-right: 10px">
                            <hos-input-number v-model="fieldItem.col" 
                             :min="7" :max="24">
                            </hos-input-number>
                        </div>
                    </hos-row>
                    </hos-col>
                </draggable>
                </hos-col>
            </hos-col>
        </hos-col>
        <hos-biz-dialog
            :title='$t("operation.add") + $t("expand.title")'
            width="1000px"
            uid="fieldAddDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
    </div>
</template>

<script>
  import draggable from 'vuedraggable'
export default {
    inject: ["closeCurrent"],
    components: {
        draggable
    },
    data() {
        return {
            input: '',
            // 根据id查询实体详情
            formId: '',
            // 实体主键
            tableId: '',
            // 拖拽开始结束标志
            drag: false,
            // 新加的tab页签
            newTabArr: [],
            // 作为对比的tab
            newTabArrClone: [],
            // 当前表单里已经存在的id的集合
            currentIds: [],
            // 从弹窗来的新数据
            addFields: [],
            num: 12,
            showEdit: false,
            hasField: [],
            pageId: '',
            fieldList: [],
            allFieldList: []
        }
    },
    created(){
        this.formId = this.$route.query.formId
        this.tableId = this.$route.query.tableId;
        this.$api('sys_expand.getFieldForDesign', {tableId: this.tableId}).then(res => {
            if(res && res.code ==200){
                // 得到自定义字段列表
                this.fieldList = res.data;
                [...this.allFieldList] = this.fieldList
            }
        })
    },
    mounted() {
        if(this.formId){
            this.$api('sys_expand.getEntityForm', this.formId).then(res => {
                if(res && res.code == 200){
                    this.newTabArr = res.data.formSetting;
                    // 保留一个作为后续删除tab和字段的对比
                    [...this.newTabArrClone] = res.data.formSetting
                    // 获取当前存在的字段的id
                    this.currentIds = this.getTabIds(res.data.formSetting)
                    this.pageId = res.data.pageId
                    // 初始得到已有字段
                    this.hasField = this.getField(this.newTabArr);
                    for(var i=0;i<this.hasField.length;i++){
                        for(var j=0;j<this.fieldList.length;j++){
                            if(this.hasField[i] == this.fieldList[j].name){
                                this.fieldList.splice(j, 1);
                            }
                        }
                    }
                }else {
                    this.$message.error(this.$t('operation.error'))
                }
            })
        }else{
            // 如果formId为空的话，默认新加一个分组
            this.addTabs();
        }
    },
    methods: {
        onStart() {
            this.drag = true
        },
        onEnd() {
            this.drag = false
        },
        addField() {
            this.$store.commit("OPEN_DIALOG", {
                component: require('./design-edit.vue').default,
                _uid: 'fieldAddDialog',
                props: {
                    callback: this.callback1,
                    tabLength: this.newTabArr.length,
                    tableId: this.tableId,
                    hasField: this.hasField,
                    allFieldList: this.allFieldList
                }
            })
        },
        // 增加分组
        addTabs() {
            var tab = {
                group: "新建页签" + (this.newTabArr.length+1),
                fieldData: [],
                permCode: '',
                edit: false
            }
            this.newTabArr.push(tab)
        },
        // 返回之前的路由
        closeTab() {
            this.$router.push({path: '/base-sys-expand'});
            this.closeCurrent();
        },
        // 删除tab页签分组,根据下标来删除
        deleteTab(group, index) {
            var deleteFields = [];
            for(let i=0;i<this.newTabArr[index].fieldData.length;i++){
                deleteFields.push(this.newTabArr[index].fieldData[i].fieldName);
            }
            this.delHasField(deleteFields);
            this.newTabArr.splice(index, 1);
            // 以下部分根据group删除的，纯属搞笑
            // for(let i=0;i<this.newTabArr.length;i++){
            //     if(this.newTabArr[i].group == group){
            //         // 得到改组删除的字段名
            //         for(var j=0;j<this.newTabArr[i].fieldData.length;j++){
            //             deleteFields.push(this.newTabArr[i].fieldData[j].fieldName)
            //         }
            //         this.delHasField(deleteFields);
            //         this.newTabArr.splice(i, 1);
            //         break;
            //     }
            // }
        },
        callback1(val) {
            // 1 将字段添加到hasField 修改fieldList
            for(var i=0;i<val.length;i++){
                this.hasField.push(val[i].fieldName);
                for(var j=0;j<this.fieldList.length;j++){
                    if(val[i].fieldName == this.fieldList[j].fieldName){
                        this.fieldList.splice(j, 1);
                        break;
                    }
                }
                // 2 将字段添加到分组里面(只会放在最后一组)
            this.newTabArr[this.newTabArr.length -1].fieldData.push(val[i]);
            }
        },
        // 删除字段
        deleteField(str1, str2) {
            for(let i=0;i<this.newTabArr.length;i++){
                if(this.newTabArr[i].group == str2){
                    for(let j=0;j<this.newTabArr[i].fieldData.length;j++){
                        if(this.newTabArr[i].fieldData[j].fieldName == str1){
                            this.newTabArr[i].fieldData.splice(j, 1);
                            break;
                        }
                    }
                }
            }
            this.hasField = this.getField(this.newTabArr)
            
        },
        delHasField(arr) {
            for(var i=0;i<arr.length;i++){
                for(var j=0;j<this.hasField.length;j++){
                    if(this.hasField[j] == arr[i]){
                        this.hasField.splice(j, 1);
                        break;
                    }
                }
            }
        },
        handleChange() {
            console.log(value);
        },
        save() {
            // 循环把多余的属性去除
            for(var i=0;i< this.newTabArr.length;i++){
                for(var j=0;j<this.newTabArr[i].fieldData.length;j++){
                    this.newTabArr[i].fieldData[j] = {
                        id: this.newTabArr[i].fieldData[j].id,
                        col: this.newTabArr[i].fieldData[j].col
                    }
                }
            }
            if(this.formId){
                var obj = {};
                var deletGroupStrs = '';
                var deletColumnStrs = '';
                var newTabIds = this.getTabIds(this.newTabArr);
                // 进行的是修改操作，需要加上tab权限编码集合deletGroupStrs  和删除的字段id集合deletColumnStrs
                // 1 遍历res.data和更改以后的newTabArr，在res.data里面缺少了newTabArr的分组，就是被删除的分组
                // 2 遍历字段，newTabArr有的且res.data里面没有的，就是删除掉的字段
                for(var i=0;i<this.newTabArrClone.length;i++){
                    // some方法返回true，代表在newTabArr里面找到了权限编码
                    let result = this.newTabArr.some(ele => ele.permCode === this.newTabArrClone[i].permCode);
                    if(result == false){
                        deletGroupStrs += this.newTabArrClone[i].permCode + ',';
                    }
                }
                for(var i=0;i<this.currentIds.length;i++){
                    let result = newTabIds.some(ele => ele === this.currentIds[i])
                    if(result == false){
                        deletColumnStrs += this.currentIds[i] + ',';
                    }
                }
                obj = {
                    pageId: this.pageId,
                    tableId: this.tableId,
                    id: this.formId,
                    formSetting: this.newTabArr,
                    deletGroupStrs: deletGroupStrs,
                    deletColumnStrs: deletColumnStrs
                }
            }else{
                // 新增的话不需要那两集合
                obj = {
                    pageId: this.pageId,
                    tableId: this.tableId,
                    id: this.formId,
                    formSetting: this.newTabArr
                }
            }
            this.$api('sys_expand.submitFields', obj).then(res => {
                if(res && res.code == 200){
                    this.$message.success(this.$t('operation.success'));
                }else{
                    this.$message.error(this.$t('operation.error'))
                }
            })
        },
        // 获取id集合的方法
        getTabIds(data) {
            let ids = [];
            for(var i=0;i<data.length;i++){
                for(var j=0;j<data[i].fieldData.length;j++){
                    ids.push(data[i].fieldData[j].id)
                }
            };
            return ids;
        },
        getField(arr){
            let field = []
            for(var i=0;i<arr.length;i++){
                if(arr[i].fieldData.length > 0){
                    for(let j=0;j<arr[i].fieldData.length;j++){
                        field.push(arr[i].fieldData[j].fieldName)
                    }
                }
            };
            return field
        },
    }
}
</script>

<style scoped>
.ghostClass{
  background-color:  blue !important;
}
.chosenClass{
  background-color: red !important;
  opacity: 1!important;
}
.dragClass{
  background-color: blueviolet !important;
  opacity: 1 !important;
  box-shadow:none !important;
  outline:none !important;
  background-image:none !important;
}
.item{
    border:  solid 5px #fff;
    background-color: #f1f1f1;
}
.button_right {
    float: right;
}
.cardBottom {
    margin-bottom: 10px;
}
.edit-pipeline {
    border-radius: 3px;
}
</style>