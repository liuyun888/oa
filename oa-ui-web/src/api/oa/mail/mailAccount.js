import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * mail_account
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',email:'邮箱',password:'密码或授权码',receiveServerType:'收件服务器类型',receiveServer:'收件服务器类型',receiveIsSsl:'是否使用SSL',receivePort:'端口',sendServer:'SMTP服务器',sendIsSsl:'是否使用SSL',sendPort:'端口',isDefault:'是否默认',remark:'备注说明'}
 **/
 
//检查账号下的新邮件
export const checkNewEmail = params => { return axios.get(`${base}/oa/mail/mailAccount/checkNewEmail`, { params: params }); };

//普通查询 条件之间and关系  
export const listMailAccount = params => { return axios.get(`${base}/oa/mail/mailAccount/list`, { params: params }); };

//模糊查询mail_account 条件之间or关系  
//export const listMailAccountKey = params => { return axios.get(`${base}/oa/mail/mailAccount/listKey`, { params: params }); };

//删除一条mail_account params={id:'主键 主键'}
export const delMailAccount = params => { return axios.post(`${base}/oa/mail/mailAccount/del`,params); };

//批量删除mail_account  params=[{id:'主键 主键'}]
export const batchDelMailAccount = params => { return axios.post(`${base}/oa/mail/mailAccount/batchDel`, params); };

//修改一条mail_account记录
export const editMailAccount = params => { return axios.post(`${base}/oa/mail/mailAccount/edit`, params); };

//新增一条mail_account
export const addMailAccount = params => { return axios.post(`${base}/oa/mail/mailAccount/add`, params); };

//测试mail_account
export const testMailAccount = params => { return axios.post(`${base}/oa/mail/mailAccount/test`, params); };