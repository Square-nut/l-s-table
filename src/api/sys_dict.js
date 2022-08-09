
// 获取字典分页列表
export const list = (param) =>{
    return {
      url: '/sys/dict/select-page',
      method: 'get',
      params: param
    }
  }
  
  // 获取字典分类树节点
  export const getTreeNodes = () =>{
    return {
      url: '/sys/dict-category/select-sort-tree',
      method: 'get'
    }
  }

  // 获取字典分类树节点
  export const dictCategoryDictTree = () =>{
    return {
      url: '/sys/dict-category/select-dict-tree',
      method: 'get'
    }
  }

    // 根据字典编码查询字典项--供select使用
    export const selectByCode = (param) =>{
      return {
        url: '/sys/dict/select-pcode',
        method: 'get',
        params: param
      }
    }

   // 根据id获取字典分类信息
 export const getCategoryById = (id) => {
  return {
    url: '/sys/dict-category/'+id,
    method: 'get',
  }
}
// 修改激活状态
export const updateActived = (param) => {
  return {
    url: '/sys/dict/update-actived',
    method: 'post',
    params: param
  }
}
//新增分类
export const insert = (param) => {
  return {
    url: '/sys/dict-category/insert',
    method: 'post',
    data: param
  }
}
//修改分类
export const update = (param) => {
  return {
    url: '/sys/dict-category/update',
    method: 'post',
    data: param
  }
}
// 删除单个字典分类
export const deleteCategory = (id) => {
  return {
  url: '/sys/dict-category/delete/'+id,
  method: 'post',
  }
}
//新增字典
export const insertDict = (param) => {
  return {
    url: '/sys/dict/insert',
    method: 'post',
    data: param
  }
}
//修改字典
export const updateDict = (param) => {
  return {
    url: '/sys/dict/update',
    method: 'post',
    data: param
  }
}
   // 根据id获取字典信息
export const selectById = (id) => {
  return {
    url: '/sys/dict/'+id,
    method: 'get',
    }
  }
  // 删除字典
export const deletion = (id) => {
  return {
  url: '/sys/dict/deletion',
  method: 'post',
  params: id
  }
}
//字典分类编码校验
export const validatedCode = (param) => {
  return {
    url: '/sys/dict-category/validate',
    method: 'get',
    params: param
  }
}
//字典编码校验
export const validated = (param) => {
  return {
    url: '/sys/dict/validate',
    method: 'get',
    params: param
  }
}
//根据字典code查询字典项
export const findDictItemByCode = (param) => {
  return {
    url: '/sys/dict/select-pcode',
    method: 'get',
    params: param
  }
}

