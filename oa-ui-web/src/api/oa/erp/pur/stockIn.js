import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getOaContext();

/**
 * pur_stock_in
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'入库单号 主键',title:'入库单标题',reqUserid:'申请人编号',reqUsername:'申请人姓名',reqDate:'申请日期',reqBranchId:'申请人机构id',isAssetCard:'是否生成资产卡片',cardDisByNum:'资产卡片是否按数量拆分',stockStatus:'入库单状态',bizProcInstId:'对应流程实例ID',bizKey:'流程业务key',commentMsg:'最后审批意见',assignee:'最后审批人',assigneeName:'最后审批人名称',agree:'最后审批意见0不同意1同意',flowLastTime:'流程最后更新时间',flowEndTime:'流程结束时间',actId:'流程当前节点编号',taskName:'当前任务名称',bizFlowState:'0初始1审批中2审批通过3审批不通过4流程取消或者删除',totalInNum:'总入库数量',totalStockNum:'总采购量',reqDeptid:'申购单位编号',reqDeptName:'申购单位名称',reqReason:'申购事由'}
 * @author maimeng-mdp code-gen
 * @since 2023年10月8日
 **/

//普通查询 条件之间and关系
export const listStockIn = params => { return axios.get(`${base}/oa/erp/pur/stockIn/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryStockInById = params => { return axios.get(`${base}/oa/erp/pur/stockIn/queryById`, { params: params }); };

//删除一条pur_stock_in params={id:'入库单号 主键'}
export const delStockIn = params => { return axios.post(`${base}/oa/erp/pur/stockIn/del`,params); };

//批量删除pur_stock_in  params=[{id:'入库单号 主键'}]
export const batchAddStockIn = params => { return axios.post(`${base}/oa/erp/pur/stockIn/batchAdd`, params); };

//批量删除pur_stock_in  params=[{id:'入库单号 主键'}]
export const batchDelStockIn = params => { return axios.post(`${base}/oa/erp/pur/stockIn/batchDel`, params); };

//修改一条pur_stock_in记录
export const editStockIn = params => { return axios.post(`${base}/oa/erp/pur/stockIn/edit`, params); };

//新增一条pur_stock_in
export const addStockIn = params => { return axios.post(`${base}/oa/erp/pur/stockIn/add`, params); };

//批量修改某些字段
export const editSomeFieldsStockIn = params => { return axios.post(`${base}/oa/erp/pur/stockIn/editSomeFields`, params); };

export const listStorkInDetail = params => { return axios.get(`${base}/oa/erp/pur/stockIn/listStorkInDetail`, { params: params }); };

export const getStockInById = params => { return axios.get(`${base}/oa/erp/pur/stockIn/getStockInById`, { params: params }); };
