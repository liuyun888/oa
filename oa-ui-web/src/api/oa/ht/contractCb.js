import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();

/**
 * ht_contract_card_condition
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={conditionId:'回款条件/收款条件 主键',htId:'合同id',invoiceId:'发票id',conditionType:'款项类别',conditionTiaoJian:'款项条件',conditionRatio:'比例',conditionAmount:'金额',conditionStatus:'状态',conditionRemark:'备注',branchId:'机构id'}
 **/
 
//普通查询 条件之间and关系  
export const listContractCb = params => { return axios.get(`${base}/oa/ht/contractCb/list`, { params: params }); };

//模糊查询ht_contract_card_condition 条件之间or关系  
//export const listContractCbKey = params => { return axios.get(`${base}/oa/ht/contractCb/listKey`, { params: params }); };

//删除一条ht_contract_card_condition params={conditionId:'回款条件/收款条件 主键'}
export const delContractCb = params => { return axios.post(`${base}/oa/ht/contractCb/del`,params); };

//批量删除ht_contract_card_condition  params=[{conditionId:'回款条件/收款条件 主键'}]
export const batchDelContractCb = params => { return axios.post(`${base}/oa/ht/contractCb/batchDel`, params); };

//修改一条ht_contract_card_condition记录
export const editContractCb = params => { return axios.post(`${base}/oa/ht/contractCb/edit`, params); };

//新增一条ht_contract_card_condition
export const addContractCb = params => { return axios.post(`${base}/oa/ht/contractCb/add`, params); };


export const batchSaveCb = params => { return axios.post(`${base}/oa/ht/contractCb/batchSave`, params); };
