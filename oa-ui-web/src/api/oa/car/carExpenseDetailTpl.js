import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * car_expense_detail_tpl
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',itemId:'费用项目编号',itemName:'费用项目',feeAmount:'费用',feeRemark:'费用说明',branchId:'归属机构'}
 **/
 
//普通查询 条件之间and关系  
export const listCarExpenseDetailTpl = params => { return axios.get(`${base}/oa/car/carExpenseDetailTpl/list`, { params: params }); };

//模糊查询car_expense_detail_tpl 条件之间or关系  
//export const listCarExpenseDetailTplKey = params => { return axios.get(`${base}/oa/car/carExpenseDetailTpl/listKey`, { params: params }); };

//删除一条car_expense_detail_tpl params={id:'主键 主键'}
export const delCarExpenseDetailTpl = params => { return axios.post(`${base}/oa/car/carExpenseDetailTpl/del`,params); };

//批量删除car_expense_detail_tpl  params=[{id:'主键 主键'}]
export const batchDelCarExpenseDetailTpl = params => { return axios.post(`${base}/oa/car/carExpenseDetailTpl/batchDel`, params); };

//修改一条car_expense_detail_tpl记录
export const editCarExpenseDetailTpl = params => { return axios.post(`${base}/oa/car/carExpenseDetailTpl/edit`, params); };

//新增一条car_expense_detail_tpl
export const addCarExpenseDetailTpl = params => { return axios.post(`${base}/oa/car/carExpenseDetailTpl/add`, params); };