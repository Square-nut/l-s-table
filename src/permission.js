import Vue from 'vue'
import router from '@sys/router'
import store from '@sys/store'
import api from '@sys/axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {INDEX_MAIN_PAGE_PATH,ELEMENTS_AUTH} from '@sys/store/mutation-types'
import { generateAllRouter } from '@sys/utils/router/router'
import {getToken} from "@sys/utils/base/token-util";
import {
    Message
} from "hosui";
//显示进度环
NProgress.configure({ showSpinner: true }) // NProgress Configuration
const loginType=process.env.VUE_APP_LOGIN_TYPE;
const source=process.env.VUE_APP_LOGIN_SOURCE;
const whiteList = ['/login/login', loginType=="oauth"? "/oauth/redirect/"+source:"/login"] // no redirect whitelist

router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    if (getToken()) {
        let isSelect=store.getters.isSelectRole;
        let  roleId=store.getters.roleId;
        let roleData=store.getters.userInfo.roleData;
        if(to.path === '/password'){
            next()
            NProgress.done()
        }else if(to.path === '/role'){
            next()
            NProgress.done()
        }else if (to.path === '/login/login'||(loginType=="oauth"&&(to.path === '/oauth/redirect/'+source))) {
            next({ path: INDEX_MAIN_PAGE_PATH })
            NProgress.done()
        } else if(store.getters.policyErrorCode&&store.getters.policyErrorCode!=""){
          ////如果密码策略的code为空，则不允许登录，跳转到密码修改页面，并且修改完密码后要重新登录
            next({ path: "/password" })
            NProgress.done()
        }else if(isSelect&&!roleId&&(!roleData||roleData.length>1||roleData.length==0)){///如果需要角色选择，则需要跳转到角色选择页面，选择角色
            let queryData=Object.assign({ redirect: to.path },to.query);
            next({ path: "/role", query:queryData })
            /*store.commit('OPEN_DIALOG',{
                component: require('@sys/views/sys/user/change-role/index').default
            })*/
            NProgress.done()
        }else{
            ///如果需要选择角色，并且只有一个角色，则直接进入,将科室id和角色id保存到缓存中
            if(isSelect&&!roleId&&roleData&&roleData.length==1){
                let dataItem=roleData[0];
                ////保存roleId
                store.dispatch("saveOrgId",dataItem.orgId);
                store.dispatch("saveRoleId",dataItem.roleId);
            }
            ////判断是否为空 路由为空时 就的重新加载数据，菜单数据如果为空 也不走这里
            if (store.getters.addRouters&&store.getters.addRouters.length==0) {
                store.dispatch('GetPermissionList').then((data) => {
                    const { allMenus, routers, singleRouters,defaultPageRouter } = data
                    const allRoutes = generateAllRouter(routers, singleRouters,defaultPageRouter)
                    // 添加主界面路由
                    store.dispatch('UpdateAppRouter',  { constRoutes:allRoutes }).then(() => {
                        // 根据roles权限生成可访问的路由表
                        // 动态添加可访问路由表
                        router.addRoutes(store.getters.addRouters)
                        // 执行高级js
                        executeAdvancedJs(to);
                        const redirect = decodeURIComponent(from.query.redirect || to.path)
                        if (to.path === redirect) {
                            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                            next({ ...to, replace: true })
                        } else {
                            // 跳转到目的路由
                            next({ path: redirect })
                        }
                    })
                })
                    .catch(() => {
                        store.dispatch('Logout').then(() => {
                            next({ path: '/login/login', query: { redirect: to.path } })
                        })
                    })
            } else {
                ///查看路由 是否需要加载预制页面，需要的话，加载
                if(to&&to.meta.hasPagePreset){
                    let resourceId=to.meta.resourceId;
                    let param={"rescoureId":resourceId};
                    getElementData(param).then(()=>{
                        if(to.path === '/'){
                            next({path: INDEX_MAIN_PAGE_PATH})
                        }else{
                            // 执行高级js
                            executeAdvancedJs(to);
                            next()
                        }
                    }).catch(error => {
                        if(to.path === '/'){
                            next({path: INDEX_MAIN_PAGE_PATH})
                        }else{
                            // 执行高级js
                            executeAdvancedJs(to);
                            next()
                        }
                    });
                }else{
                    if(to.path === '/'){
                        next({path: INDEX_MAIN_PAGE_PATH})
                    }else{
                        // 执行高级js
                        executeAdvancedJs(to);
                        next()
                    }
                }

            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            if(to.path ==='/login/login' &&  loginType==="oauth"){
                ////获取路径地址，并且重定向到登录页面
                api.request('getOauthUrl', source).then(response => {
                    if (response && response.code == 200) {
                        let url = response.data;
                        //获取返回的访问地址
                        let redirectUri=getQueryString(url,"redirect_uri");
                        //获取返回链接中的域名
                        var reDomain="";
                        if(redirectUri.indexOf("://")!=-1){
                            let str=redirectUri.split("://");
                            if(str[1]){
                                if(str[1].indexOf("/")!=-1){
                                    reDomain=str[1].split("/")[0];
                                }else{
                                    reDomain=str[1];
                                }
                            }
                        }else{
                            reDomain=redirectUri.split("/")[0];
                        }

                        //获取当前访问的域名
                        var domain = window.location.host;
                        //替换链接中的回调地址的域名
                        url=url.replace(reDomain,domain);
                        window.location.href =url;
                    } else {
                        ///提示错误信息
                        Message.error(response.msg);
                    }
                }).catch(error => {
                    console.log(error);
                    Message.error("获取认证平台地址报错，请刷新页面重试");
                })
            }else{
                // 在免登录白名单内,
                // 执行高级js
                executeAdvancedJs(to);
                next()
                NProgress.done()
            }

        } else {
            //记录登陆前访问路由
            store.commit('SET_INITIAL_ROUTE',to.fullPath);
            // 跳转到登录页面
            let path = '/login/login';
            if(loginType==="form"){
                let queryData=Object.assign({ redirect: to.fullPath},to.query);
                next({ path: path, query:queryData })
            }else if(loginType==="oauth"){
                ////获取路径地址，并且重定向到登录页面
                api.request('getOauthUrl', source).then(response => {
                    if (response && response.code == 200) {
                        let url = response.data;
                        //获取返回的访问地址
                        let redirectUri=getQueryString(url,"redirect_uri");
                        //获取返回链接中的域名
                        var reDomain="";
                        if(redirectUri.indexOf("://")!=-1){
                            let str=redirectUri.split("://");
                            if(str[1]){
                                if(str[1].indexOf("/")!=-1){
                                    reDomain=str[1].split("/")[0];
                                }else{
                                    reDomain=str[1];
                                }
                            }
                        }else{
                            reDomain=redirectUri.split("/")[0];
                        }

                        //获取当前访问的域名
                        var domain = window.location.host;
                         //替换链接中的回调地址的域名
                        url=url.replace(reDomain,domain);
                        window.location.href =url;
                    } else {
                        ///提示错误信息
                        Message.error(response.msg);
                    }
                }).catch(error => {
                    console.log(error);
                    Message.error("获取认证平台地址报错，请刷新页面重试");
                })
            }

            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})
function  getQueryString(url,name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = url.match(reg);
    if (r != null) {
    return unescape(r[2]);
}
return null;
}
function executeAdvancedJs(route){
    if(route.meta.advancedJs){
        eval(route.meta.advancedJs)
        // console.log('执行高级js,结果为:',eval(route.meta.advancedJs));
    }
}
function  getElementData(param) {
    return new Promise((resolve,reject) => {
        api.request('elementAuthList',param).then(response => {
            if(response&&response.code=="200"){
                sessionStorage.setItem(ELEMENTS_AUTH, JSON.stringify(response.data));
                resolve();
            }
        }).catch(error => {
            console.log("获取预制页面预算数据报错");
            reject();
        });
    });

}
/*function getElementData(to) {
    if(to&&to.meta.hasPagePreset){
        let resourceId=to.meta.resourceId;
        let param={"rescoureId":resourceId};
        api.request('elementAuthList',param).then(response => {
            if(response&&response.code=="200"){
                sessionStorage.setItem("ELEMENTS_AUTH", JSON.stringify(response.data));
            }
        }).catch(error => {
            console.log("获取预制页面预算数据报错");
        });
    }
}*/
