import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * car_office_car
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',carNum:'车牌号',carName:'车名',carBrandId:'汽车品牌编号',carBrandName:'汽车品牌名称',carFrontImageUrl:'汽车前照片',carBackImageUrl:'汽车后照片',carInnerImageUrl:'汽车内饰照片',carType:'汽车类型',carStatus:'汽车状态1启用0禁用',carDeptid:'汽车归属部门',carBranchId:'汽车归属机构',carDeptName:'汽车归属部门名称',carBranchName:'汽车归属机构名称',createTime:'新增时间',carSeating:'汽车座位数',carLoadWeight:'汽车载重量(kg)'}
 **/
 
//普通查询 条件之间and关系  
export const listCarOfficeCar = params => { return axios.get(`${base}/oa/car/carOfficeCar/list`, { params: params }); };

//模糊查询car_office_car 条件之间or关系  
//export const listCarOfficeCarKey = params => { return axios.get(`${base}/oa/car/carOfficeCar/listKey`, { params: params }); };

//删除一条car_office_car params={id:'主键 主键'}
export const delCarOfficeCar = params => { return axios.post(`${base}/oa/car/carOfficeCar/del`,params); };

//批量删除car_office_car  params=[{id:'主键 主键'}]
export const batchDelCarOfficeCar = params => { return axios.post(`${base}/oa/car/carOfficeCar/batchDel`, params); };

//修改一条car_office_car记录
export const editCarOfficeCar = params => { return axios.post(`${base}/oa/car/carOfficeCar/edit`, params); };

//新增一条car_office_car
export const addCarOfficeCar = params => { return axios.post(`${base}/oa/car/carOfficeCar/add`, params); };