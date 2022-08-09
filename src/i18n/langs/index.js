import zh from './zh'
import en from './en'

// biz i18n
import bizI18n from '@/i18n'

// 把 biz i18n 放到国际化的biz下
zh.biz = bizI18n['zh']
en.biz = bizI18n['en']
// 准备翻译的语言环境信息
export default {
	zh,
	en,
}
