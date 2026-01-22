import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getOaContext();

/**
 * 督办分类表
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'分类名称',status:'状态1启用0禁用',branchId:'归属机构',remark:'备注说明',createTime:'新增时间'}
 * @author maimeng-mdp code-gen
 * @since 2023年10月8日
 **/
 
//普通查询 条件之间and关系  
export const listDubanCategory = params => { return axios.get(`${base}/oa/duban/dubanCategory/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryDubanCategoryById = params => { return axios.get(`${base}/oa/duban/dubanCategory/queryById`, { params: params }); };

//删除一条督办分类表 params={id:'主键 主键'}
export const delDubanCategory = params => { return axios.post(`${base}/oa/duban/dubanCategory/del`,params); };

//批量删除督办分类表  params=[{id:'主键 主键'}]
export const batchAddDubanCategory = params => { return axios.post(`${base}/oa/duban/dubanCategory/batchAdd`, params); };

//批量删除督办分类表  params=[{id:'主键 主键'}]
export const batchDelDubanCategory = params => { return axios.post(`${base}/oa/duban/dubanCategory/batchDel`, params); };

//修改一条督办分类表记录
export const editDubanCategory = params => { return axios.post(`${base}/oa/duban/dubanCategory/edit`, params); };

//新增一条督办分类表
export const addDubanCategory = params => { return axios.post(`${base}/oa/duban/dubanCategory/add`, params); };

//批量修改某些字段
export const editSomeFieldsDubanCategory = params => { return axios.post(`${base}/oa/duban/dubanCategory/editSomeFields`, params); };