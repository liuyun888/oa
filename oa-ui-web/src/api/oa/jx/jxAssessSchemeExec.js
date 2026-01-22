import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * 考核方案
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',schemeType:'所属考核方案',planStartDay:'计划开始天数',planStartType:'计划开始类型（1-之前；2-之后）',remark:'说明',planEndDay:'计划结束天数',planEndType:'计划结束类型（1-之前；2-之后）',branchId:'组织机构号',planIsUseed:'是否启动方案（1-启动；0-不启动）',planIsRemind:'是否提醒考核（1-提醒；0-不提醒）',createdAt:'创建时间',updatedAt:'更新时间',schemeId:'方案主键',startDate:'方案归属开始日期',endDate:'方案归属结束日期',initStatus:'0-未初始化，1已初始化，生成每个模板对应的员工的绩效考核表',execStatus:'0-初始，1-执行中，2-已结束',initDate:'初始化日期',year:'年份',month:'月份',quarter:'季度：1-第一季度，2-第二季度，3-第三季度，4-第四季度',semiAnnual:'半年度：1-上半年度，2-下半年度',annual:'年度'}
 **/
 
//普通查询 条件之间and关系  
export const listJxAssessSchemeExec = params => { return axios.get(`${base}/oa/jx/jxAssessSchemeExec/list`, { params: params }); };

//模糊查询考核方案 条件之间or关系  
//export const listJxAssessSchemeExecKey = params => { return axios.get(`${base}/oa/jx/jxAssessSchemeExec/listKey`, { params: params }); };

//删除一条考核方案 params={id:'id 主键'}
export const delJxAssessSchemeExec = params => { return axios.post(`${base}/oa/jx/jxAssessSchemeExec/del`,params); };

//批量删除考核方案  params=[{id:'id 主键'}]
export const batchDelJxAssessSchemeExec = params => { return axios.post(`${base}/oa/jx/jxAssessSchemeExec/batchDel`, params); };

//修改一条考核方案记录
export const editJxAssessSchemeExec = params => { return axios.post(`${base}/oa/jx/jxAssessSchemeExec/edit`, params); };

//新增一条考核方案
export const addJxAssessSchemeExec = params => { return axios.post(`${base}/oa/jx/jxAssessSchemeExec/add`, params); };

export const batchSetJxAssessGrade = params => { return axios.post(`${base}/oa/jx/jxAssessSchemeExec/batchSetJxAssessGrade`,params); };



export const startExec = params => { return axios.post(`${base}/oa/jx/jxAssessSchemeExec/startExec`,params); };
export const stopExec = params => { return axios.post(`${base}/oa/jx/jxAssessSchemeExec/stopExec`,params); };
export const restartExec = params => { return axios.post(`${base}/oa/jx/jxAssessSchemeExec/restartExec`,params); };
export const closeExec = params => { return axios.post(`${base}/oa/jx/jxAssessSchemeExec/closeExec`,params); };
export const suspendExec = params => { return axios.post(`${base}/oa/jx/jxAssessSchemeExec/suspendExec`,params); }; 

