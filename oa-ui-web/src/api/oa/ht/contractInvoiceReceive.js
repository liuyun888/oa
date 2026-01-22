import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * ht_contract_invoice
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'发票id 主键',htId:'合同卡片id',title:'发票抬头',gtaxid:'纳税人识别号',number:'发票编号',amount:'发票金额',openDate:'发票开具日期',point:'票点',content:'内容',receiveDate:'收票日期',status:'状态1.未付款2.已付款3.已退票',type:'类型1.增值税专业发票2.增值税普通发票',createUserId:'创建人id',createUserName:'创建名称',createUserTime:'创建时间',branchId:'机构id'}
 **/
 
//普通查询 条件之间and关系  
export const listContractInvoiceReceive = params => { return axios.get(`${base}/oa/ht/contractInvoiceReceive/list`, { params: params }); };

//模糊查询ht_contract_invoice_receive 条件之间or关系  
//export const listContractInvoiceReceiveKey = params => { return axios.get(`${base}/oa/ht/contractInvoiceReceive/listKey`, { params: params }); };

//删除一条ht_contract_invoice_receive params={id:'发票id 主键'}
export const delContractInvoiceReceive = params => { return axios.post(`${base}/oa/ht/contractInvoiceReceive/del`,params); };

//批量删除ht_contract_invoice_receive  params=[{id:'发票id 主键'}]
export const batchDelContractInvoiceReceive = params => { return axios.post(`${base}/oa/ht/contractInvoiceReceive/batchDel`, params); };

//修改一条ht_contract_invoice_receive记录
export const editContractInvoiceReceive = params => { return axios.post(`${base}/oa/ht/contractInvoiceReceive/edit`, params); };

//新增一条ht_contract_invoice_receive
export const addContractInvoiceReceive = params => { return axios.post(`${base}/oa/ht/contractInvoiceReceive/add`, params); };

//修改一条ht_contract_invoice_open记录
export const updateReceiveStatus = params => { return axios.post(`${base}/oa/ht/contractInvoiceReceive/updateStatus`, params); };
