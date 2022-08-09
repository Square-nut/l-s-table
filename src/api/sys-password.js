
export const searchAll = (params) => {
    return {
        url: '/sys/password-policy/select-all',
        method: 'get',
        params: params
    }
}

export const updatePolicy = (data) => {
    return {
        url: '/sys/password-policy/update',
        method: 'post',
        data: data
    }
}
// 验证密码是否正确
export const validateOldPassword = (params) => {
    return {
        url: '/sys/user/check-password',
        method: 'get',
        params: params
    }
}
// 验证密码策略是否符合要求
export const validatePolicy = (params) => {
    return {
        url: '/sys/user/check-password-complex',
        method: 'get',
        params: params
    }
}
// 修改密码
export const changePassword = (params) => {
    return {
        url: '/sys/user/update-password',
        method: 'post',
        data: params
    }
}

export const getPwdPolicy = () => {
    return {
        url: "/sys/password-policy/select-password-complex",
        method: 'get'
    }
}

export const useLastPwd = () => {
    return {
        url: '/sys/user/continue-password',
        method: 'post'
    }
}