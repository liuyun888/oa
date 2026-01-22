import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();

/**
 * ht_contract_type
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={typeId:'合同类型id 主键',typeParentId:'合同上级id',typeName:'合同类型名称',typeDesc:'合同类型名称',typeLevel:'合同层级关系'}
 **/
 
//普通查询 条件之间and关系  
export const listContractType = params => { return axios.get(`${base}/oa/ht/contractType/list`, { params: params }); };

//模糊查询ht_contract_type 条件之间or关系  
//export const listContractTypeKey = params => { return axios.get(`${base}/oa/ht/contractType/listKey`, { params: params }); };

//删除一条ht_contract_type params={typeId:'合同类型id 主键'}
export const delContractType = params => { return axios.post(`${base}/oa/ht/contractType/del`,params); };

//批量删除ht_contract_type  params=[{typeId:'合同类型id 主键'}]
export const batchDelContractType = params => { return axios.post(`${base}/oa/ht/contractType/batchDel`, params); };

//修改一条ht_contract_type记录
export const editContractType = params => { return axios.post(`${base}/oa/ht/contractType/edit`, params); };

//新增一条ht_contract_type
export const addContractType = params => { return axios.post(`${base}/oa/ht/contractType/add`, params); };