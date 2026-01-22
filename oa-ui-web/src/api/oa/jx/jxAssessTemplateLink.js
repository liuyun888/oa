import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * 考核模板和用户的关联表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={templateId:'考核模板id 主键',linkType:'用户类型0-用户,1-部门，2-机构，3-项目，4-岗位 主键',linkPkId:'当用户类型为0时存放用户编号，当用户类型为部门时，存部门编号，依次类推 主键',branchId:'组织id',linkPkName:'关联名称',ctime:'创建时间'}
 **/
 
//普通查询 条件之间and关系  
export const listJxAssessTemplateLink = params => { return axios.get(`${base}/oa/jx/jxAssessTemplateLink/list`, { params: params }); };

//模糊查询考核模板和用户的关联表 条件之间or关系  
//export const listJxAssessTemplateLinkKey = params => { return axios.get(`${base}/oa/jx/jxAssessTemplateLink/listKey`, { params: params }); };

//删除一条考核模板和用户的关联表 params={templateId:'考核模板id 主键',linkType:'用户类型0-用户,1-部门，2-机构，3-项目，4-岗位 主键',linkPkId:'当用户类型为0时存放用户编号，当用户类型为部门时，存部门编号，依次类推 主键'}
export const delJxAssessTemplateLink = params => { return axios.post(`${base}/oa/jx/jxAssessTemplateLink/del`,params); };

//批量删除考核模板和用户的关联表  params=[{templateId:'考核模板id 主键',linkType:'用户类型0-用户,1-部门，2-机构，3-项目，4-岗位 主键',linkPkId:'当用户类型为0时存放用户编号，当用户类型为部门时，存部门编号，依次类推 主键'}]
export const batchDelJxAssessTemplateLink = params => { return axios.post(`${base}/oa/jx/jxAssessTemplateLink/batchDel`, params); };

//修改一条考核模板和用户的关联表记录
export const editJxAssessTemplateLink = params => { return axios.post(`${base}/oa/jx/jxAssessTemplateLink/edit`, params); };

//新增一条考核模板和用户的关联表
export const addJxAssessTemplateLink = params => { return axios.post(`${base}/oa/jx/jxAssessTemplateLink/add`, params); };