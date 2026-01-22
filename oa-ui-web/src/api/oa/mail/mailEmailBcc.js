import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * mail_email_bcc
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',emailId:'邮件id',userId:'密送人id',username:'密送人名字',userEmail:'密送人邮箱'}
 **/
 
//普通查询 条件之间and关系  
export const listMailEmailBcc = params => { return axios.get(`${base}/oa/mail/mailEmailBcc/list`, { params: params }); };

//模糊查询mail_email_bcc 条件之间or关系  
//export const listMailEmailBccKey = params => { return axios.get(`${base}/oa/mail/mailEmailBcc/listKey`, { params: params }); };

//删除一条mail_email_bcc params={id:'主键 主键'}
export const delMailEmailBcc = params => { return axios.post(`${base}/oa/mail/mailEmailBcc/del`,params); };

//批量删除mail_email_bcc  params=[{id:'主键 主键'}]
export const batchDelMailEmailBcc = params => { return axios.post(`${base}/oa/mail/mailEmailBcc/batchDel`, params); };

//修改一条mail_email_bcc记录
export const editMailEmailBcc = params => { return axios.post(`${base}/oa/mail/mailEmailBcc/edit`, params); };

//新增一条mail_email_bcc
export const addMailEmailBcc = params => { return axios.post(`${base}/oa/mail/mailEmailBcc/add`, params); };