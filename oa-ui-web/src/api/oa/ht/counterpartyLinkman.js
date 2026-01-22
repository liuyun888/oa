import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();

/**
 * ht_counterparty_linkman
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={linkId:'联系人id 主键',cpId:'向对方名称',linkName:'联系人名称',linkCall:'联系人称呼',linkJob:'联系人岗位',linkDept:'联系人部门',linkPhone:'联系人办公电话',linkEmail:'联系人邮箱',branchId:'机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listCounterpartyLinkman = params => { return axios.get(`${base}/oa/ht/counterpartyLinkman/list`, { params: params }); };

//模糊查询ht_counterparty_linkman 条件之间or关系  
//export const listCounterpartyLinkmanKey = params => { return axios.get(`${base}/oa/ht/counterpartyLinkman/listKey`, { params: params }); };

//删除一条ht_counterparty_linkman params={linkId:'联系人id 主键'}
export const delCounterpartyLinkman = params => { return axios.post(`${base}/oa/ht/counterpartyLinkman/del`,params); };

//批量删除ht_counterparty_linkman  params=[{linkId:'联系人id 主键'}]
export const batchDelCounterpartyLinkman = params => { return axios.post(`${base}/oa/ht/counterpartyLinkman/batchDel`, params); };

//修改一条ht_counterparty_linkman记录
export const editCounterpartyLinkman = params => { return axios.post(`${base}/oa/ht/counterpartyLinkman/edit`, params); };

//新增一条ht_counterparty_linkman
export const addCounterpartyLinkman = params => { return axios.post(`${base}/oa/ht/counterpartyLinkman/add`, params); };