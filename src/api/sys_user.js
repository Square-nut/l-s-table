
//获取机构树
/* export const getTree = (params) =>{
    return {
      url: '/api/sys/organization/select-inst-tree',
      method: 'get',
      params: params
    }
  } */
//获取机构组织树getTreeUser
/* export const getOrgUserTree = (params) =>{
    return {
      url: '/sys/organization/select-inst-org-tree',
      method: 'get',
      params: params
    }
  } */
//用户列表的查询
export const list = (params) =>{
  return {
    url: '/sys/user/select-page',
    method: 'get',
    params: params
  }
}
//用户列表的启用停用
export const updateActived = (params) => {
  return {
    url: '/sys/user/update-actived',
    method: 'post',
    params: params
  }
}
  // 删除用户列表
  export const deletion = (id) => {
    return {
    url: '/sys/user/deletion',
    method: 'post',
    params:  id
    }
  }
  // 根据id获取信息
  export const selectById = (param) => {
    return {
      url: '/sys/user/' + param,
      method: 'get',
    }
  }
  //新增用户信息
  export const insert = (params) => {
    return {
      url: '/sys/user/insert',
      method: 'post',
      data: params
    }
  }
  //修改角色
export const update = (params) => {
  return {
    url: '/sys/user/update',
    method: 'post',
    data: params
  }
}
//分页查询已删除的用户
export const deleteList = (params) =>{
  return {
    url: '/sys/user/select-delete-page',
    method: 'get',
    params: params
  }
}
//恢复用户
export const recoverUser = (params) => {
  
  return {
    url: '/sys/user/recover',
    method: 'post',
    data: params
  }
}
//校验登录名
export const validatedLoginName = (params) => {
  return {
    url: '/sys/user/check-loginName',
    method: 'get',
    params: params
  }
}
//解锁
export const unLock = (id) => {
  return {
  url: 'sys/user/unfreeze',
  method: 'post',
  params:  id
  }
}
//查询机构组织人员树
export const getEmployeeTree = (params) =>{
  return {
    url: '/sys/organization/select-employee-tree',
    method: 'get',
    params: params
  }
}
//快速新增查询机构组织人员树
export const getEmployee = (params) =>{
  return {
    url: '/sys/organization/select-employee-tree-except-user',
    method: 'get',
    params: params
  }
}
//快速新增
export const insertRelation = (params) => {
  return {
      url: '/sys/user/insert-fast',
      method: 'post',
      params: params
  }
}
//关联人员的保存
export const RelationPerson = (params) => {
  return {
      url: '/sys/user/insert-user-employee',
      method: 'post',
      data: params
  }
}
//重置密码
export const resetPwd = (id) => {
  return {
  url: 'sys/user/reset-password/'+id,
  method: 'post',
  }
}
//修改个人用户头像
export const updateAvatar = (params) => {
  return {
    url: '/sys/user/update-avatar',
    method: 'post',
    data: params
  }
}
/* //查询人员集合
export const selectEmployeeList = (params) =>{
  return {
    url: '/sys/organization/select-employee-list',
    method: 'get',
    params: params
  }
} */