import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * sig_seal_signet
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',sealId:'申请单编号',docName:'材料名称',docFileUrl:'材料保存地址/下载地址/上传地址',signetId:'印章编号',signetType:'印章类型公章0法人代表章1法人代表章',signetBranchId:'所属主体',sealCount:'用印份数',pageSeal:'是否加盖骑缝章'}
 **/
 
//普通查询 条件之间and关系  
export const listSigSealSignet = params => { return axios.get(`${base}/oa/sig/sigSealSignet/list`, { params: params }); };

//模糊查询sig_seal_signet 条件之间or关系  
//export const listSigSealSignetKey = params => { return axios.get(`${base}/oa/sig/sigSealSignet/listKey`, { params: params }); };

//删除一条sig_seal_signet params={id:'主键 主键'}
export const delSigSealSignet = params => { return axios.post(`${base}/oa/sig/sigSealSignet/del`,params); };

//批量删除sig_seal_signet  params=[{id:'主键 主键'}]
export const batchDelSigSealSignet = params => { return axios.post(`${base}/oa/sig/sigSealSignet/batchDel`, params); };

//修改一条sig_seal_signet记录
export const editSigSealSignet = params => { return axios.post(`${base}/oa/sig/sigSealSignet/edit`, params); };

//新增一条sig_seal_signet
export const addSigSealSignet = params => { return axios.post(`${base}/oa/sig/sigSealSignet/add`, params); };