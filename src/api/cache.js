//根据实体属性条件分页查询
export const selectPage = (params) => {
    return {
        url: '/monitor/cache/list',
        method: 'get',
        params: params
    }
}

// 审核
export const clear = (param) => {
    console.log(param);
    return {
        url: '/monitor/cache/clear',
        method: 'post',
        params: param
    }
}

