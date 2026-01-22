import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * ass_asset_card_oper
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',cardId:'卡片主键Id',assetSn:'资产编码',assetStatusAfter:'操作后资产状态',assetStatusBefore:'操作前资产状态',assetMngId:'单据编号',adjustStockNum:'调整库存数量',allocDate:'调拨日期',nowPsersonLiableUserid:'新责任人',nowPsersonLiableUsername:'新责任人名称',nowDeptid:'新使用部门编号',nowDeptName:'新使用部门名称',nowBranchId:'新机构编号',nowBranchName:'新机构名称',nowStoreAddress:'新地点',nowWarehouseId:'仓库编号',nowWarehouseName:'仓库名称',nowStoreAddressGps:'新地点定位',residualValue:'资产处置单-残值',netWorth:'资产处置单-净值',premiumSale:'资产出直单-报废变卖值',disposalType:'资产处置单-处置方式0出让1转让2出售3报废4报损5置换6盘亏7拍卖8捐赠',maintType:'维修方式',maintFee:'维修费用',maintOutBranchId:'外部维修单位',maintOutBranchName:'外部维修单位名称',maintOrignAmountPct:'占原值百分比',createDate:'创建日期',requireId:'ass_asset_mng操作单编号',disposeRemark:'资产处置备注文本',oldPsersonLiableUserid:'老的责任人',oldPsersonLiableUsername:'老的责任人名称',oldDeptid:'老的使用部门编号',oldDeptName:'老的使用部门名称',oldBranchId:'老的机构编号',oldBranchName:'老的机构名称',oldStoreAddress:'老的地点',oldWarehouseId:'老的仓库编号',oldWarehouseName:'老的仓库名称',oldStoreAddressGps:'老的新地点定位'}
 **/
 
//普通查询 条件之间and关系  
export const listAssetCardOper = params => { return axios.get(`${base}/oa/erp/ass/assetCardOper/list`, { params: params }); };

//模糊查询ass_asset_card_oper 条件之间or关系  
//export const listAssetCardOperKey = params => { return axios.get(`${base}/oa/erp/ass/assetCardOper/listKey`, { params: params }); };

//删除一条ass_asset_card_oper params={id:'主键 主键'}
export const delAssetCardOper = params => { return axios.post(`${base}/oa/erp/ass/assetCardOper/del`,params); };

//批量删除ass_asset_card_oper  params=[{id:'主键 主键'}]
export const batchDelAssetCardOper = params => { return axios.post(`${base}/oa/erp/ass/assetCardOper/batchDel`, params); };

//修改一条ass_asset_card_oper记录
export const editAssetCardOper = params => { return axios.post(`${base}/oa/erp/ass/assetCardOper/edit`, params); };

//新增一条ass_asset_card_oper
export const addAssetCardOper = params => { return axios.post(`${base}/oa/erp/ass/assetCardOper/add`, params); };

 //普通查询 条件之间and关系  
export const listAssetCardOperWithMng = params => { return axios.get(`${base}/oa/erp/ass/assetCardOper/listWithMng`, { params: params }); };
 //普通查询 条件之间and关系  
 export const getDetailAllProcInstIds = params => { return axios.get(`${base}/oa/erp/ass/assetCardOper/getDetailAllProcInstIds`, { params: params }); };


