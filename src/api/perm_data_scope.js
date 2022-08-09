// 查询列表
export const list = (param) => {
	return {
		url: '/perm/scope-data/select-page',
		method: 'get',
		params: param
	}
}

// 保存数据权限
export const insertDataScope = (param) => {
	return {
		url: '/perm/scope-data/insert',
		method: 'post',
		data: param
	}
}
// 保存数据权限
export const updateDataScope = (param) => {
	return {
		url: '/perm/scope-data/update',
		method: 'post',
		data: param
	}
}
//查询数据权限详情
export const selectById = (param) => {
	return {
		url: '/perm/scope-data/'+param,
		method: 'get'
	}
}

//校验编码
export const validated = (param) => {
	return {
		url: '/perm/scope-data/validate',
		method: 'get',
		params:param
	}
}

//删除
export const deletion = (param) => {
	return {
		url: '/perm/scope-data/deletion',
		method: 'post',
		params:param
	}
}
//数据权限树
export const getScopeTree = (param) => {
	return {
		url: '/perm/scope-data/tree',
		method: 'get',
		params:param
	}
}




