<template>
    <div :loading="loading" class="comupload">
        <div class="mt10">
            <hos-row>
                <hos-steps :active="active" align-center>
                    <hos-step
                        :title="$t('upload.operateType')"
                        description=""
                        @click.native="showStep(1)"
                        style="cursor: pointer"
                    ></hos-step>
                    <hos-step
                        :title="$t('upload.fileUpload')"
                        description=""
                        @click.native="showStep(2)"
                        style="cursor: pointer"
                    ></hos-step>
                </hos-steps>
                <div class="step-child-div">
                    <span>{{ $t("upload.downloadTip") }}</span>
                    <span
                        ><hos-link @click="importTemplate()" type="primary">{{
                            $t("upload.downloadTemplate")
                        }}</hos-link></span
                    >
                </div>
            </hos-row>
        </div>
        <hos-divider></hos-divider>
        <div v-show="showFirst" class="div-loc">
            <div class="type-div">
                <span style="display: block; margin-bottom: 10px">{{
                    $t("upload.pleaseSelect")
                }}</span>
                <hos-radio
                    v-model="upload.type"
                    style="display: block; margin-bottom: 10px"
                    label="add"
                    >{{ $t("upload.add") }}</hos-radio
                >
                <hos-radio
                    v-model="upload.type"
                    style="display: block; margin-bottom: 10px"
                    label="update"
                    >{{ $t("upload.update") }}</hos-radio
                >
                <hos-radio
                    v-model="upload.type"
                    style="display: block; margin-bottom: 10px"
                    label="addAndUpdate"
                    >{{ $t("upload.addAndUpdate") }}</hos-radio
                >
            </div>
        </div>
        <div v-show="!showFirst" class="div-loc">
            <hos-upload
                ref="upload"
                :limit="1"
                accept=".xlsx, .xls"
                :headers="upload.headers"
                :action="upload.actionUrl + '?type=' + upload.type"
                :disabled="upload.isUploading"
                :data="data"
                :before-upload="beforeAvatarUpload"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :auto-upload="false"
                drag
            >
                <i
                    :class="
                        isSimple == 1
                            ? 'hos-icom-upload-cloud'
                            : 'hos-icon-upload'
                    "
                ></i>
                <div class="hos-upload__text">{{ $t("upload.text") }}</div>
            </hos-upload>
            <div style="color: red">{{ $t("upload.excelTip") }}</div>
        </div>
        <div slot="footer" class="dialog-footer">
            <hos-button type="primary" @click="cancel" v-if="showFirst">{{
                $t("operation.cancel")
            }}</hos-button>
            <hos-button
                type="success"
                @click.native="showStep(2)"
                v-if="showFirst"
                >{{ $t("upload.next") }}</hos-button
            >
            <hos-button
                type="primary"
                @click.native="showStep(1)"
                v-if="!showFirst"
                >{{ $t("upload.prev") }}</hos-button
            >
            <hos-button
                type="success"
                @click="submitFileForm"
                v-if="!showFirst"
                >{{ $t("operation.save") }}</hos-button
            >
        </div>
    </div>
</template>
<script>
import { getToken } from "@sys/utils/base/token-util";
export default {
    props: ["uploadUrl", "templateUrl", "afterSubmit", "data"],
    components: {},
    data() {
        return {
            isSimple: process.env.VUE_APP_SIMPLE_ONCE,
            loading: false,
            // 步骤
            active: 0,
            // 显示第一步
            showFirst: true,
            // 导入参数
            upload: {
                // 是否禁用上传
                isUploading: false,
                // add、update、addAndUpdate
                type: "add",
                headers: {
                    "access-token": getToken(),
                },
                // 上传的地址
                actionUrl: process.env.VUE_APP_BASE_URL + this.uploadUrl,
            },
        };
    },
    created() {},
    mounted() {},
    methods: {
        showStep(index) {
            this.active = index - 1;
            this.showFirst = index === 1;
        },
        // 下载模板
        importTemplate() {
            let token = getToken();
            window.location.href =
                process.env.VUE_APP_BASE_URL +
                this.templateUrl +
                "?access-token=" +
                token;
        },
        // 文件上传前处理
        beforeAvatarUpload(file) {
            let fileName = file.name.substring(file.name.lastIndexOf(".") + 1);
            const extension = fileName === "xls";
            const extension2 = fileName === "xlsx";
            if (!extension && !extension2) {
                this.$message({
                    message: this.$t("upload.excelTip"),
                    type: "warning",
                });
            }
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            if (response.code === "200") {
                if (response.success) {
                    const msg =
                        this.$t("upload.total") +
                        response.data.total +
                        this.$t("upload.success") +
                        response.data.success;
                    this.$message.success(msg);
                    this.afterSubmit();
                } else {
                    this.$message.error(response.data);
                }
            }
        },
        // 提交上传文件
        submitFileForm() {
            if (this.$refs.upload.uploadFiles.length === 1) {
                this.$refs.upload.submit();
            } else {
                this.$message.warning(this.$t("upload.please"));
            }
        },
        //取消按钮
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "uploadDialog",
            });
            this.loading = false;
        },
    },
};
</script>
