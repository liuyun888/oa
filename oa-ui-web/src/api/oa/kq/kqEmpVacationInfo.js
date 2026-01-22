import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * kq_emp_vacation_info
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'ID 主键',userid:'员工id',username:'员工名称',deptId:'部门id',deptName:'部门名称',vacationId:'请假类别',beginDate:'开始日期',endDate:'结束日期',reason:'请假事由',branchId:'组织id',beginTime:'开始时间',endTime:'结束时间',emergencyDegree:'紧急程度',dutyDescription:'职责描述',number:'请假天数'}
 **/

//普通查询 条件之间and关系
export const listKqEmpVacationInfo = params => { return axios.get(`${base}/oa/kq/empVacationInfo/list`, { params: params }); };

//模糊查询kq_emp_vacation_info 条件之间or关系
//export const listKqEmpVacationInfoKey = params => { return axios.get(`${base}/oa/kq/empVacationInfo/listKey`, { params: params }); };

//删除一条kq_emp_vacation_info params={id:'ID 主键'}
export const delKqEmpVacationInfo = params => { return axios.post(`${base}/oa/kq/empVacationInfo/del`,params); };

//批量删除kq_emp_vacation_info  params=[{id:'ID 主键'}]
export const batchDelKqEmpVacationInfo = params => { return axios.post(`${base}/oa/kq/empVacationInfo/batchDel`, params); };

//修改一条kq_emp_vacation_info记录
export const editKqEmpVacationInfo = params => { return axios.post(`${base}/oa/kq/empVacationInfo/edit`, params); };

//新增一条kq_emp_vacation_info
export const addKqEmpVacationInfo = params => { return axios.post(`${base}/oa/kq/empVacationInfo/add`, params); };


//普通查询 条件之间and关系
export const empVacationCalc = params => { return axios.get(`${base}/oa/kq/empVacationInfo/empVacationCalc`, { params: params }); };
