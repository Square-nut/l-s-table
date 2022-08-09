import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@sys/router/router.config'

Vue.use(Router)

// 处理重复跳转报错提示
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})
