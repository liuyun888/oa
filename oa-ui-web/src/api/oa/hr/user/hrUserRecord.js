import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_record
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'用户编号',duty:'职务',deptid:'部门编号',deptName:'部门名称',remark:'备注',startTime:'开始时间',endTime:'结束时间'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserRecord = params => { return axios.get(`${base}/oa/hr/user/hrUserRecord/list`, { params: params }); };

//模糊查询hr_user_record 条件之间or关系  
//export const listHrUserRecordKey = params => { return axios.get(`${base}/oa/hr/user/hrUserRecord/listKey`, { params: params }); };

//删除一条hr_user_record params={id:'id 主键'}
export const delHrUserRecord = params => { return axios.post(`${base}/oa/hr/user/hrUserRecord/del`,params); };

//批量删除hr_user_record  params=[{id:'id 主键'}]
export const batchDelHrUserRecord = params => { return axios.post(`${base}/oa/hr/user/hrUserRecord/batchDel`, params); };

//修改一条hr_user_record记录
export const editHrUserRecord = params => { return axios.post(`${base}/oa/hr/user/hrUserRecord/edit`, params); };

//新增一条hr_user_record
export const addHrUserRecord = params => { return axios.post(`${base}/oa/hr/user/hrUserRecord/add`, params); };