import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * meet_boardroom_appendix
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',meetBoardroomId:'会议室id',name:'附件名字',addr:'附件地址',type:'附件类型',remark:'备注说明'}
 **/
 
//普通查询 条件之间and关系  
export const listMeetBoardroomAppendix = params => { return axios.get(`${base}/oa/meet/meetBoardroomAppendix/list`, { params: params }); };

//模糊查询meet_boardroom_appendix 条件之间or关系  
//export const listMeetBoardroomAppendixKey = params => { return axios.get(`${base}/oa/meet/meetBoardroomAppendix/listKey`, { params: params }); };

//删除一条meet_boardroom_appendix params={id:'主键 主键'}
export const delMeetBoardroomAppendix = params => { return axios.post(`${base}/oa/meet/meetBoardroomAppendix/del`,params); };

//批量删除meet_boardroom_appendix  params=[{id:'主键 主键'}]
export const batchDelMeetBoardroomAppendix = params => { return axios.post(`${base}/oa/meet/meetBoardroomAppendix/batchDel`, params); };

//修改一条meet_boardroom_appendix记录
export const editMeetBoardroomAppendix = params => { return axios.post(`${base}/oa/meet/meetBoardroomAppendix/edit`, params); };

//新增一条meet_boardroom_appendix
export const addMeetBoardroomAppendix = params => { return axios.post(`${base}/oa/meet/meetBoardroomAppendix/add`, params); };