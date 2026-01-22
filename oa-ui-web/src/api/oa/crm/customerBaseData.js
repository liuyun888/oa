import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * crm_customer_base_data
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',text:'简称',describe:'描述',type:'status:客户状态.'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerBaseData = params => { return axios.get(`${base}/oa/crm/customerBaseData/list`, { params: params }); };

//模糊查询crm_customer_base_data 条件之间or关系  
//export const listCustomerBaseDataKey = params => { return axios.get(`${base}/oa/crm/customerBaseData/listKey`, { params: params }); };

//删除一条crm_customer_base_data params={id:'id 主键'}
export const delCustomerBaseData = params => { return axios.post(`${base}/oa/crm/customerBaseData/del`,params); };

//批量删除crm_customer_base_data  params=[{id:'id 主键'}]
export const batchDelCustomerBaseData = params => { return axios.post(`${base}/oa/crm/customerBaseData/batchDel`, params); };

//修改一条crm_customer_base_data记录
export const editCustomerBaseData = params => { return axios.post(`${base}/oa/crm/customerBaseData/edit`, params); };

//新增一条crm_customer_base_data
export const addCustomerBaseData = params => { return axios.post(`${base}/oa/crm/customerBaseData/add`, params); };