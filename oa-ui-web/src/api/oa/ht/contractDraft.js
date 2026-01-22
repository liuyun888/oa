import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * ht_contract_draft
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',title:'标题',reqUserId:'申请人',reqUserName:'申请人名称',reqDeptId:'部门',reqDeptName:'部门名称',reqDate:'申请日期',htName:'合同名称',htParty:'签约主体',htPartyName:'签约主体名称',htSn:'合同编号',htBeginDate:'合同生效日期',htAmount:'合同总金额',htImportantClause:'合同重要条款',htDemand:'合同说明',cpId:'客户id',cpName:'客户名称',cpLevel:'客户级别',cpType:'客户类型',cpAddress:'客户地址',cpOpenBank:'客户开户行',cpBankAccount:'客户开户行账号',linkName:'联系人名称',linkPhone:'联系人电话',htParentType:'合同父级分类id',htType:'合同分类',isUseMoban:'0否',fanbenId:'范本id',isThirdparty:'是否第三方采购',isExitChaoqi:'是否存在超期风险',isExitPerson:'是否存在人员风险',isExitFanwei:'是否存在范围超出风险',isExitHuikuan:'是否存在回款风险'}
 **/
 
//普通查询 条件之间and关系  
export const listContractDraft = params => { return axios.get(`${base}/oa/ht/contractDraft/list`, { params: params }); };

//模糊查询ht_contract_draft 条件之间or关系  
//export const listContractDraftKey = params => { return axios.get(`${base}/oa/ht/contractDraft/listKey`, { params: params }); };

//删除一条ht_contract_draft params={id:'id 主键'}
export const delContractDraft = params => { return axios.post(`${base}/oa/ht/contractDraft/del`,params); };

//批量删除ht_contract_draft  params=[{id:'id 主键'}]
export const batchDelContractDraft = params => { return axios.post(`${base}/oa/ht/contractDraft/batchDel`, params); };

//修改一条ht_contract_draft记录
export const editContractDraft = params => { return axios.post(`${base}/oa/ht/contractDraft/edit`, params); };

//新增一条ht_contract_draft
export const addContractDraft = params => { return axios.post(`${base}/oa/ht/contractDraft/add`, params); };