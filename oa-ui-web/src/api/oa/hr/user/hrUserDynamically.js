import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_dynamically
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'用户编号',time:'操作时间',way:'操作者',cause:'操作方法',record:'操作记录'}
 **/
 
//普通查询 条件之间and关系  
export const listHrUserDynamically = params => { return axios.get(`${base}/oa/hr/user/hrUserDynamically/list`, { params: params }); };

//模糊查询hr_user_dynamically 条件之间or关系  
//export const listHrUserDynamicallyKey = params => { return axios.get(`${base}/oa/hr/user/hrUserDynamically/listKey`, { params: params }); };

//删除一条hr_user_dynamically params={id:'id 主键'}
export const delHrUserDynamically = params => { return axios.post(`${base}/oa/hr/user/hrUserDynamically/del`,params); };

//批量删除hr_user_dynamically  params=[{id:'id 主键'}]
export const batchDelHrUserDynamically = params => { return axios.post(`${base}/oa/hr/user/hrUserDynamically/batchDel`, params); };

//修改一条hr_user_dynamically记录
export const editHrUserDynamically = params => { return axios.post(`${base}/oa/hr/user/hrUserDynamically/edit`, params); };

//新增一条hr_user_dynamically
export const addHrUserDynamically = params => { return axios.post(`${base}/oa/hr/user/hrUserDynamically/add`, params); };