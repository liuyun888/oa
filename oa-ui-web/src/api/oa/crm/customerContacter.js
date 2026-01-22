import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * crm_customer_contacter
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={contacterId:'联系人id 主键',contacterName:'联系人名称',customerId:'客户id',customerName:'客户名称',title:'称呼',titleName:'称呼名称',anotherName:'别名',firstName:'姓',jobTitle:'岗位名称',projectRole:'项目角色',attitude:'意向判断',attention:'关注点',contacterEmail:'电子邮件',phoneOffice:'办公室电话',phoneHome:'住宅电话',mobilePhone:'移动电话',contacterFax:'传真',imcode:'IM号码',birthday:'出生年月',birthdayNotifydays:'生日提醒前几天',contacterLanguage:'语言',isMain:'是否主联系人',isPerson:'是否人脉',remark:'备注',remarkDoc:'备注文档',branchId:'机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerContacter = params => { return axios.get(`${base}/oa/crm/customerContacter/list`, { params: params }); };

//模糊查询crm_customer_contacter 条件之间or关系  
//export const listCustomerContacterKey = params => { return axios.get(`${base}/oa/crm/customerContacter/listKey`, { params: params }); };

//删除一条crm_customer_contacter params={contacterId:'联系人id 主键'}
export const delCustomerContacter = params => { return axios.post(`${base}/oa/crm/customerContacter/del`,params); };

//批量删除crm_customer_contacter  params=[{contacterId:'联系人id 主键'}]
export const batchDelCustomerContacter = params => { return axios.post(`${base}/oa/crm/customerContacter/batchDel`, params); };

//修改一条crm_customer_contacter记录
export const editCustomerContacter = params => { return axios.post(`${base}/oa/crm/customerContacter/edit`, params); };

//新增一条crm_customer_contacter
export const addCustomerContacter = params => { return axios.post(`${base}/oa/crm/customerContacter/add`, params); };

//修改父节点
export const editContacterParent = params => { return axios.post(`${base}/oa/crm/customerContacter/editContacterParent`, params); };

export const getContacterBirthdayCount = params => { return axios.get(`${base}/oa/crm/customerContacter/getContacterBirthdayCount`, { params: params }); };

export const getContacterById = params => { return axios.get(`${base}/oa/crm/customerContacter/getContacterById`, { params: params }); };

