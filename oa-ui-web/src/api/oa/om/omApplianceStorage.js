import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * om_appliance_storage
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',applianceId:'用品id',applianceName:'用品名称',standard:'规格',price:'单价',num:'入库数量',totalPrice:'金额',stock:'库存量',userId:'操作人id',username:'操作人名字',createTime:'入库日期',remark:'备注',supplierId:'供应商id',supplierName:'供应商',branchId:'机构号'}
 **/
 
//普通查询 条件之间and关系  
export const listOmApplianceStorage = params => { return axios.get(`${base}/oa/om/omApplianceStorage/list`, { params: params }); };

//模糊查询om_appliance_storage 条件之间or关系  
//export const listOmApplianceStorageKey = params => { return axios.get(`${base}/oa/om/omApplianceStorage/listKey`, { params: params }); };

//删除一条om_appliance_storage params={id:'主键 主键'}
export const delOmApplianceStorage = params => { return axios.post(`${base}/oa/om/omApplianceStorage/del`,params); };

//批量删除om_appliance_storage  params=[{id:'主键 主键'}]
export const batchDelOmApplianceStorage = params => { return axios.post(`${base}/oa/om/omApplianceStorage/batchDel`, params); };

//修改一条om_appliance_storage记录
export const editOmApplianceStorage = params => { return axios.post(`${base}/oa/om/omApplianceStorage/edit`, params); };

//新增一条om_appliance_storage
export const addOmApplianceStorage = params => { return axios.post(`${base}/oa/om/omApplianceStorage/add`, params); };