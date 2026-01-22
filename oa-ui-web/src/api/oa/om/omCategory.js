import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * om_category
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'名称',status:'状态1启用0禁用',branchId:'机构号',remark:'备注说明'}
 **/
 
//普通查询 条件之间and关系  
export const listOmCategory = params => { return axios.get(`${base}/oa/om/omCategory/list`, { params: params }); };
export const getAllOmAppliance = params => { return axios.get(`${base}/oa/om/omCategory/getAllOmAppliance`, { params: params }); };

//模糊查询om_category 条件之间or关系  
//export const listOmCategoryKey = params => { return axios.get(`${base}/oa/om/omCategory/listKey`, { params: params }); };

//删除一条om_category params={id:'主键 主键'}
export const delOmCategory = params => { return axios.post(`${base}/oa/om/omCategory/del`,params); };

//批量删除om_category  params=[{id:'主键 主键'}]
export const batchDelOmCategory = params => { return axios.post(`${base}/oa/om/omCategory/batchDel`, params); };

//修改一条om_category记录
export const editOmCategory = params => { return axios.post(`${base}/oa/om/omCategory/edit`, params); };

//新增一条om_category
export const addOmCategory = params => { return axios.post(`${base}/oa/om/omCategory/add`, params); };