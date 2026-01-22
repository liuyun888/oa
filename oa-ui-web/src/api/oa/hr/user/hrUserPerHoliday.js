import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_per_holiday
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'用户编号',year:'年份',annualLeave:'剩余带薪年假',paidLeave:'剩余调休假期',paidSickLeave:'剩余带薪病假',leaveInLieu:'剩余调休假',marriageLeave:'剩余婚假',annualVacation:'剩余年假',sickLeave:'剩余病假',totalDays:'剩余总天数'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserPerHoliday = params => { return axios.get(`${base}/oa/hr/user/hrUserPerHoliday/list`, { params: params }); };

//模糊查询hr_user_per_holiday 条件之间or关系  
//export const listHrUserPerHolidayKey = params => { return axios.get(`${base}/oa/hr/user/hrUserPerHoliday/listKey`, { params: params }); };

//删除一条hr_user_per_holiday params={id:'id 主键'}
export const delHrUserPerHoliday = params => { return axios.post(`${base}/oa/hr/user/hrUserPerHoliday/del`,params); };

//批量删除hr_user_per_holiday  params=[{id:'id 主键'}]
export const batchDelHrUserPerHoliday = params => { return axios.post(`${base}/oa/hr/user/hrUserPerHoliday/batchDel`, params); };

//修改一条hr_user_per_holiday记录
export const editHrUserPerHoliday = params => { return axios.post(`${base}/oa/hr/user/hrUserPerHoliday/edit`, params); };

//新增一条hr_user_per_holiday
export const addHrUserPerHoliday = params => { return axios.post(`${base}/oa/hr/user/hrUserPerHoliday/add`, params); };