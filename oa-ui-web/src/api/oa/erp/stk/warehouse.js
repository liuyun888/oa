import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * stk_warehouse
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'仓库名称',districtId:'仓库所属区域',districtName:'区域名称',province:'仓库所属的省',city:'仓库所属的市',street:'仓库所属的街道',provinceCode:'仓库所属的省份代码',cityCode:'仓库所属的城市代码',streetCode:'仓库所属的街道代码',address:'仓库所属地址',addressGps:'地址定位',branchId:'机构编号',branchName:'机构名称',shopId:'商户编号',locationId:'门店编号'}
 **/
 
//普通查询 条件之间and关系
export const listWarehouse = params => { return axios.get(`${base}/oa/erp/stk/warehouse/list`, { params: params }); };

//模糊查询stk_warehouse 条件之间or关系  
//export const listWarehouseKey = params => { return axios.get(`${base}/oa/erp/stk/warehouse/listKey`, { params: params }); };

//删除一条stk_warehouse params={id:'主键 主键'}
export const delWarehouse = params => { return axios.post(`${base}/oa/erp/stk/warehouse/del`,params); };

//批量删除stk_warehouse  params=[{id:'主键 主键'}]
export const batchDelWarehouse = params => { return axios.post(`${base}/oa/erp/stk/warehouse/batchDel`, params); };

//修改一条stk_warehouse记录
export const editWarehouse = params => { return axios.post(`${base}/oa/erp/stk/warehouse/edit`, params); };

//新增一条stk_warehouse
export const addWarehouse = params => { return axios.post(`${base}/oa/erp/stk/warehouse/add`, params); };