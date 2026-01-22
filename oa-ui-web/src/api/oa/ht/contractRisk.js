import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();

/**
 * ht_contract_risk
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={riskId:'risk_id 主键',contractId:'合同id',cpId:'风险相对方id',ruleId:'关联风险规则id',riskName:'风险名称',riskNav:'风险内容',riskMethod:'处理策略',yujiTime:'预计时间',createTime:'风险创建时间',createUserId:'风险创建人id',createUserName:'风险创建人名称',branchId:'机构id'}
 **/
 
//普通查询 条件之间and关系  
export const listContractRisk = params => { return axios.get(`${base}/oa/ht/contractRisk/list`, { params: params }); };

//模糊查询ht_contract_risk 条件之间or关系  
//export const listContractRiskKey = params => { return axios.get(`${base}/oa/ht/contractRisk/listKey`, { params: params }); };

//删除一条ht_contract_risk params={riskId:'risk_id 主键'}
export const delContractRisk = params => { return axios.post(`${base}/oa/ht/contractRisk/del`,params); };

//批量删除ht_contract_risk  params=[{riskId:'risk_id 主键'}]
export const batchDelContractRisk = params => { return axios.post(`${base}/oa/ht/contractRisk/batchDel`, params); };

//修改一条ht_contract_risk记录
export const editContractRisk = params => { return axios.post(`${base}/oa/ht/contractRisk/edit`, params); };

//新增一条ht_contract_risk
export const addContractRisk = params => { return axios.post(`${base}/oa/ht/contractRisk/add`, params); };