import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * jx_assess_content
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',indexItems:'考核指标项',indexExplain:'考核指标说明',weight:'权重%',weightExplain:'权重说明',templateId:'考核模板id',branchId:'组织id',
serialNumber:'序号'}
 **/
 
//普通查询 条件之间and关系  
export const listJxAssessContent = params => { return axios.get(`${base}/oa/jx/jxAssessContent/list`, { params: params }); };

//模糊查询jx_assess_content 条件之间or关系  
//export const listJxAssessContentKey = params => { return axios.get(`${base}/oa/jx/jxAssessContent/listKey`, { params: params }); };

//删除一条jx_assess_content params={id:'id 主键'}
export const delJxAssessContent = params => { return axios.post(`${base}/oa/jx/jxAssessContent/del`,params); };

//批量删除jx_assess_content  params=[{id:'id 主键'}]
export const batchDelJxAssessContent = params => { return axios.post(`${base}/oa/jx/jxAssessContent/batchDel`, params); };

//修改一条jx_assess_content记录
export const editJxAssessContent = params => { return axios.post(`${base}/oa/jx/jxAssessContent/edit`, params); };

//新增一条jx_assess_content
export const addJxAssessContent = params => { return axios.post(`${base}/oa/jx/jxAssessContent/add`, params); };