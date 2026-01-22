import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * jx_assess_grade
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',branchId:'组织id',templateId:'模板id',totalPoints:'总分',evaluate:'评价',accessory:'附件',assUserid:'考核人id',byAssUserid:'被考核人id',year:'年份',month:'月份',quarter:'季度：1-第一季度，2-第二季度，3-第三季度，4-第四季度',semiAnnual:'半年度：1-上半年度，2-下半年度',annual:'年度',scheme:'所属考核方案'}
 **/
 
//普通查询 条件之间and关系  
export const listJxAssessGrade = params => { return axios.get(`${base}/oa/jx/jxAssessGrade/list`, { params: params }); };

//模糊查询jx_assess_grade 条件之间or关系  
//export const listJxAssessGradeKey = params => { return axios.get(`${base}/oa/jx/jxAssessGrade/listKey`, { params: params }); };

//删除一条jx_assess_grade params={id:'id 主键'}
export const delJxAssessGrade = params => { return axios.post(`${base}/oa/jx/jxAssessGrade/del`,params); };

//批量删除jx_assess_grade  params=[{id:'id 主键'}]
export const batchDelJxAssessGrade = params => { return axios.post(`${base}/oa/jx/jxAssessGrade/batchDel`, params); };

//修改一条jx_assess_grade记录
export const editJxAssessGrade = params => { return axios.post(`${base}/oa/jx/jxAssessGrade/edit`, params); };

//新增一条jx_assess_grade
export const addJxAssessGrade = params => { return axios.post(`${base}/oa/jx/jxAssessGrade/add`, params); };
//保存考核信息
export const saveAssessInfo = params => { return axios.post(`${base}/oa/jx/jxAssessGrade/saveAssessInfo`, params); };
//获取考核统计

export const listUserAssessStatistics = params => { return axios.get(`${base}/oa/jx/jxAssessGrade/listUserAssessStatistics`, { params: params }); };

//获取用户评优情况
export const getAssessmentInformation = params => { return axios.get(`${base}/oa/jx/jxAssessGrade/getAssessmentInformation`, { params: params }); };

//用户所在部门的评优情况
export const deptAssessmentOf = params => { return axios.get(`${base}/oa/jx/jxAssessGrade/deptAssessmentOf`, { params: params }); };

export const getAssessInfo = params => { return axios.get(`${base}/oa/jx/jxAssessGrade/getAssessInfo`, { params: params }); };



export const getJxAssessGradeDetail = params => { return axios.get(`${base}/oa/jx/jxAssessGrade/getDetail`, { params: params }); };


export const listJxAssessGradeFullYear = params => { return axios.get(`${base}/oa/jx/jxAssessGrade/listFullYear`, { params: params }); };

export const listDeptAssessStatistics = params => { return axios.get(`${base}/oa/jx/jxAssessGrade/listDeptAssessStatistics`, { params: params }); };

export const openToConfirm = params => { return axios.post(`${base}/oa/jx/jxAssessGrade/openToConfirm`, params); };

export const batchSetGrade = params => { return axios.post(`${base}/oa/jx/jxAssessGrade/batchSetGrade`, params); };
export const closeGrade = params => { return axios.post(`${base}/oa/jx/jxAssessGrade/closeGrade`, params); };





 
