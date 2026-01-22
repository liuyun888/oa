import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * car_require_route
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',fromAddress:'出发地址',destAddress:'目的地址',fromAddressGps:'出发地址定位',destAddressGps:'目的地址定位',isSignIn:'是否打卡',seqNum:'序号',detailName:'线路名称',distance:'距离米',requireId:'用车申请编号',hasDetail:'是否有子路线'}
 **/
 //普通查询 条件之间and关系  
 export const listAddressGPS = params => { return axios.get(`${base}/oa/car/carRequireRoute/listAddressGPS`, { params: params }); };
 
//普通查询 条件之间and关系  
export const listCarRequireRoute = params => { return axios.get(`${base}/oa/car/carRequireRoute/list`, { params: params }); };

//模糊查询car_require_route 条件之间or关系  
//export const listCarRequireRouteKey = params => { return axios.get(`${base}/oa/car/carRequireRoute/listKey`, { params: params }); };

//删除一条car_require_route params={id:'主键 主键'}
export const delCarRequireRoute = params => { return axios.post(`${base}/oa/car/carRequireRoute/del`,params); };

//批量删除car_require_route  params=[{id:'主键 主键'}]
export const batchDelCarRequireRoute = params => { return axios.post(`${base}/oa/car/carRequireRoute/batchDel`, params); };

//修改一条car_require_route记录
export const editCarRequireRoute = params => { return axios.post(`${base}/oa/car/carRequireRoute/edit`, params); };

//新增一条car_require_route
export const addCarRequireRoute = params => { return axios.post(`${base}/oa/car/carRequireRoute/add`, params); };