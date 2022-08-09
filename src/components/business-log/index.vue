<template>
  <div class="h-fit">
    <hos-biz-table
      :page="true"
      uid="businessLogTable"
      :cols="cols"
      :data="businessLogData"
      :form="form"
      pagePos="top"
    >
      <template #form>
        <hos-row :gutter="20">
          <hos-col :span="6">
            <hos-form-item :label="$t('businessLog.title')">
              <hos-input v-model="form.model.title"
              :placeholder="$t('common.placeholder.title')"></hos-input>
            </hos-form-item>
          </hos-col>
          <hos-col :span="6">
            <hos-form-item :label="$t('businessLog.operator')">
              <hos-input v-model="form.model.userName"
              :placeholder="$t('common.placeholder.operator')"></hos-input>
            </hos-form-item>
          </hos-col>
          <hos-col :span="6">
            <hos-form-item :label="$t('businessLog.type')">
              <hos-select
                v-model="form.model.type"
                :placeholder="$t('businessLog.pleaseSelectType')"
                clearable
              >
                <hos-option
                  v-for="item in type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </hos-option>
              </hos-select>
            </hos-form-item>
          </hos-col>
          <hos-col :span="6">
            <hos-form-item label-width="20px">
              <hos-biz-button run="form.search" type="primary"
                >{{ $t("operation.query") }}
              </hos-biz-button>
              <hos-biz-button type="primary" @click="reset()"
                >{{ $t("operation.reset") }}
              </hos-biz-button>
              <hos-button type="success" @click="closePage()">{{
                $t("operation.close")
              }}</hos-button>
            </hos-form-item>
          </hos-col>
        </hos-row>
        <hos-row :gutter="20">
            <hos-col :span="6">
            <hos-form-item :label="$t('businessLog.operateTime')">
              <hos-date-picker
                v-model="fromR.date"
                type="daterange"
                class="datapicker"
                :range-separator="$t('common.dateZhi')"
                :picker-options="{
                  disabledDate(time) {
                    // 设置禁用状态，参数为当前日期，要求返回 Boolean
                    return time.getTime() > Date.now();
                  },
                }"
                :start-placeholder="$t('common.startDate')"
                :end-placeholder="$t('common.endDate')"
              >
              </hos-date-picker>
            </hos-form-item>
          </hos-col>
        </hos-row>
      </template>
    </hos-biz-table>
    <hos-biz-dialog
      :title="$t('operation.view') + $t('loginLog.info')"
      width="70%"
      uid="businessLogViewDialog"
      :close-on-click-modal="false"
    >
    </hos-biz-dialog>
    <hos-biz-dialog
      :title="timeLineDialogTitle"
      width="40%"
      uid="timeLineDialog"
      :close-on-click-modal="false"
    ></hos-biz-dialog>
  </div>
</template>

<script>
export default {
  inject: ["closeCurrent"],
  data() {
    return {
      // 操作类型option
      type: [
        {
          value: "insert",
          label: this.$t("operation.add"),
        },
        {
          value: "update",
          label: this.$t("operation.edit"),
        },
        {
          value: "delete",
          label: this.$t("operation.delete"),
        },
        {
          value: "import",
          label: this.$t("operation.import"),
        },
        {
          value: "bind",
          label: this.$t("operation.bind"),
        },
      ],
      form: {
        //inline: true,
        labelWidth: "auto",
        model: {
          title: "",
          userName: "",
          type: "",
          startTime: "",
          endTime: "",
          tableName: "",
        },
      },
      fromR: {
        date: "",
        examine1: false,
        examine2: false,
      },
      cols: [
        {
          prop: "title",
          label: this.$t("businessLog.title"),
          width: 300,
          showOverflowTooltip: true,
        },
        {
          prop: "userName",
          label: this.$t("businessLog.operator"),
        },
        {
          label: this.$t("businessLog.type"),
          width: 100,
          prop: ({ row }) => {
            if (row.type === "insert") {
              return this.$t("operation.add");
            } else if (row.type === "update") {
              return this.$t("operation.edit");
            } else if (row.type === "delete") {
              return this.$t("operation.delete");
            } else if (row.type === "import") {
              return this.$t("operation.import");
            } else if (row.type === "bind") {
              return this.$t("operation.bind");
            }
          },
        },
        {
          prop: "tableName",
          label: this.$t("businessLog.table"),
        },
        {
          prop: "entityName",
          label: this.$t("businessLog.className"),
        },
        {
          prop: "createTime",
          label: this.$t("businessLog.operateTime"),
        },
        {
          label: this.$t("common.operation"),
          width: 80,
          prop: ({ row }, h) => {
            return row.type !== "delete" ? (
              row.type !== "import" ? (
                <div>
                  <hos-tooltip class="pl5 pr5" content="查看">
                    <i
                      class="hos-icon-view"
                      on-click={() => {
                        this.view(row);
                      }}
                    ></i>
                  </hos-tooltip>
                  <hos-tooltip class="pl5 pr5" content="生命周期">
                    <i
                      class="hos-icom-sample-stat"
                      on-click={() => {
                        this.timeLine(row);
                      }}
                    ></i>
                  </hos-tooltip>
                </div>
              ) : (
                <hos-tooltip class="pl5 pr5" content="查看">
                  <i
                    class="hos-icon-view"
                    on-click={() => {
                      this.view(row);
                    }}
                  ></i>
                </hos-tooltip>
              )
            ) : (
              <hos-tooltip class="pl5 pr5" content="生命周期">
                <i
                  class="hos-icom-sample-stat"
                  on-click={() => {
                    this.timeLine(row);
                  }}
                ></i>
              </hos-tooltip>
            );
          },
        },
      ],
      // 生命周期标题
      timeLineDialogTitle: "",
    };
  },
  watch: {},
  mounted() {
    this.form.model.tableName = this.$route.query.tableName;
  },
  created() {
    this.fromR.date = this.getNowTime();
  },
  methods: {
    // 初始化设置当前时间到七天前
    getNowTime() {
      const start = new Date(new Date().getTime() - 3600 * 1000 * 24 * 7)
        .toISOString()
        .replace("T", " ")
        .split(".")[0]; //默认开始时间7天前
      const end = new Date().toISOString().replace("T", " ").split(".")[0]; //默认结束时间一天前
      console.log([start, end]);
      return [start, end];
    },
    businessLogData(businessLog) {
      if (this.fromR.date != null && this.fromR.date !== "") {
        const date1 = new Date(this.fromR.date[0]);
        const date2 = new Date(this.fromR.date[1]);
        businessLog.startTime =
          date1.getFullYear() +
          "-" +
          (date1.getMonth() + 1) +
          "-" +
          date1.getDate();
        businessLog.endTime =
          date2.getFullYear() +
          "-" +
          (date2.getMonth() + 1) +
          "-" +
          date2.getDate();
      }
      return this.$api("business_log.selectPage", businessLog);
    },
    view(row) {
      // 查看
      this.$store.commit("OPEN_DIALOG", {
        component: require("./view.vue").default,
        _uid: "businessLogViewDialog",
        props: {
          obj: row,
        },
      });
    },
    // 关闭页面
    closePage() {
      this.$router.push({
        path: this.$route.query.path,
      });
      this.closeCurrent();
    },
    // 生命周期
    timeLine(row) {
      this.timeLineDialogTitle = this.$t("common.timeLine");
      this.$store.commit("OPEN_DIALOG", {
        component: require("@sys/components/time-line/index.vue").default,
        _uid: "timeLineDialog",
        props: {
          id: row.bussinessId,
          tableName: this.$route.query.tableName,
        },
      });
    },
    reset() {
      this.form.model = {
        title: "",
        userName: "",
        type: "",
        startTime: "",
        endTime: "",
        tableName: this.$route.query.tableName,
      };
      this.fromR.date = this.getNowTime();
      const date1 = new Date(this.fromR.date[0]);
      const date2 = new Date(this.fromR.date[1]);
      this.form.model.startTime =
        date1.getFullYear() +
        "-" +
        (date1.getMonth() + 1) +
        "-" +
        date1.getDate();
      this.form.model.endTime =
        date2.getFullYear() +
        "-" +
        (date2.getMonth() + 1) +
        "-" +
        date2.getDate();
      this.$store.commit("UPDATE_TABLE", { _uid: "businessLogTable" });
    },
  },
};
</script>
