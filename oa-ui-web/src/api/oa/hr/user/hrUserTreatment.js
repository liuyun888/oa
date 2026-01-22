import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_treatment
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'用户编号',salaryAccountName:'工资账户名',salaryBank:'工资银行',salaryAccount:'工资账号',accumulationAccount:'公积金账户',socialSecurity:'社保号码'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserTreatment = params => { return axios.get(`${base}/oa/hr/user/hrUserTreatment/list`, { params: params }); };

//模糊查询hr_user_treatment 条件之间or关系  
//export const listHrUserTreatmentKey = params => { return axios.get(`${base}/oa/hr/user/hrUserTreatment/listKey`, { params: params }); };

//删除一条hr_user_treatment params={id:'id 主键'}
export const delHrUserTreatment = params => { return axios.post(`${base}/oa/hr/user/hrUserTreatment/del`,params); };

//批量删除hr_user_treatment  params=[{id:'id 主键'}]
export const batchDelHrUserTreatment = params => { return axios.post(`${base}/oa/hr/user/hrUserTreatment/batchDel`, params); };

//修改一条hr_user_treatment记录
export const editHrUserTreatment = params => { return axios.post(`${base}/oa/hr/user/hrUserTreatment/edit`, params); };

//新增一条hr_user_treatment
export const addHrUserTreatment = params => { return axios.post(`${base}/oa/hr/user/hrUserTreatment/add`, params); };

//修改前先查询是否存在，不存在就新增，存在就修改
export const editHrUserTreatmentByUserid = params => { return axios.post(`${base}/oa/hr/user/hrUserTreatment/editHrUserTreatmentByUserid`, params); };

