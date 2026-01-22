import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_train
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'用户编号',trainName:'培训名称',remark:'描述',startTime:'开始日期',endTime:'结束日期',trainUnit:'培训单位'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserTrain = params => { return axios.get(`${base}/oa/hr/user/hrUserTrain/list`, { params: params }); };

//模糊查询hr_user_train 条件之间or关系  
//export const listHrUserTrainKey = params => { return axios.get(`${base}/oa/hr/user/hrUserTrain/listKey`, { params: params }); };

//删除一条hr_user_train params={id:'id 主键'}
export const delHrUserTrain = params => { return axios.post(`${base}/oa/hr/user/hrUserTrain/del`,params); };

//批量删除hr_user_train  params=[{id:'id 主键'}]
export const batchDelHrUserTrain = params => { return axios.post(`${base}/oa/hr/user/hrUserTrain/batchDel`, params); };

//修改一条hr_user_train记录
export const editHrUserTrain = params => { return axios.post(`${base}/oa/hr/user/hrUserTrain/edit`, params); };

//新增一条hr_user_train
export const addHrUserTrain = params => { return axios.post(`${base}/oa/hr/user/hrUserTrain/add`, params); };