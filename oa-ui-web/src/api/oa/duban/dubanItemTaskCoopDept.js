import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * duban_item_task_coop_dept
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',dubanItemId:'任务id',deptId:'协助单位id',deptName:'协助单位'}
 **/
 
//普通查询 条件之间and关系  
export const listDubanItemTaskCoopDept = params => { return axios.get(`${base}/oa/duban/dubanItemTaskCoopDept/list`, { params: params }); };

//模糊查询duban_item_task_coop_dept 条件之间or关系  
//export const listDubanItemTaskCoopDeptKey = params => { return axios.get(`${base}/oa/duban/dubanItemTaskCoopDept/listKey`, { params: params }); };

//删除一条duban_item_task_coop_dept params={id:'主键 主键'}
export const delDubanItemTaskCoopDept = params => { return axios.post(`${base}/oa/duban/dubanItemTaskCoopDept/del`,params); };

//批量删除duban_item_task_coop_dept  params=[{id:'主键 主键'}]
export const batchDelDubanItemTaskCoopDept = params => { return axios.post(`${base}/oa/duban/dubanItemTaskCoopDept/batchDel`, params); };

//修改一条duban_item_task_coop_dept记录
export const editDubanItemTaskCoopDept = params => { return axios.post(`${base}/oa/duban/dubanItemTaskCoopDept/edit`, params); };

//新增一条duban_item_task_coop_dept
export const addDubanItemTaskCoopDept = params => { return axios.post(`${base}/oa/duban/dubanItemTaskCoopDept/add`, params); };