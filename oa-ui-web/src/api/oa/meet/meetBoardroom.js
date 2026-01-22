import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * meet_boardroom
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'会议室名称',typeId:'会议室类型id',typeName:'会议室类型',phone:'会议室电话',number:'会议人数',device:'会议设备，多项用逗号分隔',remark:'备注',status:'状态1启用0禁用',branchId:'归属机构'}
 **/

export const getMeetBoardroom = params => { return axios.get(`${base}/oa/meet/meetBoardroom/getMeetBoardroom`, { params: params }); };

//普通查询 条件之间and关系  
export const listMeetBoardroom = params => { return axios.get(`${base}/oa/meet/meetBoardroom/list`, { params: params }); };


//模糊查询meet_boardroom 条件之间or关系  
//export const listMeetBoardroomKey = params => { return axios.get(`${base}/oa/meet/meetBoardroom/listKey`, { params: params }); };

//删除一条meet_boardroom params={id:'主键 主键'}
export const delMeetBoardroom = params => { return axios.post(`${base}/oa/meet/meetBoardroom/del`,params); };

//批量删除meet_boardroom  params=[{id:'主键 主键'}]
export const batchDelMeetBoardroom = params => { return axios.post(`${base}/oa/meet/meetBoardroom/batchDel`, params); };

//修改一条meet_boardroom记录
export const editMeetBoardroom = params => { return axios.post(`${base}/oa/meet/meetBoardroom/edit`, params); };

//新增一条meet_boardroom
export const addMeetBoardroom = params => { return axios.post(`${base}/oa/meet/meetBoardroom/add`, params); };