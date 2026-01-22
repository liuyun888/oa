import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()

/**
 * crm_customer_business_prod
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'客户商机关联产品id 主键',businessId:'商机id',productId:'产品id',unitPrice:'单价',count:'数量'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerBusinessProd = params => { return axios.get(`${base}/oa/crm/customerBusinessProd/list`, { params: params }); };

//模糊查询crm_customer_business_prod 条件之间or关系  
//export const listCustomerBusinessProdKey = params => { return axios.get(`${base}/oa/crm/customerBusinessProd/listKey`, { params: params }); };

//删除一条crm_customer_business_prod params={id:'客户商机关联产品id 主键'}
export const delCustomerBusinessProd = params => { return axios.post(`${base}/oa/crm/customerBusinessProd/del`,params); };

//批量删除crm_customer_business_prod  params=[{id:'客户商机关联产品id 主键'}]
export const batchDelCustomerBusinessProd = params => { return axios.post(`${base}/oa/crm/customerBusinessProd/batchDel`, params); };

//修改一条crm_customer_business_prod记录
export const editCustomerBusinessProd = params => { return axios.post(`${base}/oa/crm/customerBusinessProd/edit`, params); };

//新增一条crm_customer_business_prod
export const addCustomerBusinessProd = params => { return axios.post(`${base}/oa/crm/customerBusinessProd/add`, params); };