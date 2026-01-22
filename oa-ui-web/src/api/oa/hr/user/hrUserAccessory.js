import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_accessory
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',name:'附件名称',type:'0-合同，1-简历，2-资格证书，3-其他',relevanceId:'关联id',accessory:'附件地址',userid:'用户id'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserAccessory = params => { return axios.get(`${base}/oa/hr/user/hrUserAccessory/list`, { params: params }); };

//模糊查询hr_user_accessory 条件之间or关系  
//export const listHrUserAccessoryKey = params => { return axios.get(`${base}/oa/hr/user/hrUserAccessory/listKey`, { params: params }); };

//删除一条hr_user_accessory params={id:'id 主键'}
export const delHrUserAccessory = params => { return axios.post(`${base}/oa/hr/user/hrUserAccessory/del`,params); };

//批量删除hr_user_accessory  params=[{id:'id 主键'}]
export const batchDelHrUserAccessory = params => { return axios.post(`${base}/oa/hr/user/hrUserAccessory/batchDel`, params); };

//修改一条hr_user_accessory记录
export const editHrUserAccessory = params => { return axios.post(`${base}/oa/hr/user/hrUserAccessory/edit`, params); };

//新增一条hr_user_accessory
export const addHrUserAccessory = params => { return axios.post(`${base}/oa/hr/user/hrUserAccessory/add`, params); };


//根据条件删除
export const delHrUserAccessoryByWhere = params => { return axios.post(`${base}/oa/hr/user/hrUserAccessory/delHrUserAccessoryByWhere`,params); };
