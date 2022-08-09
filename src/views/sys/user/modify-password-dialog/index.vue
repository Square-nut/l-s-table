<template>
    <div
        @click.stop="flagHide()"
        class="change-pass"
    >
        <hos-form
            ref="passwordForm"
            :model="passwordForm"
            :rules="rules"
            label-width="auto"
        >
            <hos-row v-if="isError">
                <hos-col>
                    <hos-alert
                        center
                        :title="policyErrorDesc"
                        type="warning"
                        :closable="false"
                        show-icon
                        close-text="重新登录"
                        @close="logout"
                    >
                    </hos-alert>
                </hos-col>
            </hos-row>
            <hos-row>
                <hos-col>
                    <hos-form-item
                        :label="$t('passwordPolicy.oldPassword')"
                        prop="oldPassword"
                    >
                        <hos-input
                            :type="flag ? 'text' : 'password'"
                            v-model="passwordForm.oldPassword"
                        >
                            <i
                                class="icon-position"
                                slot="suffix"
                                :class="['hos-icon-view']"
                                autocomplete="auto"
                                @click.stop="flag = !flag"
                            />
                        </hos-input>
                    </hos-form-item>
                </hos-col>
            </hos-row>
            <hos-row>
                <hos-col>
                    <hos-form-item
                        :label="$t('passwordPolicy.newPassword')"
                        prop="newPasswordOne"
                    >
                        <hos-input
                            :type="flag1 ? 'text' : 'password'"
                            v-model="passwordForm.newPasswordOne"
                        ><i
                                slot="suffix"
                                class="icon-position"
                                :class="['hos-icon-view']"
                                autocomplete="auto"
                                @click.stop="flag1 = !flag1"
                            />
                        </hos-input>
                        <span
                            v-if="showPwdStr"
                            class="length-str"
                        >({{ this.lengthStr }})</span>
                    </hos-form-item>
                </hos-col>
            </hos-row>
            <hos-row v-if="passwordForm.newPasswordOne != null && passwordForm.newPasswordOne != ''">
                <hos-col>
                    <hos-form-item :label="$t('passwordPolicy.strength')">
                        <hos-progress
                            :percentage="percentage"
                            :color="customColorMethod"
                            :format="percentageFormat"
                            class="progress"
                        >
                        </hos-progress>
                    </hos-form-item>
                </hos-col>
            </hos-row>
            <hos-row>
                <hos-col>
                    <hos-form-item
                        :label="$t('passwordPolicy.confirmPassword')"
                        prop="newPasswordTwo"
                    >
                        <hos-input
                            :type="flag2 ? 'text' : 'password'"
                            v-model="passwordForm.newPasswordTwo"
                        >
                            <i
                                slot="suffix"
                                class="icon-position"
                                :class="['hos-icon-view']"
                                autocomplete="auto"
                                @click.stop="flag2 = !flag2"
                            />
                        </hos-input>
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
                @click="cancel()"
            >{{
        $t("operation.cancel")
      }}</hos-button>
            <hos-button
                type="success"
                @click="save()"
            >{{
        $t("operation.save")
      }}</hos-button>
            <hos-button
                v-if="showLastBtn"
                @click="useLastPwd()"
                size="small"
            >
                {{ $t("passwordPolicy.useLastPwd") }}</hos-button>
        </div>
    </div>
</template>
<script>
import AuthConstant from "@sys/constant/auth-constant";
import { mapActions, mapState } from "vuex";

export default {
    data() {
        return {
            // rowNum: 18,
            // offsetNum: 3,
            flag: false,
            flag1: false,
            flag2: false,
            // 是否显示沿用密码按钮
            showLastBtn: false,
            lengthStr: "",
            showPwdStr: false,
            // 密码策略
            pwdPLolicy: {},
            // 修改密码的表单
            passwordForm: {},
            // 密码评分
            percentage: 0,
            isError: false,
            policyErrorDesc: "",
            rules: {
                oldPassword: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                this.$api("sys-password.validateOldPassword", {
                                    password: this.$m.crypt(value),
                                }).then((res) => {
                                    if (
                                        res &&
                                        res.code == 200 &&
                                        res.data == true
                                    ) {
                                        callback();
                                    } else {
                                        callback(
                                            new Error(
                                                this.$t(
                                                    "passwordPolicy.message.oldPasswordError"
                                                )
                                            )
                                        );
                                    }
                                });
                            } else {
                                callback(
                                    new Error(
                                        this.$t(
                                            "passwordPolicy.message.oldPasswordNull"
                                        )
                                    )
                                );
                            }
                        },
                    },
                ],
                newPasswordOne: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value !== "") {
                                if (value.length < this.pwdPLolicy.M0001) {
                                    callback(
                                        new Error(
                                            this.$t(
                                                "passwordPolicy.rule.newPwdLength"
                                            )
                                        )
                                    );
                                } else {
                                    this.$api("sys-password.validatePolicy", {
                                        password: this.$m.crypt(value),
                                    }).then((res) => {
                                        if (
                                            res &&
                                            res.code &&
                                            res.data == true
                                        ) {
                                            callback();
                                        } else {
                                            callback(
                                                new Error(
                                                    this.$t(
                                                        "common.tipMessage." +
                                                            res.code
                                                    )
                                                )
                                            );
                                        }
                                    });
                                }
                            } else {
                                callback(
                                    new Error(
                                        this.$t(
                                            "passwordPolicy.message.passwordNull"
                                        )
                                    )
                                );
                            }
                        },
                    },
                ],
                newPasswordTwo: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value == this.passwordForm.newPasswordOne) {
                                    callback();
                                } else {
                                    callback(
                                        new Error(
                                            this.$t(
                                                "passwordPolicy.message.confirmPasswordError"
                                            )
                                        )
                                    );
                                }
                            } else {
                                callback(
                                    new Error(
                                        this.$t(
                                            "passwordPolicy.message.confirmPasswordNull"
                                        )
                                    )
                                );
                            }
                        },
                    },
                ],
            },
        };
    },
    watch: {
        "passwordForm.newPasswordOne": {
            handler(newValue) {
                var mark = 0;
                // 长度得分
                if (newValue.length < 5) {
                    mark += 5;
                } else if (newValue.length >= 8) {
                    mark += 25;
                } else {
                    mark += 10;
                }
                // 含字母得分
                if (/[A-Za-z]/.test(newValue)) {
                    if (/[A-Z]/.test(newValue) && /[a-z]/.test(newValue)) {
                        // 大小写字母混合
                        mark += 20;
                    } else {
                        // 只有大写或小写
                        mark += 10;
                    }
                }
                // 含数字得分
                var countNum =
                    newValue.length - newValue.replace(/\d+/g, "").length;
                if (countNum == 1) {
                    mark += 10;
                } else if (countNum > 1) {
                    mark += 20;
                }
                // 含特殊符号得分
                var count =
                    newValue.length -
                    newValue.replace(
                        /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g,
                        ""
                    ).length;
                if (count == 1) {
                    mark += 10;
                } else if (count > 1) {
                    mark += 25;
                }
                // 组合
                if (/[A-Za-z]/.test(newValue) && /\d/g.test(newValue)) {
                    mark += 2;
                    if (
                        /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/.test(
                            newValue
                        )
                    ) {
                        mark += 1;
                        if (/[A-Z]/.test(newValue) && /[a-z]/.test(newValue)) {
                            mark += 2;
                        }
                    }
                }
                this.percentage = mark;
            },
        },
    },
    created() {
        //代表强制修改密码的页面，
        // if(this.$route.fullPath=="/password"){
        //     this.rowNum = 14;
        //     this.offsetNum = 5;
        // }
        // 获取需要展示在alert里的文字信息
        let policyErrorCode = this.$store.getters.policyErrorCode;
        ///
        if (policyErrorCode && AuthConstant.passwordError[policyErrorCode]) {
            this.isError = true;
            this.policyErrorDesc = AuthConstant.passwordError[policyErrorCode];
        }
        this.$api("sys-password.getPwdPolicy").then((res) => {
            if (res && res.code == 200) {
                this.pwdPLolicy = res.data;
                // 控制是否显示密码策略内容
                if (
                    (this.pwdPLolicy.M0001 == "" ||
                        this.pwdPLolicy.M0001 == "0") &&
                    this.pwdPLolicy.M0003 == ""
                ) {
                    this.showPwdStr = false;
                } else {
                    this.showPwdStr = true;
                }
                if (this.pwdPLolicy.M0001 && this.pwdPLolicy.M0001 > 0) {
                    this.lengthStr =
                        this.$t("passwordPolicy.message.leastPasswordClose", [
                            this.pwdPLolicy.M0001,
                        ]) + "，";
                }
                if (this.pwdPLolicy.M0003) {
                    let pass = "";
                    switch (this.pwdPLolicy.M0003) {
                        case "M0003001,M0003002":
                            pass = "numberLetter";
                            break;
                        case "M0003001,M0003003,M0003004":
                            pass = "numberUpLower";
                            break;
                        case "M0003001,M0003002,M0003005":
                            pass = "numberLetterChar";
                            break;
                        case "M0003001,M0003003,M0003004,M0003005":
                            pass = "numberUpLowerChar";
                            break;
                    }
                    this.lengthStr +=
                        this.$t("passwordPolicy.message.passComplexity", [
                            this.$t("passwordPolicy.menu." + pass),
                        ]) + "，";
                }
                if (
                    this.pwdPLolicy.M0008 == "true" &&
                    policyErrorCode == "003"
                ) {
                    this.showLastBtn = true;
                }
                if (this.lengthStr.length > 0) {
                    this.lengthStr = this.lengthStr.substring(
                        0,
                        this.lengthStr.length - 1
                    );
                }
            }
        });
    },
    methods: {
        ...mapActions(["Logout"]),
        logout() {
            this.Logout().then(() => {
                window.location.href = "/";
            });
        },
        customColorMethod(percentage) {
            if (percentage < 30) {
                return "#ff0000";
            } else if (percentage >= 30 && percentage < 50) {
                return "#ff5500";
            } else if (percentage >= 50 && percentage < 70) {
                return "#ffaa00";
            } else if (percentage >= 70 && percentage < 90) {
                return "#ffaa7f";
            } else if (percentage >= 90) {
                return "#67c23a";
            }
        },
        flagHide() {
            this.flag = this.flag1 = this.flag2 = false;
        },
        flagShow(e) {
            this.flag = !this.flag;
            e.stopPropagation();
        },
        percentageFormat(percentage) {
            var formatResult = "";
            if (percentage >= 90) {
                formatResult = "非常安全";
            } else if (percentage >= 80 && percentage < 90) {
                formatResult = "安全";
            } else if (percentage >= 70 && percentage < 80) {
                formatResult = "非常强";
            } else if (percentage >= 60 && percentage < 70) {
                formatResult = "强";
            } else if (percentage >= 50 && percentage < 60) {
                formatResult = "一般";
            } else if (percentage >= 25 && percentage < 50) {
                formatResult = "弱";
            } else if (percentage >= 0 && percentage < 25) {
                formatResult = "非常弱";
            }
            return formatResult;
        },
        useLastPwd() {
            this.$api("sys-password.useLastPwd").then((res) => {
                if (res && res.code == 200 && res.data == true) {
                    this.showLastBtn = false;
                    this.$message.success(
                        this.$t("passwordPolicy.message.useLastPwdSuccess")
                    );
                } else {
                    this.showLastBtn = true;
                    this.$message.error(
                        this.$t("passwordPolicy.message.useLastPwdFaild")
                    );
                }
            });
        },
        cancel() {
            ////代表强制修改密码的页面，
            if (this.$route.fullPath == "/password") {
                this.logout();
            } else {
                ////弹出层 内部打开的
                this.$store.commit("CLOSE_DIALOG", { _uid: "menuDialog" });
            }
        },
        save() {
            let pwdForm = JSON.parse(JSON.stringify(this.passwordForm));
            pwdForm.oldPassword = this.$m.crypt(pwdForm.oldPassword);
            pwdForm.newPasswordOne = this.$m.crypt(pwdForm.newPasswordOne);
            pwdForm.newPasswordTwo = this.$m.crypt(pwdForm.newPasswordTwo);
            this.$refs.passwordForm.validate((valid) => {
                if (valid) {
                    this.$api("sys-password.changePassword", pwdForm).then(
                        (res) => {
                            if (res && res.code == 200) {
                                this.$message.success(
                                    this.$t(
                                        "passwordPolicy.message.changeSuccess"
                                    )
                                );
                                if (this.$route.fullPath == "/password") {
                                    this.$store.dispatch("setPoliceCode", "");
                                    this.$router.push({
                                        path: "/",
                                    });
                                } else {
                                    this.$store.commit("CLOSE_DIALOG", {
                                        _uid: "menuDialog",
                                    });
                                }
                            } else {
                                this.$message.error(
                                    this.$t("common.tipMessage." + res.code)
                                );
                            }
                        }
                    );
                }
            });
        },
    },
};
</script>