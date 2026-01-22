import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()



/**
 * crm_customer_opertion
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={operId:'操作记录id 主键',customerId:'客户id',operUserId:'操作人',operUserName:'操作人名称',operDeptId:'操作人部门id',operDeptName:'操作人部门名称',ipAddress:'ip地址',oldValue:'之前的值',newValue:'之后修改的值',operType:'create',operTime:'操作时间',branchId:'机构id'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerOpertion = params => { return axios.get(`${base}/oa/crm/customerOpertion/list`, { params: params }); };

//模糊查询crm_customer_opertion 条件之间or关系  
//export const listCustomerOpertionKey = params => { return axios.get(`${base}/oa/crm/customerOpertion/listKey`, { params: params }); };

//删除一条crm_customer_opertion params={operId:'操作记录id 主键'}
export const delCustomerOpertion = params => { return axios.post(`${base}/oa/crm/customerOpertion/del`,params); };

//批量删除crm_customer_opertion  params=[{operId:'操作记录id 主键'}]
export const batchDelCustomerOpertion = params => { return axios.post(`${base}/oa/crm/customerOpertion/batchDel`, params); };

//修改一条crm_customer_opertion记录
export const editCustomerOpertion = params => { return axios.post(`${base}/oa/crm/customerOpertion/edit`, params); };

//新增一条crm_customer_opertion
export const addCustomerOpertion = params => { return axios.post(`${base}/oa/crm/customerOpertion/add`, params); };