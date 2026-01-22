import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * om_appliance
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'名称',standard:'规格',categoryId:'分类id',categoryName:'分类名称',remark:'备注',stock:'库存量',status:'状态',unit:'单位',isWarn:'是否警示',highWarn:'最高警示数量',lowWarn:'最低警示数量',highPurchase:'最高采购数量',lowPurchase:'最低采购数量',price:'单价',highPrice:'最高单价',lowPrice:'最低单价',branchId:'机构号'}
 **/
 
//普通查询 条件之间and关系  
export const listOmAppliance = params => { return axios.get(`${base}/oa/om/omAppliance/list`, { params: params }); };

//模糊查询om_appliance 条件之间or关系  
//export const listOmApplianceKey = params => { return axios.get(`${base}/oa/om/omAppliance/listKey`, { params: params }); };

//删除一条om_appliance params={id:'主键 主键'}
export const delOmAppliance = params => { return axios.post(`${base}/oa/om/omAppliance/del`,params); };

//批量删除om_appliance  params=[{id:'主键 主键'}]
export const batchDelOmAppliance = params => { return axios.post(`${base}/oa/om/omAppliance/batchDel`, params); };

//修改一条om_appliance记录
export const editOmAppliance = params => { return axios.post(`${base}/oa/om/omAppliance/edit`, params); };

//新增一条om_appliance
export const addOmAppliance = params => { return axios.post(`${base}/oa/om/omAppliance/add`, params); };