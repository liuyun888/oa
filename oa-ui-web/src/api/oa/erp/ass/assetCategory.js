import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()

/**
 * ass_asset_category
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={categoryId:'资产编码 主键',categoryName:'资产分类名称',parentId:'上级Id,顶级为0',level:'层次排序',seq:'排序'}
 **/
 
//普通查询 条件之间and关系  
export const listAssetCategory = params => { return axios.get(`${base}/oa/erp/ass/assetCategory/list`, { params: params }); };

//模糊查询ass_asset_category 条件之间or关系  
//export const listAssetCategoryKey = params => { return axios.get(`${base}/oa/erp/ass/assetCategory/listKey`, { params: params }); };

//删除一条ass_asset_category params={categoryId:'资产编码 主键'}
export const delAssetCategory = params => { return axios.post(`${base}/oa/erp/ass/assetCategory/del`,params); };

//批量删除ass_asset_category  params=[{categoryId:'资产编码 主键'}]
export const batchDelAssetCategory = params => { return axios.post(`${base}/oa/erp/ass/assetCategory/batchDel`, params); };

//修改一条ass_asset_category记录
export const editAssetCategory = params => { return axios.post(`${base}/oa/erp/ass/assetCategory/edit`, params); };

//新增一条ass_asset_category
export const addAssetCategory = params => { return axios.post(`${base}/oa/erp/ass/assetCategory/add`, params); };

//查询资产分类树形结构
export const getAssetCategoryTree = params => { return axios.get(`${base}/oa/erp/ass/assetCategory/getAssetCategoryTree`, params); };