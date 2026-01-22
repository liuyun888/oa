import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * ass_asset_maintenance_consumables
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键（采购申请单） 主键',requireId:'维修单编号',consuName:'配件/耗材名字',consuSpec:'规格型号',consuNum:'数量',unitPrice:'单价',remark:'说明'}
 **/
 
//普通查询 条件之间and关系  
export const listAssetMaintenanceConsumables = params => { return axios.get(`${base}/oa/erp/ass/assetMaintenanceConsumables/list`, { params: params }); };

//模糊查询ass_asset_maintenance_consumables 条件之间or关系  
//export const listAssetMaintenanceConsumablesKey = params => { return axios.get(`${base}/oa/erp/ass/assetMaintenanceConsumables/listKey`, { params: params }); };

//删除一条ass_asset_maintenance_consumables params={id:'主键（采购申请单） 主键'}
export const delAssetMaintenanceConsumables = params => { return axios.post(`${base}/oa/erp/ass/assetMaintenanceConsumables/del`,params); };

//批量删除ass_asset_maintenance_consumables  params=[{id:'主键（采购申请单） 主键'}]
export const batchDelAssetMaintenanceConsumables = params => { return axios.post(`${base}/oa/erp/ass/assetMaintenanceConsumables/batchDel`, params); };

//修改一条ass_asset_maintenance_consumables记录
export const editAssetMaintenanceConsumables = params => { return axios.post(`${base}/oa/erp/ass/assetMaintenanceConsumables/edit`, params); };

//新增一条ass_asset_maintenance_consumables
export const addAssetMaintenanceConsumables = params => { return axios.post(`${base}/oa/erp/ass/assetMaintenanceConsumables/add`, params); };


export const getDataByRequireId = params => { return axios.get(`${base}/oa/erp/ass/assetMaintenanceConsumables/getDataByRequireId`, { params: params }); };
