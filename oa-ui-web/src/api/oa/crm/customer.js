import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()

const archive=config.getArcBasePath();

/**
 * crm_customer
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={customerId:'客户id 主键',customerName:'客户名称',customerCode:'客户编码',customerEngName:'客户简称',address:'客户地址',addressGps:'gps定位',zipCode:'邮政编码',country:'国家',province:'省份',provinceCode:'省份代码',city:'城市',cityCode:'城市代码',district:'区县',districtCode:'区县代码',language:'语言',phone:'电话',fax:'传真',email:'电子邮件',website:'网站',introduction:'介绍',customerStatus:'客户状态',customerStatusName:'客户状态名称',customerType:'客户类型',customerTypeName:'客户类型名称',description:'描述',descriptionName:'客户描述名称',size:'规模',sizeName:'规模名称',source:'来源',sourceName:'来源名称',sectorId:'客户行业id',sectorName:'客户行业名称',managerUserId:'客户经理id',managerUserName:'客户经理名称',agentId:'中介机构id',agentName:'中介机构名称',parentId:'上级单位id',parentName:'上级单位名称',customerDocId:'文档id',customerDocName:'文档名称',customerIntroductiondocId:'背景资料id',customerIntroductiondocName:'背景资料名称',seclevel:'客户级别',evaluation:'客户价值',rating:'客户级别',portalStatus:'门户状态',creditAmount:'信用额度',creditTime:'信用期间',bankName:'开户银行',accountName:'帐户',accounts:'银行帐号',totalContractAmount:'累计合同金额',isAttention:'是否关注客户',createTime:'创建时间',createUserId:'创建人Id',createUserName:'创建人姓名',updateTime:'最后更新时间',updateUserId:'最后更新Id',updateUserName:'最后更新姓名',lastContactTime:'最后联系客户时间',branchId:'机构id'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomer = params => { return axios.get(`${base}/oa/crm/customer/list`, { params: params }); };

//模糊查询crm_customer 条件之间or关系  
//export const listCustomerKey = params => { return axios.get(`${base}/oa/crm/customer/listKey`, { params: params }); };

//删除一条crm_customer params={customerId:'客户id 主键'}
export const delCustomer = params => { return axios.post(`${base}/oa/crm/customer/del`,params); };

//批量删除crm_customer  params=[{customerId:'客户id 主键'}]
export const batchDelCustomer = params => { return axios.post(`${base}/oa/crm/customer/batchDel`, params); };

//修改一条crm_customer记录
export const editCustomer = params => { return axios.post(`${base}/oa/crm/customer/edit`, params); };

//新增一条crm_customer
export const addCustomer = params => { return axios.post(`${base}/oa/crm/customer/add`, params); };

//获取存在的客户数量
export const getExitCustomerCount = params => { return axios.get(`${base}/oa/crm/customer/getExitCustomerCount`, { params: params }); };


//查询文档列表
export const listArchive = params => { return axios.get(`${archive}/mdp/arc/archive/list`, { params: params }); };

export const isAttention = params => { return axios.post(`${base}/oa/crm/customer/isAttention`, params); };

export const getNewestCustomer = params => { return axios.get(`${base}/oa/crm/customer/getNewestCustomer`, { params: params }); };

//获取全部区域
export const getRegionByParentId = params => { return axios.get(`${base}/oa/crm/customer/getRegionByParentId`, { params: params }); };

