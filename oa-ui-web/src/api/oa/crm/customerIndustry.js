import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * crm_customer_industry
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'行业id 主键',parentId:'上级id',name:'行业名称',level:'层级',seq:'排序'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerIndustry = params => { return axios.get(`${base}/oa/crm/customerIndustry/list`, { params: params }); };

//模糊查询crm_customer_industry 条件之间or关系  
//export const listCustomerIndustryKey = params => { return axios.get(`${base}/oa/crm/customerIndustry/listKey`, { params: params }); };

//删除一条crm_customer_industry params={id:'行业id 主键'}
export const delCustomerIndustry = params => { return axios.post(`${base}/oa/crm/customerIndustry/del`,params); };

//批量删除crm_customer_industry  params=[{id:'行业id 主键'}]
export const batchDelCustomerIndustry = params => { return axios.post(`${base}/oa/crm/customerIndustry/batchDel`, params); };

//修改一条crm_customer_industry记录
export const editCustomerIndustry = params => { return axios.post(`${base}/oa/crm/customerIndustry/edit`, params); };

//新增一条crm_customer_industry
export const addCustomerIndustry = params => { return axios.post(`${base}/oa/crm/customerIndustry/add`, params); };