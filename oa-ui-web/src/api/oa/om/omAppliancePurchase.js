import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * om_appliance_purchase
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',applianceId:'用品id',applianceName:'用品名称',standard:'规格',price:'单价',num:'采购数量',totalPrice:'金额',stock:'库存量',userId:'操作人id',username:'操作人名字',createTime:'入库日期',remark:'备注',supplierId:'供应商id',supplierName:'供应商',branchId:'机构号'}
 **/
 
//普通查询 条件之间and关系  
export const listOmAppliancePurchase = params => { return axios.get(`${base}/oa/om/omAppliancePurchase/list`, { params: params }); };

//模糊查询om_appliance_purchase 条件之间or关系  
//export const listOmAppliancePurchaseKey = params => { return axios.get(`${base}/oa/om/omAppliancePurchase/listKey`, { params: params }); };

//删除一条om_appliance_purchase params={id:'主键 主键'}
export const delOmAppliancePurchase = params => { return axios.post(`${base}/oa/om/omAppliancePurchase/del`,params); };

//批量删除om_appliance_purchase  params=[{id:'主键 主键'}]
export const batchDelOmAppliancePurchase = params => { return axios.post(`${base}/oa/om/omAppliancePurchase/batchDel`, params); };

//修改一条om_appliance_purchase记录
export const editOmAppliancePurchase = params => { return axios.post(`${base}/oa/om/omAppliancePurchase/edit`, params); };
export const pushStorageOmAppliancePurchase = params => { return axios.post(`${base}/oa/om/omAppliancePurchase/pushStorage`, params); };
export const batPushStorageOmAppliancePurchase = params => { return axios.post(`${base}/oa/om/omAppliancePurchase/batPushStorage`, params); };

//新增一条om_appliance_purchase
export const addOmAppliancePurchase = params => { return axios.post(`${base}/oa/om/omAppliancePurchase/add`, params); };