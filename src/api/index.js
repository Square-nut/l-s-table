
/**
 * 登录
 */
export const login = (params) => {
  return {
    url: '/auth/token',
    method: 'post',
    params: params
  }
}

///获取验证码

export const getCaptcha = (params) => {
  return {
    url: '/auth/captcha',
    method: 'get'
  }
}

/**
 * 获取资源权限
 */
export const listMenu = () => {
  return {
    url: '/sys/resources/list-menu',
    ////url: '/sys/resources/list-all-menu',
    method: 'get',
  }
}

/**
 * 获取预制页面权限数据
 */
export const elementAuthList = (params) => {
  return {
    url: '/sys/page-preset/column-perm/list-perm',
    method: 'get',
    params: params

  }
}

/**
 * 用户登录成功之后加载的配置信息
 * @returns 
 */
export const listConfig=()=>{
  return {
    url :"/sys/config/select-init",
    method:'get'
  }
}

////获取登录前的一些数据
export const getPreLoginData = (params) => {
  return {
    url: '/auth/pre-auth-data',
    method: 'get',
    params:params
  }
}
export const getOauthUrl = (source) => {
  return {
    url: `/social-auth/oauth/render/${source}`,
    method: 'get'
  }
}

///获取动态口令的编码
export const getOTPCode = (params) => {
  return {
    url: '/otp-auth/otp-code',
    method: 'get',
    params:params
  }
}


// 退出方法
export function logout() {
  return {
    url: '/auth-logout',
    method: 'post',
  }
}

// 退出方法
export function getTenant() {
  return {
    url: '/tenant/select-tenant',
    method: 'get',
  }
}