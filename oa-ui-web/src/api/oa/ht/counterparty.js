import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();

/**
 * ht_counterparty
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={cpId:'相对方id 主键',cpSn:'相对方编号',cpShort:'相对方简称',cpLevel:'相对方级别',cpType:'相对放类型',cpTypeName:'相对方类型名称',cpStatus:'1',cpIndustry:'相对放行业',cpIndustryName:'相对方行业名称',cpAddress:'相对方国家地区',cpRegion:'相对方区域',cpRegionName:'相对方区域名称',cpWebsite:'相对方网址',cpDesc:'相对方简介',cpFddb:'相对方法定代表',cpZcxx:'相对方注册信息',cpGszch:'相对方工商注册号',cpZczb:'相对方注册资本',cpZcsj:'相对方注册时间',cpDwzt:'单位状态：',cpPhone:'相对方单位电话',cpEmail:'相对方邮箱',cpFax:'相对方传真',cpProvince:'相对方省',cpProvinceCode:'相对方省代码',cpCity:'相对方市',cpCityCode:'相对方市代码',cpDistrict:'相对方区',cpDistrictCode:'相对方区代码',cpFzr:'相对方负责人',cpFzrPhone:'相对方负责人手机',cpClearWay:'相对方结算方式',cpOpenBank:'相对方开户行',cpCurrency:'相对方币种',cpBankAccount:'相对方账号',branchId:'机构账号',createTime:'创建时间',createUserId:'创建用户',createUserName:'创建用户名称'}
 **/
 
//普通查询 条件之间and关系  
export const listCounterparty = params => { return axios.get(`${base}/oa/ht/counterparty/list`, { params: params }); };

//模糊查询ht_counterparty 条件之间or关系  
//export const listCounterpartyKey = params => { return axios.get(`${base}/oa/ht/counterparty/listKey`, { params: params }); };

//删除一条ht_counterparty params={cpId:'相对方id 主键'}
export const delCounterparty = params => { return axios.post(`${base}/oa/ht/counterparty/del`,params); };

//批量删除ht_counterparty  params=[{cpId:'相对方id 主键'}]
export const batchDelCounterparty = params => { return axios.post(`${base}/oa/ht/counterparty/batchDel`, params); };

//修改一条ht_counterparty记录
export const editCounterparty = params => { return axios.post(`${base}/oa/ht/counterparty/edit`, params); };

//新增一条ht_counterparty
export const addCounterparty = params => { return axios.post(`${base}/oa/ht/counterparty/add`, params); };