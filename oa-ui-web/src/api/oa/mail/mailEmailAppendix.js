import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * mail_email_appendix
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',emailId:'邮件id',name:'附件名字',addr:'附件地址',type:'附件类型',remark:'备注说明'}
 **/
 
//普通查询 条件之间and关系  
export const listMailEmailAppendix = params => { return axios.get(`${base}/oa/mail/mailEmailAppendix/list`, { params: params }); };

//模糊查询mail_email_appendix 条件之间or关系  
//export const listMailEmailAppendixKey = params => { return axios.get(`${base}/oa/mail/mailEmailAppendix/listKey`, { params: params }); };

//删除一条mail_email_appendix params={id:'主键 主键'}
export const delMailEmailAppendix = params => { return axios.post(`${base}/oa/mail/mailEmailAppendix/del`,params); };

//批量删除mail_email_appendix  params=[{id:'主键 主键'}]
export const batchDelMailEmailAppendix = params => { return axios.post(`${base}/oa/mail/mailEmailAppendix/batchDel`, params); };

//修改一条mail_email_appendix记录
export const editMailEmailAppendix = params => { return axios.post(`${base}/oa/mail/mailEmailAppendix/edit`, params); };

//新增一条mail_email_appendix
export const addMailEmailAppendix = params => { return axios.post(`${base}/oa/mail/mailEmailAppendix/add`, params); };