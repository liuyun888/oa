/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
  routes: [
    {
      path: '/oa/om',
      component: Layout,
      name: 'OmMngCenter',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '办公用品',
        icon: 'office-supplies'
      },
      children: [
        
        { path: 'omAppliance/OmApplianceMng', component: _import('oa/om/omAppliance/OmApplianceMng'), name: 'OmApplianceMng', meta: { title: '用品管理' }},
        { path: 'omApplianceRequire/OmApplianceRequireAdd', component: _import('oa/om/omApplianceRequire/OmApplianceRequireAdd'), name: 'OmApplianceRequireAdd', meta: { title: '领用申请' }},
        { path: 'omApplianceRequire/OmApplianceRequireMy', component: _import('oa/om/omApplianceRequire/OmApplianceRequireMy'), name: 'OmApplianceRequireMy', meta: { title: '我的申领' }},
        { path: 'omApplianceRequire/OmApplianceRequireMng', component: _import('oa/om/omApplianceRequire/OmApplianceRequireMng'), name: 'OmApplianceRequireMng', meta: { title: '领用管理' }},
        { path: 'omAppliancePurchase/OmAppliancePurchaseAdd', component: _import('oa/om/omAppliancePurchase/OmAppliancePurchaseAdd'), name: 'OmAppliancePurchaseAdd', meta: { title: '采购申请' }},
        { path: 'omAppliancePurchase/OmAppliancePurchaseMy', component: _import('oa/om/omAppliancePurchase/OmAppliancePurchaseMy'), name: 'OmAppliancePurchaseMy', meta: { title: '我的采购' }},
        { path: 'omAppliancePurchase/OmAppliancePurchaseMng', component: _import('oa/om/omAppliancePurchase/OmAppliancePurchaseMng'), name: 'omAppliancePurchaseMng', meta: { title: '采购管理' }},
        { path: 'omApplianceStorage/OmApplianceStorageMng', component: _import('oa/om/omApplianceStorage/OmApplianceStorageMng'), name: 'OmApplianceStorageMng', meta: { title: '入库管理' }},
        { path: 'omAppliance/OmApplianceNeedPurchase', component: _import('oa/om/omAppliance/OmApplianceNeedPurchase'), name: 'OmApplianceNeedPurchase', meta: { title: '库存警示' }},
        { path: 'omCategory/OmCategoryMng', component: _import('oa/om/omCategory/OmCategoryMng'), name: 'OmCategoryMng', meta: { title: '分类管理' }},


      ]
    }
  ]
}
