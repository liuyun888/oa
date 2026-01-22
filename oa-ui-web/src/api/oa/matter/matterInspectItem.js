import request from '@/utils/request';

import config from '../../../common/config'

let base = config.getOaBasePath();

//如果使用api网关进行访问
if(config.isUserApiGate){
	base=config.getApiGate()+"/"+config.getOaBasePath()
}

/**
 * 检查项目
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',orderNumber:'序号',name:'检查项目名称',infoId:'事项基本信息id',branchId:'云用户机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listMatterInspectItem = params => { return request.get(`${base}/oa/matter/matterInspectItem/list`, { params: params }); };

//模糊查询检查项目 条件之间or关系  
//export const listMatterInspectItemKey = params => { return request.get(`${base}/oa/matter/matterInspectItem/listKey`, { params: params }); };

//删除一条检查项目 params={id:'id 主键'}
export const delMatterInspectItem = params => { return request.post(`${base}/oa/matter/matterInspectItem/del`,params); };

//批量删除检查项目  params=[{id:'id 主键'}]
export const batchDelMatterInspectItem = params => { return request.post(`${base}/oa/matter/matterInspectItem/batchDel`, params); };

//修改一条检查项目记录
export const editMatterInspectItem = params => { return request.post(`${base}/oa/matter/matterInspectItem/edit`, params); };

//新增一条检查项目
export const addMatterInspectItem = params => { return request.post(`${base}/oa/matter/matterInspectItem/add`, params); };