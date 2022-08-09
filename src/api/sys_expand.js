
// 自定义页面查询实体列表
export const entityPage = (params) => {
    return {
        url: '/sys/expand-column/table/select-page',
        method: 'get',
        params: params
    }
}
// 校验自定义字段编码
export const validateCode = (params) => {
    return {
        url: "/sys/expand-column/validate-code",
        method: "get",
        params: params
    }
}
// 校验自定义字段权限编码
export const validatePermCode = (params) => {
    return {
        url: "/sys/expand-column/validate-permcode",
        method: "get",
        params: params
    }
}
// 更新自定义字段
export const update = (data) => {
    return {
        url: "/sys/expand-column/update",
        method: "post",
        data: data
    }
}

// 删除自定义字段
export const deletion = (params) => {
    return {
        url: "/sys/expand-column/deletion",
        method: "post",
        params: params
    }
}

// 查询自定义字段列表
export const getCustomFieldPage = (params) => {
    return {
        url: "/sys/expand-column/select-page",
        method: "get",
        params: params
    }
}

// 查询自定义字段详细信息
export const getFieldById = (id) => {
    return {
        url: '/sys/expand-column/' + id,
        method: 'get',
        params: {
            id: id
        }
    }
}

// 新增自定义字段
export const insert = (data) => {
    return {
        url: "/sys/expand-column/insert",
        method: "post",
        data: data
    }
}

// 关联预置页面
export const relatedPage = (params) => {
    return {
        url: '/sys/expand-column/form/relevance',
        method: 'post',
        params: params
    }
}

// 查匈实体详情
export const getEntityForm = (id) => {
    return {
        url: '/sys/expand-column/form/' + id,
        method: 'get',
    }
}

export const submitFields = (data) => {
    return {
        url: '/sys/expand-column/form/submit',
        method: "post",
        data: data
    }
}

export const getFieldForDesign = (params) => {
    return {
        url: '/sys/expand-column/list/' + params.tableId,
        method: 'get',
        params: params
    }
}

export const getEntityPosition = (params) => {
    return {
        url: '/sys/expand-column/form/select-field-details',
        method: 'get',
        params: params
    }
}