import Vue from 'vue'
import Http from './http'

Vue.use(Http)

const api = new Http({
	debug: false,
	baseURL: process.env.VUE_APP_BASE_URL,
	timeout: process.env.VUE_APP_TIME_OUT,
	cache: false,
	emulateJSON: false,
	showLoading: false,
})


export default api
