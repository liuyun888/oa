import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * car_require_expense_detail
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',itemId:'费用项目编号',itemName:'费用项目',feeAmount:'费用',feeRemark:'费用说明',requireId:'申请编号',actFeeAmount:'实际费用',actFeeInvoiceUrl:'票据地址',actRemark:'实际费用说明'}
 **/
 
//普通查询 条件之间and关系  
export const listCarRequireExpenseDetail = params => { return axios.get(`${base}/oa/car/carRequireExpenseDetail/list`, { params: params }); };

//模糊查询car_require_expense_detail 条件之间or关系  
//export const listCarRequireExpenseDetailKey = params => { return axios.get(`${base}/oa/car/carRequireExpenseDetail/listKey`, { params: params }); };

//删除一条car_require_expense_detail params={id:'主键 主键'}
export const delCarRequireExpenseDetail = params => { return axios.post(`${base}/oa/car/carRequireExpenseDetail/del`,params); };

//批量删除car_require_expense_detail  params=[{id:'主键 主键'}]
export const batchDelCarRequireExpenseDetail = params => { return axios.post(`${base}/oa/car/carRequireExpenseDetail/batchDel`, params); };

//修改一条car_require_expense_detail记录
export const editCarRequireExpenseDetail = params => { return axios.post(`${base}/oa/car/carRequireExpenseDetail/edit`, params); };

//新增一条car_require_expense_detail
export const addCarRequireExpenseDetail = params => { return axios.post(`${base}/oa/car/carRequireExpenseDetail/add`, params); };