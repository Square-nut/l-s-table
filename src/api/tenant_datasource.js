
//根据实体属性条件分页查询
export const selectPage = (params) => {
    return {
        url: '/datasource/select-page',
        method: 'get',
        params: params
    }
}

// 删除
export const deletedatasource = (param) => {
   console.log(param);
    return {
        url: '/datasource/deletion',
        method: 'post',
        params: param
    }
}

// 保存实体
export const insert = (data) => {
    return {
        url: '/datasource/insert',
        method: 'post',
        data: data
    }
}
//根据实体属性条件分页查询
export const getAlldatasource = (params) => {
    return {
        url: '/datasource/select-page',
        method: 'get',
        params: params
    }
}
// 更新数据源信息
export const update = (data) => {
    return {
        url: '/datasource/update',
        method: 'post',
        data: data
    }
}
// 根据Id获取数据源
export const getById = (id) => {
    return {
        url: '/datasource/' + id,
        method: 'get',
        params: {
            id: id
        }
    }
}

