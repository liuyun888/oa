import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * car_require_car_driver
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',carId:'汽车编号',driverId:'司机编号',startTime:'开始时间',endTime:'结束时间',status:'状态0启用1禁用',createTime:'新增时间',requireId:'申请编号',giveBackTime:'还车时间',giveBacked:'是否已还车0否1是',giveBackUserid:'还车用户编号',giveBackUsername:'还车人姓名',giveBackRemark:'还车说明'}
 **/
 
//普通查询 条件之间and关系  
export const listCarRequireCarDriver = params => { return axios.get(`${base}/oa/car/carRequireCarDriver/list`, { params: params }); };

//模糊查询car_require_car_driver 条件之间or关系  
//export const listCarRequireCarDriverKey = params => { return axios.get(`${base}/oa/car/carRequireCarDriver/listKey`, { params: params }); };

//删除一条car_require_car_driver params={id:'主键 主键'}
export const delCarRequireCarDriver = params => { return axios.post(`${base}/oa/car/carRequireCarDriver/del`,params); };

//批量删除car_require_car_driver  params=[{id:'主键 主键'}]
export const batchDelCarRequireCarDriver = params => { return axios.post(`${base}/oa/car/carRequireCarDriver/batchDel`, params); };

//修改一条car_require_car_driver记录
export const editCarRequireCarDriver = params => { return axios.post(`${base}/oa/car/carRequireCarDriver/edit`, params); };

//新增一条car_require_car_driver
export const addCarRequireCarDriver = params => { return axios.post(`${base}/oa/car/carRequireCarDriver/add`, params); };