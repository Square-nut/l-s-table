
// 获取系统配置列表
export const list = (param) =>{
  return {
    url: '/sys/config/select-page',
    method: 'get',
    params: param
  }
}
//新增配置
export const insert = (param) => {
  return {
    url: '/sys/config/insert',
    method: 'post',
    data: param
  }
}
//修改配置
export const update = (param) => {
  return {
    url: '/sys/config/update',
    method: 'post',
    data: param
  }
}
 // 根据id获取字典信息
 export const selectById = (id) => {
  return {
    url: '/sys/config/'+id,
    method: 'get',
  }
}
  // 删除字典
export const deletion = (id) => {
  return {
  url: '/sys/config/deletion',
  method: 'post',
  params: id
  }
}
//校验编码是否重复
export const validated=(param)=>{
  return {
    url: '/sys/config/validate',
    method: 'get',
    params: param
   }
}
