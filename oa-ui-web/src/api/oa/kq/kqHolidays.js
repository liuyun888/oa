import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * kq_holidays
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',date:'日期',year:'年号',branchId:'机构id',number:'放假天数',name:'节假日名称'}
 **/

//普通查询 条件之间and关系
export const listKqHolidays = params => { return axios.get(`${base}/oa/kq/holidays/list`, { params: params }); };

//模糊查询kq_holidays 条件之间or关系
//export const listKqHolidaysKey = params => { return axios.get(`${base}/oa/kq/holidays/listKey`, { params: params }); };

//删除一条kq_holidays params={id:'id 主键'}
export const delKqHolidays = params => { return axios.post(`${base}/oa/kq/holidays/del`,params); };

//批量删除kq_holidays  params=[{id:'id 主键'}]
export const batchDelKqHolidays = params => { return axios.post(`${base}/oa/kq/holidays/batchDel`, params); };

//修改一条kq_holidays记录
export const editKqHolidays = params => { return axios.post(`${base}/oa/kq/holidays/edit`, params); };

//新增一条kq_holidays
export const addKqHolidays = params => { return axios.post(`${base}/oa/kq/holidays/add`, params); };
