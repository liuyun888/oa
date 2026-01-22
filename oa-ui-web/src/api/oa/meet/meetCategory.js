import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * meet_category
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'分类名称',flow:'审批工作流',status:'状态1启用0禁用',branchId:'归属机构',remark:'备注说明',createTime:'新增时间'}
 **/
 
//普通查询 条件之间and关系  
export const listMeetCategory = params => { return axios.get(`${base}/oa/meet/meetCategory/list`, { params: params }); };

//模糊查询meet_category 条件之间or关系  
//export const listMeetCategoryKey = params => { return axios.get(`${base}/oa/meet/meetCategory/listKey`, { params: params }); };

//删除一条meet_category params={id:'主键 主键'}
export const delMeetCategory = params => { return axios.post(`${base}/oa/meet/meetCategory/del`,params); };

//批量删除meet_category  params=[{id:'主键 主键'}]
export const batchDelMeetCategory = params => { return axios.post(`${base}/oa/meet/meetCategory/batchDel`, params); };

//修改一条meet_category记录
export const editMeetCategory = params => { return axios.post(`${base}/oa/meet/meetCategory/edit`, params); };

//新增一条meet_category
export const addMeetCategory = params => { return axios.post(`${base}/oa/meet/meetCategory/add`, params); };