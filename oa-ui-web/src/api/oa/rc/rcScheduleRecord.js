import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * rc_schedule_record
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'日志id 主键',operatorId:'操作者id',operatorName:'操作者名字',operationTime:'操作时间',modules:'日志模块',operationType:'操作类型',recordProject:'操作项目',rcTitle:'日程标题',operatorIp:'操作者ip',scheduleId:'日程编号'}
 **/
 
//普通查询 条件之间and关系  
export const listRcScheduleRecord = params => { return axios.get(`${base}/oa/rc/rcScheduleRecord/list`, { params: params }); };

//模糊查询rc_schedule_record 条件之间or关系  
//export const listRcScheduleRecordKey = params => { return axios.get(`${base}/oa/rc/rcScheduleRecord/listKey`, { params: params }); };

//删除一条rc_schedule_record params={id:'日志id 主键'}
export const delRcScheduleRecord = params => { return axios.post(`${base}/oa/rc/rcScheduleRecord/del`,params); };

//批量删除rc_schedule_record  params=[{id:'日志id 主键'}]
export const batchDelRcScheduleRecord = params => { return axios.post(`${base}/oa/rc/rcScheduleRecord/batchDel`, params); };

//修改一条rc_schedule_record记录
export const editRcScheduleRecord = params => { return axios.post(`${base}/oa/rc/rcScheduleRecord/edit`, params); };

//新增一条rc_schedule_record
export const addRcScheduleRecord = params => { return axios.post(`${base}/oa/rc/rcScheduleRecord/add`, params); };