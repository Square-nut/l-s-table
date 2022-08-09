<template>
    <div class="pwdpolicy pwd-border">
        <hos-form
            ref="passwordForm"
            :model="passwordForm"
            :inline="false"
            label-position="right"
            label-width="160px"
        >
            <hos-form-item :label="$t('passwordPolicy.default')">
                <hos-col :span="4">
                    <hos-select
                        v-model="passwordForm.M0002.value.code"
                        @change="defaultChange"
                    >
                        <hos-option
                            v-for="(item, i) in passOpt"
                            :key="'M0002' + i"
                            :label="item.label"
                            :value="item.value"
                        >
                        </hos-option>
                    </hos-select>
                </hos-col>
                <!-- 输入框的密码 -->
                <hos-col
                    :span="4"
                    v-if="passwordForm.M0002.value.code == 'M0002001'"
                >
                    <hos-form-item
                        :rules="rules.value"
                        :prop="passwordForm.M0002.value.value"
                    >
                        <hos-input
                            :placeholder='$t("common.placeholder.defaultPwd")'
                            class="ml5"
                            v-model="passwordForm.M0002.value.value"
                            @blur="defaultInputChange(passwordForm.M0002.value.value)"
                        ></hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col :span="12">
                    <span
                        class="policyFont"
                        v-if="passwordForm.M0002.value.code == 'M0002001'"
                    >
                        {{
              "*" +
              $t("passwordPolicy.message.default") +
              passwordForm.M0002.value.value
            }}
                    </span>
                    <span
                        class="policyFont"
                        v-if="passwordForm.M0002.value.code == 'M0002002'"
                    >
                        {{ "*" + $t("passwordPolicy.message.defaultPhone") }}
                    </span>
                    <span
                        class="policyFont"
                        v-if="passwordForm.M0002.value.code == 'M0002003'"
                    >
                        {{ "*" + $t("passwordPolicy.message.defaultIdCard") }}
                    </span>
                </hos-col>
            </hos-form-item>
            <hos-row>
                <!-- 失效允许延用上次密码 -->
                <hos-col :span="12">
                    <hos-form-item :label="$t('passwordPolicy.loseUseLast')">
                        <hos-switch
                            v-model="passwordForm.M0008.value"
                            @change="lastPasswordChange"
                            :active-text="$t('common.actived.activedTrue')"
                            :inactive-text="$t('common.actived.activedFalse')"
                            inner-label
                        ></hos-switch>
                        <span
                            class="policyFont"
                            v-if="passwordForm.M0008.value == true"
                        >
                            {{ "*" + $t("passwordPolicy.message.lapseShowContinueOpen") }}
                        </span>
                        <span
                            class="policyFont"
                            v-if="passwordForm.M0008.value == false"
                        >
                            {{ "*" + $t("passwordPolicy.message.lapseShowContinueClose") }}
                        </span>
                    </hos-form-item>
                </hos-col>
            </hos-row>
            <hos-row>
                <!-- 首次登陆强制修改 -->
                <hos-col :span="12">
                    <hos-form-item :label="$t('passwordPolicy.firstLoginChange')">
                        <hos-switch
                            v-model="passwordForm.M0004.value"
                            @change="fistLoginChange"
                            :active-text="$t('common.actived.activedTrue')"
                            :inactive-text="$t('common.actived.activedFalse')"
                            inner-label
                        ></hos-switch>
                        <span
                            class="policyFont"
                            v-if="passwordForm.M0004.value == true"
                        >
                            {{ "*" + $t("passwordPolicy.message.firstLoginOpen") }}
                        </span>
                        <span
                            class="policyFont"
                            v-if="passwordForm.M0004.value == false"
                        >
                            {{ "*" + $t("passwordPolicy.message.firstLoginClose") }}
                        </span>
                    </hos-form-item>
                </hos-col>
            </hos-row>
            <hos-row>
                <!-- 新密码与上次密码一致 -->
                <hos-col :span="12">
                    <hos-form-item :label="$t('passwordPolicy.neewPassEqualLast')">
                        <hos-switch
                            v-model="passwordForm.M0005.value"
                            @change="samePasswordChange"
                            :active-text="$t('common.actived.activedTrue')"
                            :inactive-text="$t('common.actived.activedFalse')"
                            inner-label
                        ></hos-switch>
                        <span
                            class="policyFont"
                            v-if="passwordForm.M0005.value == true"
                        >
                            {{ "*" + $t("passwordPolicy.message.newEqualLastOpen") }}
                        </span>
                        <span
                            class="policyFont"
                            v-if="passwordForm.M0005.value == false"
                        >
                            {{ "*" + $t("passwordPolicy.message.newEqualLastClose") }}
                        </span>
                    </hos-form-item>
                </hos-col>
            </hos-row>
            <!-- tab页签 -->
            <hos-tabs
                v-model="activeName"
                @tab-click="handleClick"
            >
                <!-- 密码控制 -->
                <hos-tab-pane
                    :label="$t('passwordPolicy.passRule')"
                    name="first"
                    class="pwd-padding"
                >
                    <hos-row>
                        <hos-col :span="24">
                            <hos-form-item :label="$t('passwordPolicy.passExpiration')">
                                <hos-input-number
                                    class="hos-input-number-pwd"
                                    v-model="passwordForm.M0007.value"
                                    @change="inputChange(passwordForm.M0007, 'M0007')"
                                    :min="0"
                                    :max="100"
                                ></hos-input-number>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0007.value == 0"
                                >
                                    {{ "*" + $t("passwordPolicy.message.passExpirationOpen") }}
                                </span>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0007.value != 0"
                                >
                                    {{
                    "*" +
                    $t("passwordPolicy.message.passExpirationClose", [
                      passwordForm.M0007.value,
                    ])
                  }}
                                </span>
                            </hos-form-item>
                        </hos-col>
                    </hos-row>
                    <hos-row>
                        <hos-col :span="24">
                            <hos-form-item :label="$t('passwordPolicy.leastPass')">
                                <hos-input-number
                                    class="hos-input-number-pwd"
                                    v-model="passwordForm.M0001.value"
                                    @change="inputChange(passwordForm.M0001, 'M0001')"
                                    :min="0"
                                    :max="12"
                                ></hos-input-number>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0001.value == 0"
                                >
                                    {{ "*" + $t("passwordPolicy.message.leastPasswordOpen") }}
                                </span>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0001.value != 0"
                                >
                                    {{
                    "*" +
                    $t("passwordPolicy.message.leastPasswordClose", [
                      passwordForm.M0001.value,
                    ])
                  }}
                                </span>
                            </hos-form-item>
                        </hos-col>
                    </hos-row>
                    <hos-row>
                        <hos-col :span="24">
                            <hos-form-item :label="$t('passwordPolicy.passComplexity')">
                                <hos-select
                                    class="hos-input-number-pwd"
                                    v-model="passwordForm.M0003.value"
                                    @change="complexityChange"
                                >
                                    <hos-option
                                        v-for="(item, index) in passComplex"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </hos-option>
                                </hos-select>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0003.value == ''"
                                >
                                    {{ "*" + $t("passwordPolicy.message.passComplexityNull") }}
                                </span>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0003.value != ''"
                                >
                                    {{
                    "*" +
                    $t("passwordPolicy.message.passComplexity", [
                      this.passwordComplex[passwordForm.M0003.value],
                    ])
                  }}
                                </span>
                            </hos-form-item>
                        </hos-col>
                    </hos-row>
                </hos-tab-pane>
                <!-- 安全控制 -->
                <hos-tab-pane
                    :label="$t('passwordPolicy.safeControl')"
                    name="second"
                    class="pwd-padding"
                >
                    <hos-row>
                        <!-- 登录校验验证码 -->
                        <hos-col :span="12">
                            <hos-form-item :label="$t('passwordPolicy.loginValid')">
                                <hos-switch
                                    v-model="passwordForm.M0009.value"
                                    @change="validCodeChange"
                                    :active-text="$t('common.actived.activedTrue')"
                                    :inactive-text="$t('common.actived.activedFalse')"
                                    inner-label
                                ></hos-switch>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0009.value == true"
                                >
                                    {{ "*" + $t("passwordPolicy.message.loginValidOpen") }}
                                </span>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0009.value == false"
                                >
                                    {{ "*" + $t("passwordPolicy.message.loginValidClose") }}
                                </span>
                            </hos-form-item>
                        </hos-col>
                    </hos-row>
                    <hos-row>
                        <!-- 登陆时校验密码规则 -->
                        <hos-col :span="12">
                            <hos-form-item :label="$t('passwordPolicy.loginValidRule')">
                                <hos-switch
                                    v-model="passwordForm.M0011.value"
                                    @change="validPasswordChange"
                                    :active-text="$t('common.actived.activedTrue')"
                                    :inactive-text="$t('common.actived.activedFalse')"
                                    inner-label
                                ></hos-switch>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0011.value == true"
                                >
                                    {{ "*" + $t("passwordPolicy.message.loginValidRuleOpen") }}
                                </span>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0011.value == false"
                                >
                                    {{ "*" + $t("passwordPolicy.message.loginValidRuleClose") }}
                                </span>
                            </hos-form-item>
                        </hos-col>
                    </hos-row>
                    <hos-row>
                        <hos-col :span="12">
                            <hos-form-item :label="$t('passwordPolicy.passFind')">
                                <hos-switch
                                    v-model="passwordForm.M0012.value"
                                    @change="recaverChnage"
                                    :active-text="$t('common.actived.activedTrue')"
                                    :inactive-text="$t('common.actived.activedFalse')"
                                    inner-label
                                ></hos-switch>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0012.value == true"
                                >
                                    {{ "*" + $t("passwordPolicy.message.passFindOpen") }}
                                </span>
                                <span
                                    class="policyFont"
                                    v-if="passwordForm.M0012.value == false"
                                >
                                    {{ "*" + $t("passwordPolicy.message.passFindClose") }}
                                </span>
                            </hos-form-item>
                        </hos-col>
                    </hos-row>
                    <hos-form-item :label="$t('passwordPolicy.openGraphics')">
                        <hos-col :span="1">
                            <hos-switch
                                v-model="passwordForm.M0013.value.isActived"
                                @change="addValidChange('M0013')"
                                :active-text="$t('common.actived.activedTrue')"
                                :inactive-text="$t('common.actived.activedFalse')"
                                inner-label
                            ></hos-switch>
                        </hos-col>
                        <hos-form-item
                            class="pwdFormItem"
                            v-if="passwordForm.M0013.value.isActived == true"
                            :label="$t('passwordPolicy.inputNumber')"
                            label-width="110px"
                        >
                            <hos-input-number
                                v-model="passwordForm.M0013.value.number"
                                :controls="true"
                                :min="1"
                                @change="addValidChange('M0013')"
                            ></hos-input-number>
                        </hos-form-item>
                        <span
                            v-if="passwordForm.M0013.value.isActived == true"
                            class="policyFont pwdFormItem"
                        >{{
                "*" +
                $t("passwordPolicy.message.inputNumber", [
                  passwordForm.M0013.value.number,
                ])
              }}</span>
                    </hos-form-item>
                    <hos-form-item :label="$t('passwordPolicy.lockPwd')">
                        <hos-col :span="1">
                            <hos-switch
                                v-model="passwordForm.M0015.value.isActived"
                                @change="addValidChange('M0013')"
                                :active-text="$t('common.actived.activedTrue')"
                                :inactive-text="$t('common.actived.activedFalse')"
                                inner-label
                            ></hos-switch>
                        </hos-col>
                        <hos-form-item
                            class="pwdFormItem"
                            v-if="passwordForm.M0015.value.isActived == true"
                            :label="$t('passwordPolicy.inputNumber')"
                            label-width="110px"
                        >
                            <hos-input-number
                                v-model="passwordForm.M0015.value.number"
                                :controls="true"
                                :min="3"
                                @change="addValidChange('M0015')"
                            ></hos-input-number>
                        </hos-form-item>
                        <hos-form-item
                            class="pwdFormItem"
                            v-if="passwordForm.M0015.value.isActived == true"
                            :label="$t('passwordPolicy.lockTime')"
                            label-width="110px"
                            :rules="rules.hour"
                            :prop="passwordForm.M0015.value.hour"
                        >
                            <hos-input
                                :placeholder='$t("common.placeholder.lockTime")'
                                v-model="passwordForm.M0015.value.hour"
                                @blur="addValidChange('M0015')"
                            >
                            </hos-input>
                        </hos-form-item>
                        <span
                            v-if="passwordForm.M0015.value.isActived == true"
                            class="policyFont pwdFormItem"
                        >{{
                "*" +
                $t("passwordPolicy.message.inputNumberLock", [
                  passwordForm.M0015.value.number,
                  passwordForm.M0015.value.hour,
                ])
              }}</span>
                    </hos-form-item>
                </hos-tab-pane>
            </hos-tabs>
        </hos-form>
    </div>
</template>

<script>
import { validNoZh, validNumberInteger } from "@sys/utils/validateUtil.js";
export default {
    name: "initialization",
    data() {
        return {
            // 默认密码枚举
            passOpt: [
                {
                    value: "M0002001",
                    label: this.$t("passwordPolicy.menu.fiexdPass"),
                },
                {
                    value: "M0002002",
                    label: this.$t("user.phoneNumber"),
                },
                {
                    value: "M0002003",
                    label: this.$t("passwordPolicy.menu.IDcard"),
                },
            ],
            // 密码复杂度枚举
            passComplex: [
                {
                    value: "",
                    label: this.$t("passwordPolicy.menu.noLimit"),
                },
                {
                    value: "M0003001,M0003002",
                    label: this.$t("passwordPolicy.menu.numberLetter"),
                },
                {
                    value: "M0003001,M0003003,M0003004",
                    label: this.$t("passwordPolicy.menu.numberUpLower"),
                },
                {
                    value: "M0003001,M0003002,M0003005",
                    label: this.$t("passwordPolicy.menu.numberLetterChar"),
                },
                {
                    value: "M0003001,M0003003,M0003004,M0003005",
                    label: this.$t("passwordPolicy.menu.numberUpLowerChar"),
                },
            ],
            // 密码复杂度的枚举
            passwordComplex: {
                "M0003001,M0003002": this.$t("passwordPolicy.numChar"),
                "M0003001,M0003003,M0003004": this.$t(
                    "passwordPolicy.numLowerUpChar"
                ),
                "M0003001,M0003002,M0003005": this.$t(
                    "passwordPolicy.numCharSpecial"
                ),
                "M0003001,M0003003,M0003004,M0003005": this.$t(
                    "passwordPolicy.numLowerUpSpecial"
                ),
            },
            // 验证贵则表格数据
            tableData: [],
            passwordForm: {
                M0001: {
                    value: "",
                    code: "",
                },
                M0002: {
                    value: { code: "M0002001", value: "111111" },
                    code: "",
                },
                M0003: {
                    value: "",
                    code: "",
                },
                M0004: {
                    value: false,
                    code: "",
                },
                M0005: {
                    value: false,
                    code: "",
                },
                M0006: {
                    value: false,
                    code: "",
                },
                M0007: {
                    value: "",
                    code: "",
                },
                M0008: {
                    value: false,
                    code: "",
                },
                M0009: {
                    value: false,
                    code: "",
                },
                M0010: {
                    value: false,
                    code: "",
                },
                M0011: {
                    value: false,
                    code: "",
                },
                M0012: {
                    value: false,
                    code: "",
                },
                M0013: {
                    remark: "",
                    value: { number: 1, isActived: false },
                    code: "",
                },
                M0015: {
                    remark: "",
                    value: { number: 3, hour: "0.5", isActived: false },
                    code: "",
                },
            },
            ableChange: false,
            activeName: "first",
            rules: {
                value: [
                    {
                        required: true,
                        trigger: "change",
                        validator: (rule, value, callback) => {
                            if (rule.field && rule.field != "") {
                                const result = validNoZh(rule.field);
                                if (result == true) {
                                    if (rule.field.length <= 40) {
                                        callback();
                                    } else {
                                        callback(
                                            new Error(
                                                this.$t(
                                                    "common.rule.pwd.length"
                                                )
                                            )
                                        );
                                    }
                                } else {
                                    callback(
                                        new Error(
                                            this.$t("common.rule.pwd.noZh")
                                        )
                                    );
                                }
                            } else {
                                callback(
                                    new Error(
                                        this.$t("common.rule.pwd.required")
                                    )
                                );
                            }
                        },
                    },
                ],
                hour: [
                    {
                        required: false,
                        trigger: "change",
                        validator: (rule, value, callback) => {
                            if (rule.field && rule.field != "") {
                                if (!/(^[0-9]\d*$)/.test(rule.field)) {
                                    callback(
                                        new Error(
                                            this.$t(
                                                "passwordPolicy.rule.number.Integer"
                                            )
                                        )
                                    );
                                } else {
                                    callback();
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
        this.$api("sys-password.searchAll").then((res) => {
            if (JSON.stringify(res.data) === "{}") {
                this.ableChange = true;
            } else {
                // 可操作且得到数据
                this.ableChange = true;
                this.passwordForm = res.data;
            }
            console.log(this.tableData);
        });
        this.tableData.push(this.passwordForm.M0013, this.passwordForm.M0015);
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        // 默认密码的修改
        defaultChange() {
            let data = this.passwordForm.M0002;
            if (this.ableChange == true) {
                this.updatePolicy(data);
            }
        },
        // 默认密码修改的校验
        defaultInputChange(value) {
            const result = validNoZh(value);
            if (result == true) {
                if (value.length <= 40) {
                    ``;
                    let data = this.passwordForm.M0002;
                    this.updatePolicy(data);
                }
            }
        },
        // 失效允许延用上次密码修改
        lastPasswordChange() {
            let data = this.passwordForm.M0008;
            if (this.ableChange == true) {
                this.updatePolicy(data);
            }
        },
        // 首次登陆强制修改
        fistLoginChange() {
            let data = this.passwordForm.M0004;
            if (this.ableChange == true) {
                this.updatePolicy(data);
            }
        },
        // 新密码与上次密码一致
        samePasswordChange() {
            let data = this.passwordForm.M0005;
            if (this.ableChange == true) {
                this.updatePolicy(data);
            }
        },
        // 是否允许延用上次密码
        isUseLastChange() {
            let data = this.passwordForm.M0006;
            if (this.ableChange == true) {
                this.updatePolicy(data);
            }
        },
        // 登录校验验证码
        validCodeChange() {
            let data = this.passwordForm.M0009;
            if (this.ableChange == true) {
                this.updatePolicy(data);
            }
        },
        // 修改密码校验验证码
        editPasswordChange() {
            let data = this.passwordForm.M0010;
            if (this.ableChange == true) {
                this.updatePolicy(data);
            }
        },
        // 登陆时校验密码规则
        validPasswordChange() {
            let data = this.passwordForm.M0011;
            if (this.ableChange == true) {
                this.updatePolicy(data);
            }
        },
        // 密码找回的修改
        recaverChnage() {
            let data = this.passwordForm.M0012;
            if (this.ableChange == true) {
                this.updatePolicy(data);
            }
        },
        // 添加验证规则的修改
        addValidChange(data) {
            this.$refs.passwordForm.validate((valid) => {
                if (valid) {
                    if (data == "M0015") {
                        this.updatePolicy(this.passwordForm.M0015);
                    } else if (data == "M0013") {
                        this.updatePolicy(this.passwordForm.M0013);
                    }
                } else {
                    this.$message.error(this.$t("operation.error"));
                }
            });
        },
        // 密码有效期的修改和最小长度的修改
        inputChange(data, code) {
            let obj = data;
            if (this.ableChange == true) {
                this.updatePolicy(data);
            }
        },
        // 密码复杂度的选择修改
        complexityChange() {
            let data = this.passwordForm.M0003;
            if (this.ableChange == true) {
                this.updatePolicy(data);
            }
        },
        // 请求后台的方法
        updatePolicy(data) {
            this.$api("sys-password.updatePolicy", data).then((res) => {
                if (res && res.code == 200) {
                    this.$message.success(
                        this.$t("passwordPolicy.message.success")
                    );
                } else {
                    // 保存失败就刷新page,返回之前的状态
                    this.$message.error(this.$t("operation.error"));
                    //this.refreshPage();
                }
            });
        },
        refreshPage() {
            this.tableData = [];
            this.$api("sys-password.searchAll").then((res) => {
                if (res && res.code == 200) {
                    if (res.data != null) {
                        this.passwordForm = res.data;
                    }
                    this.tableData.push(
                        this.passwordForm.M0013,
                        this.passwordForm.M0015
                    );
                } else {
                    this.$message.error(this.$t("operation.error"));
                }
            });
        },
        sortByDate(obj1, obj2) {
            let val1 = obj1.value.number;
            let val2 = obj2.value.number;
            return val2 - val1;
        },
        // 防抖方法
        debounce(fn, delay) {
            debugger;
            var delay = delay || 3000;
            var timer;
            return function () {
                var th = this;
                var args = arguments;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    timer = null;
                    fn.apply(th, args);
                }, delay);
            };
        },
    },
};
</script>
<style scoped>
.policyFont {
    padding-left: 10px;
    color: #909399;
    font-size: 11px;
}
</style>
