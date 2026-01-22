import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * mail_email_addressee
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',emailId:'邮件id',userId:'收件人id',username:'收件人名字',userEmail:'收件人邮箱'}
 **/
 
//普通查询 条件之间and关系  
export const listMailEmailAddressee = params => { return axios.get(`${base}/oa/mail/mailEmailAddressee/list`, { params: params }); };

//模糊查询mail_email_addressee 条件之间or关系  
//export const listMailEmailAddresseeKey = params => { return axios.get(`${base}/oa/mail/mailEmailAddressee/listKey`, { params: params }); };

//删除一条mail_email_addressee params={id:'主键 主键'}
export const delMailEmailAddressee = params => { return axios.post(`${base}/oa/mail/mailEmailAddressee/del`,params); };

//批量删除mail_email_addressee  params=[{id:'主键 主键'}]
export const batchDelMailEmailAddressee = params => { return axios.post(`${base}/oa/mail/mailEmailAddressee/batchDel`, params); };

//修改一条mail_email_addressee记录
export const editMailEmailAddressee = params => { return axios.post(`${base}/oa/mail/mailEmailAddressee/edit`, params); };
export const setStarMailEmailAddressee = params => { return axios.post(`${base}/oa/mail/mailEmailAddressee/setStar`, params); };
export const setReadMailEmailAddressee = params => { return axios.post(`${base}/oa/mail/mailEmailAddressee/setRead`, params); };

//新增一条mail_email_addressee
export const addMailEmailAddressee = params => { return axios.post(`${base}/oa/mail/mailEmailAddressee/add`, params); };