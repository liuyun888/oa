import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * ass_asset_inventory_task
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={taskId:'盘点任务id 主键',reqUsername:'申请人姓名',reqDeptid:'申请人部门',reqDeptName:'申请人部门名称',reqTitle:'申请标题',reqBranchId:'申请机构id',reqBranchName:'申请机构名称',reqDate:'申请日期',allocationType:'分配用户',categoryId:'资产类别id',categoryName:'资产类别名称',warehouseId:'仓库id',warehouseName:'仓库名称',purchasedateType:'采购时间0',startTime:'开始时间',endTime:'结束时间',taskStatus:'over',reqStatus:'hold'}
 **/
 
//普通查询 条件之间and关系  
export const listAssetInventoryTask = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTask/list`, { params: params }); };

//模糊查询ass_asset_inventory_task 条件之间or关系  
//export const listAssetInventoryTaskKey = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTask/listKey`, { params: params }); };

//删除一条ass_asset_inventory_task params={taskId:'盘点任务id 主键'}
export const delAssetInventoryTask = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTask/del`,params); };

//批量删除ass_asset_inventory_task  params=[{taskId:'盘点任务id 主键'}]
export const batchDelAssetInventoryTask = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTask/batchDel`, params); };

//修改一条ass_asset_inventory_task记录
export const editAssetInventoryTask = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTask/edit`, params); };

//新增一条ass_asset_inventory_task
export const addAssetInventoryTask = params => { return axios.post(`${base}/oa/erp/ass/assetInventoryTask/add`, params); };

//查询任务关联的资产卡片
export const getTaskDetail = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTask/getTaskDetail`, { params: params }); };

//获取我能盘点的任务
export const getMyTaskDetail = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTask/getMyTaskDetail`, { params: params }); };

//获取能操作该盘点任务的用户信息
export const getCanOperTaskUser = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTask/getCanOperTaskUser`, { params: params }); };

//完成盘点任务
export const finishInventory = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTask/finishInventory`, { params: params }); };

//开始资产任务盘点
export const beginInventory = params => { return axios.get(`${base}/oa/erp/ass/assetInventoryTask/beginInventory`, { params: params }); };


