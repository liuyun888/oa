import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getOaContext();

/**
 * 用印申请表
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'申请单编号 主键',sealUserid:'申请人编号',sealUsername:'申请人姓名',sealDeptid:'申请部门编号',sealDeptName:'申请部门',sealPhoneno:'联系电话',reqTime:'申请时间',startTime:'用印开始时间',endTime:'用印结束时间',sealBranchId:'用印主体机构号',sealBranchName:'用印主题机构名称',bizFlowState:'流程状态',bizProcInstId:'流程实例编号',sealStatus:'申请状态',sealReason:'用印原因',remark:'其它说明'}
 * @author maimeng-mdp code-gen
 * @since 2023年10月9日
 **/

//普通查询 条件之间and关系
export const listSigSeal = params => {
    return axios.get(`${base}/oa/sig/sigSeal/list`, {params: params});
};

//普通查询 条件之间and关系
export const querySigSealById = params => {
    return axios.get(`${base}/oa/sig/sigSeal/queryById`, {params: params});
};

//删除一条用印申请表 params={id:'申请单编号 主键'}
export const delSigSeal = params => {
    return axios.post(`${base}/oa/sig/sigSeal/del`, params);
};

//批量删除用印申请表  params=[{id:'申请单编号 主键'}]
export const batchAddSigSeal = params => {
    return axios.post(`${base}/oa/sig/sigSeal/batchAdd`, params);
};

//批量删除用印申请表  params=[{id:'申请单编号 主键'}]
export const batchDelSigSeal = params => {
    return axios.post(`${base}/oa/sig/sigSeal/batchDel`, params);
};

//修改一条用印申请表记录
export const editSigSeal = params => {
    return axios.post(`${base}/oa/sig/sigSeal/edit`, params);
};

//新增一条用印申请表
export const addSigSeal = params => {
    return axios.post(`${base}/oa/sig/sigSeal/add`, params);
};

//批量修改某些字段
export const editSomeFieldsSigSeal = params => {
    return axios.post(`${base}/oa/sig/sigSeal/editSomeFields`, params);
};

//修改sigseal并修改sigsealsignet
export const editSigSealAndSigSealSignet = params => {
    return axios.post(`${base}/oa/sig/sigSeal/editSigSealAndSigSealSignet`, params);
};
