/**
 * 获取资源权限
 */
export const getMenu = () => {
    return {
        url: '/sys/resources/authorized',
        method: 'get',
    }
}


// 根据id获取资源
export const getById = (id) => {
  return {
    url: '/sys/resources/' + id,
    method: 'get',
    params: {
      id: id
    }
  }
}

// 获取资源树节点
export const getTreeNodes = () => {
  return {
    url: '/sys/resources/tree',
    method: 'get',
  }
}

// 获取父资源树（只有目录）
export const getCategoryTree = () => {
  return {
    url: '/sys/resources/tree-category',
    method: 'get',
  }
}

// 获取资源分页列表
export const getList = (params) => {
  return {
    url: '/sys/resources/list',
    method: 'get',
    params: params
  }
}
// 新增资源
export const insert = (data) => {
  return {
    url: '/sys/resources/insert',
    method: 'post',
    data: data
  }
}

// 修改资源
export const update = (data) => {
  return {
    url: '/sys/resources/update',
    method: 'post',
    data: data
  }
}
// 删除单个资源
export const deleteSingle = params => {
  return {
    url: '/sys/resources/deletion',
    method: 'post',
    params: params
  }
}
// 批量删除资源
export const deleteBatch = () => {
  return {
    url: '/sys/resources/deletion',
    method: 'post',
    emulateJSON: true
  }
}
 export const validate = (params) => {
   return {
    url: '/sys/resources/validate',
    method: 'get',
    params: params
   }
 }
// 修改资源激活状态
export const updateActived = (params) => {
  return {
    url: '/sys/resources/update-actived/' + params.id,
    method: 'post',
    params: params
  }
}


export const getResource = (params) => {
  return {
    url: `/sys/resources/list-menu`,
    method: "get"
  }
}

/**
* 获取资源权限
*/
export const listMenu = () => {
return {
  url: '/sys/resources/list-menu',
  method: 'get',
}
}

export const authedResource = (params) => {
  return {
    url: `/sys/resources/tree-menu`,
    method: "get"
  }
}

// 租户可授权资源树
export const getTenantResourceTree = () => {
  return {
    url: '/sys/resources/tenant-resource-tree',
    method: 'get',
  }
}