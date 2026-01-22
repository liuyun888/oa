import request from '@/utils/request';

import config from '../../../common/config'

let base = config.getOaBasePath();

//如果使用api网关进行访问
if(config.isUserApiGate){
	base=config.getApiGate()+"/"+config.getOaBasePath()
}

/**
 * 事项与公司关联表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',matterInfoId:'事项id',companyId:'公司id'}
 **/
 
//普通查询 条件之间and关系  
export const listMatterCompany = params => { return request.get(`${base}/oa/matter/matterCompany/list`, { params: params }); };

//模糊查询事项与公司关联表 条件之间or关系  
//export const listMatterCompanyKey = params => { return request.get(`${base}/oa/matter/matterCompany/listKey`, { params: params }); };

//删除一条事项与公司关联表 params={id:'id 主键'}
export const delMatterCompany = params => { return request.post(`${base}/oa/matter/matterCompany/del`,params); };

//批量删除事项与公司关联表  params=[{id:'id 主键'}]
export const batchDelMatterCompany = params => { return request.post(`${base}/oa/matter/matterCompany/batchDel`, params); };

//修改一条事项与公司关联表记录
export const editMatterCompany = params => { return request.post(`${base}/oa/matter/matterCompany/edit`, params); };

//新增一条事项与公司关联表
export const addMatterCompany = params => { return request.post(`${base}/oa/matter/matterCompany/add`, params); };

export const addOrDeleteMatter= params => { return request.post(`${base}/oa/matter/matterCompany/addOrDeleteMatter`, params); };