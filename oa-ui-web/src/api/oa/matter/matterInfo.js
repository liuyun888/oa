import request from '@/utils/request';

import config from '../../../common/config'

let base = config.getOaBasePath();

//如果使用api网关进行访问
if(config.isUserApiGate){
	base=config.getApiGate()+"/"+config.getOaBasePath()
}

/**
 * 事项库-事项基本信息
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',majorName:'专业名称',businessName:'业务名称',companyHandbook:'公司手册',branchId:'云用户机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listMatterInfo = params => { return request.get(`${base}/oa/matter/matterInfo/list`, { params: params }); };
export const getMatterInfo= params => { return request.get(`${base}/oa/matter/matterInfo/getMatterInfo`, { params: params }); };
//模糊查询事项库-事项基本信息 条件之间or关系  
//export const listMatterInfoKey = params => { return request.get(`${base}/oa/matter/matterInfo/listKey`, { params: params }); };

//删除一条事项库-事项基本信息 params={id:'id 主键'}
export const delMatterInfo = params => { return request.post(`${base}/oa/matter/matterInfo/del`,params); };
export const  importData= params => { return request.post(`${base}/oa/matter/matterInfo/importData`, params); };
export const uploadFileToRemote=(request)=>{
	console.log('req--->');
	console.log(request);
	let formData=new FormData();
	formData.append('file',request.file);
	return request.post(request.action,formData);
			
	
	/*request.post(request.action,formData).then((res)=>{
		console.log(res);
	})*/
}
//批量删除事项库-事项基本信息  params=[{id:'id 主键'}]
export const batchDelMatterInfo = params => { return request.post(`${base}/oa/matter/matterInfo/batchDel`, params); };

//修改一条事项库-事项基本信息记录
export const editMatterInfo = params => { return request.post(`${base}/oa/matter/matterInfo/edit`, params); };

//新增一条事项库-事项基本信息
export const addMatterInfo = params => { return request.post(`${base}/oa/matter/matterInfo/add`, params); };