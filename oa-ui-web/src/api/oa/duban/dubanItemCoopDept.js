import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * duban_item_coop_dept
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',dubanItemId:'督办id',deptId:'协助单位id',deptName:'协助单位'}
 **/
 
//普通查询 条件之间and关系  
export const listDubanItemCoopDept = params => { return axios.get(`${base}/oa/duban/dubanItemCoopDept/list`, { params: params }); };

//模糊查询duban_item_coop_dept 条件之间or关系  
//export const listDubanItemCoopDeptKey = params => { return axios.get(`${base}/oa/duban/dubanItemCoopDept/listKey`, { params: params }); };

//删除一条duban_item_coop_dept params={id:'主键 主键'}
export const delDubanItemCoopDept = params => { return axios.post(`${base}/oa/duban/dubanItemCoopDept/del`,params); };

//批量删除duban_item_coop_dept  params=[{id:'主键 主键'}]
export const batchDelDubanItemCoopDept = params => { return axios.post(`${base}/oa/duban/dubanItemCoopDept/batchDel`, params); };

//修改一条duban_item_coop_dept记录
export const editDubanItemCoopDept = params => { return axios.post(`${base}/oa/duban/dubanItemCoopDept/edit`, params); };

//新增一条duban_item_coop_dept
export const addDubanItemCoopDept = params => { return axios.post(`${base}/oa/duban/dubanItemCoopDept/add`, params); };