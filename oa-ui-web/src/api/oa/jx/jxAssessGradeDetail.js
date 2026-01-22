import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * 考核分数详情表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',grade:'复评分',gradeId:'总分表id',selfAssessment:'自评分',vouchGrade:'核定分',contentId:'考核项主键'}
 **/
 
//普通查询 条件之间and关系  
export const listJxAssessGradeDetail = params => { return axios.get(`${base}/oa/jx/jxAssessGradeDetail/list`, { params: params }); };

//模糊查询考核分数详情表 条件之间or关系  
//export const listJxAssessGradeDetailKey = params => { return axios.get(`${base}/oa/jx/jxAssessGradeDetail/listKey`, { params: params }); };

//删除一条考核分数详情表 params={id:'id 主键'}
export const delJxAssessGradeDetail = params => { return axios.post(`${base}/oa/jx/jxAssessGradeDetail/del`,params); };

//批量删除考核分数详情表  params=[{id:'id 主键'}]
export const batchDelJxAssessGradeDetail = params => { return axios.post(`${base}/oa/jx/jxAssessGradeDetail/batchDel`, params); };

//修改一条考核分数详情表记录
export const editJxAssessGradeDetail = params => { return axios.post(`${base}/oa/jx/jxAssessGradeDetail/edit`, params); };

//新增一条考核分数详情表
export const addJxAssessGradeDetail = params => { return axios.post(`${base}/oa/jx/jxAssessGradeDetail/add`, params); };