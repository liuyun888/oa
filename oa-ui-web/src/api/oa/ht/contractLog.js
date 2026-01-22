import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * ht_contract_log
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'操作编号 主键',htId:'合同编号',opRemark:'操作描述',opUserid:'操作人编号',opUsername:'操作人姓名',opTime:'操作时间',opIp:'操作者机器ip'}
 **/
 
//普通查询 条件之间and关系  
export const listContractLog = params => { return axios.get(`${base}/oa/ht/contractLog/list`, { params: params }); };

//模糊查询ht_contract_log 条件之间or关系  
//export const listContractLogKey = params => { return axios.get(`${base}/oa/ht/contractLog/listKey`, { params: params }); };

//删除一条ht_contract_log params={id:'操作编号 主键'}
export const delContractLog = params => { return axios.post(`${base}/oa/ht/contractLog/del`,params); };

//批量删除ht_contract_log  params=[{id:'操作编号 主键'}]
export const batchDelContractLog = params => { return axios.post(`${base}/oa/ht/contractLog/batchDel`, params); };

//修改一条ht_contract_log记录
export const editContractLog = params => { return axios.post(`${base}/oa/ht/contractLog/edit`, params); };

//新增一条ht_contract_log
export const addContractLog = params => { return axios.post(`${base}/oa/ht/contractLog/add`, params); };