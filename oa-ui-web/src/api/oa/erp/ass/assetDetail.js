import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getOaContext();

/**
 * ass_asset_detail
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'id 主键',assetSn:'资产编码',categoryId:'资产类别',categoryName:'资产类别名称',assetNo:'资产序列号',spec:'规格型号',measUnit:'计量单位',orignUnitAmount:'资产原值',servLife:'使用期限',branchId:'组织机构代码',deptid:'使用部门',deptName:'使用部门名称',storeAddress:'存放地点',personLiableUserid:'责任人',purchaseUserid:'采购人',purchaseUsername:'采购人名称',purchaseDate:'采购时间',supplierId:'供应商编号',passetSn:'所属父资产资产编码',passetName:'所属父资产',defectsLiabilityPeriod:'保修期（月）',warehouseDate:'入库日期',assetStatus:'资产状态0闲置1在用2借用3维修4报废',startUseDate:'开始使用日期',inventoryTask:'盘点任务',confDesc:'配置说明',remark:'备注',assetImageUrl:'资产图片',createUserid:'创建人',createTime:'创建时间',createUsername:'创建人名称',lastEditUserid:'最后修改人',lastEditTime:'最后修改时间',lastEditUsername:'最后修改人名称',receiptNo:'入库单号',supplierName:'供应商',assetName:'资产名称',stockNum:'总数量(如果有卡片，则=card_stock_num)',warehouseId:'仓库编号',warehouseName:'仓库名称',productId:'产品编号',productSn:'产品编码',brandId:'品牌编号',brandName:'品牌名称',cardNum:'资产卡片的卡片数量，注意不是卡片的库存数量',openCard:'是否创建卡片0否1是，同种资产要么都建卡要么都不建卡',splitNum:'按数量拆分成多张卡片',cardStockNum:'卡片中库存数量',residualValue:'资产处置单-残值',netWorth:'资产处置单-净值',premiumSale:'资产处置单-报废变卖值',cbCenterId:'成本中心编号',cbCenterName:'成本中心名称'}
 * @author maimeng-mdp code-gen
 * @since 2023年10月8日
 **/
 
//普通查询 条件之间and关系  
export const listAssetDetail = params => { return axios.get(`${base}/oa/erp/ass/assetDetail/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryAssetDetailById = params => { return axios.get(`${base}/oa/erp/ass/assetDetail/queryById`, { params: params }); };

//删除一条ass_asset_detail params={id:'id 主键'}
export const delAssetDetail = params => { return axios.post(`${base}/oa/erp/ass/assetDetail/del`,params); };

//批量删除ass_asset_detail  params=[{id:'id 主键'}]
export const batchAddAssetDetail = params => { return axios.post(`${base}/oa/erp/ass/assetDetail/batchAdd`, params); };

//批量删除ass_asset_detail  params=[{id:'id 主键'}]
export const batchDelAssetDetail = params => { return axios.post(`${base}/oa/erp/ass/assetDetail/batchDel`, params); };

//修改一条ass_asset_detail记录
export const editAssetDetail = params => { return axios.post(`${base}/oa/erp/ass/assetDetail/edit`, params); };

//新增一条ass_asset_detail
export const addAssetDetail = params => { return axios.post(`${base}/oa/erp/ass/assetDetail/add`, params); };

//批量修改某些字段
export const editSomeFieldsAssetDetail = params => { return axios.post(`${base}/oa/erp/ass/assetDetail/editSomeFields`, params); };