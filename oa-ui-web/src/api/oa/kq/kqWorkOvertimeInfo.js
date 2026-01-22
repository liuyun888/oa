import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * kq_work_overtime_info
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'ID 主键',userid:'员工id',username:'员工名称',workOvertimeType:'加班类型',beginTime:'开始时间',endTime:'结束时间',workOvertimeHours:'加班小时数',reasonWorkOvertime:'加班原因',branchId:'组织id',deptId:'部门id',deptName:'部门名称',applyTime:'申请时间',accessory:'附件'}
 **/

//普通查询 条件之间and关系
export const listKqWorkOvertimeInfo = params => { return axios.get(`${base}/oa/kq/workOvertimeInfo/list`, { params: params }); };

//模糊查询kq_work_overtime_info 条件之间or关系
//export const listKqWorkOvertimeInfoKey = params => { return axios.get(`${base}/oa/kq/workOvertimeInfo/listKey`, { params: params }); };

//删除一条kq_work_overtime_info params={id:'ID 主键'}
export const delKqWorkOvertimeInfo = params => { return axios.post(`${base}/oa/kq/workOvertimeInfo/del`,params); };

//批量删除kq_work_overtime_info  params=[{id:'ID 主键'}]
export const batchDelKqWorkOvertimeInfo = params => { return axios.post(`${base}/oa/kq/workOvertimeInfo/batchDel`, params); };

//修改一条kq_work_overtime_info记录
export const editKqWorkOvertimeInfo = params => { return axios.post(`${base}/oa/kq/workOvertimeInfo/edit`, params); };

//新增一条kq_work_overtime_info
export const addKqWorkOvertimeInfo = params => { return axios.post(`${base}/oa/kq/workOvertimeInfo/add`, params); };
