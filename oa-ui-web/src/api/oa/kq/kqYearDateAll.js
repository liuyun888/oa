import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * kq_year_date_all
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',branchId:'组织id',repYear:'年份',repDate:'日期',dbStatus:'0:工作日；1：周末休息日；2：法定休息日；',month:'月份'}
 **/

//普通查询 条件之间and关系
export const listKqYearDateAll = params => { return axios.get(`${base}/oa/kq/yearDateAll/list`, { params: params }); };

//模糊查询kq_year_date_all 条件之间or关系
//export const listKqYearDateAllKey = params => { return axios.get(`${base}/oa/kq/yearDateAll/listKey`, { params: params }); };

//删除一条kq_year_date_all params={id:'id 主键'}
export const delKqYearDateAll = params => { return axios.post(`${base}/oa/kq/yearDateAll/del`,params); };

//批量删除kq_year_date_all  params=[{id:'id 主键'}]
export const batchDelKqYearDateAll = params => { return axios.post(`${base}/oa/kq/yearDateAll/batchDel`, params); };

//修改一条kq_year_date_all记录
export const editKqYearDateAll = params => { return axios.post(`${base}/oa/kq/yearDateAll/edit`, params); };

//查询
export const listWorkCalendar = params => { return axios.get(`${base}/oa/kq/yearDateAll/listWorkCalendar`, { params: params }); };

//新增
export const addKqYearDateAll = params => { return axios.post(`${base}/oa/kq/yearDateAll/add`, params); };



