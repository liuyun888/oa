import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_credential
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'用户编号',certificateName:'证书名称',startTime:'颁发日期',endTime:'失效日期',issueUnit:'颁发单位'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserCredential = params => { return axios.get(`${base}/oa/hr/user/hrUserCredential/list`, { params: params }); };

//模糊查询hr_user_credential 条件之间or关系  
//export const listHrUserCredentialKey = params => { return axios.get(`${base}/oa/hr/user/hrUserCredential/listKey`, { params: params }); };

//删除一条hr_user_credential params={id:'id 主键'}
export const delHrUserCredential = params => { return axios.post(`${base}/oa/hr/user/hrUserCredential/del`,params); };

//批量删除hr_user_credential  params=[{id:'id 主键'}]
export const batchDelHrUserCredential = params => { return axios.post(`${base}/oa/hr/user/hrUserCredential/batchDel`, params); };

//修改一条hr_user_credential记录
export const editHrUserCredential = params => { return axios.post(`${base}/oa/hr/user/hrUserCredential/edit`, params); };

//新增一条hr_user_credential
export const addHrUserCredential = params => { return axios.post(`${base}/oa/hr/user/hrUserCredential/add`, params); };