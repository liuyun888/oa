import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * crm_customer_agenda_about
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={aboutId:'日程相关交流id 主键',agendaId:'日程id',submitUserId:'提交人id',submitUserName:'提交人名称',submitUserTime:'提交日期',richText:'富文本'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerAgendaAbout = params => { return axios.get(`${base}/oa/crm/customerAgendaAbout/list`, { params: params }); };

//模糊查询crm_customer_agenda_about 条件之间or关系  
//export const listCustomerAgendaAboutKey = params => { return axios.get(`${base}/oa/crm/customerAgendaAbout/listKey`, { params: params }); };

//删除一条crm_customer_agenda_about params={aboutId:'日程相关交流id 主键'}
export const delCustomerAgendaAbout = params => { return axios.post(`${base}/oa/crm/customerAgendaAbout/del`,params); };

//批量删除crm_customer_agenda_about  params=[{aboutId:'日程相关交流id 主键'}]
export const batchDelCustomerAgendaAbout = params => { return axios.post(`${base}/oa/crm/customerAgendaAbout/batchDel`, params); };

//修改一条crm_customer_agenda_about记录
export const editCustomerAgendaAbout = params => { return axios.post(`${base}/oa/crm/customerAgendaAbout/edit`, params); };

//新增一条crm_customer_agenda_about
export const addCustomerAgendaAbout = params => { return axios.post(`${base}/oa/crm/customerAgendaAbout/add`, params); };