import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()

/**
 * crm_customer_business
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={businessId:'商机id 主键',businessName:'商机名称',businessType:'商机类型',expectDate:'销售预期',customerId:'所属客户id',customerName:'所属客户名称',expectEarnings:'预期收益',managerUserId:'客户经理id',managerUserName:'客户经理名称',possibility:'可能性',scheduleId:'商机来源',successKeyCause:'成功关键因素',faulitKeyCause:'失败关键因素',intermediaryOrganId:'中介机构',intermediaryOrganName:'中介机构名称',businessStatus:'1进行中',businessCreateId:'创建人Id',businessCreateName:'创建人姓名',businessCreateTime:'创建时间'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerBusiness = params => { return axios.get(`${base}/oa/crm/customerBusiness/list`, { params: params }); };

//模糊查询crm_customer_business 条件之间or关系  
//export const listCustomerBusinessKey = params => { return axios.get(`${base}/oa/crm/customerBusiness/listKey`, { params: params }); };

//删除一条crm_customer_business params={businessId:'商机id 主键'}
export const delCustomerBusiness = params => { return axios.post(`${base}/oa/crm/customerBusiness/del`,params); };

//批量删除crm_customer_business  params=[{businessId:'商机id 主键'}]
export const batchDelCustomerBusiness = params => { return axios.post(`${base}/oa/crm/customerBusiness/batchDel`, params); };

//修改一条crm_customer_business记录
export const editCustomerBusiness = params => { return axios.post(`${base}/oa/crm/customerBusiness/edit`, params); };

//新增一条crm_customer_business
export const addCustomerBusiness = params => { return axios.post(`${base}/oa/crm/customerBusiness/add`, params); };

//设置关注
export const isAttention = params => { return axios.post(`${base}/oa/crm/customerBusiness/isAttention`, params); };

export const getBusinessById = params => { return axios.get(`${base}/oa/crm/customerBusiness/getBusinessById`, { params: params }); };

