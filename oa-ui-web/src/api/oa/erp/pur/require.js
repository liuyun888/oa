import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()

/**
 * pur_require
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键（采购申请单） 主键',reqUserid:'申购人编号',reqUsername:'申购人姓名',reqDeptid:'申购单位编号',reqDeptName:'申购单位名称',reqTitle:'申购标题',reqBranchId:'申购机构编号',reqBranchName:'申购机构名称',reqDate:'申购日期',isPlan:'是否计划内0否1是',reqReason:'申购事由',reqType:'申购方式0采购1内部调拨',purchaseInquiryRemark:'采购询价意见'}
 **/
 
//普通查询 条件之间and关系  
export const listRequire = params => { return axios.get(`${base}/oa/erp/pur/require/list`, { params: params }); };

//模糊查询pur_require 条件之间or关系  
//export const listRequireKey = params => { return axios.get(`${base}/oa/erp/pur/require/listKey`, { params: params }); };

//删除一条pur_require params={id:'主键（采购申请单） 主键'}
export const delRequire = params => { return axios.post(`${base}/oa/erp/pur/require/del`,params); };

//批量删除pur_require  params=[{id:'主键（采购申请单） 主键'}]
export const batchDelRequire = params => { return axios.post(`${base}/oa/erp/pur/require/batchDel`, params); };

//修改一条pur_require记录
export const editRequire = params => { return axios.post(`${base}/oa/erp/pur/require/edit`, params); };

//新增一条pur_require
export const addRequire = params => { return axios.post(`${base}/oa/erp/pur/require/add`, params); };