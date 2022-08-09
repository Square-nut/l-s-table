
// 查询表格
export const selectPage = (params) => {
    return {
        url: '/tenant/tenant-package/select-page',
        method: 'get',
        params: params
    }
}
// 根据id获得数据
export const getById =  (id) => {
    return {
        url: '/tenant/tenant-package/' + id,
        method: 'get'
    }
}
// 根据id更新租户包状态
export const updateStats = (parmas) => {
    return {
        url: '/tenant/tenant-package/update-actived',
        method: 'post',
        params: parmas
    }
}
// 根据id删除租户包
export const deleteById = (params) => {
    return {
        url: '/tenant/tenant-package/deletion',
        method: 'post',
        params: params
    }
}
// 授权树资源
export const getTree = (id) => {
    return {
        url: '/tenant/tenant-package/select-tree',
        method: 'get',
        params: {
            packageId: id
        }
    }
}
// 更新授权信息
export const saveAuth = (params) => {
    return {
        url: '/tenant/tenant-package/insert-tenant-package-resources',
        method: 'post',
        params: params
    }
}
//  保存实体
export const insert = (data) => {
    return {
        url: '/tenant/tenant-package/insert',
        method: 'post',
        data: data
    }
}

export const validCode = (params) => {
    return {
        url: '/tenant/tenant-package/validate-code',
        method: 'post',
        params: params
    }
}

export const update = (params) => {
    return {
        url: '/tenant/tenant-package/update',
        method: 'post',
        data: params
    }
}

export const packageTreeData = () => {
    return {
        url: 'tenant/tenant-package/select-all-data',
        method: 'get'
    }
}

// 校验租户包石佛偶使用
export const validPackageUsed = (params) => {
    return {
        url: '/tenant/tenant-package/validate-used',
        method: 'get',
        params: params,
    }
}