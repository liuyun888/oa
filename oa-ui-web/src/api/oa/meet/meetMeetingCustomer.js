import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * meet_meeting_customer
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',meetingId:'会议id',customerId:'参会客户id',customerName:'参会客户',status:'参加状态',remark:'参加备注'}
 **/
 
//普通查询 条件之间and关系  
export const listMeetMeetingCustomer = params => { return axios.get(`${base}/oa/meet/meetMeetingCustomer/list`, { params: params }); };

//模糊查询meet_meeting_customer 条件之间or关系  
//export const listMeetMeetingCustomerKey = params => { return axios.get(`${base}/oa/meet/meetMeetingCustomer/listKey`, { params: params }); };

//删除一条meet_meeting_customer params={id:'主键 主键'}
export const delMeetMeetingCustomer = params => { return axios.post(`${base}/oa/meet/meetMeetingCustomer/del`,params); };

//批量删除meet_meeting_customer  params=[{id:'主键 主键'}]
export const batchDelMeetMeetingCustomer = params => { return axios.post(`${base}/oa/meet/meetMeetingCustomer/batchDel`, params); };

//修改一条meet_meeting_customer记录
export const editMeetMeetingCustomer = params => { return axios.post(`${base}/oa/meet/meetMeetingCustomer/edit`, params); };

//新增一条meet_meeting_customer
export const addMeetMeetingCustomer = params => { return axios.post(`${base}/oa/meet/meetMeetingCustomer/add`, params); };