import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * meet_meeting
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'会议名称',categoryId:'会议分类id',categoryName:'会议分类',requireUserid:'申请人id',requireUsername:'申请人',roomId:'会议室id',roomName:'会议室名称',customRoomName:'自定义会议地点',startTime:'开始时间',endTime:'结束时间',reminders:'提醒方式',remindersImmediate:'立刻提醒',remindersBeforeStart:'开始前提醒',remindersBeforeEnd:'结束前提醒',otherAttender:'其他参加',attenderNum:'参会人数',customerNum:'参会客户数',isUsingReturn:'是否启用回执,0否1是,会议参与人手动参加回执',isUsingSingin:'是否启用会议签到,0否1是',singinMode:'签到模式：0-人员签到,1-扫码签到,2-WIFI签到',singinUserid:'签到模式1：签到人员,所选人员为统一签到人员！默认为会议申请人！',singinUsername:'签到模式1：签到人员',singinWifi:'签到模式2：签到WIFI',branchId:'归属机构',deptId:'单位id',deptName:'单位',requireRemark:'申请备注',startRemark:'会议开始备注',createTime:'创建时间',status:'状态0待审批,1审批中,2已批准,3已拒绝,4已开始,5已结束',approveSuggestion:'审批意见'}
 **/

export const getMeetMeeting = params => { return axios.get(`${base}/oa/meet/meetMeetingAttender/list`, { params: params }); };
export const checkMeetingTime = params => { return axios.get(`${base}/oa/meet/meetMeeting/checkMeetingTime`, { params: params }); };

 //普通查询 条件之间and关系
export const getMeetMeetingsByTime = params => { return axios.get(`${base}/oa/meet/meetMeeting/getMeetMeetingsByTime`, { params: params }); };

//普通查询 条件之间and关系
export const minelistMeetMeeting = params => { return axios.get(`${base}/oa/meet/meetMeeting/minelist`, { params: params }); };
export const listMeetMeeting = params => { return axios.get(`${base}/oa/meet/meetMeeting/listAdministrator`, { params: params }); };

//模糊查询meet_meeting 条件之间or关系
//export const listMeetMeetingKey = params => { return axios.get(`${base}/oa/meet/meetMeeting/listKey`, { params: params }); };

//删除一条meet_meeting params={id:'主键 主键'}
export const delMeetMeeting = params => { return axios.post(`${base}/oa/meet/meetMeeting/del`,params); };

//批量删除meet_meeting  params=[{id:'主键 主键'}]
export const batchDelMeetMeeting = params => { return axios.post(`${base}/oa/meet/meetMeeting/delList`, params); };

//修改一条meet_meeting记录
export const editMeetMeeting = params => { return axios.post(`${base}/oa/meet/meetMeeting/edit`, params); };

//新增一条meet_meeting
export const addMeetMeeting = params => { return axios.post(`${base}/oa/meet/meetMeeting/add`, params); };

export const getMyMeetMeeting = params => { return axios.get(`${base}/oa/meet/meetMeeting/list`, { params: params }); };
