//根据实体属性条件分页查询
export const selectPage = (params) => {
    return {
        url: '/monitor/oper-log/select-page',
        method: 'get',
        params: params
    }
}

// 审核
export const examine = (param) => {
   console.log(param);
    return {
        url: '/monitor/oper-log/examine',
        method: 'post',
        params: param
    }
}

// 清空日志
export const emptyLog = (data) => {
    return {
        url: '/monitor/oper-log/emptyLog',
        method: 'post',
        data: data
    }
}

