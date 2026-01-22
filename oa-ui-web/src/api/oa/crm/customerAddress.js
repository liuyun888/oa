import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * crm_customer_address
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={addressId:'地址id 主键',curstomerId:'客户id',city:'城市',zipCode:'邮政编码',phone:'电话',fax:'传真',email:'电子邮件',district:'区县',contacterUserId:'联系人id',contacterUserName:'联系人名称',typeId:'地址类型',typeName:'地址类型名称',appendAddress:'附加地址'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerAddress = params => { return axios.get(`${base}/oa/crm/customerAddress/list`, { params: params }); };

//模糊查询crm_customer_address 条件之间or关系  
//export const listCustomerAddressKey = params => { return axios.get(`${base}/oa/crm/customerAddress/listKey`, { params: params }); };

//删除一条crm_customer_address params={addressId:'地址id 主键'}
export const delCustomerAddress = params => { return axios.post(`${base}/oa/crm/customerAddress/del`,params); };

//批量删除crm_customer_address  params=[{addressId:'地址id 主键'}]
export const batchDelCustomerAddress = params => { return axios.post(`${base}/oa/crm/customerAddress/batchDel`, params); };

//修改一条crm_customer_address记录
export const editCustomerAddress = params => { return axios.post(`${base}/oa/crm/customerAddress/edit`, params); };

//新增一条crm_customer_address
export const addCustomerAddress = params => { return axios.post(`${base}/oa/crm/customerAddress/add`, params); };