import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * car_car_driver_tpl
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',carId:'汽车编号',driverId:'司机编号',startTime:'开始时间',endTime:'结束时间',status:'状态0启用1禁用',createTime:'新增时间',branchId:'归属机构'}
 **/

 //普通查询 并且返回汽车和司机的信息  
export const getTplAndCarDriver = params => { return axios.get(`${base}/oa/car/carCarDriverTpl/infos`, { params: params }); };
 
//普通查询 条件之间and关系  
export const listCarCarDriverTpl = params => { return axios.get(`${base}/oa/car/carCarDriverTpl/list`, { params: params }); };

//模糊查询car_car_driver_tpl 条件之间or关系  
//export const listCarCarDriverTplKey = params => { return axios.get(`${base}/oa/car/carCarDriverTpl/listKey`, { params: params }); };

//删除一条car_car_driver_tpl params={id:'主键 主键'}
export const delCarCarDriverTpl = params => { return axios.post(`${base}/oa/car/carCarDriverTpl/del`,params); };

//批量删除car_car_driver_tpl  params=[{id:'主键 主键'}]
export const batchDelCarCarDriverTpl = params => { return axios.post(`${base}/oa/car/carCarDriverTpl/batchDel`, params); };

//修改一条car_car_driver_tpl记录
export const editCarCarDriverTpl = params => { return axios.post(`${base}/oa/car/carCarDriverTpl/edit`, params); };

//新增一条car_car_driver_tpl
export const addCarCarDriverTpl = params => { return axios.post(`${base}/oa/car/carCarDriverTpl/add`, params); };