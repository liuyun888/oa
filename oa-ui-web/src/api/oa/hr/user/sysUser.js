import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * sys_user
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={userid:'内部用户编号 主键',unionid:'全局唯一编号',displayUserid:'登录展示使用用户编号',locked:'是否被锁定0否1是',startdate:'启用日期',nickname:'昵称',username:'用户名称',phoneno:'移动电话号码',password:'密码',salt:'盐值',pwdtype:'密码类型1指纹2密码',headimgurl:'头像地址',country:'国家',city:'城市',province:'省份',address:'详细地址',sex:'性别',enddate:'到期日期',districtId:'区县编号',email:'邮箱',fgOne:'指纹1',fgTwo:'指纹2',fgThr:'指纹3',idCardNo:'身份证号码',officePhoneno:'办公室电话',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态'}
 **/
 
//普通查询 条件之间and关系  
export const listSysUser = params => { return axios.get(`${base}/oa/hr/user/sysUser/list`, { params: params }); };

//模糊查询sys_user 条件之间or关系  
//export const listSysUserKey = params => { return axios.get(`${base}/oa/hr/user/sysUser/listKey`, { params: params }); };

//删除一条sys_user params={userid:'内部用户编号 主键'}
export const delSysUser = params => { return axios.post(`${base}/oa/hr/user/sysUser/del`,params); };

//批量删除sys_user  params=[{userid:'内部用户编号 主键'}]
export const batchDelSysUser = params => { return axios.post(`${base}/oa/hr/user/sysUser/batchDel`, params); };

//修改一条sys_user记录
export const editSysUser = params => { return axios.post(`${base}/oa/hr/user/sysUser/edit`, params); };

//新增一条sys_user
export const addSysUser = params => { return axios.post(`${base}/oa/hr/user/sysUser/add`, params); };

//查询用户信息  
export const getUserInfomation = params => { return axios.get(`${base}/oa/hr/user/sysUser/getUserInfomation`, { params: params }); };


//查询用户信息  
export const getUserDeptPost = params => { return axios.get(`${base}/oa/hr/user/sysUser/getUserDeptPost`, { params: params }); };

