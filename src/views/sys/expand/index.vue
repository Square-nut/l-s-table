<template>
  <div style="height: 100%">
    <hos-biz-table
      @selection-change="handleSelectionChange"
      :page="true"
      :selection="selection"
      uid="expandTable"
      :cols="cols"
      :data="expandData"
      :form="form"
      pagePos="top"
    >
      <template #form>
        <hos-row>
          <hos-col :span="6">
            <hos-form-item :label="$t('common.code')">
              <hos-input clearable v-model="form.model.tableClass" :placeholder="$t('common.placeholder.code')">
              </hos-input>
            </hos-form-item>
          </hos-col>
          <hos-col :span="6">
            <hos-form-item :label="$t('common.name')">
              <hos-input clearable v-model="form.model.name" :placeholder="$t('common.placeholder.name')">
              </hos-input>
            </hos-form-item>
          </hos-col>
          <hos-col :span="6">
            <hos-form-item label-width="20px">
              <hos-biz-button run="form.search" type="primary">{{$t('operation.query')}}</hos-biz-button>
              <hos-biz-button @click="reset()">{{$t('operation.reset')}}</hos-biz-button>
              <hos-button v-has-permi="{key:'base:sys:expand:log'}" @click="bizLog()"
              type="primary">{{ $t("operation.bizLog") }}</hos-button>
            </hos-form-item>
          </hos-col>
        </hos-row>
      </template>
      <template #toolbar>
        <hos-button-group>
          <hos-button v-has-permi="{key:'base:sys:expand:lifetime'}"
           icon="hos-icom-sample-stat" @click="timeLine()">
            {{ $t("operation.timeline") }}</hos-button>
          </hos-button-group>
      </template>
      <template #operation="{ row }">
				 <hos-tooltip class="pl5 pr5"  :content="$t('expand.expand')">
          <i class="hos-icon-circle-plus-outline" @click="cunstomFieldTab(row)"></i></hos-tooltip>
         <hos-tooltip class="pl5 pr5"  :content="$t('expand.design')">
          <i class="hos-icom-design" @click="deviseTab(row)"></i>
        </hos-tooltip>
         <hos-tooltip class="pl5 pr5"  :content="$t('expand.link')">
          <i class="hos-icom-barbell" @click="userPageLink(row)"></i>
        </hos-tooltip>
			</template>
    </hos-biz-table>
    <hos-biz-dialog
      :title='"关联预置页面"'
      width="60%"
      uid="pageUserLinkDialog"
      :close-on-click-modal="false"
    >
    </hos-biz-dialog>
    <hos-biz-dialog
      :title="timeLineDialogTitle"
      width="40%"
      uid="timeLineDialog"
      :close-on-click-modal="false">
    </hos-biz-dialog>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      selection: [],
      page: {
        size: 10,
        current: 1,
        name: '',
        tableClass: ''
      },
      names: [],
      //生命周期弹窗名
      timeLineDialogTitle: "",
      form: {
        labelWidth: "80px",
        model: {
          name: "",
          tableClass: ""
        }
      },
      cols: [{
        type: 'selection',
        width: '50px',
        align: "center"
      },{
        prop: 'tableClass',
        label: this.$t('common.code')
      },{
        prop: 'name',
        label: this.$t('common.name')
      },{
        prop: 'createTime',
        label: this.$t('common.createTime')
      },{
        label: this.$t('common.operation'),
        width: '120px',
        prop: 'operation',
				slotName: 'operation'
      }]
    }
  },
  methods: {
    // 自定义页面实体列表
    expandData(params) {
      return this.$api('sys_expand.entityPage', params)
    },
    handleSelectionChange(selection) {
      this.selectedTableIds = selection.map((item) => item.id);
      this.names = selection.map((item) => item.name);
    },
    // 打开用户页面关联界面
    userPageLink(row) {
      this.$store.commit("OPEN_DIALOG", {
        component: require('./expand-page.vue').default,
        _uid: 'pageUserLinkDialog',
        props: {
          tableId: row.id,
          pageId: row.pageId
        }
      })
    },
    // 打开自定义字段页面
    cunstomFieldTab(row) {
      console.log(row)
      this.$router.push({
        path: '/base-sys-expand-field',
        query: {
          fieldId: row.id,
          tableId: row.id,
          title: row.name
        },
      })
    },
    // 页面设计
    deviseTab(data) {
      console.log(data)
      this.$router.push({
        path: '/base-sys-expand-design',
        query: {
          formId: data.formId,
          tableId: data.id,
        }
      })
    },
    reset() {
      this.form.model = {
        name: "",
        tableClass: ""
      }
    },
    // 生命周期
    timeLine() {
      if(this.selectedTableIds !== undefined && this.selectedTableIds.length > 0) {
        if(this.selectedTableIds.length > 1) {
          this.$message.warning(this.$t("timeline.warning"));
          return;
        }
      } else {
        this.$message.warning(this.$t("timeline.please"));
        return;
      }
      this.timeLineDialogTitle = this.$t("timeline.title") + this.names[0];
      this.$store.commit("OPEN_DIALOG", {
        component: require("@sys/components/time-line/index.vue").default,
        _uid: "timeLineDialog",
        props: {
          id: this.selectedTableIds[0],
          tableName: "t_sys_expand_table"
        },
      });
    },
     // 数据日志页面
    bizLog() {
      // 数据日志组件
      this.$router.push({
        path: "/base-monitor-business-log",
        query: {
          tableName: "t_sys_expand_table",
          path: "/base-sys-expand"
        },
      });
    },
  }
}
</script>
