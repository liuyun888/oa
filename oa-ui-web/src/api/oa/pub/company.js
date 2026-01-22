import request from '@/utils/request';

import config from '../../../common/config'

let base = config.getOaBasePath();

//如果使用api网关进行访问
if(config.isUserApiGate){
	base=config.getApiGate()+"/"+config.getOaBasePath()
}

/**
 * 往来单位
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={companyId:'公司编号 主键',branchId:'云用户机构编号 主键',companyName:'往来单位名称',districtId:'归属地区',categoryId:'分类',phoneNo:'电话',orgId:'组织机构代码/统一信用代码',address:'详细地址'}
 **/
 
//普通查询 条件之间and关系  
export const listCompany = params => { return request.get(`${base}/oa/pub/company/list`, { params: params }); };

//模糊查询往来单位 条件之间or关系  
//export const listCompanyKey = params => { return request.get(`${base}/oa/pub/company/listKey`, { params: params }); };

//删除一条往来单位 params={companyId:'公司编号 主键',branchId:'云用户机构编号 主键'}
export const delCompany = params => { return request.post(`${base}/oa/pub/company/del`,params); };

//批量删除往来单位  params=[{companyId:'公司编号 主键',branchId:'云用户机构编号 主键'}]
export const batchDelCompany = params => { return request.post(`${base}/oa/pub/company/batchDel`, params); };

//修改一条往来单位记录
export const editCompany = params => { return request.post(`${base}/oa/pub/company/edit`, params); };

//新增一条往来单位
export const addCompany = params => { return request.post(`${base}/oa/pub/company/add`, params); };