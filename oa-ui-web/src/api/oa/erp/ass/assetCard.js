import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getOaContext();

/**
 * ass_asset_card
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={cardId:'主键id 主键',detailId:'关联的资产id',cardStatus:'卡片状态0闲置1在用2借用4报废5待领取',assetSn:'资产编码',assetNo:'资产序列号',spec:'规格型号',measUnit:'计量单位',orignUnitAmount:'资产原值',servLife:'使用期限',branchId:'组织机构代码',deptid:'使用部门',deptName:'使用部门名称',personLiableUserid:'责任人',personLiableUsername:'责任人名称',purchaseUserid:'采购人',purchaseUsername:'采购人姓名',purchaseDate:'采购日期',supplierId:'供应商id',supplierName:'供应商名称',passetSn:'所属父资产',passetName:'所属父资产名称',defectsLiabilityPeriod:'保修期（月）',warehouseDate:'入库日期',startUseDate:'开始使用日期',inventoryTask:'盘点任务',confDesc:'配置说明',remark:'备注',assetImageUrl:'资产图片',createUserid:'创建人',createTime:'创建时间',createUsername:'创建人名称',lastEditUserid:'最后修改人',lastEditTime:'最后修改时间',lastEditUsername:'最后修改人名称',receiptNo:'入库单号',assetName:'资产名称',warehouseId:'仓库编号',warehouseName:'仓库名称',storeAddress:'存放地点',productId:'产品编号',productSn:'产品编码',brandId:'品牌编号',brandName:'品牌名称',cardType:'hold',categoryId:'资产分类Id',categoryName:'资产分类名称',isInventory:'是否正在盘点',currency:'资产币种人名币CNY,港元HKD,美元USD,欧元EUR,英镑GBP,日元JPY',stockNum:'库存数量',splitNum:'按数量拆分',residualValue:'资产处置单-残值',netWorth:'资产处置单-净值',premiumSale:'资产处置单-报废变卖值',cbCenterId:'成本中心编号',cbCenterName:'成本中心名称',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除',bizProcInstId:'当前审批流程实例',flowTitle:'当前审批流标题',isMaint:'是否在维修0否1是',maintStartTime:'开始维修日期',maintEndTime:'维修完成日期'}
 * @author maimeng-mdp code-gen
 * @since 2023年10月8日
 **/

//普通查询 条件之间and关系
export const listAssetCard = params => { return axios.get(`${base}/oa/erp/ass/assetCard/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryAssetCardById = params => { return axios.get(`${base}/oa/erp/ass/assetCard/queryById`, { params: params }); };

//删除一条ass_asset_card params={cardId:'主键id 主键'}
export const delAssetCard = params => { return axios.post(`${base}/oa/erp/ass/assetCard/del`,params); };

//批量删除ass_asset_card  params=[{cardId:'主键id 主键'}]
export const batchAddAssetCard = params => { return axios.post(`${base}/oa/erp/ass/assetCard/batchAdd`, params); };

//批量删除ass_asset_card  params=[{cardId:'主键id 主键'}]
export const batchDelAssetCard = params => { return axios.post(`${base}/oa/erp/ass/assetCard/batchDel`, params); };

//修改一条ass_asset_card记录
export const editAssetCard = params => { return axios.post(`${base}/oa/erp/ass/assetCard/edit`, params); };

//新增一条ass_asset_card
export const addAssetCard = params => { return axios.post(`${base}/oa/erp/ass/assetCard/add`, params); };

//批量修改某些字段
export const editSomeFieldsAssetCard = params => { return axios.post(`${base}/oa/erp/ass/assetCard/editSomeFields`, params); };

export const getAssetCards = params => { return axios.get(`${base}/oa/erp/ass/assetCard/getAssetCards`, { params: params }); };

export const getInventoryCards = params => { return axios.get(`${base}/oa/erp/ass/assetCard/getInventoryCards`, { params: params }); };
