import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()



/**
 * ass_asset_inventory_task_detail
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',cardId:'资产卡片Id',detailStatus:'盘点任务状态，0未盘点'}
 **/
 
//普通查询 条件之间and关系  
export const listAssetInventoryTaskDetail = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTaskDetail/list`, { params: params }); };

//模糊查询ass_asset_inventory_task_detail 条件之间or关系  
//export const listAssetInventoryTaskDetailKey = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTaskDetail/listKey`, { params: params }); };

//删除一条ass_asset_inventory_task_detail params={id:'id 主键'}
export const delAssetInventoryTaskDetail = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTaskDetail/del`,params); };

//批量删除ass_asset_inventory_task_detail  params=[{id:'id 主键'}]
export const batchDelAssetInventoryTaskDetail = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTaskDetail/batchDel`, params); };

//修改一条ass_asset_inventory_task_detail记录
export const editAssetInventoryTaskDetail = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTaskDetail/edit`, params); };

//新增一条ass_asset_inventory_task_detail
export const addAssetInventoryTaskDetail = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTaskDetail/add`, params); };

//根据状态查询明细数量
export const getTaskCountByStatus = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTaskDetail/getTaskCountByStatus`, { params: params }); };
