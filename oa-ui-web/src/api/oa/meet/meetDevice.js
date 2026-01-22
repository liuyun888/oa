import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * meet_device
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'设备名称',version:'设备型号',using:'用途',remark:'备注',status:'状态1启用0禁用',branchId:'归属机构'}
 **/
 
//普通查询 条件之间and关系  
export const listMeetDevice = params => { return axios.get(`${base}/oa/meet/meetDevice/list`, { params: params }); };

//模糊查询meet_device 条件之间or关系  
//export const listMeetDeviceKey = params => { return axios.get(`${base}/oa/meet/meetDevice/listKey`, { params: params }); };

//删除一条meet_device params={id:'主键 主键'}
export const delMeetDevice = params => { return axios.post(`${base}/oa/meet/meetDevice/del`,params); };

//批量删除meet_device  params=[{id:'主键 主键'}]
export const batchDelMeetDevice = params => { return axios.post(`${base}/oa/meet/meetDevice/batchDel`, params); };

//修改一条meet_device记录
export const editMeetDevice = params => { return axios.post(`${base}/oa/meet/meetDevice/edit`, params); };

//新增一条meet_device
export const addMeetDevice = params => { return axios.post(`${base}/oa/meet/meetDevice/add`, params); };