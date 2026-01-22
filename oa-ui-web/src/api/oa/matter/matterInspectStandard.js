import request from '@/utils/request';

import config from '../../../common/config'

let base = config.getOaBasePath();

//如果使用api网关进行访问
if(config.isUserApiGate){
	base=config.getApiGate()+"/"+config.getOaBasePath()
}

/**
 * 事项检查依据
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',accordingName:'依据名称（检查依据）',clause:'依据条款（检查依据）',contentId:'检查内容id',branchId:'云用户机构编号',standard:'检查标准'}
 **/
 
//普通查询 条件之间and关系  
export const listMatterInspectStandard = params => { return request.get(`${base}/oa/matter/matterInspectStandard/list`, { params: params }); };

//模糊查询事项检查依据 条件之间or关系  
//export const listMatterInspectStandardKey = params => { return request.get(`${base}/oa/matter/matterInspectStandard/listKey`, { params: params }); };

//删除一条事项检查依据 params={id:'id 主键'}
export const delMatterInspectStandard = params => { return request.post(`${base}/oa/matter/matterInspectStandard/del`,params); };

//批量删除事项检查依据  params=[{id:'id 主键'}]
export const batchDelMatterInspectStandard = params => { return request.post(`${base}/oa/matter/matterInspectStandard/batchDel`, params); };

//修改一条事项检查依据记录
export const editMatterInspectStandard = params => { return request.post(`${base}/oa/matter/matterInspectStandard/edit`, params); };

//新增一条事项检查依据
export const addMatterInspectStandard = params => { return request.post(`${base}/oa/matter/matterInspectStandard/add`, params); };