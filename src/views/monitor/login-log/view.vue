<template>
    <div :loading="loading">
        <div class="view-Log">
            <hos-descriptions
                :column="2"
                border
                :labelStyle="{ 'text-align': 'right', width: '100px' }"
            >
                <hos-descriptions-item
                    :label="$t('loginLog.loginName')"
                    :contentStyle="{ width: '40%' }"
                >
                    <div>{{ loginLogExamineDialogForm.loginName }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.createTime')">
                    <div>{{ loginLogExamineDialogForm.createTime }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.title')">
                    <div>{{ loginLogExamineDialogForm.title }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.msg')">
                    <div>{{ loginLogExamineDialogForm.msg }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.loginWay')">
                    <div>{{ loginLogExamineDialogForm.loginWayDesc }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.visitSource')">
                    <div>{{ loginLogExamineDialogForm.visitSource }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.ip')">
                    <div>{{ loginLogExamineDialogForm.ip }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.serverIP')">
                    <div>{{ loginLogExamineDialogForm.serverIP }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.browser')">
                    <div>{{ loginLogExamineDialogForm.browser }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.loginLocation')">
                    <div>{{ loginLogExamineDialogForm.loginLocation }}</div>
                </hos-descriptions-item>

                <hos-descriptions-item :label="$t('loginLog.os')">
                    <div>{{ loginLogExamineDialogForm.os }}</div>
                </hos-descriptions-item>

                <hos-descriptions-item :label="$t('loginLog.mac')">
                    <div>{{ loginLogExamineDialogForm.mac }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.examineState')">
                    <div>{{ loginLogExamineDialogForm.examineStateDesc }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('logExamine.type')">
                    <div>{{ loginLogExamineDialogForm.examineTypeDesc }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.examineUserName')">
                    <div>{{ loginLogExamineDialogForm.examineUserName }}</div>
                </hos-descriptions-item>
                <hos-descriptions-item :label="$t('loginLog.examineDate')">
                    <div>{{ loginLogExamineDialogForm.examineDate }}</div>
                </hos-descriptions-item>
            </hos-descriptions>
            <hos-descriptions :column="4" border>
                <hos-descriptions-item
                    :label="$t('loginLog.examineOpinion')"
                    :labelStyle="{ 'text-align': 'right', width: '100px' }"
                >
                    <div>{{ loginLogExamineDialogForm.examineOpinion }}</div>
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
            loginLogExamineTreeData: [],
            loginLogExamineDialogForm: {},
            loading: false,
        };
    },
    mounted() {
        // 初始化表单
        if (this.obj) {
            console.log(this.obj);
            this.loginLogExamineDialogForm = this.obj;
        }
    },
    methods: {
        cancel() {
            this.$store.commit("CLOSE_DIALOG", { _uid: "loginLogViewDialog" });
            this.loading = false;
        },
    },
};
</script>