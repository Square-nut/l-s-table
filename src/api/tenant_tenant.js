
// 获取所有租户
export const getTenant = (params) => {
    return {
        url: '/tenant/select-all',
        method: 'get',
    }
}
// 删除
export const deleteTenant = (id) => {
    return {
        url: '/tenant/deletion',
        method: 'post',
        params: id
    }
}
// 保存实体
export const insert = (data) => {
    return {
        url: '/tenant/insert',
        method: 'post',
        data: data
    }
}
//根据实体属性条件分页查询
export const getAllTenant = (params) => {
    return {
        url: '/tenant/select-page',
        method: 'get',
        params: params
    }
}
// 更新租户信息
export const update = (data) => {
    return {
        url: '/tenant/update',
        method: 'post',
        data: data
    }
}
// 根据Id获取租户
export const getById = (id) => {
    return {
        url: '/tenant/' + id,
        method: 'get',
        params: {
            id: id
        }
    }
}
// 更新租户状态
export const updateActived = (params) => {
    return {
        url: '/tenant/update-actived',
        method: 'post',
        params: params
    }
}
// 验证表单
export const validator = (params) => {
    return {
        url: '/tenant/validate-domain',
        method: "post",
        params: params
    }
}


export const initData = (params) => {
    return {
        url: '/tenant/init-data',
        method: "get",
        params: params
    }
}

// 查询所有可用的数据源
export const sourceData = () => {
    return {
        url: '/datasource/select-all',
        method: 'get'
    }
}

// 校验电话号码
export const validPhone = (params) => {
    return {
        url: '/tenant/validate-tel',
        method: 'post',
        params: params
    }
}

// 保存数据源
export const saveDataSource = (params) => {
    return {
        url: '/tenant/tenant-link-datasource',
        method: 'post',
        params: params
    }
}