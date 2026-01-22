import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * crm_customer_agenda_doc
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',agendaId:'日程id',docId:'文档id'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerAgendaDoc = params => { return axios.get(`${base}/oa/crm/customerAgendaDoc/list`, { params: params }); };

//模糊查询crm_customer_agenda_doc 条件之间or关系  
//export const listCustomerAgendaDocKey = params => { return axios.get(`${base}/oa/crm/customerAgendaDoc/listKey`, { params: params }); };

//删除一条crm_customer_agenda_doc params={id:'id 主键'}
export const delCustomerAgendaDoc = params => { return axios.post(`${base}/oa/crm/customerAgendaDoc/del`,params); };

//批量删除crm_customer_agenda_doc  params=[{id:'id 主键'}]
export const batchDelCustomerAgendaDoc = params => { return axios.post(`${base}/oa/crm/customerAgendaDoc/batchDel`, params); };

//修改一条crm_customer_agenda_doc记录
export const editCustomerAgendaDoc = params => { return axios.post(`${base}/oa/crm/customerAgendaDoc/edit`, params); };

//新增一条crm_customer_agenda_doc
export const addCustomerAgendaDoc = params => { return axios.post(`${base}/oa/crm/customerAgendaDoc/add`, params); };