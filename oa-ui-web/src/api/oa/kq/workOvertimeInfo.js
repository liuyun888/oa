import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getOaContext();

/**
 * 加班表
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'ID 主键',userid:'员工id',username:'员工名称',workOvertimeType:'加班类型',beginTime:'开始时间',endTime:'结束时间',workOvertimeHours:'加班小时数',reasonWorkOvertime:'加班原因',branchId:'组织id',deptid:'部门id',deptName:'部门名称',applyTime:'申请时间',accessory:'附件',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态',title:'标题'}
 * @author maimeng-mdp code-gen
 * @since 2023年10月9日
 **/

//普通查询 条件之间and关系
export const listWorkOvertimeInfo = params => { return axios.get(`${base}/oa/kq/workOvertimeInfo/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryWorkOvertimeInfoById = params => { return axios.get(`${base}/oa/kq/workOvertimeInfo/queryById`, { params: params }); };

//删除一条加班表 params={id:'ID 主键'}
export const delWorkOvertimeInfo = params => { return axios.post(`${base}/oa/kq/workOvertimeInfo/del`,params); };

//批量删除加班表  params=[{id:'ID 主键'}]
export const batchAddWorkOvertimeInfo = params => { return axios.post(`${base}/oa/kq/workOvertimeInfo/batchAdd`, params); };

//批量删除加班表  params=[{id:'ID 主键'}]
export const batchDelWorkOvertimeInfo = params => { return axios.post(`${base}/oa/kq/workOvertimeInfo/batchDel`, params); };

//修改一条加班表记录
export const editWorkOvertimeInfo = params => { return axios.post(`${base}/oa/kq/workOvertimeInfo/edit`, params); };

//新增一条加班表
export const addWorkOvertimeInfo = params => { return axios.post(`${base}/oa/kq/workOvertimeInfo/add`, params); };

//批量修改某些字段
export const editSomeFieldsWorkOvertimeInfo = params => { return axios.post(`${base}/oa/kq/workOvertimeInfo/editSomeFields`, params); };

// 请假申请
export const processApprovaWorkOvertimeInfo = params => { return axios.post(`${base}/oa/kq/workOvertimeInfo/processApprova`, params); };
