import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * crm_customer_agenda
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={agendaId:'日程id 主键',agendaText:'日程标题',agendaNav:'日程内容',customerId:'客户id',customerName:'客户名称',contacterId:'客户联系人id',contacterName:'客户联系人名称',urgentLevel:'紧急程度',urgentLevelName:'紧急程度名称',beginTime:'开始时间',endTime:'结束时间',tipType:'提醒方式',remindImmediately:'是否立即提醒',remindBeforeStart:'是否开始前提醒',remindBeforeHour:'开始前提醒小时',remindBeforeMinute:'开始前提醒分钟',remindEndStart:'是否结束前提醒',remindEndHour:'结束前提醒小时',remindEndMinute:'结束前提醒分钟',workPlanType:'日程类型',agendaCreateId:'创建人Id',agendaCreateName:'创建人姓名',agendaCreateImg:'创建人头像',agendaCreateTime:'创建时间',isPlan:'是否日程计划',branchId:'机构id',businessId:'关联商机id'}
 **/
 
//普通查询 条件之间and关系  
export const listCustomerAgenda = params => { return axios.get(`${base}/oa/crm/customerAgenda/list`, { params: params }); };

//模糊查询crm_customer_agenda 条件之间or关系  
//export const listCustomerAgendaKey = params => { return axios.get(`${base}/oa/crm/customerAgenda/listKey`, { params: params }); };

//删除一条crm_customer_agenda params={agendaId:'日程id 主键'}
export const delCustomerAgenda = params => { return axios.post(`${base}/oa/crm/customerAgenda/del`,params); };

//批量删除crm_customer_agenda  params=[{agendaId:'日程id 主键'}]
export const batchDelCustomerAgenda = params => { return axios.post(`${base}/oa/crm/customerAgenda/batchDel`, params); };

//修改一条crm_customer_agenda记录
export const editCustomerAgenda = params => { return axios.post(`${base}/oa/crm/customerAgenda/edit`, params); };

//新增一条crm_customer_agenda
export const addCustomerAgenda = params => { return axios.post(`${base}/oa/crm/customerAgenda/add`, params); };