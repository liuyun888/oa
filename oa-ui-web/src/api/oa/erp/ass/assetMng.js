import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getOaContext();

/**
 * 资产出租/出借单
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'主键（采购申请单） 主键',reqUserid:'申请人编号',reqUsername:'申请人姓名',reqDeptid:'申请单位编号',reqDeptName:'申请单位名称',reqBranchId:'申请机构编号',reqBranchName:'申请机构名称',reqTitle:'申请标题',reqDate:'申请日期',reqReason:'申请事由',startDate:'维修/借用开始日期',endDate:'维修/借用结束日期',totalDay:'共维修/借用天数',opType:'操作方式lease租用reallocation调拨maint维修use领用return归还change变更dispose处置inventory盘点',maintTotalFeeAmount:'维修费用合计',maintIsConsumables:'是否需要维修配件/耗材0否1是',dispTotalOrignAmount:'资产处置总资产原值',dispTotalScrapSaleAmount:'资产处置报废变卖值合计',dispAddAssets:'资产处置同时处置附加资产',inDeptId:'资产出租借入部门',inDeptName:'资产出租借入部门名称',outDeptId:'资产出租借出部门',outDeptName:'资产出租借出部门名称',inBranchId:'资产出租借入机构id',inBranchName:'资产出租借入机构名称',outBranchId:'资产出租借出机构编号',outBranchName:'资产出租借出机构名称',mngStatus:'暂存:',inventoryTask:'盘点任务',bizProcInstId:'对应流程实例ID',bizKey:'流程业务key',commentMsg:'最后审批意见',assignee:'最后审批人',assigneeName:'最后审批人名称',agree:'最后审批意见0不同意1同意',flowLastTime:'流程最后更新时间',flowEndTime:'流程结束时间',actId:'流程当前节点编号',taskName:'当前任务名称',bizFlowState:'0初始1审批中2审批通过3审批不通过4流程取消或者删除'}
 * @author maimeng-mdp code-gen
 * @since 2023年10月8日
 **/

//普通查询 条件之间and关系
export const listAssetMng = params => { return axios.get(`${base}/oa/erp/ass/assetMng/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryAssetMngById = params => { return axios.get(`${base}/oa/erp/ass/assetMng/queryById`, { params: params }); };

//删除一条资产出租/出借单 params={id:'主键（采购申请单） 主键'}
export const delAssetMng = params => { return axios.post(`${base}/oa/erp/ass/assetMng/del`,params); };

//批量删除资产出租/出借单  params=[{id:'主键（采购申请单） 主键'}]
export const batchAddAssetMng = params => { return axios.post(`${base}/oa/erp/ass/assetMng/batchAdd`, params); };

//批量删除资产出租/出借单  params=[{id:'主键（采购申请单） 主键'}]
export const batchDelAssetMng = params => { return axios.post(`${base}/oa/erp/ass/assetMng/batchDel`, params); };

//修改一条资产出租/出借单记录
export const editAssetMng = params => { return axios.post(`${base}/oa/erp/ass/assetMng/edit`, params); };

//新增一条资产出租/出借单
export const addAssetMng = params => { return axios.post(`${base}/oa/erp/ass/assetMng/add`, params); };

//批量修改某些字段
export const editSomeFieldsAssetMng = params => { return axios.post(`${base}/oa/erp/ass/assetMng/editSomeFields`, params); };

//查询通过id查询单据资产明细
export const getDetail = params => { return axios.get(`${base}/oa/erp/ass/assetMng/getDetail`, { params: params }); };

export const addMngFlow = params => { return axios.post(`${base}/oa/erp/ass/assetMng/addMng`, params); };

export const editMngFlow = params => { return axios.post(`${base}/oa/erp/ass/assetMng/editMng`, params); };
