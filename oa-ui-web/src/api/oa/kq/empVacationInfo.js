import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getOaContext();

/**
 * 员工请假信息表
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'ID 主键',userid:'员工id',username:'员工名称',deptid:'部门id',deptName:'部门名称',vacationId:'请假类别',beginDate:'开始日期',endDate:'结束日期',reason:'请假事由',branchId:'组织id',beginTime:'开始时间作废',endTime:'结束时间作废',emergencyDegree:'紧急程度',dutyDescription:'职责描述',vacationHours:'请假小时数',title:'标题',accessory:'附件',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除',vacationType:'假期类型',vacationName:'假期名称'}
 * @author maimeng-mdp code-gen
 * @since 2023年10月9日
 **/
 
//普通查询 条件之间and关系  
export const listEmpVacationInfo = params => { return axios.get(`${base}/oa/kq/empVacationInfo/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryEmpVacationInfoById = params => { return axios.get(`${base}/oa/kq/empVacationInfo/queryById`, { params: params }); };

//删除一条员工请假信息表 params={id:'ID 主键'}
export const delEmpVacationInfo = params => { return axios.post(`${base}/oa/kq/empVacationInfo/del`,params); };

//批量删除员工请假信息表  params=[{id:'ID 主键'}]
export const batchAddEmpVacationInfo = params => { return axios.post(`${base}/oa/kq/empVacationInfo/batchAdd`, params); };

//批量删除员工请假信息表  params=[{id:'ID 主键'}]
export const batchDelEmpVacationInfo = params => { return axios.post(`${base}/oa/kq/empVacationInfo/batchDel`, params); };

//修改一条员工请假信息表记录
export const editEmpVacationInfo = params => { return axios.post(`${base}/oa/kq/empVacationInfo/edit`, params); };

//新增一条员工请假信息表
export const addEmpVacationInfo = params => { return axios.post(`${base}/oa/kq/empVacationInfo/add`, params); };

//批量修改某些字段
export const editSomeFieldsEmpVacationInfo = params => { return axios.post(`${base}/oa/kq/empVacationInfo/editSomeFields`, params); };