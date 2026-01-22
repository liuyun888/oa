import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * 请假类型表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'ID 主键',vacationType:'假期类型1-事假，2-病假，3-年假，4-婚假,5-哺乳假，6-丧假，7-外勤',vacationRule:'请假规则描述：比如妇乳期只能女员工享有',branchId:'组织架构编号',totalHours:'可请总时长，单位小时',sexRule:'性别要求0-男性可请，1-女性可请，2-全部',name:'假期名称',beginEmpMonths:'入职年限要求开始月数',endEmpMonths:'入职年限要求结束月数',beginWorkingMonths:'工龄要求开始月数',endWorkingMonths:'工龄要求结束月数',status:'启用0否1是'}
 **/

//普通查询 条件之间and关系
export const listKqVacationType = params => { return axios.get(`${base}/oa/kq/vacationType/list`, { params: params }); };

//模糊查询请假类型表 条件之间or关系
//export const listKqVacationTypeKey = params => { return axios.get(`${base}/oa/kq/vacationType/listKey`, { params: params }); };

//删除一条请假类型表 params={id:'ID 主键'}
export const delKqVacationType = params => { return axios.post(`${base}/oa/kq/vacationType/del`,params); };

//批量删除请假类型表  params=[{id:'ID 主键'}]
export const batchDelKqVacationType = params => { return axios.post(`${base}/oa/kq/vacationType/batchDel`, params); };

//修改一条请假类型表记录
export const editKqVacationType = params => { return axios.post(`${base}/oa/kq/vacationType/edit`, params); };

//新增一条请假类型表
export const addKqVacationType = params => { return axios.post(`${base}/oa/kq/vacationType/add`, params); };
