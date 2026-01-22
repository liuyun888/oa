import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()

/**
 * pur_require_detail_disassemble
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={assetSn:'资产编码 主键',categoryId:'资产类别',assetNo:'资产序列号',spec:'规格型号',measUnit:'计量单位',orignUnitAmount:'资产原值',servLife:'使用期限',branchId:'组织机构代码',deptid:'使用部门',storeAddress:'存放地点',personLiable

Userid:'责任人',purchaseUserid:'采购人',supplierId:'供应商编号',passetSn:'所属父资产',passetName:'所属父资产资产编码',defectsLiabilityPeriod:'保修期（月）',warehouseDate:'入库日期',assetStatus:'资产状态0闲置1在用2借用3维修4报废',startUseDate:'开始使用日期',inventoryTask:'盘点任务',confDesc:'配置说明',remark:'备注',assetImageUrl:'资产图片',createUserid:'创建人',createTime:'创建时间',lastEditUserid:'最后修改人',
lastEditTime:'最后修改时间',receiptNo:'入库单号',supplierName:'供应商',assetName:'资产名称',stockNum:'数量',warehouseId:'仓库编号',productId:'产品编号',productSn:'产品编码',brandId:'品牌编号',brandName:'品牌名称',requireId:'申购单号'}
 **/
 
//普通查询 条件之间and关系  
export const listRequireDetailDisassemble = params => { return axios.get(`${base}/oa/erp/pur/requireDetailDisassemble/list`, { params: params }); };

//模糊查询pur_require_detail_disassemble 条件之间or关系  
//export const listRequireDetailDisassembleKey = params => { return axios.get(`${base}/oa/erp/pur/requireDetailDisassemble/listKey`, { params: params }); };

//删除一条pur_require_detail_disassemble params={assetSn:'资产编码 主键'}
export const delRequireDetailDisassemble = params => { return axios.post(`${base}/oa/erp/pur/requireDetailDisassemble/del`,params); };

//批量删除pur_require_detail_disassemble  params=[{assetSn:'资产编码 主键'}]
export const batchDelRequireDetailDisassemble = params => { return axios.post(`${base}/oa/erp/pur/requireDetailDisassemble/batchDel`, params); };

//修改一条pur_require_detail_disassemble记录
export const editRequireDetailDisassemble = params => { return axios.post(`${base}/oa/erp/pur/requireDetailDisassemble/edit`, params); };

//新增一条pur_require_detail_disassemble
export const addRequireDetailDisassemble = params => { return axios.post(`${base}/oa/erp/pur/requireDetailDisassemble/add`, params); };