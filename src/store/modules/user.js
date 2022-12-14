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
        // ??????
        Login({commit}, loginForm) {
            return new Promise((resolve, reject) => {
                let headers = {};
                ///???????????????????????????????????????
                if (loginForm.grantType == "captcha" || loginForm.grantType == "otp") {
                    ///???heazder??????
                    headers["captcha-key"] = loginForm.captchaUUID;
                    headers["captcha-code"] = loginForm.captchaCode;
                }
                if (loginForm.selectRoleId != "" && loginForm.selectRoleId != undefined && loginForm.selectRoleId != null) {
                    ///??????????????? ??????
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
                        ///??????????????????
                        const hosUser = result.hosUser;
                        ///??????????????????
                        const detail = result.detail;
                        ///????????????????????????userinfo??????
                        const userInfo = Object.assign(hosUser, detail);
                        //????????????????????????????????????localstorage???
                        tokenUtil.setToken(result.accessToken);
                        tokenUtil.setRefreshToken(result.refreshToken);
                        ///??????????????????????????????????????????
                        userStoreUtil.setTenantId(userInfo.tenantId);
                        userStoreUtil.setLoginName(userInfo.loginName);
                        userStoreUtil.setUserInfo(userInfo);
                        userStoreUtil.setAvatar(userInfo.avatar);
                        userStoreUtil.setPolicyErrorCode(userInfo.policyErrorCode)
                        ///??????????????????
                        //storageUtil.setLocal("select-role", userInfo.isSelectRole);
                        //storageUtil.setLocal(TENANT_ID, userInfo.tenantId);
                        //storageUtil.setLocal(LOGIN_NAME, userInfo.loginName);
                        //storageUtil.setLocal(USER_INFO, userInfo);
                        ///??????store???
                        commit('SET_ACCESS_TOKEN', result.accessToken);
                        commit('SET_REFRESH_TOKEN', result.refreshToken);
                        commit('SET_USER_INFO', userInfo);//????????????

                        ///?????????????????????
                        commit('SET_NAME', {loginName: userInfo.loginName, name: userInfo.name});
                        commit('SET_AVATAR', userInfo.avatar); ///??????
                        commit('SET_TENANT', userInfo.tenantId);////??????id
                        commit('SET_DEFAULT_PAGE_DATA', userInfo.defaultPageData);///?????????????????????
                        commit('SET_BASE_USER_ORG_ROLE', userInfo.baseUserOrgRole);
                        //commit('SET_ROLE_ID',userInfo.roleId);
                        //commit('SET_ORG_ID',userInfo.orgId);
                        commit('SET_IS_SELECT_ROLE', userInfo.isSelectRole);
                        commit('SET_POLICY_ERROR_CODE', userInfo.policyErrorCode);
                        //storageUtil.setLocal("org-id", userInfo.orgId);
                        //storageUtil.setLocal("role-id", userInfo.roleId);
                        ///????????????????????????????????????????????????????????????????????????
                        resolve(response)
                    } else {
                        reject(response)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // ??????????????????
        GetPermissionList({commit}) {
            return new Promise((resolve, reject) => {
                api.request('listMenu').then(response => {
                    if (!response.data) {
                        console.log('getPermissionList: permissions must be a non-null array !')
                        reject('getPermissionList: permissions must be a non-null array !')
                    }
                    commit('SET_DEFAULT_PAGE_DATA', response.data.index);///?????????????????????
                    const menuData = response.data.menus;
                    menuData.forEach(el => {
                        el.oneMenu = true
                        return el
                    });
                    const elementsAuth = response.data.elements;
                    if (menuData) {
                        //????????????sessionStorage???
                        sessionStorage.setItem(USER_AUTH, JSON.stringify(menuData));
                        //sessionStorage.setItem(ELEMENTS_AUTH, JSON.stringify(elementsAuth));

                        //??????????????????????????????
                        let singleRouterList = [];
                        let routers = [];
                        //????????????
                        let dropDownMenus = [];
                        ///????????????????????????
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

        // ??????
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
                        // ????????????????????????????????????
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
                ////????????????token???????????????????????????????????????????????????????????????auth2????????????????????????????????????????????????
                let loginType=process.env.VUE_APP_LOGIN_TYPE;
                let url=process.env.VUE_APP_LOGIN_OAUTH_SERVER_URL;
                if (loginType === 'oauth'){
                    // ????????????????????????????????????
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
        },///??????????????????????????????????????????????????????????????????????????????
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
