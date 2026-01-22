import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_overtime
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'用户编号',overtimeTime:'加班日期',overtimeHour:'加班时间，单位是小时',remark:'备注'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserOvertime = params => { return axios.get(`${base}/oa/hr/user/hrUserOvertime/list`, { params: params }); };

//模糊查询hr_user_overtime 条件之间or关系  
//export const listHrUserOvertimeKey = params => { return axios.get(`${base}/oa/hr/user/hrUserOvertime/listKey`, { params: params }); };

//删除一条hr_user_overtime params={id:'id 主键'}
export const delHrUserOvertime = params => { return axios.post(`${base}/oa/hr/user/hrUserOvertime/del`,params); };

//批量删除hr_user_overtime  params=[{id:'id 主键'}]
export const batchDelHrUserOvertime = params => { return axios.post(`${base}/oa/hr/user/hrUserOvertime/batchDel`, params); };

//修改一条hr_user_overtime记录
export const editHrUserOvertime = params => { return axios.post(`${base}/oa/hr/user/hrUserOvertime/edit`, params); };

//新增一条hr_user_overtime
export const addHrUserOvertime = params => { return axios.post(`${base}/oa/hr/user/hrUserOvertime/add`, params); };