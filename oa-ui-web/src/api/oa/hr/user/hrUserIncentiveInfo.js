import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_incentive_info
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'用户编号',certificateName:'奖惩名称',time:'奖惩日期',remark:'备注',type:'奖惩类型---0-现金，1-豪车，2-豪宅'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserIncentiveInfo = params => { return axios.get(`${base}/oa/hr/user/hrUserIncentiveInfo/list`, { params: params }); };

//模糊查询hr_user_incentive_info 条件之间or关系  
//export const listHrUserIncentiveInfoKey = params => { return axios.get(`${base}/oa/hr/user/hrUserIncentiveInfo/listKey`, { params: params }); };

//删除一条hr_user_incentive_info params={id:'id 主键'}
export const delHrUserIncentiveInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserIncentiveInfo/del`,params); };

//批量删除hr_user_incentive_info  params=[{id:'id 主键'}]
export const batchDelHrUserIncentiveInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserIncentiveInfo/batchDel`, params); };

//修改一条hr_user_incentive_info记录
export const editHrUserIncentiveInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserIncentiveInfo/edit`, params); };

//新增一条hr_user_incentive_info
export const addHrUserIncentiveInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserIncentiveInfo/add`, params); };