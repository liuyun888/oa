import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();

/**
 * ht_contract_template
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'范本id 主键',typeId:'合同分类id',name:'范本名称',isOpen:'是否开启0否1是',url:'链接',version:'版本号'}
 **/
 
//普通查询 条件之间and关系  
export const listContractTemplate = params => { return axios.get(`${base}/oa/ht/contractTemplate/list`, { params: params }); };

//模糊查询ht_contract_template 条件之间or关系  
//export const listContractTemplateKey = params => { return axios.get(`${base}/oa/ht/contractTemplate/listKey`, { params: params }); };

//删除一条ht_contract_template params={id:'范本id 主键'}
export const delContractTemplate = params => { return axios.post(`${base}/oa/ht/contractTemplate/del`,params); };

//批量删除ht_contract_template  params=[{id:'范本id 主键'}]
export const batchDelContractTemplate = params => { return axios.post(`${base}/oa/ht/contractTemplate/batchDel`, params); };

//修改一条ht_contract_template记录
export const editContractTemplate = params => { return axios.post(`${base}/oa/ht/contractTemplate/edit`, params); };

//新增一条ht_contract_template
export const addContractTemplate = params => { return axios.post(`${base}/oa/ht/contractTemplate/add`, params); };