import request from '@/utils/request';

import config from '../../../common/config'

let base = config.getOaBasePath();

//如果使用api网关进行访问
if(config.isUserApiGate){
	base=config.getApiGate()+"/"+config.getOaBasePath()
}

/**
 * 事项检查内容
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',serialNumber:'编号',contentName:'检查内容名称',inspectMethod:'检查方法',legalFrequency:'法定频次（检查频次）',adviseFrequency:'建议频次（检查频次）',remarks:'备注',itemId:'检查项目id',branchId:'云用户机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listMatterInspectContent = params => { return request.get(`${base}/oa/matter/matterInspectContent/list`, { params: params }); };

//模糊查询事项检查内容 条件之间or关系  
//export const listMatterInspectContentKey = params => { return request.get(`${base}/oa/matter/matterInspectContent/listKey`, { params: params }); };

//删除一条事项检查内容 params={id:'id 主键'}
export const delMatterInspectContent = params => { return request.post(`${base}/oa/matter/matterInspectContent/del`,params); };

//批量删除事项检查内容  params=[{id:'id 主键'}]
export const batchDelMatterInspectContent = params => { return request.post(`${base}/oa/matter/matterInspectContent/batchDel`, params); };

//修改一条事项检查内容记录
export const editMatterInspectContent = params => { return request.post(`${base}/oa/matter/matterInspectContent/edit`, params); };

//新增一条事项检查内容
export const addMatterInspectContent = params => { return request.post(`${base}/oa/matter/matterInspectContent/add`, params); };