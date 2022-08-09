//次级角色权限树
export const getRoleTree = () => {
	return {
		url: '/perm/role/sub-tree',
		method: 'get'
	}
}

//选中资源
export const getResourceCheckNodes = (obj) => {
	return {
		url: '/perm/scope/list-resource/' +obj,
		method: 'get'
	}
}

//选中角色
export const getRoleCheckNodes = (obj) => {
	return {
		url: '/perm/scope/list-role/' +obj,
		method: 'get'
	}
}

 // 保存资源
 export const saveResourceCheckNodes = (obj) => {
	return {
	url: '/perm/scope/save-resource',
	method: 'post',
	params: obj
	}
}

 // 保存角色
 export const saveRoleCheckNodes = (obj) => {
	return {
	url: '/perm/scope/save-role',
	method: 'post',
	params: obj
	}
}




