<template>
    <div
        :loading="loading"
        class="upload-avatar"
    >
        <hos-form
            ref="dialogForm"
            size="small"
            :model="dialogForm"
            label-position="right"
        >
            <hos-row>
                <hos-col>
                    <div>{{ $t("role.logouploud") }}</div>
                    <hos-form-item
                        prop="avatar"
                        class="avatarHeight"
                    >
                        <hos-upload
                            :class="{
                hide: hideUploadEdit,
                uoloadSty: showBtnImg,
                disUoloadSty: noneBtnImg,
              }"
                            action=""
                            :on-change="getImageFile"
                            :on-remove="handlePicRemove"
                            :on-preview="handlePicPreview"
                            :limit="1"
                            list-type="picture-card"
                            :auto-upload="false"
                            :file-list="fileList"
                        >
                            <img
                                v-if="imageUrl"
                                :src="imageUrl"
                                class="avatar"
                            />
                            <i
                                v-else
                                class="hos-icon-plus"
                            ></i>
                            <!-- <i class="hos-icon-plus"></i> -->
                        </hos-upload>
                        <hos-dialog
                            :visible.sync="dialogVisible"
                            append-to-body
                            width="300px"
                        >
                            <img
                                width="100%"
                                :src="dialogImageUrl"
                                alt=""
                            />
                        </hos-dialog>
                    </hos-form-item>
                </hos-col>
            </hos-row>
        </hos-form>
        <div
            slot="footer"
            class="dialog-footer"
        >
            <hos-button
                type="primary"
                @click="cancel"
                size="small"
            >{{
        $t("operation.cancel")
      }}</hos-button>
            <hos-button
                type="success"
                @click="save"
                size="small"
            >{{
        $t("operation.save")
      }}</hos-button>
        </div>
    </div>
</template>
<script>
export default {
    props: [],
    components: {},
    data() {
        return {
            dialogForm: {
                avatar: "",
            },
            loading: false,
            imageUrl: "",
            fileList: [],
            dialogImageUrl: "",
            showBtnImg: true,
            noneBtnImg: false,
            dialogVisible: false,
            hideUploadEdit: false, // 是否隐藏上传按钮
            limitCountImg: 1, //上传图片的最大数量
            rulesLogo: "",
            rulesType: "",
        };
    },
    created() {
        //从缓存中取头像的数据
        // this.avatar = require('../../../../assets/images/defaultRole.png')
        this.avatar = this.$store.getters.avatar;
        this.imageUrl = this.avatar;
        //  this.getImageFile( this.imageUrl);
    },
    methods: {
        // 获取图片信息
        getImageFile(file, fileList) {
            if (file.status == "ready") {
                const validateImgStatus = this.validateImg(file);
                if (!validateImgStatus) {
                    // this.imageUrl = "";
                    this.fileList = [];
                    return;
                }
            }
            if (fileList == undefined) {
                this.noneBtnImg = false;
            } else {
                if (fileList.length && fileList.length >= this.limitCountImg) {
                    this.noneBtnImg = true;
                } else {
                    this.noneBtnImg = false;
                }
            }
            // this.noneBtnImg = fileList.length >= this.limitCountImg || fileList == undefined;
            this.getImageBase64(file.raw).then((res) => {
                this.imageUrl = res;
            });
            // this.beforeAvatarUpload(file);
            // 大于1张隐藏
            this.hideUploadEdit = fileList.length >= 1;
        },
        validateImg(file) {
            const accept = ".gif, .jpg, .jpeg, .png, .bmp, .webp";
            const type = accept.replace(/\s/g, "").split(",");
            const fileType = file.name.substring(file.name.lastIndexOf("."));
            if (type.indexOf(fileType) === -1) {
                this.$message.error(this.$t("role.uploadno"));
                // this.rulesType = '上传文件格式不正确!';
                return false;
            }

            const isLt2M = file.size / 1024 < 10;
            if (!isLt2M) {
                // this.rulesLogo = '上传头像图片大小不能超过 10KB!';
                this.$message.error(this.$t("role.logouploud"));
                return false;
            }
            return true;
        },

        //转换成base64方法
        getImageBase64(file) {
            return new Promise(function (resolve, reject) {
                let newImagereader = new FileReader();
                let imgInfo = "";
                newImagereader.readAsDataURL(file);
                newImagereader.onload = function () {
                    imgInfo = newImagereader.result;
                };
                newImagereader.onerror = function (error) {
                    reject(error);
                };
                newImagereader.onloadend = function () {
                    resolve(imgInfo);
                };
            });
        },
        //删除
        handlePicRemove(file, fileList) {
            this.noneBtnImg = fileList.length >= this.limitCountImg;
            this.hideUploadEdit = fileList.length >= 1;
            this.imageUrl = "";
            this.rulesLogo = "";
        },
        //预览
        handlePicPreview(file) {
            // console.log("file", file);
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 保存dialog
        save() {
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    //this.dialogForm.avatar = this.imageUrl
                    let obj = {
                        avatar: this.imageUrl,
                    };
                    this.$api("sys_user.updateAvatar", obj).then((res) => {
                        if (res && res.code == "200") {
                            this.$message.success(this.$t("operation.success"));
                            this.$store.dispatch("saveAvatar", this.imageUrl);
                        } else {
                            this.$message.error(this.$t("operation.error"));
                        }
                    });
                }
            });
        },

        //取消按钮
        cancel() {
            this.$store.commit("CLOSE_DIALOG", { _uid: "menuDialog" });
        },
    },
};
</script>
<style>
.avatar {
    width: 176px;
    height: 176px;
    border-radius: 5px;
}

.uoloadSty .hos-upload--picture-card {
    width: 178px;
    height: 178px;
    line-height: 178px;
}

.disUoloadSty {
    height: 178px;
}

.uoloadSty {
    height: 178px;
}

.disUoloadSty .hos-upload--picture-card {
    display: none;
    /* 上传按钮隐藏 */
}

.hos-upload--picture-card {
    width: 178px;
    height: 178px;
}
.hos-upload-list--picture-card .hos-upload-list__item {
    width: 178px;
    height: 178px;
}
</style>
