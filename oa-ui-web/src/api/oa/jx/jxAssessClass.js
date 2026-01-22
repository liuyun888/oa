import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * jx_assess_class
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',name:'等级名称',classTyle:'等级类型,1-优秀，2-良好，3-中等，4-合格，5-不合格',prescribedLimitLeft:'评定范围',prescribedLimitRight:'评定范围',branchId:'机构号'}
 **/
 
//普通查询 条件之间and关系  
export const listJxAssessClass = params => { return axios.get(`${base}/oa/jx/jxAssessClass/list`, { params: params }); };

//模糊查询jx_assess_class 条件之间or关系  
//export const listJxAssessClassKey = params => { return axios.get(`${base}/oa/jx/jxAssessClass/listKey`, { params: params }); };

//删除一条jx_assess_class params={id:'id 主键'}
export const delJxAssessClass = params => { return axios.post(`${base}/oa/jx/jxAssessClass/del`,params); };

//批量删除jx_assess_class  params=[{id:'id 主键'}]
export const batchDelJxAssessClass = params => { return axios.post(`${base}/oa/jx/jxAssessClass/batchDel`, params); };

//修改一条jx_assess_class记录
export const editJxAssessClass = params => { return axios.post(`${base}/oa/jx/jxAssessClass/edit`, params); };

//新增一条jx_assess_class
export const addJxAssessClass = params => { return axios.post(`${base}/oa/jx/jxAssessClass/add`, params); };

//保存
export const saveAssessClassList = params => { return axios.post(`${base}/oa/jx/jxAssessClass/saveAssessClassList`, params); };

