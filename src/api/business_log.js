//根据实体属性条件分页查询
export const selectPage = (params) => {
    return {
        url: '/monitor/bussiness-log/select-page',
        method: 'get',
        params: params
    }
}

//生命周期
export const timeLineData = (params) => {
    return {
        url: '/monitor/bussiness-log/time-line',
        method: 'get',
        params: {
            businessId: params.businessId,
            tableName: params.tableName
        }
    }
}

