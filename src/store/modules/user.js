import Vue from 'vue'
import {
    USER_AUTH,
    ELEMENTS_AUTH,
    CACHE_INCLUDED_ROUTES,
} from "@sys/store/mutation-types"
import api from '@sys/axios'
import {getMenusAndRouter} from '@sys/utils/router/router'
import * as storageUtil from "@sys/utils/base/storage-util";
import * as tokenUtil from "@sys/utils/base/token-util";
import * as userStoreUtil from "@sys/utils/base/user-store-util";
import { getQueryString, getTopUrl } from "@sys/utils/base/base-util";
const user = {
    state: {
        accessToken: '',
        refreshToken: '',
        loginName: '',
        name: '',
        tenantId: '',
        avatar: '',
        menuList: [],
        dropDownMenus: [],
        roleId: "",
        orgId: "",
        userInfo: null,
        baseUserOrgRole: "",
        defaultPageData: null,
        isSelectRole: false,
        policyErrorCode: "",
        baseScopeResource: false,
    },

    mutations: {
        SET_ACCESS_TOKEN: (state, accessToken) => {
            state.accessToken = accessToken
        },
        SET_REFRESH_TOKEN: (state, refreshToken) => {
            state.refreshToken = refreshToken
        },
        SET_NAME: (state, {loginName, name}) => {
            state.loginName = loginName
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_MENU_LIST: (state, menuList) => {
            state.menuList = menuList
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo
        },
        SET_TENANT: (state, id) => {
            state.tenantId = id
        },
        SET_DROP_DOWN_MENUS: (state, dropDownMenus) => {
            state.dropDownMenus = dropDownMenus
        },
        SET_DEFAULT_PAGE_DATA: (state, data) => {
            state.defaultPageData = data
        },
        SET_BASE_USER_ORG_ROLE: (state, data) => {
            state.baseUserOrgRole = data
        },
        SET_ROLE_ID: (state, id) => {
            state.roleId = id
        },
        SET_ORG_ID: (state, id) => {
            state.orgId = id
        },
        SET_IS_SELECT_ROLE: (state, isSelectRole) => {
            state.isSelectRole = isSelectRole;
        },
        SET_POLICY_ERROR_CODE: (state, policyErrorCode) => {
            state.policyErrorCode = policyErrorCode;
        }
    },

    actions: {
        // 登录
        Login({commit}, loginForm) {
            return new Promise((resolve, reject) => {
                let headers = {};
                ///验证码模式或者动态口令模式
                if (loginForm.grantType == "captcha" || loginForm.grantType == "otp") {
                    ///经heazder放入
                    headers["captcha-key"] = loginForm.captchaUUID;
                    headers["captcha-code"] = loginForm.captchaCode;
                }
                if (loginForm.selectRoleId != "" && loginForm.selectRoleId != undefined && loginForm.selectRoleId != null) {
                    ///角色和科室 关联
                    if (loginForm.selectRoleId.indexOf("^") > -1) {
                        headers["role-id"] = loginForm.selectRoleId.split("^")[0];
                        headers["org-id"] = loginForm.selectRoleId.split("^")[1];
                    } else {
                        headers["role-id"] = loginForm.selectRoleId;
                    }

                }
                api.request('login', loginForm, headers).then(response => {
                    if (response.code == '200') {
                        const result = response.data;
                        ///用户基础信息
                        const hosUser = result.hosUser;
                        ///用户扩展信息
                        const detail = result.detail;
                        ///将用户信息合并成userinfo保存
                        const userInfo = Object.assign(hosUser, detail);
                        //全部封装到用户信息中放到localstorage中
                        tokenUtil.setToken(result.accessToken);
                        tokenUtil.setRefreshToken(result.refreshToken);
                        ///其他信息直接使用缓存类去保存
                        userStoreUtil.setTenantId(userInfo.tenantId);
                        userStoreUtil.setLoginName(userInfo.loginName);
                        userStoreUtil.setUserInfo(userInfo);
                        userStoreUtil.setAvatar(userInfo.avatar);
                        userStoreUtil.setPolicyErrorCode(userInfo.policyErrorCode)
                        ///是否选择角色
                        //storageUtil.setLocal("select-role", userInfo.isSelectRole);
                        //storageUtil.setLocal(TENANT_ID, userInfo.tenantId);
                        //storageUtil.setLocal(LOGIN_NAME, userInfo.loginName);
                        //storageUtil.setLocal(USER_INFO, userInfo);
                        ///放到store中
                        commit('SET_ACCESS_TOKEN', result.accessToken);
                        commit('SET_REFRESH_TOKEN', result.refreshToken);
                        commit('SET_USER_INFO', userInfo);//用户信息

                        ///后用户名、姓名
                        commit('SET_NAME', {loginName: userInfo.loginName, name: userInfo.name});
                        commit('SET_AVATAR', userInfo.avatar); ///头像
                        commit('SET_TENANT', userInfo.tenantId);////租户id
                        commit('SET_DEFAULT_PAGE_DATA', userInfo.defaultPageData);///默认显示的页面
                        commit('SET_BASE_USER_ORG_ROLE', userInfo.baseUserOrgRole);
                        //commit('SET_ROLE_ID',userInfo.roleId);
                        //commit('SET_ORG_ID',userInfo.orgId);
                        commit('SET_IS_SELECT_ROLE', userInfo.isSelectRole);
                        commit('SET_POLICY_ERROR_CODE', userInfo.policyErrorCode);
                        //storageUtil.setLocal("org-id", userInfo.orgId);
                        //storageUtil.setLocal("role-id", userInfo.roleId);
                        ///处理下角色数据，如果以前登录过，并且角色选择了，
                        resolve(response)
                    } else {
                        reject(response)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户信息
        GetPermissionList({commit}) {
            return new Promise((resolve, reject) => {
                api.request('listMenu').then(response => {
                    if (!response.data) {
                        console.log('getPermissionList: permissions must be a non-null array !')
                        reject('getPermissionList: permissions must be a non-null array !')
                    }
                    commit('SET_DEFAULT_PAGE_DATA', response.data.index);///默认显示的页面
                    const menuData = response.data.menus;
                    menuData.forEach(el => {
                        el.oneMenu = true
                        return el
                    });
                    const elementsAuth = response.data.elements;
                    if (menuData) {
                        //权限放入sessionStorage里
                        sessionStorage.setItem(USER_AUTH, JSON.stringify(menuData));
                        //sessionStorage.setItem(ELEMENTS_AUTH, JSON.stringify(elementsAuth));

                        //权限列表转为菜单路由
                        let singleRouterList = [];
                        let routers = [];
                        //下拉菜单
                        let dropDownMenus = [];
                        ///默认默认登录数据
                        /*let defaultPageData=store.getters.defaultPageData;
                         */
                        let defaultPageRouter=[];
                        let allMenus = getMenusAndRouter(menuData, routers, singleRouterList, dropDownMenus,defaultPageRouter);
                        console.log("------------", dropDownMenus)
                        commit('SET_DROP_DOWN_MENUS', dropDownMenus)

                        // Vue.ls.set(USER_AUTH, menuList, 7 * 24 * 60 * 60 * 1000)
                        commit('SET_MENU_LIST', allMenus)

                        let resolveData = {
                            'allMenus': allMenus,
                            'routers': routers,
                            'singleRouters': singleRouterList,
                            "defaultPageRouter":defaultPageRouter
                        }
                        resolve(resolveData)
                    } else {
                        reject('getPermissionList: permissions must be a non-null array !')
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        Logout({commit, state}) {
            return new Promise((resolve, reject) => {
                /*  let logoutToken = state.token;
                  let headers={};
                  headers[ACCESS_TOKEN]=logoutToken;*/
                api.request('logout').then(response => {
                    commit('SET_ACCESS_TOKEN', '')
                    commit('SET_REFRESH_TOKEN', '')
                    commit('SET_MENU_LIST', [])
                    commit('SET_USER_INFO', {})
                    commit('SET_NAME', '', '')
                    commit('SET_AVATAR', '')
                    commit('SET_ORG_ID', '')
                    commit('SET_ROLE_ID', '')
                    tokenUtil.removeAllToken();
                    userStoreUtil.removeAllUserStore();
                    storageUtil.removeLocal(CACHE_INCLUDED_ROUTES);
                    let loginType=process.env.VUE_APP_LOGIN_TYPE;
                    let url=process.env.VUE_APP_LOGIN_OAUTH_SERVER_URL;
                    if (loginType === 'oauth'){
                        // 向认证服务器发送注销请求
                        url= url + '?service=' +window.location.protocol+"//"+window.location.host;
                        location.href = url;
                    }else{
                        resolve();
                    }
                }).catch(error => {
                    reject(error)
                });
                ////
                // logout(logoutToken).then(() => {
                //     if (process.env.VUE_APP_SSO == 'true') {
                //         let sevice = 'http://' + window.location.host + '/'
                //         let serviceUrl = encodeURIComponent(sevice)
                //         window.location.href = process.env.VUE_APP_CAS_BASE_URL + '/logout?service=' + serviceUrl
                //     }
                //     resolve()
                // }).catch(() => {
                //     resolve()
                // })
            })
        },
        frontLogout({commit}) {
            return new Promise((resolve) => {
                commit('SET_ACCESS_TOKEN', '')
                commit('SET_REFRESH_TOKEN', '')
                commit('SET_MENU_LIST', [])
                commit('SET_USER_INFO', {})
                commit('SET_NAME', '', '')
                commit('SET_AVATAR', '')
                commit('SET_ORG_ID', '')
                commit('SET_ROLE_ID', '')
                tokenUtil.removeAllToken();
                userStoreUtil.removeAllUserStore();
                storageUtil.removeLocal(CACHE_INCLUDED_ROUTES);
                ////一般用于token过期的时候才会调用，跳转到登录页面，如果是auth2的方式，则就需要去统一认证去退出
                let loginType=process.env.VUE_APP_LOGIN_TYPE;
                let url=process.env.VUE_APP_LOGIN_OAUTH_SERVER_URL;
                if (loginType === 'oauth'){
                    // 向认证服务器发送注销请求
                    url= url + '?service=' +window.location.protocol+"//"+window.location.host;
                    location.href = url;
                }else{
                    resolve();
                }
                //
            });
        },
        saveTenant({commit}, id) {
            userStoreUtil.setTenantId(id);
            commit('SET_TENANT', id)
        },
        saveOrgId({commit}, id) {
            storageUtil.setLocal("org-id", id);
            commit('SET_ORG_ID', id)
        },
        saveRoleId({commit}, id) {
            storageUtil.setLocal("role-id", id);
            commit('SET_ROLE_ID', id)
        },
        saveName({commit}, name) {
            userStoreUtil.setName(name);
            commit('SET_NAME', name);
        },///保存用户头像，用于后期用户信息更新后，更新用户的头像
        saveAvatar({commit}, avatar) {
            userStoreUtil.setAvatar(avatar);
            commit('SET_AVATAR', avatar);
        },
        saveMenuList({commit}, menu) {
            commit('SET_MENU_LIST', menu);
        },
        setDropDownMenu({commit}, menu) {
            commit('SET_DROP_DOWN_MENUS', menu);
        },
       setPoliceCode({commit}, errorCode) {
           userStoreUtil.setPolicyErrorCode(errorCode)
           commit('SET_POLICY_ERROR_CODE', errorCode);

        }


    }
}

export default user
