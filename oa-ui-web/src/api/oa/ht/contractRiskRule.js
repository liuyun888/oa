import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();

/**
 * ht_contract_risk_rule
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={ruleId:'rule_id 主键',ruleName:'风险名称',ruleDesc:'风险说明',branchId:'branch_id'}
 **/
 
//普通查询 条件之间and关系  
export const listContractRiskRule = params => { return axios.get(`${base}/oa/ht/contractRiskRule/list`, { params: params }); };

//模糊查询ht_contract_risk_rule 条件之间or关系  
//export const listContractRiskRuleKey = params => { return axios.get(`${base}/oa/ht/contractRiskRule/listKey`, { params: params }); };

//删除一条ht_contract_risk_rule params={ruleId:'rule_id 主键'}
export const delContractRiskRule = params => { return axios.post(`${base}/oa/ht/contractRiskRule/del`,params); };

//批量删除ht_contract_risk_rule  params=[{ruleId:'rule_id 主键'}]
export const batchDelContractRiskRule = params => { return axios.post(`${base}/oa/ht/contractRiskRule/batchDel`, params); };

//修改一条ht_contract_risk_rule记录
export const editContractRiskRule = params => { return axios.post(`${base}/oa/ht/contractRiskRule/edit`, params); };

//新增一条ht_contract_risk_rule
export const addContractRiskRule = params => { return axios.post(`${base}/oa/ht/contractRiskRule/add`, params); };