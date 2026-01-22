import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getOaContext();

/**
 * 印章设备库
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'印章设备编号 主键',deviceName:'设备名称',branchId:'归属机构',deptid:'归属部门',deptName:'归属部门',branchName:'归属机构名称',deviceSn:'设备标识码',brandId:'品牌编号',brandName:'品牌名称',startTime:'启用时间',endTime:'停用时间',status:'状态0停用1启用',address:'保管地址',addressGps:'地址定位',deviceType:'设备类型0便携机1台式机2普通印章',bizFlowState:'流程状态',bizProcInstId:'流程实例编号',admUserid:'管理用户编号',admUsername:'管理员姓名',admDeptid:'管理部门编号',admDeptName:'管理部门名称',admBranchId:'管理机构号'}
 * @author maimeng-mdp code-gen
 * @since 2023年10月9日
 **/
 
//普通查询 条件之间and关系  
export const listSigDevice = params => { return axios.get(`${base}/oa/sig/sigDevice/list`, { params: params }); };

//普通查询 条件之间and关系
export const querySigDeviceById = params => { return axios.get(`${base}/oa/sig/sigDevice/queryById`, { params: params }); };

//删除一条印章设备库 params={id:'印章设备编号 主键'}
export const delSigDevice = params => { return axios.post(`${base}/oa/sig/sigDevice/del`,params); };

//批量删除印章设备库  params=[{id:'印章设备编号 主键'}]
export const batchAddSigDevice = params => { return axios.post(`${base}/oa/sig/sigDevice/batchAdd`, params); };

//批量删除印章设备库  params=[{id:'印章设备编号 主键'}]
export const batchDelSigDevice = params => { return axios.post(`${base}/oa/sig/sigDevice/batchDel`, params); };

//修改一条印章设备库记录
export const editSigDevice = params => { return axios.post(`${base}/oa/sig/sigDevice/edit`, params); };

//新增一条印章设备库
export const addSigDevice = params => { return axios.post(`${base}/oa/sig/sigDevice/add`, params); };

//批量修改某些字段
export const editSomeFieldsSigDevice = params => { return axios.post(`${base}/oa/sig/sigDevice/editSomeFields`, params); };