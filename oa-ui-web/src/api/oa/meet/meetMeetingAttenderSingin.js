import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * meet_meeting_attender_singin
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',meetingId:'会议id',userId:'参会用户id',username:'参会用户'}
 **/
 
//普通查询 条件之间and关系  
export const listMeetMeetingAttenderSingin = params => { return axios.get(`${base}/oa/meet/meetMeetingAttenderSingin/list`, { params: params }); };

//模糊查询meet_meeting_attender_singin 条件之间or关系  
//export const listMeetMeetingAttenderSinginKey = params => { return axios.get(`${base}/oa/meet/meetMeetingAttenderSingin/listKey`, { params: params }); };

//删除一条meet_meeting_attender_singin params={id:'主键 主键'}
export const delMeetMeetingAttenderSingin = params => { return axios.post(`${base}/oa/meet/meetMeetingAttenderSingin/del`,params); };

//批量删除meet_meeting_attender_singin  params=[{id:'主键 主键'}]
export const batchDelMeetMeetingAttenderSingin = params => { return axios.post(`${base}/oa/meet/meetMeetingAttenderSingin/batchDel`, params); };

//修改一条meet_meeting_attender_singin记录
export const editMeetMeetingAttenderSingin = params => { return axios.post(`${base}/oa/meet/meetMeetingAttenderSingin/edit`, params); };

//新增一条meet_meeting_attender_singin
export const addMeetMeetingAttenderSingin = params => { return axios.post(`${base}/oa/meet/meetMeetingAttenderSingin/add`, params); };