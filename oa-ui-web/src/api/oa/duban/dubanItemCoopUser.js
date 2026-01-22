import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * duban_item_coop_user
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',dubanItemId:'督办id',userId:'协助用户id',username:'协助用户'}
 **/
 
//普通查询 条件之间and关系  
export const listDubanItemCoopUser = params => { return axios.get(`${base}/oa/duban/dubanItemCoopUser/list`, { params: params }); };

//模糊查询duban_item_coop_user 条件之间or关系  
//export const listDubanItemCoopUserKey = params => { return axios.get(`${base}/oa/duban/dubanItemCoopUser/listKey`, { params: params }); };

//删除一条duban_item_coop_user params={id:'主键 主键'}
export const delDubanItemCoopUser = params => { return axios.post(`${base}/oa/duban/dubanItemCoopUser/del`,params); };

//批量删除duban_item_coop_user  params=[{id:'主键 主键'}]
export const batchDelDubanItemCoopUser = params => { return axios.post(`${base}/oa/duban/dubanItemCoopUser/batchDel`, params); };

//修改一条duban_item_coop_user记录
export const editDubanItemCoopUser = params => { return axios.post(`${base}/oa/duban/dubanItemCoopUser/edit`, params); };

//新增一条duban_item_coop_user
export const addDubanItemCoopUser = params => { return axios.post(`${base}/oa/duban/dubanItemCoopUser/add`, params); };