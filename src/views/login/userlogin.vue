<template>
  <hos-form
    ref="loginForm"
    :model="loginForm"
    :rules="isSimple == 1 ? loginRules : {}"
    class="login-form"
    auto-complete="on"
    label-position="left"
  >
    <hos-col :span="24">
      <hos-form-item prop="tenantId" v-if="openTenant">
        <hos-select
          @change="changeTenant"
          class="tenantSelect"
          popper-class="tenantPop"
          :placeholder="$t('login.label.placeholder.tenantId')"
          v-model="loginForm.tenantId"
        >
          <hos-option
            v-for="(item, index) in tenantData"
            :key="index"
            :label="item.name"
            :value="item.tenantId"
          >
          </hos-option>
        </hos-select>
        <i class="hos-icon-s-home"></i>
      </hos-form-item>
    </hos-col>

    <hos-col :span="24">
      <hos-form-item prop="loginName">
        <hos-input
          prefix-icon="hos-icon-user"
          ref="loginName"
          v-model="loginForm.loginName"
          :placeholder="$t('login.label.placeholder.loginName')"
          name="loginName"
          type="text"
          @keyup.enter.native="keyEnterLogin('password')"
        />
      </hos-form-item>
    </hos-col>
    <hos-col :span="24">
      <hos-form-item prop="password">
        <hos-input
          prefix-icon="hos-icon-lock"
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('login.label.placeholder.password')"
          name="password"
          @keyup.enter.native="keyEnterLogin('captchaCode')"
        />
      </hos-form-item>
    </hos-col>
    <!--图形验证码的区域-->
    <hos-col :span="24" v-if="openCaptcha">
      <hos-form-item prop="captchaCode">
        <hos-col :span="16">
          <hos-input
            prefix-icon="hos-icom-select-grant"
            v-model="loginForm.captchaCode"
            ref="captchaCode"
            :placeholder="$t('login.label.placeholder.captchaCode')"
            type="text"
            @keyup.enter.native="keyEnterLogin"
          >
          </hos-input>
        </hos-col>
        <hos-col :span="8" class="VCode">
          <!--<hos-image
                            :src="imgUrl" @click="getCaptcha"></hos-image>-->
          <img :src="imgUrl" @click="getCaptcha" />
        </hos-col>
      </hos-form-item>
    </hos-col>
    <div v-if="isSimple == 0 && loginErr" class="loginErrBox">
      <span>{{ loginErr }}</span>
    </div>
    <hos-col :span="24">
      <hos-form-item class="simple-login-btn">
        <hos-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 10px"
          @click="userHandleLogin(true)"
          >{{ $t("login.label.button.loginBtn") }}
        </hos-button>
        <hos-form-item v-if="forgetPassword">
          <hos-row class="Password_settings">
            <!--忘记密码-->
            {{ $t("login.label.forgetPassword") }}
          </hos-row>
        </hos-form-item>
      </hos-form-item>
    </hos-col>
  </hos-form>
</template>

<script>
import { mapActions } from "vuex";
import * as tokenUtil from "@sys/utils/base/token-util";
import AuthConstant from "@sys/constant/auth-constant";
import { INDEX_MAIN_PAGE_PATH } from "@sys/store/mutation-types";
import { getQueryString, getTopUrl } from "@sys/utils/base/base-util";
import { getLoginErrorDesc } from "./js/login";

export default {
  name: "userlogin",
  props: {
    selectTenant: Function,
    getUserLoginData: Function,
    loginSucessHandler: Function,
  },
  data() {
    ///校验是否是手机号或者邮箱
    return {
      loginErr: "",
      isSimple: process.env.VUE_APP_SIMPLE_ONCE,
      title: process.env.VUE_APP_TITLE,
      openTenant: false, //是否开启租户
      openCaptcha: false, //开启图形验证码
      imgUrl: "", //图形验证码,给个默认的图片
      originalOpenCaptcha: false,
      loginForm: {
        grantType: "password",
        loginName: "",
        password: "",
        tenantId: "",
        isRecordLogin: true,
        captchaCode: "",
        captchaUUID: "",
        selectRoleId: "",
      },
      loginRules: {
        loginName: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("login.label.rule.loginName"),
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("login.label.rule.password"),
          },
        ],
        ///租户id
        tenantId: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("login.label.rule.tenantId"),
          },
        ],
        captchaCode: [
          {
            required: false,
            trigger: "blur",
            message: this.$t("login.label.rule.captchaCode"),
          },
        ],
      },
      loading: false,
      passwordType: "password",
      tenantData: [],
      isSelectRole: false,
      isRoleOrg: false,
      oAuthId: "",
      source: "",
      socialChangType: "insert",
      roleId: [],
      roleName: [],
      inputValueChanged: false,
      roleData: [],
      forgetPassword: false,
    };
  },
  mounted() {
    window.addEventListener("click", this.clickOther);
  },
  beforeDestroy() {
    // 实例销毁之前对点击事件进行解绑
    window.removeEventListener("click", this.clickOther);
  },
  watch: {
    "loginForm.loginName": function (newVal, oldval) {
      this.inputValueChanged = newVal !== oldval;
    },
    "loginForm.password": function (newVal, oldval) {
      this.inputValueChanged = newVal !== oldval;
    },
  },
  created() {
    ///从父页面中，拿到登录前需要的数据，主要是租户数据以及是否选择角色
    this.initData(this.getUserLoginData());
  },
  computed: {},
  methods: {
    ...mapActions(["Login"]),
    initData(val) {
      let that = this;
      let preData = val;
      this.openTenant = preData.isTenantEnable;
      this.forgetPassword = preData.forgetPassword;
      if (this.openTenant) {
        this.tenantData = preData.tenantData;
        this.loginForm.tenantId = this.$store.getters.tenantId;
        /* if (this.tenantData.length > 0) {
                        let filterData = this.tenantData.filter(function (item) {    // 3、value 代表数组中的每一项
                            return item.tenantId == that.$store.getters.tenantId;
                        })
                        if (filterData & filterData.length > 0) {
                            this.loginForm.tenantId = that.$store.getters.tenantId;
                        } else {
                            this.loginForm.tenantId = this.tenantData[0].tenantId;
                        }
                    }*/
      }
      this.oAuthId = preData.oAuthId;
      this.source = preData.source;
      this.socialChangType = preData.socialChangType;
      this.openCaptcha = preData.isCaptchaEnable;
      this.originalOpenCaptcha = preData.isCaptchaEnable;
      let captchData = window.sessionStorage.getItem("openCaptcha");
      if (captchData === "true" && !this.openCaptcha) {
        this.openCaptcha = true;
      }
      if (this.openCaptcha) {
        this.$nextTick(() => {
          this.loginRules.captchaCode = {
            required: true,
            trigger: "blur",
            message: this.$t("login.label.rule.captchaCode"),
          };
        });
      }
      if (this.openCaptcha) {
        this.getCaptcha();
      }
    },
    keyEnterLogin(name) {
      ///键盘enter事件
      if (this.$refs[name]) {
        this.$refs[name].focus();
      } else {
        this.userHandleLogin(true);
      }
    },
    ///登录操作
    userHandleLogin(isLogin) {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.isSimple == 0) {
            if (!this.loginForm.loginName) {
              this.loginErr = this.$t("login.label.rule.loginName");
              return false;
            }
            if (!this.loginForm.password) {
              this.loginErr = this.$t("login.label.rule.password");
              return false;
            }
            if (this.openCaptcha) {
              if (!this.loginForm.captchaCode) {
                this.loginErr = this.$t("login.label.rule.captchaCode");
                return false;
              }
            }
          }
          if (this.openCaptcha) {
            this.loginForm.grantType = "captcha";
          } else {
            this.loginForm.grantType = "password";
          }
          ///如果需要选择角色，并且角色id是空的，则此次登录不需要记录信息
          if (this.isSelectRole && !isLogin) {
            this.loginForm.isRecordLogin = false;
            this.loginForm.grantType = "password";
            this.loginForm.selectRoleId = "";
            ///看看是否需要验证码模式，主要是看是否是错误次数过多导致的开启验证码
            if (
              window.sessionStorage.getItem("openCaptcha") === "true" &&
              this.openCaptcha
            ) {
              this.loginForm.grantType = "captcha";
            }
          } else {
            this.loginForm.isRecordLogin = true;
          }

          let paramData = JSON.parse(JSON.stringify(this.loginForm));
          if (paramData.password) {
            paramData.password = this.$m.crypt(paramData.password);
          }
          this.loading = true;
          this.Login(paramData)
            .then((res) => {
              this.loading = false;
              ///此处还要判断下是否 要绑定用户  TODO、
              if (this.oAuthId != "") {
                ///去调用杨桐的接口去绑定用户去，需要传递的参数为
                //this.source   this.oAuthId
                let param = {};
                param.appCode = this.source;
                param.appLoginCode = this.oAuthId;
                param.userId = this.$store.getters.userInfo.userId;
                param.tenantId = this.$store.getters.userInfo.tenantId;
                let funcObj = null;
                if (this.socialChangType === "insert") {
                  funcObj = this.insertUserContract(
                    "user_contrast.insert",
                    param
                  );
                } else {
                  funcObj = this.insertUserContract(
                    "user_contrast.update",
                    param
                  );
                }

                funcObj
                  .then(() => {
                    ////判断是否有父页面
                    if (window.opener && !window.opener.closed) {
                      window.opener.redirectToMainWin();
                    } else {
                      toPath = INDEX_MAIN_PAGE_PATH; ///第三方绑定账户的登录，直接跳转到登录页面
                      this.$router.push({ path: toPath });
                    }
                  })
                  .catch((err) => {
                    ////用户对照失败后，需要重新对照
                    ///清除上一次登录的前段数据
                    this.$store.dispatch("frontLogout");
                  });
              } else {
                this.loginSucessHandler();
              }
              window.sessionStorage.removeItem("openCaptcha");
              this.openCaptcha = this.originalOpenCaptcha;
              if (!this.openCaptcha) {
                this.loginRules.captchaCode = {
                  required: false,
                  trigger: "blur",
                  message: "",
                };
              } else {
                ///登录成功后，直接跳转，
                /*this.loginForm.captchaCode="";
                                this.getCaptcha();*/
              }
            })
            .catch((err) => {
              this.loading = false;
              ///处理4002 4003等问题，以及错误信息的显示
              let code = err.code;
              ////代表需要代开验证码了
              if (this.openCaptcha) {
                this.openCaptcha = true;
                this.loginForm.captchaCode = "";
                this.getCaptcha();
              }
              if (
                code ===
                AuthConstant.captchaNeedOpenCode /*|| this.openCaptcha*/
              ) {
                this.openCaptcha = true;
                this.loginForm.captchaCode = "";
                this.getCaptcha();
                ///，则将其状态保存到sessionstorage中，刷新默认还是有验证码的模式
                window.sessionStorage.setItem("openCaptcha", "true");
                this.$nextTick(() => {
                  this.loginRules.captchaCode = {
                    required: true,
                    trigger: "blur",
                    message: this.$t("login.label.rule.captchaCode"),
                  };
                });
              } else if (code === AuthConstant.twoAuthErrorCode) {
                ///这个需要从respnmse中获取数据,已经从过滤器中处理了
                let uuid = err.uuid;
                let authType = err.authType;
                ///弹出层
                this.$emit("openTwoAuthDialog", uuid, authType);
              } else {
                let errorDesc = getLoginErrorDesc(code, err.msg);
                if (!errorDesc || errorDesc == "") {
                  errorDesc = this.$t("login.common.userLoginFail");
                }
                if (this.isSimple == 1) {
                  this.$message.error(errorDesc);
                } else {
                  this.loginErr = errorDesc;
                }
              }
            });
          this.loading = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCaptcha() {
      this.$api("getCaptcha")
        .then((response) => {
          if (response && response.code == 200) {
            this.imgUrl = "data:image/gif;base64," + response.data.img;
            this.loginForm.captchaUUID = response.data.uuid;
          } else {
            ///提示错误信息
            this.$message.error(this.$t("login.common.captchaGetFail"));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    insertUserContract(url, param) {
      return new Promise((resolve, reject) => {
        this.$api(url, param)
          .then((response) => {
            if (response && response.code == 200) {
              this.source = "";
              this.oAuthId = "";
              this.$message.success(
                this.$t("login.common.userContractSuccess")
              );
              resolve(response);
            } else {
              ///提示错误信息
              //this.$message.error("用户对照失败：" + response.msg+"，请重新对照");
              this.$message.error(this.$t("login.common.userContractFail"));
              reject(response);
            }
          })
          .catch((error) => {
            this.$message.error(this.$t("login.common.userContractFail"));
            reject(error);
          });
      });
    },
    changeTenant(val) {
      this.loginForm.tenantId = val;
      this.selectTenant(val);
    },
  },
};
</script>
