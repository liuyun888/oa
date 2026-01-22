import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * meet_boardroom_type
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'会议室类型',branchId:'归属机构'}
 **/
 
//普通查询 条件之间and关系  
export const listMeetBoardroomType = params => { return axios.get(`${base}/oa/meet/meetBoardroomType/list`, { params: params }); };

//模糊查询meet_boardroom_type 条件之间or关系  
//export const listMeetBoardroomTypeKey = params => { return axios.get(`${base}/oa/meet/meetBoardroomType/listKey`, { params: params }); };

//删除一条meet_boardroom_type params={id:'主键 主键'}
export const delMeetBoardroomType = params => { return axios.post(`${base}/oa/meet/meetBoardroomType/del`,params); };

//批量删除meet_boardroom_type  params=[{id:'主键 主键'}]
export const batchDelMeetBoardroomType = params => { return axios.post(`${base}/oa/meet/meetBoardroomType/batchDel`, params); };

//修改一条meet_boardroom_type记录
export const editMeetBoardroomType = params => { return axios.post(`${base}/oa/meet/meetBoardroomType/edit`, params); };

//新增一条meet_boardroom_type
export const addMeetBoardroomType = params => { return axios.post(`${base}/oa/meet/meetBoardroomType/add`, params); };