<template></template>

<script>
import { INDEX_MAIN_PAGE_PATH, INITIAL_ROUTE } from "@sys/store/mutation-types";
import * as storageUtil from "@sys/utils/base/storage-util";
export default {
  name: "oauth_callback",
  data() {
    return {
      redirect: undefined,
      socialForm: {
        tenantId: "",
        grantType: "social",
        source: "",
        code: "",
        state: "",
      },
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      //清空租户的缓存
      this.$store.dispatch("saveTenant", "");
      this.socialForm.source = process.env.VUE_APP_LOGIN_SOURCE;
      this.socialForm.code = this.$route.query.code;
      this.socialForm.state = this.$route.query.state;
      //获取当前访问的域名
      var domain = window.location.host;
      this.socialForm.domain = "http://" + domain;
      this.$store
        .dispatch("Login", this.socialForm)
        .then(() => {
          this.redirect = storageUtil.getLocal(INITIAL_ROUTE);
          this.$router.push({ path: this.redirect || INDEX_MAIN_PAGE_PATH });
        })
        .catch((error) => {
          ////如果是本系统没有用户，则重新退出后登录
          if (error.code && error.code === "4005") {
            this.$message.error(this.$t("login.social.notBindUserError"));
            let loginType = process.env.VUE_APP_LOGIN_TYPE;
            let url = process.env.VUE_APP_LOGIN_OAUTH_SERVER_URL;
            if (loginType === "oauth") {
              // 向认证服务器发送注销请求
              url =
                url +
                "?service=" +
                window.location.protocol +
                "//" +
                window.location.host;
              location.href = url;
            }
          } else if (error.code && error.code === "4006") {
            this.$message.error(this.$t("login.social.bindUserError"));
            let loginType = process.env.VUE_APP_LOGIN_TYPE;
            let url = process.env.VUE_APP_LOGIN_OAUTH_SERVER_URL;
            if (loginType === "oauth") {
              // 向认证服务器发送注销请求
              url =
                url +
                "?service=" +
                window.location.protocol +
                "//" +
                window.location.host;
              location.href = url;
            }
          } else {
            // this.$message.error(this.$t("login.social.authError"));
            this.$router.push("/login");
          }
        });
    },
  },
};
</script>
