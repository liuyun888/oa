import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * om_appliance_require
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'申请单号 主键',applianceId:'用品id',applianceName:'用品名称',standard:'规格',num:'使用数量',stock:'当前库存',explain:'说明',useType:'使用类型:0个人使用,1部门使用',receiveType:'领取方式:0自取,1快递,2他人代领',useTime:'领用日期',createTime:'申请时间',status:'状态0已提交,1审批中,2已通过,3未通过,4已归还',branchId:'机构号'}
 **/
 
//普通查询 条件之间and关系  
export const listOmApplianceRequire = params => { return axios.get(`${base}/oa/om/omApplianceRequire/list`, { params: params }); };

//模糊查询om_appliance_require 条件之间or关系  
//export const listOmApplianceRequireKey = params => { return axios.get(`${base}/oa/om/omApplianceRequire/listKey`, { params: params }); };

//删除一条om_appliance_require params={id:'申请单号 主键'}
export const delOmApplianceRequire = params => { return axios.post(`${base}/oa/om/omApplianceRequire/del`,params); };

//批量删除om_appliance_require  params=[{id:'申请单号 主键'}]
export const batchDelOmApplianceRequire = params => { return axios.post(`${base}/oa/om/omApplianceRequire/batchDel`, params); };

//修改一条om_appliance_require记录
export const editOmApplianceRequire = params => { return axios.post(`${base}/oa/om/omApplianceRequire/edit`, params); };

//新增一条om_appliance_require
export const addOmApplianceRequire = params => { return axios.post(`${base}/oa/om/omApplianceRequire/add`, params); };