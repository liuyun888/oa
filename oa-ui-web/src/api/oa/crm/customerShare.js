import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()

/**
 * crm_customer_share
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={shareId:'共享id 主键',customerId:'客户id',shareType:'dept:',shareObj:'共享对象',shareObjName:'共享对象名称',shareLevel:'see:查看edit编辑',branchId:'机构id'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerShare = params => { return axios.get(`${base}/oa/crm/customerShare/list`, { params: params }); };

//模糊查询crm_customer_share 条件之间or关系  
//export const listCustomerShareKey = params => { return axios.get(`${base}/oa/crm/customerShare/listKey`, { params: params }); };

//删除一条crm_customer_share params={shareId:'共享id 主键'}
export const delCustomerShare = params => { return axios.post(`${base}/oa/crm/customerShare/del`,params); };

//批量删除crm_customer_share  params=[{shareId:'共享id 主键'}]
export const batchDelCustomerShare = params => { return axios.post(`${base}/oa/crm/customerShare/batchDel`, params); };

//修改一条crm_customer_share记录
export const editCustomerShare = params => { return axios.post(`${base}/oa/crm/customerShare/edit`, params); };

//新增一条crm_customer_share
export const addCustomerShare = params => { return axios.post(`${base}/oa/crm/customerShare/add`, params); };