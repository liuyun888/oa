import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * car_require
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'申请编号 主键',reqStartTime:'申请用车开始时间',reqEndTime:'申请用车结束时间',reqDeptid:'申请部门编号',reqDeptName:'申请部门名称',reqBranchId:'申请机构号',reqUserid:'申请人编号',reqUsername:'申请人姓名',reqPhoneno:'申请人电话',reqReason:'申请事由',reqTime:'申请时间',reqStatus:'申请状态',bizFlowState:'审批状态',bizProcInstId:'流程实例编号',destAddress:'目的地地址',destGps:'目的地定位',reqTitle:'申请标题',hasRoute:'是否规划路线',reqBranchName:'机构名称'}
 **/
 
//根据申请用车id进行查询其他信息
export const getMessageById = params => { return axios.get(`${base}/oa/car/carRequire/getMessageById`, { params: params }); };

//普通查询 条件之间and关系  
export const listCarRequire = params => { return axios.get(`${base}/oa/car/carRequire/list`, { params: params }); };

//模糊查询car_require 条件之间or关系  
//export const listCarRequireKey = params => { return axios.get(`${base}/oa/car/carRequire/listKey`, { params: params }); };

//删除一条car_require params={id:'申请编号 主键'}
export const delCarRequire = params => { return axios.post(`${base}/oa/car/carRequire/del`,params); };

//批量删除car_require  params=[{id:'申请编号 主键'}]
export const batchDelCarRequire = params => { return axios.post(`${base}/oa/car/carRequire/batchDel`, params); };

//修改一条car_require记录
export const editCarRequire = params => { return axios.post(`${base}/oa/car/carRequire/edit`, params); };

//新增一条car_require
export const addCarRequire = params => { return axios.post(`${base}/oa/car/carRequire/add`, params); };