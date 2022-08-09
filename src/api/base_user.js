
/**
 * 查询
 */
export const list = (params) => {
    return {
        url: '/sys/user/select-page',
        method: 'get',
        params: params
    }
}

/**
 * 查询科室部门数据
 */
 export const listDept = () => {
    return {
        url: '/sys/user/list-dept',
        method: 'get'
    }
}

/**
 * 查询用户树
 */
 export const usertree = () => {
    return {
        url: '/sys/user/select-user-tree',
        method: 'get'
    }
}