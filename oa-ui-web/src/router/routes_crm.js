import Vue from 'vue' 
/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default { 
    
   routes: [
        {
            path: '/oa/crm',
            component: Layout,
            name: '客户管理',
            meta: {
                title: '客户管理',
                icon: 'client'
            },
            iconCls: 'fa el-icon-menu',
            //leaf: true,//只有一个节点
            children: [
                { path: 'customer/CustomerIndex', component: _import('oa/crm/customer/CustomerIndex'), name: '客户首页', meta: { title: '客户首页' } },
                { path: 'customer/CustomerMng', component: _import('oa/crm/customer/CustomerMng'), name: '我的客户', meta: { title: '我的客户' } },
                { path: 'customerAgenda/CustomerAgendaMng', component: _import('oa/crm/customerAgenda/CustomerAgendaMng'), name: '客户联系', meta: { title: '客户联系' } },
                { path: 'customerContacter/CustomerContacterMng', component: _import('oa/crm/customerContacter/CustomerContacterMng'), name: '客户联系人', meta: { title: '客户联系人' } },
                { path: 'customerBusiness/CustomerBusinessMng', component: _import('oa/crm/customerBusiness/CustomerBusinessMng'), name: '客户商机', meta: { title: '客户商机' } },
                { path: 'customerContacter/CustomerContacterBirthday', component: _import('oa/crm/customerContacter/CustomerContacterBirthday'), name: '客户生日', meta: { title: '客户生日' } },
            ]
        },
   ]
   
}
