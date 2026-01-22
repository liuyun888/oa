import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getOaContext();

/**
 * 督办表
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'督办字号 主键',name:'事项名称',categoryId:'事项分类id',categoryName:'事项分类',createUserid:'创建人id',createUsername:'创建人名称',dutyId:'责任人id',dutyName:'责任人名称',betweenDeptid:'牵头部门id',betweenDeptName:'牵头部门名称',betweenId:'牵头人id||中间人id',betweenName:'牵头人名称',branchId:'归属机构',startTime:'计划开始时间',endTime:'计划结束时间',hostDeptId:'主办单位id',hostDeptName:'主办单位',hostId:'主办id',hostName:'主办',remark:'任务描述',status:'状态0已申报1进行中2已完成3已超时',createTime:'创建时间',progress:'进度'}
 * @author maimeng-mdp code-gen
 * @since 2023年10月8日
 **/
 
//普通查询 条件之间and关系  
export const listDubanItem = params => { return axios.get(`${base}/oa/duban/dubanItem/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryDubanItemById = params => { return axios.get(`${base}/oa/duban/dubanItem/queryById`, { params: params }); };

//删除一条督办表 params={id:'督办字号 主键'}
export const delDubanItem = params => { return axios.post(`${base}/oa/duban/dubanItem/del`,params); };

//批量删除督办表  params=[{id:'督办字号 主键'}]
export const batchAddDubanItem = params => { return axios.post(`${base}/oa/duban/dubanItem/batchAdd`, params); };

//批量删除督办表  params=[{id:'督办字号 主键'}]
export const batchDelDubanItem = params => { return axios.post(`${base}/oa/duban/dubanItem/batchDel`, params); };

//修改一条督办表记录
export const editDubanItem = params => { return axios.post(`${base}/oa/duban/dubanItem/edit`, params); };

//新增一条督办表
export const addDubanItem = params => { return axios.post(`${base}/oa/duban/dubanItem/add`, params); };

//批量修改某些字段
export const editSomeFieldsDubanItem = params => { return axios.post(`${base}/oa/duban/dubanItem/editSomeFields`, params); };