import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * mail_email_cc
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',emailId:'邮件id',userId:'抄送人id',username:'抄送人名字',userEmail:'抄送人邮箱'}
 **/
 
//普通查询 条件之间and关系  
export const listMailEmailCc = params => { return axios.get(`${base}/oa/mail/mailEmailCc/list`, { params: params }); };

//模糊查询mail_email_cc 条件之间or关系  
//export const listMailEmailCcKey = params => { return axios.get(`${base}/oa/mail/mailEmailCc/listKey`, { params: params }); };

//删除一条mail_email_cc params={id:'主键 主键'}
export const delMailEmailCc = params => { return axios.post(`${base}/oa/mail/mailEmailCc/del`,params); };

//批量删除mail_email_cc  params=[{id:'主键 主键'}]
export const batchDelMailEmailCc = params => { return axios.post(`${base}/oa/mail/mailEmailCc/batchDel`, params); };

//修改一条mail_email_cc记录
export const editMailEmailCc = params => { return axios.post(`${base}/oa/mail/mailEmailCc/edit`, params); };

//新增一条mail_email_cc
export const addMailEmailCc = params => { return axios.post(`${base}/oa/mail/mailEmailCc/add`, params); };