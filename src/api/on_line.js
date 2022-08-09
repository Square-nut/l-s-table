//根据实体属性条件分页查询
export const selectPage = (params) => {
    return {
        url: '/monitor/online-user/list',
        method: 'get',
        params: params
    }
}

// 下线
export const kick = (param) => {
    return {
        url: '/monitor/online-user/kick',
        method: 'post',
        data: param
    }
}

