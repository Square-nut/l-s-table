// 获取角色列表 过滤了次级管理员
export const list = (params) =>{
  return {
    url: '/perm/role/list',
    method: 'get',
    params: params
  }
}
//角色编码校验
export const validated = (params) => {
  return {
    url: '/perm/role/validate',
    method: 'get',
    params: params
  }
}

// 修改激活状态
export const updateActived = (params) => {
  return {
    url: '/perm/role/update-actived/'+params.id,
    method: 'post',
    params: params
  }
}

//新增角色
export const insert = (params) => {
  return {
    url: '/perm/role/insert',
    method: 'post',
    data: params
  }
}
//修改角色
export const update = (params) => {
  return {
    url: '/perm/role/update',
    method: 'post',
    data: params
  }
}
   // 根据id获取角色信息
export const selectById = (param) => {
  return {
    url: '/perm/role/' + param,
    method: 'get',
    }
  }
  // 获取所有激活状态的非超管、everyone角色树 包括未激活所有数据 节点激活状态字段为actived
export const getAllTreeNodes = () =>{
   return {
    url: '/perm/role/all-tree',
    method: 'get'
    }
  }
  // 删除角色
  export const deletion = (id) => {
    return {
    url: '/perm/role/deletion',
    method: 'post',
    params: id
    }
  }
  //获取菜单权限树
export const getTree = (param) => {
  return {
    url: '/sys/resources/tree',
    method: 'get',
    params: param
    }
}

// 获取普通角色树 当前用户有权限管理的普通角色树
export const getTreeNodes = () =>{
  return {
    url: '/perm/role/tree',
    method: 'get'
  }
}

// 获取除超管、everyone的角色树 当前用户有权限管理的普通角色+次级角色树
export const getParentTreeNodes = (param) =>{
  return {
    url: '/perm/role/parent-tree',
    method: 'get',
    params: param
  }
}
  //获取已授权资源id集合
export const getMenuTree =(params) =>{
    return {
    url: '/perm/role/role-resource/'+params.roleId,
    method: 'get',
    params: params
  }
}
  //获取已授权资源
  export const getTreeResource =(params) =>{
    return {
    url: '/perm/role/role-resource/tree/'+params,
    method: 'get'
  }
}
//资源菜单授权保存
export const getgrant= (params) =>{
  return {
    url: '/perm/role/role-resource/grant',
    method: 'post',
    params: params
  }
}
 //获取角色属性
 export const getPropertiesId = (params) => {
  return {
    url: '/perm/role/properties/'+params,
    method: 'get'
    }
  }
  //保存角色属性
  export const saveProperties = (params) => {
    return {
      url: '/perm/role/save-properties/',
      method: 'post',
      data: params
    }
  }
  //分配用户查询
export const assignUserList = (params) =>{
  return {
    url: '/perm/role/select-page-user',
    method: 'get',
    params: params
  }
}
 // 分配用户删除
 export const deletionAssignUser = (id) => {
  return {
  url: '/perm/role/delete-role-user',
  method: 'post',
  params: id
  }
}
   //保存分配用户
export const insertUser = (params) => {
  return {
    url: '/perm/role/save-distribution-user',
    method: 'post',
    data: params
  }
}
//根据id获取角色-用户数据
export const selectUserById = (id) => {
  return {
    url: '/perm/role/select-role-user-by-id/'+id,
    method: 'get',
    
    }
  }
  //分配用户编辑保存
export const updateUser = (params) => {
  return {
    url: '/perm/role/update-role-user',
    method: 'post',
    data: params
  }
}
//查询预置页面按钮
export const pageList = (params) =>{
  return {
    url: '/sys/page-preset/list/'+params.resourceId,
    method: 'get',
    params: params
  }
}
/* export const pagePresetList = (params) =>{
  return {
    url: '/sys/page-preset/column/list-column-perm',
    method: 'get',
    params: params
  }
} */
//获取数据权限树
export const getScopeTree= (param) =>{
  return {
    url: '/perm/scope-data/tree',
    method: 'get',
    params: param
  }
}
//获取已授权数据权限树
export const getTreeScope =(params) =>{
  return {
  url: '/perm/role/role-scope/'+params.roleId,
  method: 'get',
  params: params
}
}
//保存数据权限
export const getScope= (param) =>{
  return {
    url: '/perm/role/role-scope/grant',
    method: 'post',
    params: param
  }
}
//根据角色查询未分配用户树
export const getUserTree = (param) =>{
  return {
   url: '/perm/role/unassigned-user-tree',
   method: 'get',
   params: param
   }
 }

// 获取所有次级管理员角色树
export const getAllSubTree = () =>{
  return {
    url: '/perm/role/all-sub-tree',
    method: 'get'
  }
}