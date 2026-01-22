import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getOaContext();

/**
 * 督办任务表
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'主键 主键',dubanId:'督办主键',categoryId:'事项分类id',categoryName:'事项分类',name:'任务名称',startTime:'任务开始时间',endTime:'任务结束时间',createUserid:'创建人id',createUsername:'创建人名称',hostDeptId:'主办单位id',hostDeptName:'主办单位',hostId:'主办id',hostName:'主办',remark:'任务描述',createTime:'创建时间',status:'状态0已申报1进行中2已完成3已超时',progress:'进度'}
 * @author maimeng-mdp code-gen
 * @since 2023年10月8日
 **/
 
//普通查询 条件之间and关系  
export const listDubanItemTask = params => { return axios.get(`${base}/oa/duban/dubanItemTask/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryDubanItemTaskById = params => { return axios.get(`${base}/oa/duban/dubanItemTask/queryById`, { params: params }); };

//删除一条督办任务表 params={id:'主键 主键'}
export const delDubanItemTask = params => { return axios.post(`${base}/oa/duban/dubanItemTask/del`,params); };

//批量删除督办任务表  params=[{id:'主键 主键'}]
export const batchAddDubanItemTask = params => { return axios.post(`${base}/oa/duban/dubanItemTask/batchAdd`, params); };

//批量删除督办任务表  params=[{id:'主键 主键'}]
export const batchDelDubanItemTask = params => { return axios.post(`${base}/oa/duban/dubanItemTask/batchDel`, params); };

//修改一条督办任务表记录
export const editDubanItemTask = params => { return axios.post(`${base}/oa/duban/dubanItemTask/edit`, params); };

//新增一条督办任务表
export const addDubanItemTask = params => { return axios.post(`${base}/oa/duban/dubanItemTask/add`, params); };

//批量修改某些字段
export const editSomeFieldsDubanItemTask = params => { return axios.post(`${base}/oa/duban/dubanItemTask/editSomeFields`, params); };