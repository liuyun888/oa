import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_leave
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'员工编号',type:'请假类型',number:'请假天数',remark:'备注',startTime:'请假开始时间',endTime:'请假结束时间'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserLeave = params => { return axios.get(`${base}/oa/hr/user/hrUserLeave/list`, { params: params }); };

//模糊查询hr_user_leave 条件之间or关系  
//export const listHrUserLeaveKey = params => { return axios.get(`${base}/oa/hr/user/hrUserLeave/listKey`, { params: params }); };

//删除一条hr_user_leave params={id:'id 主键'}
export const delHrUserLeave = params => { return axios.post(`${base}/oa/hr/user/hrUserLeave/del`,params); };

//批量删除hr_user_leave  params=[{id:'id 主键'}]
export const batchDelHrUserLeave = params => { return axios.post(`${base}/oa/hr/user/hrUserLeave/batchDel`, params); };

//修改一条hr_user_leave记录
export const editHrUserLeave = params => { return axios.post(`${base}/oa/hr/user/hrUserLeave/edit`, params); };

//新增一条hr_user_leave
export const addHrUserLeave = params => { return axios.post(`${base}/oa/hr/user/hrUserLeave/add`, params); };