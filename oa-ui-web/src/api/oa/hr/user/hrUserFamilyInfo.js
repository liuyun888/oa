import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_family_info
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',familyTies:'家庭关系',userid:'用户编号',jobUnits:'任职单位',occupation:'职业',contactInformation:'联系方式',remark:'备注',familyName:'姓名'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserFamilyInfo = params => { return axios.get(`${base}/oa/hr/user/hrUserFamilyInfo/list`, { params: params }); };

//模糊查询hr_user_family_info 条件之间or关系  
//export const listHrUserFamilyInfoKey = params => { return axios.get(`${base}/oa/hr/user/hrUserFamilyInfo/listKey`, { params: params }); };

//删除一条hr_user_family_info params={id:'id 主键'}
export const delHrUserFamilyInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserFamilyInfo/del`,params); };

//批量删除hr_user_family_info  params=[{id:'id 主键'}]
export const batchDelHrUserFamilyInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserFamilyInfo/batchDel`, params); };

//修改一条hr_user_family_info记录
export const editHrUserFamilyInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserFamilyInfo/edit`, params); };

//新增一条hr_user_family_info
export const addHrUserFamilyInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserFamilyInfo/add`, params); };