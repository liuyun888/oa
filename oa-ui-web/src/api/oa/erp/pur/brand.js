import axios from '@/utils/request'

import config from '@/common/config'

const base = config.getOaBasePath()


/**
 * pur_brand
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'品牌id 主键',brandName:'品牌名称',firstLetter:'首字母',factoryStatus:'是否为品牌制作商',logo:'品牌logo',bigPic:'专区大图',brandStory:'品牌故事'}
 **/
 
//普通查询 条件之间and关系  
export const listBrand = params => { return axios.get(`${base}/oa/erp/pur/brand/list`, { params: params }); };

//模糊查询pur_brand 条件之间or关系  
//export const listBrandKey = params => { return axios.get(`${base}/oa/erp/pur/brand/listKey`, { params: params }); };

//删除一条pur_brand params={id:'品牌id 主键'}
export const delBrand = params => { return axios.post(`${base}/oa/erp/pur/brand/del`,params); };

//批量删除pur_brand  params=[{id:'品牌id 主键'}]
export const batchDelBrand = params => { return axios.post(`${base}/oa/erp/pur/brand/batchDel`, params); };

//修改一条pur_brand记录
export const editBrand = params => { return axios.post(`${base}/oa/erp/pur/brand/edit`, params); };

//新增一条pur_brand
export const addBrand = params => { return axios.post(`${base}/oa/erp/pur/brand/add`, params); };