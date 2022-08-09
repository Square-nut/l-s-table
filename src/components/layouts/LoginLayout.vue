<template>
  <hos-container>
    <template v-if="isSimple == 1">
      <div class="hos-img-login-bg"></div>
      <div class="hos-img-login-content">
        <hos-header> </hos-header>
        <hos-main class="hos-login-main">
          <div class="hos-login-card">
            <route-view></route-view>
          </div>
        </hos-main>
        <hos-footer class="login-footer">
          <div>
            <span class="foot-font"
              >© 2014-2022 东华医为科技有限公司版权所有</span
            >
          </div>
        </hos-footer>
      </div>
    </template>
    <template v-else>
      <hos-main class="login-simple-hos-main">
        <div class="header-four-box">
          <div class="left-group-box"></div>
          <div class="center"><span>东华医为数字化医院</span></div>
          <div class="right-group-box"></div>
        </div>
        <div class="simple-login-mid">
          <hos-carousel trigger="click" height="530px">
            <hos-carousel-item v-for="item in carouselImage" :key="item.key">
              <hos-image
                :src="item.url"
                style="width: 100%; height: 530px"
              ></hos-image>
            </hos-carousel-item>
          </hos-carousel>
          <div class="simple-login-card">
            <route-view></route-view>
          </div>
        </div>
      </hos-main>
      <hos-footer class="simple-footer">
        <div class="simple-com-logo"></div>
        <span class="simple-foot-font">
          © 2014-2022 东华医为科技有限公司版权所有
        </span>
      </hos-footer>
    </template>
  </hos-container>
</template>

<script>
import RouteView from "@sys/components/layouts/RouteView";

export default {
  name: "LoginLayout",
  data() {
    return {
      isSimple: process.env.VUE_APP_SIMPLE_ONCE,
      carouselImage: [
        { key: 1, url: require("../../assets/images/login/01.png") },
        { key: 2, url: require("../../assets/images/login/02.png") },
        { key: 3, url: require("../../assets/images/login/03.png") },
      ],
    };
  },
  components: { RouteView },
  mounted() {
    document.body.classList.add("userLayout");
  },
  beforeDestroy() {
    document.body.classList.remove("userLayout");
  },
};
</script>

<style lang="scss" scoped>
.hos-header {
  margin-bottom: 48px;
}
.hos-system-name {
  padding-top: 25px;
  font-size: 32px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #000000;
}
img {
  width: 550px;
  height: 430px;
  opacity: 1;
  border-radius: 0px;
}
.hos-login-main {
  display: flex;
  height: 502px;
  opacity: 1;
  border-radius: 0px;
  .hos-img-login {
    padding-left: 166px;
  }
  .hos-login-card {
    .hos-card {
      width: 350px;
      height: 375px;
      opacity: 1;
      border-radius: 0px;
    }
  }
}
@import "../../assets/css/login.css";
</style>
