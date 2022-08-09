<template>
  <div style="padding: 10px 10px 0 10px" class="log-view">
    <hos-table
      :data="businessLogData"
      style="width: 100%"
      v-show="type === 'insert' || type === 'update'"
      :row-style="tableRowStyle"
      class="data-view w-fit"
    >
      <hos-table-column
        type="index"
        :label="$t('common.index')"
        width="50px"
        align="center"
      >
      </hos-table-column>
      <hos-table-column prop="code" :label="$t('businessLog.field')">
      </hos-table-column>
      <hos-table-column prop="fieldName" :label="$t('businessLog.fieldName')">
      </hos-table-column>
      <hos-table-column
        prop="before"
        :label="$t('businessLog.before')"
        :formatter="beforeFormatter"
      >
      </hos-table-column>
      <hos-table-column
        prop="after"
        :label="$t('businessLog.after')"
        :formatter="afterFormatter"
      >
      </hos-table-column>
    </hos-table>
    <div v-show="type === 'import'" style="height: 350px">
      <hos-descriptions border :labelStyle="{ 'text-align': 'right'}">
        <hos-descriptions-item :label="$t('businessLog.type')">
          <hos-tag>{{ operateType }}</hos-tag>
        </hos-descriptions-item>
        <hos-descriptions-item :label="$t('businessLog.total')">
          <hos-tag>{{ total }}</hos-tag>
        </hos-descriptions-item>
        <hos-descriptions-item :label="$t('businessLog.success')">
          <hos-tag>{{ success }}</hos-tag>
        </hos-descriptions-item>
      </hos-descriptions>
    </div>
    <div v-show="type === 'bind'" style="max-height: 350px">
      <hos-descriptions :column="2" border :labelStyle="{ 'text-align': 'right'}">
        <hos-descriptions-item
          :label="$t('businessLog.className')"
          :contentStyle="{ width: '41%' }"
        >
          <hos-tag>{{ entityName }}</hos-tag>
        </hos-descriptions-item>
        <hos-descriptions-item
          :label="$t('businessLog.title')"
          :contentStyle="{ width: '41%' }"
        >
          <hos-tag>{{ title }}</hos-tag>
        </hos-descriptions-item>
        <hos-descriptions-item
          :label="$t('businessLog.before')"
          :contentStyle="{ width: '41%' }"
        >
          {{ before }}
        </hos-descriptions-item>
        <hos-descriptions-item
          :label="$t('businessLog.after')"
          :contentStyle="{ width: '41%' }"
        >
          {{ after }}
        </hos-descriptions-item>
        <hos-descriptions-item
          :label="$t('businessLog.add')"
          :contentStyle="{ width: '41%' }"
        >
          {{ add }}
        </hos-descriptions-item>
        <hos-descriptions-item
          :label="$t('businessLog.delete')"
          :contentStyle="{ width: '41%' }"
        >
          {{ del }}
        </hos-descriptions-item>
      </hos-descriptions>
    </div>
    <div slot="footer" class="dialog-footer" style="padding-top: 20px">
      <hos-button @click="cancel" type="primary">{{
        $t("operation.close")
      }}</hos-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ["obj"],
  data() {
    return {
      // 数据
      businessLogData: [],
      // 执行条数
      total: 0,
      // 成功条数
      success: 0,
      // 操作类型
      type: "",
      // 对象类
      entityName: "",
      // 对象名
      title: "",
      // 旧值
      before: "",
      // 新值
      after: "",
      // 新增部分
      add: "",
      // 删除部分
      del: "",
      // 导入详情中的操作类型名
      operateType: "",
    };
  },
  mounted() {
    // 初始化表单
    if (this.obj) {
      this.businessLogData = this.obj.difData;
      this.type = this.obj.type;
      if (this.obj.type === "import") {
        this.total = this.businessLogData[0].total;
        this.success = this.businessLogData[0].success;
        this.operateType = this.businessLogData[0].type;
      } else if (this.obj.type === "bind") {
        this.entityName = this.obj.entityName;
        this.title = this.obj.title;
        this.before =
          this.businessLogData[0].before === ""
            ? "无"
            : this.businessLogData[0].before;
        this.after =
          this.businessLogData[0].after === ""
            ? "无"
            : this.businessLogData[0].after;
        this.add =
          this.businessLogData[0].add === ""
            ? "无"
            : this.businessLogData[0].add;
        this.del =
          this.businessLogData[0].delete === ""
            ? "无"
            : this.businessLogData[0].delete;
      }
    }
  },
  methods: {
    cancel() {
      this.$store.commit("CLOSE_DIALOG", { _uid: "businessLogViewDialog" });
      this.loading = false;
    },
    tableRowStyle({ row }) {
      if (row.before !== row.after) {
        return {
          background: "#fca5a5",
        };
      }
      return "";
    },
    beforeFormatter(row) {
      if (typeof row.before == "boolean") {
        if (row.before) {
          return "true";
        } else {
          return "false";
        }
      } else if (row.before instanceof Object) {
        row.before = JSON.stringify(row.before);
        return row.before;
      } else {
        if (row.before !== "" && row.before.length > 50) {
          if (row.before !== row.after) {
            // 长数据区别不相等
            row.before = row.before.substring(0, 50) + "...";
          } else {
            row.before = row.before.substring(0, 50) + "......";
          }
        }
        return row.before;
      }
    },
    afterFormatter(row) {
      if (typeof row.after == "boolean") {
        if (row.after) {
          return "true";
        } else {
          return "false";
        }
      } else if (row.after instanceof Object) {
        row.after = JSON.stringify(row.after);
        return row.after;
      } else {
        if (row.after !== "" && row.after.length > 50) {
          row.after = row.after.substring(0, 50) + "......";
        }
        return row.after;
      }
    },
  },
};
</script>