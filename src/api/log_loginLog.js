//根据实体属性条件分页查询
export const selectPage = (params) => {
    return {
        url: '/monitor/login-log/select-page',
        method: 'get',
        params: params
    }
}

// 审核
export const examine = (param) => {
   console.log(param);
    return {
        url: '/monitor/login-log/examine',
        method: 'post',
        params: param
    }
}

// 清空日志
export const emptyLog = (data) => {
    return {
        url: '/monitor/login-log/emptyLog',
        method: 'post',
        data: data
    }
}

// 审核保存
export const saveExamine = (data) => {
    return {
        url: '/monitor/log_examine/examine',
        method: 'post',
        data: data
    }
}

