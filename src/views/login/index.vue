<template>
  <hos-card v-if="loginType == 'normal'" shadow="never">
    <hos-biz-dialog uid="twoAuthDialog" ref="twoAuthDialog" />
    <div class="title-container">
      <!--欢迎登录,-->
      <h3 class="title">{{ $t("login.label.title") }}{{ title }}</h3>
    </div>
    <div class="login-card" v-if="reload">
      <hos-tabs type="card" v-model="activeType" ref="tabs">
        <!--账号登录-->
        <hos-tab-pane
          :label="$t('login.label.authType.user')"
          name="password"
          v-if="passwordEnable"
        >
          <userLogin
            ref="userLogin"
            @openTwoAuthDialog="openTwoAuthDialog"
            :loginSucessHandler="loginSucessHandler"
            :getUserLoginData="getUserLoginData"
            :selectTenant="selectTenant"
          ></userLogin>
        </hos-tab-pane>
        <!-- 口令登录-->
        <hos-tab-pane
          :label="$t('login.label.authType.otp')"
          name="otp"
          v-if="otpEnable"
        >
          <otplogin
            ref="otp"
            @openTwoAuthDialog="openTwoAuthDialog"
            :loginSucessHandler="loginSucessHandler"
            :getOTPLoginData="getOTPLoginData"
          ></otplogin>
        </hos-tab-pane>
        <!-- 扫码登录-->
        <hos-tab-pane
          :label="$t('login.label.authType.qr')"
          name="qr"
          v-if="qrEnable"
          >扫码登录</hos-tab-pane
        >
        <!-- ca登录-->
        <hos-tab-pane
          :label="$t('login.label.authType.ca')"
          name="ca"
          v-if="caEnable"
          >ca登录</hos-tab-pane
        >
      </hos-tabs>
      <div class="thirdLogin" v-if="socialEnable">
        <social
          ref="social"
          @openTwoAuthDialog="openTwoAuthDialog"
          :save-window="saveWindow"
          :getSocialData="getSocialData"
          v-if="socialEnable"
        ></social>
      </div>
    </div>
    <hos-dialog
      :title="$t('login.label.placeholder.tenantId')"
      :visible.sync="centerDialogVisible"
      width="30%"
      :show-close="showClose"
      :showCollapse="showFlod"
      center
    >
      <div style="margin-top: 10px">
        <hos-tag
          style="margin-left: 10px"
          :key="index"
          :type="tenantId == item.tenantId ? 'warning' : ''"
          v-for="(item, index) in tenantData"
          @click="selectTenant(item.tenantId)"
          ><i :class="item.icon"></i>{{ item.name }}</hos-tag
        >
      </div>
    </hos-dialog>
  </hos-card>
  <hos-card
    v-else-if="loginType == 'social'"
    style="
      background-color: transparent;
      border: none;
      width: 400px;
      float: right;
      margin-right: 100px;
    "
    :loading="loading"
  >
    <hos-row> 第三方平台正在登录 </hos-row>
  </hos-card>
</template>

<script>
import userLogin from "./userlogin";
import social from "./social";
import { getQueryString, getTopUrl } from "@sys/utils/base/base-util";
import { INDEX_MAIN_PAGE_PATH } from "@sys/store/mutation-types";
import { validatenull } from "@sys/utils/base/base-validate";
import AuthConstant from "@sys/constant/auth-constant";
import otplogin from "./otplogin";
import { getMenuListByPermi } from "@sys/utils/router/router";
export default {
  components: {
    otplogin,
    userLogin,
    social,
  },
  data() {
    return {
      title: process.env.VUE_APP_TITLE,
      reload: true,
      showClose: false,
      showFlod: false,
      activeType: "", ///默认激活的授权类型，可以写死或者从后台数据中获取，先默认
      isMany: false,
      authType: [],
      tenantData: [],
      tenantId: "",
      isTenantEnable: false,
      passwordEnable: false, ///密码登录
      captchaEnable: false, ///图形验证码跟密码模式在同一个页面中
      otpEnable: false, ///动态验证码登录
      socialEnable: false, ////第三方平台
      qrEnable: false, ///手机扫码
      caEnable: false,
      preAuthData: [],
      loading: false,
      socialForm: {
        tenantId: "",
        grantType: "social",
        isRecordLogin: true,
        source: "",
        code: "",
        state: "",
      },
      redirectUrl: this.redirect,
      loginType: "",
      oAuthId: "",
      isSingle: true,
      isFormSingle: true,
      windowArray: [],
      socialChangType: "insert",
      centerDialogVisible: false,
    };
  },
  mounted() {},
  created() {
    ///
    let _this = this;
    window.redirectToMainWin = function (obj) {
      _this.redirectToMain();
    };
    window.getTwoAuthUUID = function (obj) {
      return this.twoAuthUUID;
    };
    window.openTwoAuthDialog = function (uuid, authType) {
      _this.openTwoAuthDialog(uuid, authType);
    };
    window.getUserLoginData = function () {
      _this.getUserLoginData();
    };

    window.closeChildWindow = function () {
      _this.closeChildWindow();
    };
    window.showErrorMessage = function (msg) {
      _this.showErrorMessage(msg);
    };

    this.tenantId = this.$store.getters.tenantId;
    this.handleLogin();
  },
  methods: {
    loginSucessHandler(toPath) {
      if (!toPath) {
        let toCustomPath = getQueryString("redirect");
        if (!toCustomPath) {
          toCustomPath = INDEX_MAIN_PAGE_PATH;
        }
        toPath = toCustomPath;
      }
      this.$router.push({ path: toPath });
    },
    saveWindow(winObj) {
      if (winObj) {
        this.windowArray.push(winObj);
      }
    },
    showErrorMessage(msg) {
      this.$message.error(msg);
    },
    redirectToMain() {
      ///关闭所有的打开的窗口
      let windowArray = this.windowArray;
      for (let i = 0; i < windowArray.length; i++) {
        windowArray[i].close();
      }
      this.loginSucessHandler();
    },
    closeChildWindow() {
      let windowArray = this.windowArray;
      for (let i = 0; i < windowArray.length; i++) {
        windowArray[i].close();
      }
    },
    getUserLoginData() {
      ///用户名密码登录模式下需要的数据

      /*if(window.opener && !window.opener.closed){
                    return window.opener.getUserLoginData();
                }*/
      let dataObj = {};
      ///租户数据
      dataObj.tenantData = this.tenantData;
      dataObj.isTenantEnable = this.isTenantEnable;
      dataObj.isCaptchaEnable = this.captchaEnable;
      dataObj.oAuthId = this.oAuthId;
      dataObj.source = this.socialForm.source;
      dataObj.socialChangType = this.socialChangType;
      dataObj.forgetPassword = this.preAuthData.showRebackPassword;
      return dataObj;
      //callback(dataObj);
    },
    getOTPLoginData() {
      ///用户名密码登录模式下需要的数据
      let dataObj = {};
      ///租户数据
      dataObj.tenantData = this.tenantData;
      dataObj.isTenantEnable = this.isTenantEnable;
      return dataObj;
    },
    getSocialData(callback) {
      ///第三方平台的数据
      let dataObj = {};
      ///租户数据
      dataObj.sourceData = this.preAuthData.authType.SOCIAL.source;
      dataObj.isSingle = this.isSingle;
      return dataObj;
    },
    openPage(type, isShowMain) {
      this.activeType = type;
      if (isShowMain) {
        this.isMain = true;
      } else {
        this.isMain = false;
      }
    },
    getPreAuthData(authType) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let param = { tenantId: this.$store.getters.tenantId };
        this.$api("getPreLoginData", param)
          .then((response) => {
            if (response && response.code == 200) {
              let res = response.data;
              let authLength = 0;
              ///分析数据
              ///获取租户数据
              this.preAuthData = res;
              this.loading = false;
              /// 优先根据参数来
              if (!authType) {
                authType = res.authType;
              } else {
                ///验证码是否开启判断下，如果开启了
                if (res.authType.CAPTCHA && res.authType.CAPTCHA.enable) {
                  authType.CAPTCHA = {
                    enable: true,
                  };
                }
              }
              if (!authType) {
                authType = {
                  PASSWORD: {
                    enable: true,
                  },
                };
              }
              let array = [];
              let Formarray = [];
              if (authType.PASSWORD && authType.PASSWORD.enable) {
                this.passwordEnable = true;
                array.push("password");
                Formarray.push("password");
              }
              ///验证码 打开 代表密码登录打开了
              if (authType.CAPTCHA && authType.CAPTCHA.enable) {
                ///密码模式没开启，才将这种登录方式 算入一种
                if (!this.passwordEnable) {
                  array.push("password");
                  Formarray.push("password");
                }
                this.captchaEnable = true;
                this.passwordEnable = true;
              }
              if (authType.SOCIAL && authType.SOCIAL.enable) {
                if (authType.SOCIAL.source.length == 0) {
                  this.socialEnable = false;
                } else {
                  this.socialEnable = true;
                  array.push("social");
                }
              }
              if (authType.OTP && authType.OTP.enable) {
                this.otpEnable = true;
                array.push("otp");
                Formarray.push("otp");
              }
              ///从后端获取到默认的认证模式
              this.activeType = "password";
              if (this.passwordEnable) {
                this.activeType = "password";
              } else if (this.otpEnable) {
                this.activeType = "otp";
              }
              this.activeType = res.activeType
                ? res.activeType
                : this.activeType;
              ///
              if (array.length == 1) {
                this.isSingle = true;
              } else if (array.length > 1) {
                this.isSingle = false;
              }
              if (Formarray.length == 1) {
                this.isFormSingle = true;
                ////设置标题隐藏
                this.$refs.tabs.$el.firstElementChild.style.display = "none";
              } else if (Formarray.length > 1) {
                this.isFormSingle = false;
                this.$refs.tabs.$el.firstElementChild.style.display = "";
              }
              if (array.length > 0 && array.indexOf(this.activeType) == -1) {
                this.activeType = array[0];
              }
              resolve();
            } else {
              ///提示错误信息
              this.$message.error(response.msg);
              reject(response);
            }
          })
          .catch((error) => {
            //this.$message.error("数据获取异常");
            reject(error);
          });
      });
    },
    hisLogin(hisForm) {
      this.$store
        .dispatch("Login", hisForm)
        .then(() => {
          this.$router.push({ path: INDEX_MAIN_PAGE_PATH });
        })
        .catch((error) => {
          this.loading = false;
          let errorDesc = error.msg;
          this.$message.error(errorDesc);
        });
    },
    ///获取租户的数据
    getTanantData() {
      return new Promise((resolve, reject) => {
        this.$api("getTenant").then((response) => {
          if (response.code == 200) {
            resolve(response);
          } else {
            this.$message.error("初始化数据失败");
          }
        });
      });
    },
    handleLogin() {
      ////判断是否是his那边的登录
      let hisForm = {};
      hisForm.userId = getQueryString("userId");
      hisForm.hisToken = getQueryString("token");
      hisForm.grantType = "his";
      if (hisForm.userId && hisForm.hisToken) {
        this.hisLogin(hisForm);
        return;
      }

      const topUrl = getTopUrl();
      const redirectUrl = "/oauth/redirect/";
      const redirectPath = getQueryString("redirect");
      this.socialForm.source = getQueryString("source");
      this.socialForm.code = getQueryString("code");
      this.socialForm.state = getQueryString("state");
      this.socialForm.tenantId = this.$store.getters.tenantId;
      if (
        validatenull(this.socialForm.source) &&
        topUrl.includes(redirectUrl)
      ) {
        let source = redirectPath.split("?")[0];
        source = source.split(redirectUrl)[1];
        this.socialForm.source = source;
      }
      if (
        !validatenull(this.socialForm.source) &&
        !validatenull(this.socialForm.code) &&
        !validatenull(this.socialForm.state)
      ) {
        this.loginType = "social";
        this.loading = true;
        ////登录之前，看是是否从有父窗口，然后获取下二次认证的参数
        if (window.opener && !window.opener.closed) {
          ///认证成功后，关闭本页面，并关闭父页面打开的所有的认证页面
          ///这个的从弹出层中获取，不然获取到的就是主页面上的，是不对的
          let twoAuthUUID = window.opener.getTwoAuthUUID();
          if (twoAuthUUID) {
            this.socialForm.twoAuthUUID = twoAuthUUID;
          }
        }
        alert("开始认证");
        this.$store
          .dispatch("Login", this.socialForm)
          .then(() => {
            ///存在父页面
            if (window.opener && !window.opener.closed) {
              ///认证成功后，关闭本页面，并关闭父页面打开的所有的认证页面
              window.opener.redirectToMainWin();
            } else {
              ///跳转到主页面
              this.loginSucessHandler();
              //this.$router.push({path: INDEX_MAIN_PAGE_PATH});
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            let errorDesc = error.msg;
            ///
            let code = error.code;
            ///代表验证通过，但是没有绑定用户，需要输入用户名和密码去校验
            if (
              code == AuthConstant.socialErrorCode ||
              code == AuthConstant.socialErrorCodeSec
            ) {
              this.loginType = "normal";
              ///只开启密码模式，验证码是否开启，则从返回的数据里去重置
              let authType = {
                PASSWORD: {
                  enable: true,
                },
              };
              this.oAuthId = error.msg;
              if (code == AuthConstant.socialErrorCodeSec) {
                this.socialChangType = "update";
              } else {
                this.socialChangType = "insert";
              }
              ///如果本系统不允许登录，则直接调用social的服务器进行撤销授权
              ///给一个提示框确认是否需要绑定账户
              this.$confirm(
                this.$t("login.social.notBindUserConfirmDesc"),
                this.$t("login.label.info"),
                {
                  confirmButtonText: this.$t("operation.confirm"),
                  cancelButtonText: this.$t("operation.cancel"),
                  type: "warning",
                }
              )
                .then(() => {
                  ///确定
                  //重新获取下数据，主要是重新获取租户数据.这个时候直接从首页面上重新获取租户数据，就可以了，将其他模式关闭
                  /*this.getPreAuthData(authType).then((res)=>{

                                        })*/
                  this.normalPreLogin(authType);
                  ///
                })
                .catch(() => {
                  if (window.opener && !window.opener.closed) {
                    ///认证成功后，关闭本页面，并关闭父页面打开的所有的认证页面
                    window.opener.closeChildWindow();
                  } else {
                    ///刷新页面
                    location.href = "/";
                  }
                });
            } else if (code === AuthConstant.twoAuthErrorCode) {
              ///这个需要从respnmse中获取数据,已经从过滤器中处理了
              let uuid = error.uuid;
              let authType = error.authType;
              ///这里需要调用父窗口的方法
              if (window.opener && !window.opener.closed) {
                ///认证成功后，关闭本页面，并关闭父页面打开的所有的认证页面
                window.opener.openTwoAuthDialog(uuid, authType);
                window.opener.closeChildWindow();
              }
            } else {
              ///第三方平台认证失败
              this.$message.error(this.$t("login.social.authError"));
              if (window.opener && !window.opener.closed) {
                ///认证成功后，关闭本页面，并关闭父页面打开的所有的认证页面
                window.opener.closeChildWindow();
                window.opener.showErrorMessage(
                  this.$t("login.social.authError")
                );
              }
              ///重新跳转到登录页面
              //window.location.href="/"
              //this.loginType="normal";
            }
          });
      } else {
        this.normalPreLogin();
      }
    },
    normalPreLogin(authType) {
      this.loginType = "normal";
      this.getTanantData().then((response) => {
        let isEnable = response.data.enable;
        this.isTenantEnable = isEnable;
        ///租户开启
        if (isEnable) {
          ///先判断之前有没有选择租户
          this.tenantId = this.$store.getters.tenantId;
          this.tenantData = response.data.list;
          let obj = this.tenantData.find(
            (item) => item.tenantId === this.tenantId
          );
          if (obj) {
            ///代表之前选择过租户了
            ///获取登录配置数据
            this.getPreAuthData(authType);
          } else {
            ///当前选中的租户id设置为空
            this.tenantId = "";
            ///弹出租户选择的框==by杨桐：修改成自己走下拉选
            this.centerDialogVisible = false;
            if (this.tenantData) {
              //默认选中第一个租户
              this.selectTenant(this.tenantData[0].tenantId);
            }
          }
        } else {
          ///获取登录配置数据
          this.getPreAuthData(authType);
        }
      });
    },
    selectTenant(id) {
      this.reload = false;
      this.$nextTick(() => {
        this.$store.dispatch("saveTenant", id);
        this.tenantId = id;
        this.reload = true;
        ///获取登录配置数据
        this.getPreAuthData();
        this.centerDialogVisible = false;
      });
    },
    openTwoAuthDialog(uuid, authType) {
      this.twoAuthUUID = uuid;
      let windowDialog = null;
      switch (authType) {
        case "otp": {
          windowDialog = this.$store.commit("OPEN_DIALOG", {
            component: require("./otplogin").default,
            _uid: "twoAuthDialog",
            ref: "twoAuthDialog",
            props: {
              twoAuthUUID: uuid,
              getOTPLoginData: this.getOTPLoginData,
              loginSucessHandler: this.loginSucessHandler,
            },
          });
          break;
        }
        case "social": {
          windowDialog = this.$store.commit("OPEN_DIALOG", {
            component: require("./social").default,
            _uid: "twoAuthDialog",
            ref: "twoAuthDialog",
            props: {
              twoAuthUUID: uuid,
              getSocialData: this.getSocialData,
              saveWindow: this.saveWindow,
            },
          });
          break;
        }
        default: {
          this.$message.error("不支持此种登录方式");
        }
      }
    },
  },
};
</script>
<style>
@import "../../assets/css/login.css";
@import "../../assets/css/login-base.css";
</style>

