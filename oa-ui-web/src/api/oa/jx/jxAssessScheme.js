import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * 考核方案
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',schemeType:'所属考核方案',planStartDay:'计划开始天数',planStartType:'计划开始类型（1-之前；2-之后）',remark:'说明',planEndDay:'计划结束天数',planEndType:'计划结束类型（1-之前；2-之后）',branchId:'组织机构号',planIsUseed:'是否启动方案（1-启动；0-不启动）',planIsRemind:'是否提醒考核（1-提醒；0-不提醒）',createdAt:'创建时间',updatedAt:'更新时间'}
 **/
 
//普通查询 条件之间and关系  
export const listJxAssessScheme = params => { return axios.get(`${base}/oa/jx/jxAssessScheme/list`, { params: params }); };

//模糊查询考核方案 条件之间or关系  
//export const listJxAssessSchemeKey = params => { return axios.get(`${base}/oa/jx/jxAssessScheme/listKey`, { params: params }); };

//删除一条考核方案 params={id:'id 主键'}
export const delJxAssessScheme = params => { return axios.post(`${base}/oa/jx/jxAssessScheme/del`,params); };

//批量删除考核方案  params=[{id:'id 主键'}]
export const batchDelJxAssessScheme = params => { return axios.post(`${base}/oa/jx/jxAssessScheme/batchDel`, params); };

//修改一条考核方案记录
export const editJxAssessScheme = params => { return axios.post(`${base}/oa/jx/jxAssessScheme/edit`, params); };

//新增一条考核方案
export const addJxAssessScheme = params => { return axios.post(`${base}/oa/jx/jxAssessScheme/add`, params); };


//拷贝一条考核方案记录
export const copyJxAssessScheme = params => { return axios.post(`${base}/oa/jx/jxAssessScheme/copy`, params); };
