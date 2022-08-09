<template>
    <div>
        <!-- 在已有的tab分组中使用组件 -->
        <div :ref="'customField' + permCode">
            <!-- 遍历当前权限编码对应的字段组合 -->
            <hos-col v-for="item in this.filedShowData[0].fieldData" :key="item.id" :span="item.col">
                 <hos-form-item :label="item.name" :prop="item.id">
                    <hos-input v-if="item.type == 'input'" v-model="expandParams[item.id]"
                        @blur="onInputChange()">
                    </hos-input>
                    <hos-select v-else-if="item.type == 'select'" 
                    v-model="expandParams[item.id]" @change="onInputChange()">
                        <hos-option v-for="optItem in item.options" :key="optItem.value"
                        :label="optItem.label" :value="optItem.value"></hos-option>
                    </hos-select>
                    <hos-input-number v-else-if="item.type == 'inputNumber'"
                    v-model="expandParams[item.id]" @change="onInputChange()"></hos-input-number>
                    <hos-input v-else-if="item.type == 'textarea'" type="textarea"
                    v-model="expandParams[item.id]" @blur="onInputChange()"></hos-input>
                    <hos-date-picker v-else-if="item.type == 'DatePicker'" type="date"
                    v-model="expandParams[item.id]" @change="onInputChange()"></hos-date-picker>
                    <hos-switch v-else-if="item.type=='switch'" v-model="expandParams[item.id]" 
                     @change="onInputChange()"
                    >
                    </hos-switch>
                </hos-form-item>
            </hos-col>
        </div> 
    </div>
</template>
<script>
import {transRule} from'./getRules.js'
export default {
    name: "customField",
    props: {
        fields: Array,
        // 扩展字段的id和value
        expandParams: Object,
        permCode: String,
        rules: Object
    },
    data(){
        
        return {
            filedShowData: [],
            // 通过fields获取到
            newRules: [],
        }
    },
    created(){
        // 根据权限编码渲染需要展示的字段
        this.filedShowData = this.fields.filter(item => {
            return item.permCode == this.permCode
        });
        // 动态添加规则
        let newRule = transRule(this.filedShowData);
        // 将新规则添加到原来的规则里面
        this.$emit('addRules', newRule)
        // 遍历数据获取选择框的数据源
        // if(this.filedShowData.length != 0){
        //     for(var i=0;i< this.filedShowData[0].fieldData.length;i++){
        //         if(this.filedShowData[0].fieldData[i].type == 'select'){
        //             this.$api('', {type: 'select', typesetting: this.filedShowData[0].fieldData[i].typesetting}).then(res => {
        //                 this.$set(this.fields, 'options', res.data)
        //             })
        //         }
        //     }
        // }
    },
    methods: {
        onInputChange() {
            // 验证输入内容
            // this.$refs['customField'+this.permcode].validateField(item)
            this.$emit('changeForm', this.expandParams)
        },
    }
    
}
</script>

<style scoped>
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>


// 1 字段初始化值为空，调用实体表单布局结构接口渲染出自定义字段，
// 2 修改的时候，先渲染页面，再调用实体表单的字段信息，获取到expandParams上面的字段的value，把value赋值上去
// 数据存储格式
{
    "id": 'value',        字段Id   字段值
    
}
// typeSetting是select的options获取的来源
// 根据权限编码来渲染字段，每一组权限编码对应了一个tab组合，组件只会渲染一个tab下面的字段