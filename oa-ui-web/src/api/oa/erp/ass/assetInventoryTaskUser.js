import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()

/**
 * ass_asset_inventory_task_user
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',inventoryUserid:'用户Id',inventoryUsername:'用户名称',taskId:'盘点任务Id'}
 **/
 
//普通查询 条件之间and关系  
export const listAssetInventoryTaskUser = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTaskUser/list`, { params: params }); };

//模糊查询ass_asset_inventory_task_user 条件之间or关系  
//export const listAssetInventoryTaskUserKey = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTaskUser/listKey`, { params: params }); };

//删除一条ass_asset_inventory_task_user params={id:'id 主键'}
export const delAssetInventoryTaskUser = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTaskUser/del`,params); };

//批量删除ass_asset_inventory_task_user  params=[{id:'id 主键'}]
export const batchDelAssetInventoryTaskUser = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTaskUser/batchDel`, params); };

//修改一条ass_asset_inventory_task_user记录
export const editAssetInventoryTaskUser = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTaskUser/edit`, params); };

//新增一条ass_asset_inventory_task_user
export const addAssetInventoryTaskUser = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTaskUser/add`, params); };