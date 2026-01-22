import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()



/**
 * pur_order
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',purTitle:'采购标题',purUserid:'采购申请人id',purUsername:'采购申请人姓名',purDeptid:'采购申请人部门id',purDeptName:'采购申请人部门名称',purBranchId:'采购申请人机构编号',purBranchName:'采购申请人机构名称',purDate:'采购申请时间',purItems:'采购事项'}
 **/
 
//普通查询 条件之间and关系  
export const listOrder = params => { return axios.get(`${base}/oa/erp/pur/order/list`, { params: params }); };

//模糊查询pur_order 条件之间or关系  
//export const listOrderKey = params => { return axios.get(`${base}/oa/erp/pur/order/listKey`, { params: params }); };

//删除一条pur_order params={id:'主键 主键'}
export const delOrder = params => { return axios.post(`${base}/oa/erp/pur/order/del`,params); };

//批量删除pur_order  params=[{id:'主键 主键'}]
export const batchDelOrder = params => { return axios.post(`${base}/oa/erp/pur/order/batchDel`, params); };

//修改一条pur_order记录
export const editOrder = params => { return axios.post(`${base}/oa/erp/pur/order/edit`, params); };

//新增一条pur_order
export const addOrder = params => { return axios.post(`${base}/oa/erp/pur/order/add`, params); };