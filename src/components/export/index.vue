<template>
  <div :loading="loading">
    <div  class="comexport">
      <div class="mb10"><span>{{$t('export.pleaseSelect')}}</span></div>
      <hos-checkbox class="mb10 ml10" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('export.checkAll')}}</hos-checkbox>
      <hos-checkbox-group v-model="checked" @change="handleCheckedChange" class="ml10">
      <hos-checkbox class="mb10" v-for="item in this.option" :label="item.value" :key="item.value">{{item.label}}</hos-checkbox>
      </hos-checkbox-group>
    </div>
    <div slot="footer" class="dialog-footer exports" >
      <hos-button type="primary" @click="cancel">{{$t('operation.cancel')}}</hos-button>
      <hos-button type="success" @click="submitExport()" :disabled="submitDisabled">{{$t('export.submit')}}</hos-button>
    </div>
  </div>
</template>
<script>
import { getToken } from '@sys/utils/base/token-util';
export default {
  props: ['option', 'default', 'exportUrl', 'data'],
  components: {},
  data() {
    return {
      loading: false,
      // 是否全选
      checkAll: false,
      isIndeterminate: true,
      // 选中数组，初始为默认值
      checked: this.default,
      // 是否禁用提交按钮
      submitDisabled: false
    };
  },
  created() {
    this.checkAll = (this.checked.length === this.option.length)
    this.isIndeterminate = (this.checked.length < this.option.length && this.checked.length > 0)
  },
  watch: {
    checked(newVal) {  //对选中数组进行监听
      this.submitDisabled = newVal.length <= 0;
    },
  },
  mounted() {
  },
  methods: {
    // 全选正反选事件
    handleCheckAllChange(val) {
      if (val) {
        this.checked = Array.from(this.option,({value})=>value);
      } else {
        this.checked = [];
      }
      this.isIndeterminate = false;
    },
    // 单独选项选择
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.option.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.option.length;
    },
    // 确认导出
    submitExport() {
      let token = getToken();
      let url = process.env.VUE_APP_BASE_URL + this.exportUrl + "?heads=" + this.checked.join() + "&access-token=" + token;
      if (this.data && this.data.length>0){
        this.data.forEach(item=>{
          url+="&"+item.key+"="+item.value;
        })
      }
      window.location.href = url;
    },
    //取消按钮
			cancel() {
				this.$store.commit("CLOSE_DIALOG", {
					_uid: "exportDialog",
				});
				this.loading = false;
			},
  }
};
</script>
