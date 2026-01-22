import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * pur_supplier
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'编号 主键',name:'供应商名称',companyNo:'公司统一信用代码证',userid:'公司联系人',username:'联系人名称',companyAddress:'公司地址',districtId:'归属地区',addressGps:'公司定位',branchId:'归属机构编号',branchName:'归属机构名称',locationId:'门店编号',shopId:'商户编号'}
 **/
 
//普通查询 条件之间and关系  
export const listSupplier = params => { return axios.get(`${base}/oa/erp/pur/supplier/list`, { params: params }); };

//模糊查询pur_supplier 条件之间or关系  
//export const listSupplierKey = params => { return axios.get(`${base}/oa/erp/pur/supplier/listKey`, { params: params }); };

//删除一条pur_supplier params={id:'编号 主键'}
export const delSupplier = params => { return axios.post(`${base}/oa/erp/pur/supplier/del`,params); };

//批量删除pur_supplier  params=[{id:'编号 主键'}]
export const batchDelSupplier = params => { return axios.post(`${base}/oa/erp/pur/supplier/batchDel`, params); };

//修改一条pur_supplier记录
export const editSupplier = params => { return axios.post(`${base}/oa/erp/pur/supplier/edit`, params); };

//新增一条pur_supplier
export const addSupplier = params => { return axios.post(`${base}/oa/erp/pur/supplier/add`, params); };