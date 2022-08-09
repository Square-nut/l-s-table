import { LoginLayout, TabLayout,RouteView,BlankLayout } from '@components/layouts'
import i18n from "../i18n/index";
import {bizConstantRouterMap, bizConstantMenuMap} from "@/router/index";
/**
 * 走菜单，走权限控制
 * @type {[null,null]}
 */
export const asyncRouterMap = [

  {
    path: '/',
    name: 'dashboard',
    component: TabLayout,
    meta: { title: '首页' },
    redirect: '/main/welcome',
    children: []
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/login',
    component: LoginLayout,
    redirect: '/login/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@sys/views/login/index')
      },
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@sys/views/exception/404')
  },
  ,
  {
    path: '/403',
    component: () => import(/* webpackChunkName: "fail" */ '@sys/views/exception/403')
  },
  {
    path: '/role',
    component: () => import(/* webpackChunkName: "fail" */ '@sys/views/sys/user/change-role/index')
  },
  {
    path: '/password',
    component: () => import(/* webpackChunkName: "fail" */ '@sys/views/sys/user/modify-password/index')
  },
  {
    path: process.env.VUE_APP_LOGIN_TYPE=="oauth"?'/oauth/redirect'+"/"+process.env.VUE_APP_LOGIN_SOURCE:"",
    component: () => import(/* webpackChunkName: "fail" */ '@sys/views/login/callback')
  },
  {
    path: '/base-monitor-business-log',
    component: TabLayout,
    redirect: '/base-monitor-business-log/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'index',
        meta: { title: i18n.t("operation.bizLog") },
        component: () => import('@components/business-log/index')
      },
    ]
  },
  //分配用户的默认路由
  {
    path: '/base-perm-role-assign-user',
    component: TabLayout,
    redirect: '/base-perm-role-assign-user/assignUserIndex',
    hidden: true,
    children: [
      {
        path: 'assignUserIndex',
        name: 'assignUserIndex',
        meta: { title: i18n.t("role.assignUser") },
        component: () => import('@sys/views/perm/role/assign-user')
      },
    ]
  },
  {
    path: "/base-sys-expand-design",
    component: TabLayout,
    redirect: '/base-sys-expand-design/design-index',
    hidden: true,
    children: [
      {
        path: "design-index",
        name: "design-index",
        meta: {title: i18n.t('expand.design')},
        component: () => import('@sys/views/sys/expand/design-index')
      }
    ]
  },
  {
    path: "/base-sys-expand-field",
    component: TabLayout,
    redirect: '/base-sys-expand-field/field-index',
    hidden: true,
    children: [
      {
        path: "field-index",
        name: "field-index",
        meta: {title: i18n.t('expand.expand')},
        component: () => import('@sys/views/sys/expand/field-index')
      }
    ]
  },
  // 页面元素的静态路由
  {
    path: "/base-sys-page-element",
    component: TabLayout,
    redirect: '/base-sys-page-element/element',
    hidden: true,
    children: [
      {
        path: "element",
        name: "element",
        meta: {title: i18n.t('page.meta')},
        component: () => import('@sys/views/sys/page-pre/element.vue')
      }
    ]
  },

  //  业务静态路由
  ...bizConstantRouterMap
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantMenuMap = [

    // 业务静态菜单路由
    ...bizConstantMenuMap
]
