// 查询列表
export const list = (param) => {
	return {
		url: '/sys/page-preset/select-page',
		method: 'get',
		params: param
	}
}

export const insert = (param) => {
	return {
		url: '/sys/page-preset/insert',
		method: 'post',
		data: param
	}
}

export const update = (param) => {
	return {
		url: '/sys/page-preset/update',
		method: 'post',
		data: param
	}
}

export const updateActived = (param) => {
	return {
		url: '/sys/page-preset/update-actived/' + param.id,
		method: 'post',
		params: {
			actived: param.actived
		}
	}
}

export const selectById = (param) => {
	return {
		url: '/sys/page-preset/' + param,
		method: 'get'
	}
}

//校验编码是否重复
export const validated = (param) => {
	return {
		url: '/sys/page-preset/validate',
		method: 'get',
		params: param
	}
}

//删除
export const deletion = (param) => {
	return {
		url: '/sys/page-preset/deletion',
		method: 'post',
		params: param
	}
}

// 查询上级元素
export const higherList = (param) => {
	return {
		url: '/sys/page-preset/column/higher-list/' + param,
		method: 'get',
	}
}
//校验权限编码
export const columnValidated = (param) => {
	return {
		url: '/sys/page-preset/column/validate',
		method: 'get',
		params: param
	}
}
// 查询页面元素列表
export const columnList = (param) => {
	return {
		url: '/sys/page-preset/column/select-page',
		method: 'get',
		params: param
	}
}
//查询页面元素详情
export const selectColumnById = (param) => {
	return {
		url: '/sys/page-preset/column/'+param,
		method: 'get'
	}
}
// 保存页面元素
export const columnInsert = (param) => {
	return {
		url: '/sys/page-preset/column/insert',
		method: 'post',
		data: param
	}
}

// 保存页面元素
export const columnUpdate = (param) => {
	return {
		url: '/sys/page-preset/column/update',
		method: 'post',
		data: param
	}
}
//删除
export const columnDeletion = (param) => {
	return {
		url: '/sys/page-preset/column/deletion',
		method: 'post',
		params: param
	}
}
//导出页面元素
export const columnExport = (param) => {
	return {
		url: '/sys/page-preset/column/export',
		method: 'get'
	}
}
//导入页面元素
export const columnImport = (param) => {
	return {
		url: '/sys/page-preset/column/import',
		method: 'post'
	}
}
//查询元素权限
export const columnPermList = (param) => {
	return {
		url: '/sys/page-preset/column/list-column-perm',
		method: 'get',
		params: param
	}
}
//保存权限
export const submit = (param) => {
	return {
		url: '/sys/page-preset/column-perm/submit',
		method: 'post',
		data: param
	}
}
