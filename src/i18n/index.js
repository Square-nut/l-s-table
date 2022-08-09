// 如果使用模块系统 (例如通过 vue-cli)，则需要导入 Vue 和 VueI18n ，然后调用 Vue.use(VueI18n)。
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './langs'
Vue.use(VueI18n)

// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
	locale: 'zh', // 设置地区
	messages, // 设置地区信息
})

// i18n.locale('en') 修改语言

// 根据浏览器语言设置程序语言
function locale() {
	let browserLang = navigator.language || navigator.browserLanguage
	if (browserLang.toLowerCase().indexOf('zh') > -1) {
		return 'zh'
	} else {
		return 'en'
	}
}

// 现在应用程序已经准备好了

export default i18n
