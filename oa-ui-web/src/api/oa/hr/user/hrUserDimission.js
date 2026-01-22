import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_dimission
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',applyTime:'申请离职日期',practicalTime:'实际离职日期',balanceDate:'薪资结算日期',cause:'离职原因',remark:'离职备注'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserDimission = params => { return axios.get(`${base}/oa/hr/user/hrUserDimission/list`, { params: params }); };

//模糊查询hr_user_dimission 条件之间or关系  
//export const listHrUserDimissionKey = params => { return axios.get(`${base}/oa/hr/user/hrUserDimission/listKey`, { params: params }); };

//删除一条hr_user_dimission params={id:'id 主键'}
export const delHrUserDimission = params => { return axios.post(`${base}/oa/hr/user/hrUserDimission/del`,params); };

//批量删除hr_user_dimission  params=[{id:'id 主键'}]
export const batchDelHrUserDimission = params => { return axios.post(`${base}/oa/hr/user/hrUserDimission/batchDel`, params); };

//修改一条hr_user_dimission记录
export const editHrUserDimission = params => { return axios.post(`${base}/oa/hr/user/hrUserDimission/edit`, params); };

//新增一条hr_user_dimission
export const addHrUserDimission = params => { return axios.post(`${base}/oa/hr/user/hrUserDimission/add`, params); };