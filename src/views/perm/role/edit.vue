<template>
    <div class="role-edit" :loading="loading">
        <hos-form
            ref="dialogForm"
            :model="dialogForm"
            :rules="rules"
            label-width="auto"
            label-position="right"
        >
            <hos-row>
                <hos-col>
                    <hos-form-item
                        :label="$t('role.logo')"
                        prop="avatar"
                        class="h85"
                    >
                        <hos-row>
                            <hos-col
                                :span="4"
                                v-has-permi="{ key: 'base:perm:role:head' }"
                            >
                                <!-- :before-upload="beforeAvatarUpload"  -->
                                <hos-upload
                                    :class="{
                                        hide: hideUploadEdit,
                                        uoload: showBtnImg,
                                        disuoload: noneBtnImg,
                                    }"
                                    action=""
                                    :on-change="getImageFile"
                                    :on-remove="handlePicRemove"
                                    :on-preview="handlePicPreview"
                                    :limit="1"
                                    list-type="picture-card"
                                    :auto-upload="false"
                                    :disabled="
                                        $m.isDisabled(
                                            status + 'base:perm:role:head'
                                        )
                                    "
                                >
                                    <img
                                        v-if="imageUrl"
                                        :src="imageUrl"
                                        class="avatar"
                                    />
                                    <i v-else class="hos-icon-plus"></i>
                                </hos-upload>
                            </hos-col>
                            <hos-col :span="20">
                                <p class="rules-span">
                                    {{ this.$t("role.uploadnoIcon") }}
                                </p>
                                <!-- <p class="rules-span">{{this.$t("role.uploadno")}}</p> -->
                            </hos-col>
                        </hos-row>
                        <hos-dialog
                            :visible.sync="dialogVisible"
                            append-to-body
                            class="w300"
                        >
                            <img :src="dialogImageUrl" alt="" />
                        </hos-dialog>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:role:code',
                        formRule: rules,
                        elModel: 'code',
                    }"
                >
                    <hos-form-item :label="$t('common.code')" prop="code">
                        <hos-input
                            v-model="dialogForm.code"
                            clearable
                            :placeholder="$t('common.placeholder.code')"
                            :disabled="
                                $m.isDisabled(status + 'base:perm:role:code')
                            "
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:role:name',
                        formRule: rules,
                        elModel: 'name',
                    }"
                >
                    <hos-form-item
                        label-width="80px"
                        :label="$t('common.name')"
                        prop="name"
                    >
                        <hos-input
                            v-model="dialogForm.name"
                            clearable
                            :placeholder="$t('common.placeholder.name')"
                            :disabled="
                                $m.isDisabled(status + 'base:perm:role:name')
                            "
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <!-- <hos-col :span="12" v-has-permi="{key: status+'base:perm:role:name',formRule: rules,elModel:'type'}">
					<hos-form-item :label="$t('common.type')" prop="type">
						<hos-select v-model="dialogForm.type" placeholder="?????????" :disabled="$m.isDisabled(status+'base:perm:role:type')">
							<hos-option v-for="(item,index) in dataScopeTypeMap" clearable :key="index" :label="item.label" :value="item.value"></hos-option>
						</hos-select>
					</hos-form-item>
				</hos-col> -->
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:role:parentId',
                        formRule: rules,
                        elModel: 'parentId',
                    }"
                >
                    <hos-form-item
                        :label="$t('role.superiorRole')"
                        prop="parentId"
                    >
                        <hos-tree-select
                            v-model="dialogForm.parentId"
                            clearable
                            :options="treeOptions"
                            :placeholder="$t('role.placeholder.placeRole')"
                            :disabled="
                                $m.isDisabled(
                                    status + 'base:perm:role:parentId'
                                )
                            "
                        ></hos-tree-select>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:role:actived',
                        formRule: rules,
                        elModel: 'actived',
                    }"
                >
                    <hos-form-item
                        label-width="80px"
                        :label="$t('common.isActived')"
                        prop="actived"
                    >
                        <hos-switch
                            v-model="dialogForm.actived"
                            :active-text="$t('common.is')"
                            :inactive-text="$t('common.deny')"
                            inner-label
                            :disabled="
                                $m.isDisabled(status + 'base:perm:role:actived')
                            "
                        ></hos-switch>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{
                        key: status + 'base:perm:role:remark',
                        formRule: rules,
                        elModel: 'remark',
                    }"
                >
                    <hos-form-item :label="$t('common.remark')" prop="remark">
                        <hos-input
                            v-model="dialogForm.remark"
                            clearable
                            type="textarea"
                            :rows="3"
                            :placeholder="$t('common.placeholder.remark')"
                            :disabled="
                                $m.isDisabled(status + 'base:perm:role:remark')
                            "
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
            </hos-row>
        </hos-form>
        <div slot="footer" class="dialog-footer">
            <hos-button
                type="primary"
                @click="cancel"
                v-has-permi="{ key: 'base:perm:role:cancel' }"
                >{{ $t("operation.cancel") }}</hos-button
            >
            <hos-button
                type="success"
                @click="save"
                v-has-permi="{ key: 'base:perm:role:save' }"
                >{{ $t("operation.save") }}</hos-button
            >
        </div>
    </div>
</template>
<script>
export default {
    props: ["id", "parentId", "status"],
    components: {},
    data() {
        const that = this;
        //????????????
        const validated = (rule, value, callback) => {
            if (value && value !== "") {
                this.$api("perm_role.validated", {
                    code: value,
                    id: that.id,
                }).then((res) => {
                    if (res) {
                        if (res.data == false && res && res.code == "200") {
                            callback(
                                new Error(this.$t("common.rule.code.validate"))
                            );
                        } else {
                            callback();
                        }
                    }
                });
            } else {
                callback(new Error(this.$t("common.rule.code.required")));
            }
        };
        //???????????????????????????
        var validCode = (rule, value, callback) => {
            if (value) {
                if (/[\u4E00-\u9FA5]/g.test(value)) {
                    callback(
                        new Error(this.$t("common.rule.code.notInputChinese"))
                    );
                } else {
                    // ????????????
                    callback();
                }
                callback();
            }
        };
        return {
            dialogForm: {
                weight: 0,
                type: 3,
                actived: true,
                parentId: null,
            },
            loading: false,
            treeOptions: [],
            imageUrl: "",
            fileList: [],
            dialogImageUrl: "",
            showBtnImg: true,
            noneBtnImg: false,
            dialogVisible: false,
            hideUploadEdit: false, // ????????????????????????
            limitCountImg: 1, //???????????????????????????
            rulesType: "",
            isLt2M1: false,
            //????????????
            /*dataScopeTypeMap: [{
					value: 1,
					label: '????????????'
				}, {
					value: 2,
					label: '??????????????????'
				}, {
					value: 3,
					label: '????????????'
				}],*/
            rules: {
                code: [
                    {
                        required: true,
                        validator: validated,
                        trigger: "blur",
                    },
                    {
                        required: true,
                        validator: validCode,
                        trigger: "blur",
                    },
                    {
                        max: 37,
                        required: true,
                        message: this.$t("common.rule.code.length"),
                        trigger: "blur",
                    },
                ],

                name: [
                    {
                        required: true,
                        message: this.$t("common.rule.name.required"),
                    },
                    {
                        max: 37,
                        required: true,
                        message: this.$t("common.rule.name.length"),
                        trigger: "blur",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: this.$t("role.rule.type.required"),
                    },
                ],
                remark: [
                    {
                        required: false,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value.length <= 1000) {
                                    callback();
                                } else {
                                    callback(
                                        new Error(
                                            this.$t("common.rule.remark.length")
                                        )
                                    );
                                }
                            } else {
                                callback();
                            }
                        },
                    },
                ],
            },
        };
    },
    created() {
        this.dialogForm.parentId = this.parentId;
        this.getrole();
    },
    mounted() {},
    methods: {
        // ??????????????????
        getImageFile(file, fileList) {
            console.log("fileList", fileList);
            let isAccept = false;
            const isLt2M = file.size / 1024 < 10;
            const accept = ".gif, .jpg, .jpeg, .png, .bmp, .webp";
            const type = accept.replace(/\s/g, "").split(",");
            const fileType = file.name.substring(file.name.lastIndexOf("."));
            if (type.indexOf(fileType) === -1) {
                // this.rulesType =this.$t("role.uploadno");
                fileList.splice(-1, 1);
                this.$message.error(this.$t("role.uploadno")); //this.imageUrl = ""; //??????????????????
                return false;
            } else {
                isAccept = true;
            }
            if (!isLt2M) {
                fileList.splice(-1, 1); //this.imageUrl = ""; //??????????????????
                this.$message.error(this.$t("role.logouploud"));
                return false; //this.rulesLogo = this.$t("role.uploadnoIcon");
            } //return isAccept && isLt2M;
            if (isLt2M == true && isAccept == true) {
                this.noneBtnImg = fileList.length >= this.limitCountImg;
                this.getImageBase64(file.raw).then((res) => {
                    console.log("res", res);
                    this.imageUrl = res;
                });
            } else {
                this.imageUrl = "";
                fileList.splice(-1, 1); //??????????????????
                return false;
            } //this.beforeAvatarUpload(file); // ??????1?????????
            this.hideUploadEdit = fileList.length >= 1;
        },
        /* // ??????????????????
			getImageFile(file, fileList) {
				console.log("fileList", fileList);
				this.noneBtnImg = fileList.length >= this.limitCountImg;
				this.getImageBase64(file.raw).then((res) => {
					console.log("res", res);
					this.imageUrl = res;
				});
				this.beforeAvatarUpload(file);
				// ??????1?????????
				this.hideUploadEdit = fileList.length >= 1;
			},
			beforeAvatarUpload(file) {
				let isAccept = false;
				const isLt2M = file.size / 1024 < 10;
				const accept = '.gif, .jpg, .jpeg, .png, .bmp, .webp';
				const type = accept.replace(/\s/g, '').split(',')
				const fileType = file.name.substring(file.name.lastIndexOf('.'))
				if(type.indexOf(fileType) === -1) {
					this.rulesType =this.$t("role.uploadno"); 
					//this.$message.error('???????????????????????????');
				} else {
					isAccept = true;
				}
				 if(!isLt2M) {
					//this.rulesLogo = this.$t("role.uploadnoIcon"); 
					//this.$message.error('???????????????????????????????????? 10KB!');
				}
				return isAccept && isLt2M;
			}, */

        //?????????base64??????
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
        //??????
        handlePicRemove(file, fileList) {
            this.noneBtnImg = fileList.length >= this.limitCountImg;
            this.hideUploadEdit = fileList.length >= 1;
            this.imageUrl = "";
        },
        //??????
        handlePicPreview(file) {
            console.log("file", file);
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // ???????????????
        getrole() {
            let parentRoleId = this.parentId;
            if (this.parentRoleId == "0") {
                this.parentRoleId = null;
            }
            this.dialogForm.parentId = this.parentId;
            this.$api("perm_role.getParentTreeNodes", this.id).then((res) => {
                if (res && res.code == "200") {
                    this.treeOptions = res.data;
                    //????????????
                    this.disabledNode(this.treeOptions, this.id);
                }
            });
            if (this.id) {
                this.$api("perm_role.selectById", this.id).then((res) => {
                    if (res && res.code == "200") {
                        this.dialogForm = res.data;
                        //????????????
                        this.imageUrl = this.dialogForm.avatar;
                        if (
                            this.dialogForm.parentId == "0" ||
                            this.dialogForm.parentId == undefined
                        ) {
                            this.dialogForm.parentId = null;
                        }
                    }
                });
            }
        },
        // ??????????????????
        disabledNode(treeData, id) {
            //??????
            treeData.forEach((item) => {
                if (item.id === id) {
                    item["isDisabled"] = true;
                    return;
                }
                if (item.children && item.children.length > 0) {
                    this.disabledNode(item.children, id);
                }
            });
        },
        // ??????dialog
        save() {
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.dialogForm.avatar = this.imageUrl;
                    this.$api(
                        this.id ? "perm_role.update" : "perm_role.insert",
                        this.dialogForm
                    ).then((res) => {
                        this.loading = false;
                        if (res && res.code == "200") {
                            this.$message.success(this.$t("operation.success"));
                            this.cancel();
                            this.$store.commit("UPDATE_TABLE", {
                                _uid: "table",
                            });
                        } else {
                            this.$message.error(this.$t("operation.error"));
                        }
                    });
                }
            });
        },

        //????????????
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "editDialog",
            });
            this.loading = false;
        },
    },
};
</script>