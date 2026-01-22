import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * car_driver
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={driverId:'司机编号 主键',driverUserid:'汽车司机',driverUsername:'司机姓名',driverPhoneno:'司机电话',driverWeixin:'微信号',driverEmel:'邮件',driverCardNum:'驾驶证号码',driverCardImageUrl:'驾驶证照片',driverStatus:'驾驶证状态',driverCardStartTime:'驾驶证开始领证日期',driverAge:'司机年龄',driverSex:'司机性别',driverActYear:'司机实际驾龄',createTime:'增加时间',driverCardType:'驾驶证类型',driverBranchId:'司机归属机构'}
 **/
 
//普通查询 条件之间and关系  
export const listCarDriver = params => { return axios.get(`${base}/oa/car/carDriver/list`, { params: params }); };

//模糊查询car_driver 条件之间or关系  
//export const listCarDriverKey = params => { return axios.get(`${base}/oa/car/carDriver/listKey`, { params: params }); };

//删除一条car_driver params={driverId:'司机编号 主键'}
export const delCarDriver = params => { return axios.post(`${base}/oa/car/carDriver/del`,params); };

//批量删除car_driver  params=[{driverId:'司机编号 主键'}]
export const batchDelCarDriver = params => { return axios.post(`${base}/oa/car/carDriver/batchDel`, params); };

//修改一条car_driver记录
export const editCarDriver = params => { return axios.post(`${base}/oa/car/carDriver/edit`, params); };

//新增一条car_driver
export const addCarDriver = params => { return axios.post(`${base}/oa/car/carDriver/add`, params); };