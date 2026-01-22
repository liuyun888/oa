import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * rc_schedule
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'日程id 主键',createUserid:'日程创建人id',createUsername:'日程创建人',receiveUserid:'日程接收人id',receiveUsername:'日程接收人',title:'日程标题',description:'日程内容',rcType:'日程类型',startTime:'日程开始时间',endTime:'日程结束时间',urgent:'紧急程度',remindType:'提醒类型',remindNowtime:'立即提醒',remindBeforestart:'开始前提醒时间',remindBeforeend:'结束前提醒时间',status:'日程状态',branchId:'机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listRcSchedule = params => { return axios.get(`${base}/oa/rc/rcSchedule/list`, { params: params }); };

//模糊查询rc_schedule 条件之间or关系  
//export const listRcScheduleKey = params => { return axios.get(`${base}/oa/rc/rcSchedule/listKey`, { params: params }); };

//删除一条rc_schedule params={id:'日程id 主键'}
export const delRcSchedule = params => { return axios.post(`${base}/oa/rc/rcSchedule/del`,params); };

//批量删除rc_schedule  params=[{id:'日程id 主键'}]
export const batchDelRcSchedule = params => { return axios.post(`${base}/oa/rc/rcSchedule/batchDel`, params); };

//修改一条rc_schedule记录
export const editRcSchedule = params => { return axios.post(`${base}/oa/rc/rcSchedule/edit`, params); };

//完成rc_schedule记录状态
export const completeRcSchedule = params => { return axios.post(`${base}/oa/rc/rcSchedule/complete`, params); };

//完成rc_schedule记录状态
export const batchCompleteRcSchedule = params => { return axios.post(`${base}/oa/rc/rcSchedule/batchComplete`, params); };

//新增一条rc_schedule
export const addRcSchedule = params => { return axios.post(`${base}/oa/rc/rcSchedule/add`, params); };

//按照日期查询日程
export const listRcScheduleByDay = params => { return axios.get(`${base}/oa/rc/rcSchedule/listRcScheduleByDay`, { params: params }); };

//按照月份查询日程
export const listRcScheduleByMonth = params => { return axios.get(`${base}/oa/rc/rcSchedule/listRcScheduleByMonth`, { params: params }); };
