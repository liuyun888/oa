import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_edu_record
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'用户编号',schoolName:'学校名称',remark:'描述',startTime:'入学日期',endTime:'毕业日期',degree:'学位',major:'专业'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserEduRecord = params => { return axios.get(`${base}/oa/hr/user/hrUserEduRecord/list`, { params: params }); };

//模糊查询hr_user_edu_record 条件之间or关系  
//export const listHrUserEduRecordKey = params => { return axios.get(`${base}/oa/hr/user/hrUserEduRecord/listKey`, { params: params }); };

//删除一条hr_user_edu_record params={id:'id 主键'}
export const delHrUserEduRecord = params => { return axios.post(`${base}/oa/hr/user/hrUserEduRecord/del`,params); };

//批量删除hr_user_edu_record  params=[{id:'id 主键'}]
export const batchDelHrUserEduRecord = params => { return axios.post(`${base}/oa/hr/user/hrUserEduRecord/batchDel`, params); };

//修改一条hr_user_edu_record记录
export const editHrUserEduRecord = params => { return axios.post(`${base}/oa/hr/user/hrUserEduRecord/edit`, params); };

//新增一条hr_user_edu_record
export const addHrUserEduRecord = params => { return axios.post(`${base}/oa/hr/user/hrUserEduRecord/add`, params); };