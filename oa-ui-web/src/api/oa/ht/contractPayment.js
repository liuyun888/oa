import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * ht_contract_payment
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',htId:'相关合同',cpId:'合同相对方id',payCondition:'付款条件',payType:'付款种类',payRatio:'付款比例',payAmount:'应付金额',cpName:'合同相对方名称',cpBankAccount:'相对方银行账号',cpOpenBank:'相对方开户行',cpFzr:'相对方负责人',cpFzrPhone:'相对方负责人电话',payFlow:'付款流程',payStatus:'1.已付款',actualDate:'实际付款日期'}
 **/
 
//普通查询 条件之间and关系  
export const listContractPayment = params => { return axios.get(`${base}/oa/ht/contractPayment/list`, { params: params }); };

//模糊查询ht_contract_payment 条件之间or关系  
//export const listContractPaymentKey = params => { return axios.get(`${base}/oa/ht/contractPayment/listKey`, { params: params }); };

//删除一条ht_contract_payment params={id:'id 主键'}
export const delContractPayment = params => { return axios.post(`${base}/oa/ht/contractPayment/del`,params); };

//批量删除ht_contract_payment  params=[{id:'id 主键'}]
export const batchDelContractPayment = params => { return axios.post(`${base}/oa/ht/contractPayment/batchDel`, params); };

//修改一条ht_contract_payment记录
export const editContractPayment = params => { return axios.post(`${base}/oa/ht/contractPayment/edit`, params); };

//新增一条ht_contract_payment
export const addContractPayment = params => { return axios.post(`${base}/oa/ht/contractPayment/add`, params); };


export const linkInvoices = params => { return axios.post(`${base}/oa/ht/contractPayment/linkInvoices`, params); };