import Vue from 'vue'
/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
	routes: [
		{
			path: '/oa/portal',
			component: Layout,
			name: '门户',
			iconCls: 'fa el-icon-menu',
			meta: {
				title: '门户',
				icon: 'portal'
			},
			// leaf: true,//只有一个节点
			children: [
				
				{ path: 'dailyOfficeWork', component: _import('oa/portal/dailyOfficeWork'), name: 'dailyOfficeWork', meta: { title: '日常办公' } },
				{ path: 'personPortal', component: _import('oa/portal/personPortal'), name: 'personPortal', meta: { title: '个人门户' } },
				{ path: 'companyPortal', component: _import('oa/portal/companyPortal'), name: 'companyPortal', meta: { title: '公司门户' } },
				{ path: 'marketingPortal', component: _import('oa/portal/marketingPortal'), name: 'marketingPortal', meta: { title: '营销门户' } },
				{ path: 'knowledgePortal', component: _import('oa/portal/knowledgePortal'), name: 'knowledgePortal', meta: { title: '知识门户' } },
				{ path: 'statementPortal', component: _import('oa/portal/statementPortal'), name: 'statementPortal', meta: { title: '报表门户' } },
				{ path: 'contractPortal', component: _import('oa/portal/contractPortal'), name: 'contractPortal', meta: { title: '合同统计报表' } },
			]
		},
		

	]
}
