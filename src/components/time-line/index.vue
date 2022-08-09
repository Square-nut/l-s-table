<template>
  <div :loading="loading">
    <div id="timeLineDialog" style="max-height: 500px" v-if="!dataIsNull">
      <hos-timeline :reverse="false">
        <hos-timeline-item class="timeline-item" :timestamp="activity.operateTime" placement="top"
         v-for="(activity, index) in activities" :key="index" :icon="timeIcons[activity.type]" 
         :color="timeColor[activity.type]" :class="'shadow-' + activity.type">
          <hos-row style="padding-bottom:10px">
            <hos-col :span="6" class="timeline-title">
              {{activity.typeName}}
            </hos-col>
            <hos-col :span="9" class="timeline-font">
              <i class="timeline-icon hos-icom-person"></i>{{activity.operator}}
            </hos-col>
            <hos-col :span="9" class="timeline-font">
             <i class="timeline-icon hos-icon-monitor"></i>{{activity.ip}}
            </hos-col>
          </hos-row>
          <hos-row style="padding-bottom:5px">
            <hos-col :span="12" class="timeline-content">{{$t('timeline.tableName')+activity.tableName}}</hos-col>
            <hos-col :span="12" class="timeline-content">{{$t('timeline.className')+activity.className}}</hos-col>
         </hos-row>
          <hos-row>
              <hos-col :span="24" v-for="showCont,i in activity.content" :key="i" 
            class="timeline-content">{{showCont}}</hos-col>
          </hos-row>
        </hos-timeline-item>
      </hos-timeline>
    </div>
    <hos-empty description="暂无数据" v-if="dataIsNull" style="height: 200px;margin-bottom: 30px"></hos-empty>
    <div slot="footer" class="dialog-footer">
      <hos-button @click="cancel" type="primary">{{$t('operation.close')}}</hos-button>
    </div>
  </div>
</template>

<script>
import {timeColor, timeIcons} from '../../enum/timeLineEnum'
export default {
  props: ["id","tableName"],
  mixins: [timeColor, timeIcons],
  data() {
    return {
      loading: true, //遮罩
      activities: [],
      dataIsNull: false
    }
  },
  created() {
    this.initData();
  },
  methods: {
    //初始化表单数据
    initData() {
      let params= {
        businessId : this.id,
        tableName : this.tableName,
      }
      var strTest = "第一条修改数据第一条修第一条修改数据第一条修改数据改数据第一条修改数据第一条修改数据第一条修改数据@第二条修改数据@第三条修改数据"
      this.$api('business_log.timeLineData', params).then(res => {
        if(res && res.code === "200") {
          this.activities = res.data;
          for(var i=0;i<this.activities.length;i++){
            this.activities[i].content = this.activities[i].content.split("▾");
          }
          this.dataIsNull = this.activities.length <= 0;
        }
        this.loading = false;
      })
    },
    // 关闭按钮
    cancel() {
      this.$store.commit("CLOSE_DIALOG", {_uid: 'timeLineDialog'});
      this.loading = false;
    },
  }
}
</script>
<style>
.hos-timeline{
  padding-top: 20px;
}
.hos-timeline-item__node--normal{
  width: 36px;
  height: 36px;
}
.hos-timeline-item {
  padding-bottom: 10px;
}
.hos-timeline-item__tail{
  left: 17px;
  border-left: 1px solid #DAE2EE;

}
.hos-timeline-item__node{
  background-color: snow;
}
.hos-timeline-item__wrapper{
  padding-left: 55px;
}
.timeline-icon{
  padding-right:10px;
}
.timeline-title{
  font-size: 14px;
  font-weight: bold;
  margin-top: -2px;
}
.timeline-font{
  color: #666666;
  font-size: 12px;
}
.timeline-content{
  line-height: 20px;
  font-size:12px;
}
.hos-timeline-item__icon {
  font-size: 16px;
}
.hos-timeline-item__timestamp{
  position: absolute;
  margin-top: -5px;
  margin-left: -150px;
  color: black;
  line-height: 2;
  font-size: 12px;
  width: 75px;
  text-align: right;
}
.hos-timeline-item__timestamp.is-top {
  line-height: 16px;
  padding-top: 12px;
}
.hos-timeline-item__content {
  color: #303133;
  padding-top: 10px;
}
.icon_log_insert{
  background: url(../../assets/images/timeline/insert.png) center no-repeat;
}
.icon_log_update{
  background: url(../../assets/images/timeline/update.png) center no-repeat;
}
.icon_log_delete{
  background: url(../../assets/images/timeline/delete.png) center no-repeat;
}
.icon_log_import{
  background: url(../../assets/images/timeline/import.png) center no-repeat;
}
.icon_log_bind{
  background: url(../../assets/images/timeline/bind.png) center no-repeat;
}
.shadow-insert .hos-timeline-item__node {
  box-shadow: 0px 2px 5px 1px rgba(71,129,243,0.6000);
}
.shadow-update .hos-timeline-item__node {
  box-shadow: 0px 2px 5px 1px rgba(255,153,51,0.6000);
}
.shadow-delete .hos-timeline-item__node {
  box-shadow: 0px 2px 5px 1px rgba(158,227,121,0.6000);
}
.shadow-import .hos-timeline-item__node {
  box-shadow: 0px 2px 5px 1px rgba(158,227,121,0.6000);
}
.shadow-bind .hos-timeline-item__node {
  box-shadow: 0px 2px 5px 1px rgba(158,227,121,0.6000);
}
#timeLineDialog {
  max-height: 460px;
  overflow: auto;
  padding-right: 20px;
}
.timeline-item {
  margin-left:120px;
  padding-bottom:20px;
}
.timeline-item:last-child{
  padding-bottom: 10px;
}

</style>