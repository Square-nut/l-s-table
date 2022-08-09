import Vue from 'vue'
import cryptUtil from '@sys/utils/crypt/index'
import cy from '@sys/utils/crypt/aes-md5-crypt'
import {getToken,getRefreshToken} from "@sys/utils/base/token-util";
import {getOrgId,getRoleId} from "@sys/utils/base/user-store-util";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "@sys/store/mutation-types"
import AuthConstant from "@sys/constant/auth-constant";
import Constant from "@sys/constant/common-constant";
import UserConstant from "@sys/constant/user-constant";
import store from '@sys/store'
import * as tokenUtil from "@sys/utils/base/token-util";
import {
	Message
} from "hosui";
// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requestQueue = [];
export class Interceptors {
  constructor(instance) {
    this.instance = instance
    // 初始化拦截器
    this.initInterceptors();
  }
  getInterceptors() {
    return this.instance;
  }
  initInterceptors() {
	  let service=this.getInterceptors();
	  let that=this;
    // 请求拦截器
    this.instance.interceptors.request.use(
    	function (config) {
				// 在发送请求之前做些什么，比如：
				// config.withCredentials = true;
			    ////放入访问令牌
			 	config.headers.common[ACCESS_TOKEN] = getToken();
				if (getToken()) {
					config.headers[ACCESS_TOKEN] = getToken();
				}
				///租户的数据
				// if (store.getters && store.getters.tenantId) {
				// 	if (!config.params) {
				// 		config.params = {};
				// 	}
				// 	config.params.tenantId = store.getters.tenantId;
				// }
				if(getOrgId()){
					config.headers[UserConstant.orgId] = getOrgId();
				}
			    if(getRoleId()){
				   config.headers[UserConstant.roleId] = getRoleId();
			    }
				// config.withCredentials = true
				if (process.env.VUE_APP_GLOBAL_SIGN === "1" || config.needSign) {
					config = cy.encryptMD5(config)
				}
				return config
			},
		function (error) {
				// 对请求错误做些什么
				return Promise.reject(error)
			}
		)
	  // 添加响应拦截器
	  this.instance.interceptors.response.use(
			function (response) {
				// 对响应数据做点什么
				const config = response.config;
				if (response.data) {
				  if (process.env.VUE_APP_GLOBAL_DECRYPT==='1' || response.config.needDecrypt) {
					let str = response.data.data
					if(str){
						response.data.data = JSON.parse(cryptUtil.decrypt(str));
					  // if (process.env.VUE_APP_CRYPT_TYPE === "aes") {
					  //   response.data.data = JSON.parse(cy.decryptAES(str))
					  // } else if (process.env.VUE_APP_CRYPT_TYPE === "sm4") {
					  //   response.data.data = JSON.parse(sm4.decryptSM(str))
					  // }else if (process.env.VUE_APP_CRYPT_TYPE === "rsa") {
					  //   response.data.data = JSON.parse(rsa.decryptRSA(str))
					  // }
					}
				  }
				}
				// 与后端约定
				if (response.data.code == Constant.httpCode.OK) {
					return response.data;
				}else ///如果返货4001错误，代表是token失效了，需要调用刷新token重新获取token
				if (response.data.code === AuthConstant.tokenErrorCode) {
					// accessToken过期（4001是自定义的，需要与后端配合）
					const config = response.config;
					if (!isRefreshing) {
						isRefreshing = true;
						let loginForm= {
							grantType: REFRESH_TOKEN,
							refreshToken:getRefreshToken()
						};
						return store.dispatch("Login", loginForm)
							.then((res) => {
								// 已经刷新了token，将所有队列中的请求进行重试
								requestQueue.forEach(cb => cb());
								// 重试完清空这个队列
								requestQueue = [];
								return service(config);
							})
							.catch((error) => {
								Message.warning(`登录状态已过期...`);
								store.dispatch("frontLogout").then(() => {
									location.href = "/";
								});
							})
							.finally(() => {
								isRefreshing = false;
							});
					} else {
						// 正在刷新token，将返回一个未执行resolve的promise
						return new Promise(resolve => {
							// 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
							requestQueue.push(() => {
								resolve(service(config));
							});
						});
					}
					///未授权 4000错误
				}else if(response.data.code == AuthConstant.tokenNotFondCode){
					Message.warning(`请先登录系统`);
					///跳转到登录页面
					store.dispatch("frontLogout").then(() => {
						location.href = "/";
					});
					return Promise.reject(response.data);
				}else if(response.data.code == AuthConstant.twoAuthErrorCode){///这是二次认证的错误，
					////将一些数据放到 response的data中
					response.data.uuid=response.headers["two-auth-uuid"];
					response.data.authType=response.headers["two-auth-type"];
				}
				return response.data;
			},
			function (error) {
				// 对响应
				if(error&&error.response){
					that.errorHandle(error);
				}
				return Promise.reject(error)
			}
		)
	}
	/**
	 * http握手错误
	 * @param res  响应回调,根据不同响应进行不同操作
	 */
	errorHandle(error) {
		let res=error.response.data;
		///请求状态吗或者业务吗
		let code=res.status;
		const msg = res.message;
		const msginfo = res.msg;
		// 状态码判断
		switch (code) {
			case Constant.httpCode.BAD_REQUEST:
				Message.error(`请求参数有问题${msg}`);
				break;
			case Constant.httpCode.UNAUTHORIZED:
				Message.warning(`请先登录系统`);
				///跳转到登录页面
				store.dispatch("frontLogout").then(() => {
					location.href = "/";
				});
				break
			case Constant.httpCode.NOT_PERMISSION:
				Message.warning(`403没有权限访问资源${msg}`);
				break
			case Constant.httpCode.NOT_FOUND:
				Message.error(`[404没有该资源]${msg}`);
				break
			default:
				if (error.message.indexOf("timeout") !== -1) {
					Message.error("系统接口请求超时");
				} else if (error.message === "Network Error") {
					Message.error("后端接口连接异常");
				}else if(msginfo && msginfo.includes("Full authentication is required to access this resource")){
					//token为空或者被恶意修改，清空缓存，
					tokenUtil.removeAllToken();
					location.href = "/";
				}else if (!msg && error.message.includes("Request failed with status code")) {
					Message.error(
						"系统接口" + error.message.substr(error.message.length - 3) + "异常"
					);
				} else {
					if (msg) {
						Message.error(msg);
					} else {
						Message.error("接口路径找不到");
					}
				}
		}
		return Promise.reject(error.response.data);
	}
}
