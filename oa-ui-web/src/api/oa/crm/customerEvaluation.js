import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * crm_customer_evaluation
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',customerId:'客户id',temId:'模板id',level:'1差',score:'总分'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerEvaluation = params => { return axios.get(`${base}/oa/crm/customerEvaluation/list`, { params: params }); };

//模糊查询crm_customer_evaluation 条件之间or关系  
//export const listCustomerEvaluationKey = params => { return axios.get(`${base}/oa/crm/customerEvaluation/listKey`, { params: params }); };

//删除一条crm_customer_evaluation params={id:'id 主键'}
export const delCustomerEvaluation = params => { return axios.post(`${base}/oa/crm/customerEvaluation/del`,params); };

//批量删除crm_customer_evaluation  params=[{id:'id 主键'}]
export const batchDelCustomerEvaluation = params => { return axios.post(`${base}/oa/crm/customerEvaluation/batchDel`, params); };

//修改一条crm_customer_evaluation记录
export const editCustomerEvaluation = params => { return axios.post(`${base}/oa/crm/customerEvaluation/edit`, params); };

//新增一条crm_customer_evaluation
export const addCustomerEvaluation = params => { return axios.post(`${base}/oa/crm/customerEvaluation/add`, params); };