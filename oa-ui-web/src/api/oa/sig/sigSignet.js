import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * sig_signet
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'印章主键 主键',signetSn:'印章标识码',deviceId:'印章设备',signetType:'印章类型公章0法人代表章1法人代表章',signetSimpleName:'印章简称',signetName:'印章全称',keepRecord

Id:'备案编号',signetContext:'章面信息',signetStatus:'印章状态0-启用1-停用',signetBranchId:'所属主体',signetBranchName:'主题名称',bizFlowState:'流程状态',bizProcInstId:'流程实例编号',signetForm:'印章形态0电子印章1物理印章'}
 **/
 
//普通查询 条件之间and关系  
export const listSigSignet = params => { return axios.get(`${base}/oa/sig/sigSignet/list`, { params: params }); };

//模糊查询sig_signet 条件之间or关系  
//export const listSigSignetKey = params => { return axios.get(`${base}/oa/sig/sigSignet/listKey`, { params: params }); };

//删除一条sig_signet params={id:'印章主键 主键'}
export const delSigSignet = params => { return axios.post(`${base}/oa/sig/sigSignet/del`,params); };

//批量删除sig_signet  params=[{id:'印章主键 主键'}]
export const batchDelSigSignet = params => { return axios.post(`${base}/oa/sig/sigSignet/batchDel`, params); };

//修改一条sig_signet记录
export const editSigSignet = params => { return axios.post(`${base}/oa/sig/sigSignet/edit`, params); };

//新增一条sig_signet
export const addSigSignet = params => { return axios.post(`${base}/oa/sig/sigSignet/add`, params); };
//根据印章类型查询印章  
export const listSigSignetBySignetType = params => { return axios.get(`${base}/oa/sig/sigSignet/listSigSignetBySignetType`, { params: params }); };
