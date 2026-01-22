import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * 项目合同关联关系表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键id 主键',htId:'合同id',projectId:'项目编号',projectName:'项目名称',ctime:'创建时间',ltime:'更新时间'}
 **/
 
//普通查询 条件之间and关系  
export const listContractProject = params => { return axios.get(`${base}/oa/ht/contractProject/list`, { params: params }); };

//模糊查询项目合同关联关系表 条件之间or关系  
//export const listContractProjectKey = params => { return axios.get(`${base}/oa/ht/contractProject/listKey`, { params: params }); };

//删除一条项目合同关联关系表 params={id:'主键id 主键'}
export const delContractProject = params => { return axios.post(`${base}/oa/ht/contractProject/del`,params); };

//批量删除项目合同关联关系表  params=[{id:'主键id 主键'}]
export const batchDelContractProject = params => { return axios.post(`${base}/oa/ht/contractProject/batchDel`, params); };

//修改一条项目合同关联关系表记录
export const editContractProject = params => { return axios.post(`${base}/oa/ht/contractProject/edit`, params); };

//新增一条项目合同关联关系表
export const addContractProject = params => { return axios.post(`${base}/oa/ht/contractProject/add`, params); };


export const batchSaveProject = params => { return axios.post(`${base}/oa/ht/contractProject/batchSave`, params); };