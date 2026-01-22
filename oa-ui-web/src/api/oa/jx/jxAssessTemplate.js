import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * jx_assess_template
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',branchId:'组织id',name:'考核模板名称',scheme:'所属考核方案',totalPoints:'总分',explain:'考核模板说明'}
 **/
 
//普通查询 条件之间and关系  
export const listJxAssessTemplate = params => { return axios.get(`${base}/oa/jx/jxAssessTemplate/list`, { params: params }); };

//模糊查询jx_assess_template 条件之间or关系  
//export const listJxAssessTemplateKey = params => { return axios.get(`${base}/oa/jx/jxAssessTemplate/listKey`, { params: params }); };

//删除一条jx_assess_template params={id:'id 主键'}
export const delJxAssessTemplate = params => { return axios.post(`${base}/oa/jx/jxAssessTemplate/del`,params); };

//批量删除jx_assess_template  params=[{id:'id 主键'}]
export const batchDelJxAssessTemplate = params => { return axios.post(`${base}/oa/jx/jxAssessTemplate/batchDel`, params); };

//修改一条jx_assess_template记录
export const editJxAssessTemplate = params => { return axios.post(`${base}/oa/jx/jxAssessTemplate/edit`, params); };

//新增一条jx_assess_template
export const addJxAssessTemplate = params => { return axios.post(`${base}/oa/jx/jxAssessTemplate/add`, params); };

//模糊查询用户
export const listUsers = params => { return axios.get(`${base}/oa/jx/jxAssessTemplate/listUsers`, { params: params }); };

//添加模板
export const addAccessTemplate = params => { return axios.post(`${base}/oa/jx/jxAssessTemplate/addAccessTemplate`, params); };

//查询模板
export const getJxAssessTemplateList = params => { return axios.get(`${base}/oa/jx/jxAssessTemplate/listJxAssessTemplate`, { params: params }); };

//回显模板
export const getJxAssessTemplate = params => { return axios.get(`${base}/oa/jx/jxAssessTemplate/getJxAssessTemplate`, { params: params }); };

//修改模板
export const editAccessTemplate = params => { return axios.post(`${base}/oa/jx/jxAssessTemplate/editAccessTemplate`, params); };

//复制模板
export const copyAccessTemplate = params => { return axios.get(`${base}/oa/jx/jxAssessTemplate/copyAccessTemplate`, { params: params }); }; 


