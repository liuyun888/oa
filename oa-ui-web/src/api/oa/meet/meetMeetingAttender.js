import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * meet_meeting_attender
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',meetingId:'会议id',userId:'参会用户id',username:'参会用户',status:'参加状态',remark:'参加备注'}
 **/
 
//普通查询 条件之间and关系  
export const listMeetMeetingAttender = params => { return axios.get(`${base}/oa/meet/meetMeetingAttender/list`, { params: params }); };

//模糊查询meet_meeting_attender 条件之间or关系  
//export const listMeetMeetingAttenderKey = params => { return axios.get(`${base}/oa/meet/meetMeetingAttender/listKey`, { params: params }); };

//删除一条meet_meeting_attender params={id:'主键 主键'}
export const delMeetMeetingAttender = params => { return axios.post(`${base}/oa/meet/meetMeetingAttender/del`,params); };

//批量删除meet_meeting_attender  params=[{id:'主键 主键'}]
export const batchDelMeetMeetingAttender = params => { return axios.post(`${base}/oa/meet/meetMeetingAttender/batchDel`, params); };

//修改一条meet_meeting_attender记录
export const editMeetMeetingAttender = params => { return axios.post(`${base}/oa/meet/meetMeetingAttender/edit`, params); };

//参会
export const toJoinMeeting = params => { return axios.post(`${base}/oa/meet/meetMeetingExecAttender/addAttender`, params); };

//不参会
export const toNoJoinMeeting = params => { return axios.post(`${base}/oa/meet/meetMeetingExecAttender/edit`, params); };

//新增一条meet_meeting_attender
export const addMeetMeetingAttender = params => { return axios.post(`${base}/oa/meet/meetMeetingAttender/add`, params); };