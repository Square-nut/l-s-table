<template>
  <div>
    <hos-dropdown placement="bottom" @command="clickMenu" class="userInfo">
      <div class="drop-user">
        <hos-avatar
          style="vertical-align: sub"
          :size="18"
          :src="avatar"
        ></hos-avatar>
        <span style="padding-left: 3px">{{
          $store.getters.userInfo.name
        }}</span>
      </div>
      <hos-dropdown-menu slot="dropdown">
        <hos-dropdown-item
          v-for="(item, index) in dropDownMenus"
          :key="index"
          :command="item"
          :icon="item.meta.icon ? item.meta.icon : 'hos-icon-menu'"
        >
          {{ item.meta.title }}
        </hos-dropdown-item>
        <hos-dropdown-item
          @click.native="handlerLogout"
          icon="hos-icon-switch-button"
        >
          退出登录</hos-dropdown-item
        >
        <hos-dropdown-item v-if="simple == 0">
          <span
            >左侧菜单：
            <hos-switch
              v-model="simpleLeftMenu"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              size="mini"
              @change="changeMenu"
            >
            </hos-switch>
          </span>
        </hos-dropdown-item>
      </hos-dropdown-menu>
    </hos-dropdown>
    <!--  设置按钮 SZWW  -->
    <hos-dropdown
      v-if="simple == 0"
      placement="bottom"
      trigger="click"
      class="setUp"
      :hide-on-click="false"
    >
      <div class="drop-user">
        <i class="hos-icon-setting"></i>
      </div>
      <hos-dropdown-menu slot="dropdown" class="headMenu_setUp">
        <hos-dropdown-item>
          <img src="@sys/assets/images/helpImg.png" />
          <span @click="openHelpDoc()">帮助文档</span>
        </hos-dropdown-item>
        <!--        <hos-dropdown-item>-->
        <!--          <img src="@sys/assets/images/colorImg.png" />-->
        <!--          <span>系统颜色转换</span>-->
        <!--          <div class="color">-->
        <!--            <span-->
        <!--              @click="changeColor('blue')"-->
        <!--              :class="{ active: themeColor == 'blue' }"-->
        <!--              >蓝</span-->
        <!--            >-->
        <!--            <span-->
        <!--              @click="changeColor('green')"-->
        <!--              :class="{ active: themeColor == 'green' }"-->
        <!--              >绿</span-->
        <!--            >-->
        <!--            <span-->
        <!--              @click="changeColor('purple')"-->
        <!--              :class="{ active: themeColor == 'purple' }"-->
        <!--              >紫</span-->
        <!--            >-->
        <!--          </div>-->
        <!--        </hos-dropdown-item>-->
        <!--        <hos-dropdown-item>-->
        <!--          <img src="@sys/assets/images/fontImg.png" />-->
        <!--          <span>文字大小转换</span>-->
        <!--          <div class="font">-->
        <!--            <span-->
        <!--              @click="changeFontSize('large')"-->
        <!--              :class="{ active: themeFont == 'large' }"-->
        <!--              >大</span-->
        <!--            >-->
        <!--            <span-->
        <!--              @click="changeFontSize('default')"-->
        <!--              :class="{ active: themeFont == 'default' }"-->
        <!--              >中</span-->
        <!--            >-->
        <!--            <span-->
        <!--              @click="changeFontSize('small')"-->
        <!--              :class="{ active: themeFont == 'small' }"-->
        <!--              >小</span-->
        <!--            >-->
        <!--          </div>-->
        <!--        </hos-dropdown-item>-->
        <!--        <hos-dropdown-item>-->
        <!--          <img src="@sys/assets/images/fontImg.png" />-->
        <!--          <span>中英文切换</span>-->
        <!--          <div class="font">-->
        <!--            <span-->
        <!--              @click="chinese('zh')"-->
        <!--              :class="{ active: themeFamily == 'zh' }"-->
        <!--              >中文</span-->
        <!--            >-->
        <!--            <span-->
        <!--              @click="english('en')"-->
        <!--              :class="{ active: themeFamily == 'en' }"-->
        <!--              >英文</span-->
        <!--            >-->
        <!--          </div>-->
        <!--        </hos-dropdown-item>-->
      </hos-dropdown-menu>
    </hos-dropdown>
    <!--  设置按钮 EZWW  -->
    <hos-biz-dialog
      :title="dialogTitle"
      :width="dialogTitle == '修改密码'?'43%':width"
      uid="menuDialog"
      :close-on-click-modal="false"
    >
    </hos-biz-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import themeConfig from "@sys/utils/theme/themeConfig";
export default {
  name: "DropDownMenu",

  data() {
    return {
      simple: process.env.VUE_APP_SIMPLE_ONCE,
      simpleLeftMenu: localStorage.getItem("leftMenu"),
      dialogTitle: "",
      width: "50%",
      themeColor: localStorage.getItem("theme"),
      themeFont: localStorage.getItem("fontSize"),
      themeFamily: localStorage.getItem("fontFamily"),
    };
  },
  computed: {
    ...mapState({
      permissionMenuList: (state) => state.user.menuList,
      dropDownMenus: (state) => state.user.dropDownMenus,
    }),
    ...mapGetters(["avatar"]),
  },
  created() {
    let theme = localStorage.getItem("theme");
    if (theme) {
      this.changeTheme(theme);
    }
    if (localStorage.getItem("fontFamily") == "zh") {
      this.$i18n.locale = "zh";
    }
  },
  watch: {
    defaultTheme: {
      handler: function (val, oldVal) {
        this.theme = val;
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions(["Logout"]),

    handlerLogout() {
      this.Logout().then(() => {
        const loginType = process.env.VUE_APP_LOGIN_TYPE;
        if (loginType == "oauth") {
          const logoutUrl = process.env.VUE_APP_OAUTH_LOGOUT_URL;
          location.href = logoutUrl + "?service=" + window.location.href;
        } else {
          location.href = "/";
        }
      });
    },
    openHelpDoc() {
      window.open("http://114.242.246.250:8034/");
    },
    //设置中英文两个切换方法
    chinese() {
      this.$i18n.locale = "zh";
      localStorage.setItem("fontFamily", "zh");
      this.themeFamily = "zh";
    },
    english() {
      this.$i18n.locale = "en";
      localStorage.setItem("fontFamily", "en");
      this.themeFamily = "en";
    },
    changeMenu(val) {
      localStorage.setItem("leftMenu", val);
      this.$emit("changeMenuType", val);
    },
    changeColor(color) {
      localStorage.setItem("theme", color);
      this.changeTheme(color);
      location.reload();
    },
    changeTheme(theme) {
      const config = themeConfig[theme];
      Object.keys(config).forEach((key) => {
        document
          .getElementsByTagName("body")[0]
          .style.setProperty(key, config[key]);
      });
    },
    changeFontSize(size) {
      localStorage.setItem("fontSize", size);
      location.reload();
    },

    clickMenu(command) {
      if (!command) {
        return;
      }
      let menu = command;
      if (!menu.meta.isDialog) {
        this.$router.push({ path: menu.path });
      } else {
        let componentPath = menu.meta.componentPath;
        let component = "";
        if (menu.meta.isFrame) {
          component = require("@sys/components/layouts/IframePageView").default;
        } else {
          component = require(`@sys/views${componentPath}`).default;
        }
        //  打开一个弹窗
        this.dialogTitle = menu.meta.title;
        this.$store.commit("OPEN_DIALOG", {
          _uid: "menuDialog",
          component: component,
          props: menu.props,
        });
      }
    },
  },
};
</script>
