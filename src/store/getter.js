import Vue from 'vue'
import * as storageUtil from "@sys/utils/base/storage-util";
import * as userStoreUtil from "@sys/utils/base/user-store-util";
import * as tokenUtil from "@sys/utils/base/token-util";
import {validatenull}  from "@sys/utils/base/base-validate";

const getters = {
    token: state => state.user.token || tokenUtil.getToken(),
    refreshToken:state => state.user.refreshToken || tokenUtil.getRefreshToken(),
    tenantId:state => state.user.tenantId || userStoreUtil.getTenantId(),
    avatar: state => {
        return state.user.avatar ||userStoreUtil.getAvatar();
    },
    defaultPageData: state => {
        return state.user.defaultPageData || userStoreUtil.getUserInfo().defaultPageData ||{};
    },
    loginName: state => state.user.loginName || userStoreUtil.getLoginName(),
    name: state => state.user.name || userStoreUtil.getName(),
    ////这个是菜单数据，每次刷新页面都需要刷新，不走localstorage
    menuList: state => state.user.menuList,
    userInfo: state => {
        return state.user.userInfo || userStoreUtil.getUserInfo()||{}
    },
    roleId:state =>{
        let roleId=state.user.roleId;
        if(!roleId){
            let id=userStoreUtil.getRoleId();
            state.user.roleId=id;
        }
        return state.user.roleId;
    },
    orgId:state =>{
        let orgId=state.user.orgId;
        if(!orgId){
            let id=userStoreUtil.getOrgId();
            state.user.orgId=id;
        }
        return state.user.orgId;
    },
    isSelectRole:state =>{
        if(userStoreUtil.getUserInfo()&&!validatenull(userStoreUtil.getUserInfo().isSelectRole)){
            return userStoreUtil.getUserInfo().isSelectRole;
        }else{
            return state.user.isSelectRole;
        }
        return state.user.isSelectRole;
    },
    baseUserOrgRole:state =>{
        let baseUserOrgRole=state.user.baseUserOrgRole;
        if(!baseUserOrgRole){
            let value=userStoreUtil.getUserInfo().baseUserOrgRole;
            state.user.baseUserOrgRole=value;
        }
        return state.user.baseUserOrgRole;
    },
    policyErrorCode:state => state.user.policyErrorCode || userStoreUtil.getPolicyErrorCode(),
    baseScopeResource:state => {
        if(userStoreUtil.getUserInfo()&&!validatenull(userStoreUtil.getUserInfo().baseScopeResource)){
             return userStoreUtil.getUserInfo().baseScopeResource;
        }else{
            return state.user.baseScopeResource;
        }
    },
    addRouters: state => state.permission.addRouters,
}

export default getters

