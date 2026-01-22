import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_contract
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'用户编号',contractName:'合同名称',startTime:'合同开始时间',endTime:'合同到期时间',contractType:'合同类型---',contractStatus:'合同状态---0-正常，1已到期，2-已解除',identification:'签订标识---0-首次签订',remark:'备注',processsingTime:'合同办理时间'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserContract = params => { return axios.get(`${base}/oa/hr/user/hrUserContract/list`, { params: params }); };

//模糊查询hr_user_contract 条件之间or关系  
//export const listHrUserContractKey = params => { return axios.get(`${base}/oa/hr/user/hrUserContract/listKey`, { params: params }); };

//删除一条hr_user_contract params={id:'id 主键'}
export const delHrUserContract = params => { return axios.post(`${base}/oa/hr/user/hrUserContract/del`,params); };

//批量删除hr_user_contract  params=[{id:'id 主键'}]
export const batchDelHrUserContract = params => { return axios.post(`${base}/oa/hr/user/hrUserContract/batchDel`, params); };

//修改一条hr_user_contract记录
export const editHrUserContract = params => { return axios.post(`${base}/oa/hr/user/hrUserContract/edit`, params); };

//新增一条hr_user_contract
export const addHrUserContract = params => { return axios.post(`${base}/oa/hr/user/hrUserContract/add`, params); };