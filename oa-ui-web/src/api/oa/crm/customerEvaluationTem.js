import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * crm_customer_evaluation_tem
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={temId:'tem_id 主键',name:'名称',value:'分值',proportion:'权重'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerEvaluationTem = params => { return axios.get(`${base}/oa/crm/customerEvaluationTem/list`, { params: params }); };

//模糊查询crm_customer_evaluation_tem 条件之间or关系  
//export const listCustomerEvaluationTemKey = params => { return axios.get(`${base}/oa/crm/customerEvaluationTem/listKey`, { params: params }); };

//删除一条crm_customer_evaluation_tem params={temId:'tem_id 主键'}
export const delCustomerEvaluationTem = params => { return axios.post(`${base}/oa/crm/customerEvaluationTem/del`,params); };

//批量删除crm_customer_evaluation_tem  params=[{temId:'tem_id 主键'}]
export const batchDelCustomerEvaluationTem = params => { return axios.post(`${base}/oa/crm/customerEvaluationTem/batchDel`, params); };

//修改一条crm_customer_evaluation_tem记录
export const editCustomerEvaluationTem = params => { return axios.post(`${base}/oa/crm/customerEvaluationTem/edit`, params); };

//新增一条crm_customer_evaluation_tem
export const addCustomerEvaluationTem = params => { return axios.post(`${base}/oa/crm/customerEvaluationTem/add`, params); };