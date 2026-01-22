import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * mail_email
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',subject:'主题',content:'正文',senderId:'发件人id',senderName:'发件人名字',senderEmail:'发件人邮箱',sendTime:'时间',isStar:'是否为星标',isRead:'是否已读',status:'发送状态'}
 **/
 
//普通查询 条件之间and关系  
export const getMailMessage = params => { return axios.get(`${base}/oa/mail/mailEmail/getMailMessage`, { params: params }); };
export const listMailEmail = params => { return axios.get(`${base}/oa/mail/mailEmail/list`, { params: params }); };

//模糊查询mail_email 条件之间or关系  
//export const listMailEmailKey = params => { return axios.get(`${base}/oa/mail/mailEmail/listKey`, { params: params }); };

//删除一条mail_email params={id:'主键 主键'}
export const delMailEmail = params => { return axios.post(`${base}/oa/mail/mailEmail/del`,params); };

//批量删除mail_email  params=[{id:'主键 主键'}]
export const batchDelMailEmail = params => { return axios.post(`${base}/oa/mail/mailEmail/batchDel`, params); };

//修改一条mail_email记录
export const editMailEmail = params => { return axios.post(`${base}/oa/mail/mailEmail/edit`, params); };
export const setStarMailEmail = params => { return axios.post(`${base}/oa/mail/mailEmail/setStar`, params); };
export const setReadMailEmail = params => { return axios.post(`${base}/oa/mail/mailEmail/setRead`, params); };


//新增一条mail_email
export const addMailEmail = params => { return axios.post(`${base}/oa/mail/mailEmail/add`, params); };

//接收mail_email
export const receiveMailEmail = params => { return axios.post(`${base}/oa/mail/mailEmail/receive`, params); };


export const receiveAllMailEmail = params => { return axios.post(`${base}/oa/mail/mailEmail/receiveAll`, params); };