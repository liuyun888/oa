/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
  routes: [
    {
      path: '/oa/car',
      component: Layout,
      name: 'CarMngCenter',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '车辆中心',
        icon: 'car'
      },
      // leaf: true,//只有一个节点
      children: [
        { path: 'carOfficeCar/CarOfficeCarMng', component: _import('oa/car/carOfficeCar/CarOfficeCarMng'), name: 'CarOfficeCarMng', meta: { title: '车辆管理' }},
        { path: 'carDriver/CarDriverMng', component: _import('oa/car/carDriver/CarDriverMng'), name: 'CarDriverMng', meta: { title: '司机管理' }},
        { path: 'carCarDriverTpl/CarCarDriverTplMng', component: _import('oa/car/carCarDriverTpl/CarCarDriverTplMng'), name: 'CarCarDriverTplMng', meta: { title: '车辆司机管理'}},
        { path: 'carRouteTpl/CarRouteTplMng', component: _import('oa/car/carRouteTpl/CarRouteTplMng'), name: 'CarRouteTplMng', meta: { title: '路线模板管理'}},
        // { path: 'carRouteDetailTpl/CarRouteDetailTplMng', component: _import('oa/car/carRouteDetailTpl/CarRouteDetailTplMng'), name: 'CarRouteDetailTplMng', meta: { title: '路线详细管理'}},
        { path: 'carExpenseDetailTpl/CarExpenseDetailTplMng', component: _import('oa/car/carExpenseDetailTpl/CarExpenseDetailTplMng'), name: 'CarExpenseDetailTplMng', meta: { title: '费用模板管理'}},
        { path: 'carDriverSignIn/CarDriverSignInMng', component: _import('oa/car/carDriverSignIn/CarDriverSignInMng'), name: 'CarDriverSignInMng', meta: { title: '司机打卡管理'}},
        { path: 'carRequire/CarRequire', component: _import('oa/car/carRequire/CarRequire'), name: 'CarRequire', meta: { title: '用车申请'}},
        { path: 'carRequire/CarRequireMng', component: _import('oa/car/carRequire/CarRequireMng'), name: 'CarRequireMng', meta: { title: '用车申请管理'}},
        { path: 'components/watch', component: _import('oa/car/components/watch'), name: 'watch', meta: { title: '车辆监控中心'}},
        // { path: 'carRequireCarDriver/CarRequireCarDriverMng', component: _import('oa/car/carRequireCarDriver/CarRequireCarDriverMng'), name: 'CarRequireCarDriverMng', meta: { title: '用车司机关联'}},
        // { path: 'carRequireExpenseDetail/CarRequireExpenseDetailMng', component: _import('oa/car/carRequireExpenseDetail/CarRequireExpenseDetailMng'), name: 'CarRequireExpenseDetailMng', meta: { title: '用车项目费用'}},
        // { path: 'carRequireRoute/CarRequireRouteMng', component: _import('oa/car/carRequireRoute/CarRequireRouteMng'), name: 'CarRequireRouteMng', meta: { title: '用车路线'}},
        // { path: 'carRequireRouteDetail/CarRequireRouteDetailMng', component: _import('oa/car/carRequireRouteDetail/CarRequireRouteDetailMng'), name: 'CarRequireRouteDetailMng', meta: { title: '用车详细路线'}}
      ]
    },
    {
      path: '/oa/car/watch',
      name: '车辆监控中心',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '车辆中心',
        icon: 'example'
      },
      component: _import('oa/car/components/watch')
    }
  ]
}
