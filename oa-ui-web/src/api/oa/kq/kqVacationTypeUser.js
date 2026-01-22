import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * kq_vacation_type_user
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',vacationId:'请假类型id',userid:'员工id',remainingHoliday:'剩余假期',branchId:'组织机构id',username:'员工名称'}
 **/

//普通查询 条件之间and关系
export const listKqVacationTypeUser = params => { return axios.get(`${base}/oa/kq/vacationTypeUser/list`, { params: params }); };

//模糊查询kq_vacation_type_user 条件之间or关系
//export const listKqVacationTypeUserKey = params => { return axios.get(`${base}/oa/kq/vacationTypeUser/listKey`, { params: params }); };

//删除一条kq_vacation_type_user params={id:'id 主键'}
export const delKqVacationTypeUser = params => { return axios.post(`${base}/oa/kq/vacationTypeUser/del`,params); };

//批量删除kq_vacation_type_user  params=[{id:'id 主键'}]
export const batchDelKqVacationTypeUser = params => { return axios.post(`${base}/oa/kq/vacationTypeUser/batchDel`, params); };

//修改一条kq_vacation_type_user记录
export const editKqVacationTypeUser = params => { return axios.post(`${base}/oa/kq/vacationTypeUser/edit`, params); };

//新增一条kq_vacation_type_user
export const addKqVacationTypeUser = params => { return axios.post(`${base}/oa/kq/vacationTypeUser/add`, params); };

