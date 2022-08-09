import Vue from "vue";
import App from "./App.vue";
import HosUI from 'hosui'
import axios from '@sys/axios'
import router from '@sys/router'
import store from '@sys/store'
import i18n from '@sys/i18n'
/* import Chinese from './i18n/langs/zh'
import English from './i18n/langs/en' */
import Storage from 'vue-ls'
import util from '@sys/utils/util'
import directive from "@sys/directive";
import hosBizComponent from '@sys/components/hos-biz/index'
// import "./assets/style/index.scss"

// biz下的自定义指令
import '@/directive'

import {
  ACCESS_TOKEN,
  DEFAULT_MULTI_PAGE,
  USER_AUTH
} from "@sys/store/mutation-types"

import config from './defaultSettings'

if (process.env.VUE_APP_SIMPLE_ONCE === '1') {
  require('@sys/assets/style/hos/index.scss')
} else {
  // const themeColor = localStorage.getItem("theme") ? localStorage.getItem("theme") : 'blue';
  // switch (themeColor) {
  //   case 'green':
  //     require('@sys/styles/green.scss')
  //     break;
  //   case 'purple':
  //     require('@sys/styles/purple.scss')
  //     break;
  //   case 'blue':
  //     require('@sys/styles/blue.scss')
  //     break;
  // }
  require('hosui/lib/theme-simple/index.css');
  require('@sys/styles/index.scss') // global css

  require('@sys/assets/style/custom.css')
  require('@sys/assets/style/simple/index.scss')
}
const fontSize = localStorage.getItem("fontSize") ? localStorage.getItem("fontSize") : null;

Vue.config.productionTip = false;
Vue.use(Storage, config.storageOptions)
Vue.use(HosUI,{
  size:fontSize,
  style: process.env.VUE_APP_SIMPLE_ONCE === '1' ? 'hos' : 'simple'
});
Vue.use(util);
Vue.use(directive);
Vue.use(hosBizComponent);
import './permission'

new Vue({
  router,
  store,
  i18n,
  axios,
  mounted () {
    store.commit('SET_ACCESS_TOKEN', Vue.ls.get(ACCESS_TOKEN))
    // store.commit('SET_MENU_LIST', Vue.ls.get(USER_AUTH) ? Vue.ls.get(USER_AUTH) : [])
    store.commit('SET_MULTI_PAGE',Vue.ls.get(DEFAULT_MULTI_PAGE,config.multipage))
  },
  render: (h) => h(App),
}).$mount("#app");


console.log(process.env.VUE_APP_BASE_URL, 'BASE_URL')
