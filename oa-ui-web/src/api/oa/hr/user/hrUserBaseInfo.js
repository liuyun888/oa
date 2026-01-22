import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_user_base_info
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',userid:'用户编号',deptid:'部门编号',deptName:'部门名称',branchId:'机构编号',branchName:'机构名称',reportId:'汇报上级编号',reportName:'汇报上级名称',duty:'职务',workplace:'工作地点',account:'系统账号',post:'所属岗位',status:'员工状态---0-试用，1-实习，2-正式，3-临时，4-试用延期，5-解聘，6-离职，7-退休',level:'人员级别---0-总裁，1-公司副总，2-部门经理，3-中心总监，4-普通员工',jobNature:'工作性质',entryTime:'入职日期',positiveTime:'转正日期',jobDeadline:'用工期限，单位是年',trialDeadline:'试用期限，单位是月',phoneno:'手机号码',email:'邮箱地址',officeAddress:'办公地址',officePhoneno:'办公电话',emergencyContact:'紧急联系人',emeContactPho:'紧急联系人电话',ortherPhoneno:'其他联系方式',username:'姓名',formerName:'曾用名',idCardNo:'身份证号码',sex:'性别',birthdate:'出生日期',age:'年龄',nation:'民族',politicsStatus:'政治面貌',smokedDate:'入团日期',partyDate:'入党日期',eduBack:'最高学历',degree:'最高学位',maritalStatus:'婚姻情况',healthyCondition:'健康情况',stature:'身高(厘米)',weight:'体重(千克)',presentAddress:'现居地',nativePlace:'籍贯',birthplace:'出生地',regPerResidence:'户口所在地',regPerResidenceLocal:'户口所在派出所',startTime:'到本单位日期',workTime:'参加工作日期',workingYears:'连续工龄',enterpriseYears:'本企业工龄',accessory:'附件'}
 **/

//普通查询 条件之间and关系  
export const listHrUserBaseInfo = params => { return axios.get(`${base}/oa/hr/user/hrUserBaseInfo/list`, { params: params }); };

//模糊查询hr_user_base_info 条件之间or关系  
//export const listHrUserBaseInfoKey = params => { return axios.get(`${base}/oa/hr/user/hrUserBaseInfo/listKey`, { params: params }); };

//删除一条hr_user_base_info params={id:'id 主键'}
export const delHrUserBaseInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserBaseInfo/del`,params); };

//批量删除hr_user_base_info  params=[{id:'id 主键'}]
export const batchDelHrUserBaseInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserBaseInfo/batchDel`, params); };

//修改一条hr_user_base_info记录
export const editHrUserBaseInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserBaseInfo/edit`, params); };

//新增一条hr_user_base_info
export const addHrUserBaseInfo = params => { return axios.post(`${base}/oa/hr/user/hrUserBaseInfo/add`, params); };


//查询已经创建的员工档案，这个接口要关联用户表查询部门等信息  
export const getUserInfo = params => { return axios.get(`${base}/oa/hr/user/hrUserBaseInfo/listUserInfo`, { params: params }); };

//回显员工的所有信息
export const getEmployeeInfo = params => { return axios.get(`${base}/oa/hr/user/hrUserBaseInfo/getEmployeeInfo`, { params: params }); };

//导入excel文件
export const importantExcel = params => { return axios.post(`${base}/oa/hr/user/hrUserBaseInfo/addBaseInfoByExcel`, params,{
    headers:{'Content-Type':'multipart/form-data'}
  }); };

//根据选择要导出的类型查询员工信息
export const getBaseInfoByDeriveType = params => { return axios.get(`${base}/oa/hr/user/hrUserBaseInfo/listBaseInfoByDeriveType`, { params: params }); };
//查询最新的十条员工
export const listNewWorker = params => { return axios.get(`${base}/oa/hr/user/hrUserBaseInfo/listNewWorker`, { params: params }); };

