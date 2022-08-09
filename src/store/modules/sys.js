import Vue from 'vue'
import {
  DEFAULT_MULTI_PAGE,INITIAL_ROUTE
} from "@sys/store/mutation-types"

const sys = {
  state: {
    multipage: true, //默认多页签模式
    initialRoute:"",//登陆前访问的路由
  },
  mutations: {
    SET_MULTI_PAGE (state, multipageFlag) {
      Vue.ls.set(DEFAULT_MULTI_PAGE, multipageFlag)
      state.multipage = multipageFlag
    },
    SET_INITIAL_ROUTE (state, initialRoute) {
      Vue.ls.set(INITIAL_ROUTE, initialRoute)
      state.initialRoute = initialRoute
    },
  },
  actions: {

  }
}

export default sys
