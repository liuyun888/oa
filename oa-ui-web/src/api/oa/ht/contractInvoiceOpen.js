import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();

/**
 * ht_contract_invoice_open
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',htId:'合同id',requireId:'申请人id',cpId:'向对方id',requireName:'申请人名称',title:'发票抬头',gtaxid:'纳税人识别号',openBank:'开户行',openBankAccount:'账号',phone:'电话',address:'地址',conditionId:'收款项id',amount:'金额',point:'票点',type:'类型1.增值税专业发票',content:'内容',createUserId:'create_user_id',createUserName:'create_user_name',createTime:'create_time',branchId:'branch_id'}
 **/
 
//普通查询 条件之间and关系  
export const listContractInvoiceOpen = params => { return axios.get(`${base}/oa/ht/contractInvoiceOpen/list`, { params: params }); };

//模糊查询ht_contract_invoice_open 条件之间or关系  
//export const listContractInvoiceOpenKey = params => { return axios.get(`${base}/oa/ht/contractInvoiceOpen/listKey`, { params: params }); };

//删除一条ht_contract_invoice_open params={id:'id 主键'}
export const delContractInvoiceOpen = params => { return axios.post(`${base}/oa/ht/contractInvoiceOpen/del`,params); };

//批量删除ht_contract_invoice_open  params=[{id:'id 主键'}]
export const batchDelContractInvoiceOpen = params => { return axios.post(`${base}/oa/ht/contractInvoiceOpen/batchDel`, params); };

//修改一条ht_contract_invoice_open记录
export const editContractInvoiceOpen = params => { return axios.post(`${base}/oa/ht/contractInvoiceOpen/edit`, params); };

//新增一条ht_contract_invoice_open
export const addContractInvoiceOpen = params => { return axios.post(`${base}/oa/ht/contractInvoiceOpen/add`, params); };


//修改一条ht_contract_invoice_open记录
export const updateOpenStatus = params => { return axios.post(`${base}/oa/ht/contractInvoiceOpen/updateStatus`, params); };
