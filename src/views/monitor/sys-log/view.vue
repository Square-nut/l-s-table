<template>
    <div :loading="loading">
        <div class="view-Log">
            <hos-descriptions
                :column="2"
                border
                :labelStyle="{ 'text-align': 'right', width: '115px' }"
            >
                <hos-descriptions-item
                    :label="$t('operlog.title')"
                    :contentStyle="{ width: '40%' }"
                >
                    <div>{{ operlogExamineDialogForm.title }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.content')">
                    <div>{{ operlogExamineDialogForm.content }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.userName')">
                    <div>{{ operlogExamineDialogForm.userName }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.operTime')">
                    <div>{{ operlogExamineDialogForm.operTime }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.takeTime')">
                    <div>{{ operlogExamineDialogForm.takeTime }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.browser')">
                    <div>{{ operlogExamineDialogForm.browser }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.clientIp')">
                    <div>{{ operlogExamineDialogForm.clientIp }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.serverIp')">
                    <div>{{ operlogExamineDialogForm.serverIp }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.requestUrl')">
                    <div>{{ operlogExamineDialogForm.requestUrl }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.requestMethod')">
                    <div>{{ operlogExamineDialogForm.requestMethod }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.method')">
                    <div>{{ operlogExamineDialogForm.method }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.requestParam')">
                    <hos-tooltip class="pl5 pr5" placement="top">
                        <div slot="content">
                            {{ $t("operlog.requestParam") }}<br />{{
                                operlogExamineDialogForm.requestParam
                            }}
                        </div>
                        <div>
                            {{ operlogExamineDialogForm.requestParamStr }}
                        </div>
                    </hos-tooltip>
                </hos-descriptions-item>

                <hos-descriptions-item :label="$t('operlog.responseResult')">
                    <hos-tooltip class="pl5 pr5" placement="top">
                        <div slot="content">
                            {{ $t("operlog.responseResult") }}<br />{{
                                operlogExamineDialogForm.responseResult
                            }}
                        </div>
                        <div>
                            {{ operlogExamineDialogForm.responseResultStr }}
                        </div>
                    </hos-tooltip>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.errorMsg')">
                    <hos-tooltip class="pl5 pr5" placement="top">
                        <div slot="content">
                            {{ $t("operlog.errorMsg") }}<br />{{
                                operlogExamineDialogForm.errorMsg
                            }}
                        </div>
                        <div>{{ operlogExamineDialogForm.errorMsgStr }}</div>
                    </hos-tooltip>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.examineState')">
                    <div>{{ operlogExamineDialogForm.examineStateDesc }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('logExamine.type')">
                    <div>{{ operlogExamineDialogForm.examineTypeDesc }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.examineUserName')">
                    <div>{{ operlogExamineDialogForm.examineUserName }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('operlog.examineDate')">
                    <div>{{ operlogExamineDialogForm.examineDate }}</div>
                </hos-descriptions-item>
            </hos-descriptions>
            <hos-descriptions :column="4" border>
                <hos-descriptions-item
                    :label="$t('loginLog.examineOpinion')"
                    :labelStyle="{ 'text-align': 'right', width: '115px' }"
                >
                    <div>{{ operlogExamineDialogForm.examineOpinion }}</div>
                </hos-descriptions-item>
            </hos-descriptions>
        </div>
    </div>
</template>
<script>
export default {
    props: ["obj"],
    data() {
        return {
            operlogExamineTreeData: [],
            operlogExamineDialogForm: {},
            loading: false,
        };
    },
    mounted() {
        // 初始化表单
        if (this.obj) {
            this.operlogExamineDialogForm = this.obj;
            if (this.operlogExamineDialogForm.errorMsg.length > 110) {
                this.operlogExamineDialogForm.errorMsgStr =
                    this.operlogExamineDialogForm.errorMsg.slice(0, 110) +
                    "...";
            } else {
                this.operlogExamineDialogForm.errorMsgStr =
                    this.operlogExamineDialogForm.errorMsg;
            }
            if (this.operlogExamineDialogForm.requestParam.length > 110) {
                this.operlogExamineDialogForm.requestParamStr =
                    this.operlogExamineDialogForm.requestParam.slice(0, 110) +
                    "...";
            } else {
                this.operlogExamineDialogForm.requestParamStr =
                    this.operlogExamineDialogForm.requestParam;
            }
            if (this.operlogExamineDialogForm.responseResult.length > 110) {
                this.operlogExamineDialogForm.responseResultStr =
                    this.operlogExamineDialogForm.responseResult.slice(0, 110) +
                    "...";
            } else {
                this.operlogExamineDialogForm.responseResultStr =
                    this.operlogExamineDialogForm.responseResult;
            }
        }
    },
    methods: {
        cancel() {
            this.$store.commit("CLOSE_DIALOG", { _uid: "operlogViewDialog" });
            this.loading = false;
        },
    },
};
</script>
