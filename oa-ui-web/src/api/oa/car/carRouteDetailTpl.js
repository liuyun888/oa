import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()

/**
 * car_route_detail_tpl
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',fromAddress:'出发地址',destAddress:'目的地址',fromAddressGps:'出发地址定位',destAddressGps:'目的地址定位',isSignIn:'是否打卡',seqNum:'序号',detailName:'线路名称',distance:'距离米',routeId:'路线编号'}
 **/

 //普通查询 条件之间and关系  
export const listAddressGPS = params => { return axios.get(`${base}/oa/car/carRouteDetailTpl/listAddressGPS`, { params: params }); };
 
//普通查询 条件之间and关系  
export const listCarRouteDetailTpl = params => { return axios.get(`${base}/oa/car/carRouteDetailTpl/list`, { params: params }); };

//模糊查询car_route_detail_tpl 条件之间or关系  
//export const listCarRouteDetailTplKey = params => { return axios.get(`${base}/oa/car/carRouteDetailTpl/listKey`, { params: params }); };

//删除一条car_route_detail_tpl params={id:'主键 主键'}
export const delCarRouteDetailTpl = params => { return axios.post(`${base}/oa/car/carRouteDetailTpl/del`,params); };

//批量删除car_route_detail_tpl  params=[{id:'主键 主键'}]
export const batchDelCarRouteDetailTpl = params => { return axios.post(`${base}/oa/car/carRouteDetailTpl/batchDel`, params); };

//修改一条car_route_detail_tpl记录
export const editCarRouteDetailTpl = params => { return axios.post(`${base}/oa/car/carRouteDetailTpl/edit`, params); };

//新增一条car_route_detail_tpl
export const addCarRouteDetailTpl = params => { return axios.post(`${base}/oa/car/carRouteDetailTpl/add`, params); };