
/**
 * 查询组织树
 */
export const orgtree = (params) => {
    return {
        url: '/sys/organization/select-inst-org-tree',
        method: 'get',
    }
}

/**
 * 查询机构列表
 */
 export const instree = (params) => {
    return {
        url: '/sys/organization/select-inst-tree',
        method: 'get',
    }
}