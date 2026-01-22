import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * car_driver_sign_in
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',userid:'打卡用户编号',driverId:'打卡司机编号',carId:'车辆编号',requireId:'申请用车编号（如果有，则填写）',address:'打卡位置',addressGps:'打卡位置gps',createTime:'打卡时间',remark:'备注说明',status:'状态0-装货中-1出发-2途中-3到达-4卸货中-5卸货完成-6回程途中-7还车完成-8维修中-9故障待援-10故障修复完成',username:'打卡用户编号',branchId:'打卡人归属机构'}
 **/
 
//普通查询 条件之间and关系  
export const listCarDriverSignIn = params => { return axios.get(`${base}/oa/car/carDriverSignIn/list`, { params: params }); };

//模糊查询car_driver_sign_in 条件之间or关系  
//export const listCarDriverSignInKey = params => { return axios.get(`${base}/oa/car/carDriverSignIn/listKey`, { params: params }); };

//删除一条car_driver_sign_in params={id:'主键 主键'}
export const delCarDriverSignIn = params => { return axios.post(`${base}/oa/car/carDriverSignIn/del`,params); };

//批量删除car_driver_sign_in  params=[{id:'主键 主键'}]
export const batchDelCarDriverSignIn = params => { return axios.post(`${base}/oa/car/carDriverSignIn/batchDel`, params); };

//修改一条car_driver_sign_in记录
export const editCarDriverSignIn = params => { return axios.post(`${base}/oa/car/carDriverSignIn/edit`, params); };

//新增一条car_driver_sign_in
export const addCarDriverSignIn = params => { return axios.post(`${base}/oa/car/carDriverSignIn/add`, params); };