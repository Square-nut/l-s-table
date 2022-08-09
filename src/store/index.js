import Vue from 'vue'
import Vuex from 'vuex'
// import state from './state'
// import mutations from './mutations'
import modules from './modules'
// import uiStore from '../ui/extends/store'
import getters from './getter'

const store = {
  // state: uiStore.state,
  // mutations: uiStore.mutations,
	modules,
	getters
}

Vue.use(Vuex)

export default new Vuex.Store(store)
