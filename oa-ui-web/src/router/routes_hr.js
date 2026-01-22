import Vue from 'vue'
/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
	routes: [
		{
			path: '/oa/hr',
			component: Layout,
			name: '档案信息',
			iconCls: 'fa el-icon-menu',
			meta: {
				title: '档案信息',
				icon: 'record'
			},
			// leaf: true,//只有一个节点
			children: [
				{ path: 'user/employeeInfo', component: _import('oa/hr/user/employeeInfo'), name: 'employeeInfo', meta: { title: '在职员工信息' } },
				{ path: 'user/dimissionEmployeeInfo', component: _import('oa/hr/user/dimissionEmployeeInfo'), name: 'dimissionEmployeeInfo', meta: { title: '离职员工信息' } },
				{ path: 'user/HrUserContract', component: _import('oa/hr/user/HrUserContract'), name: 'HrUserContract', meta: { title: '合同信息' } },
				{ path: 'user/HrUserWorked', component: _import('oa/hr/user/HrUserWorked'), name: 'HrUserWorked', meta: { title: '工作经历' } },
				{ path: 'user/HrUserEduRecord', component: _import('oa/hr/user/HrUserEduRecord'), name: 'HrUserEduRecord', meta: { title: '教育记录' } },
				{ path: 'user/HrUserTrain', component: _import('oa/hr/user/HrUserTrain'), name: 'HrUserTrain', meta: { title: '培训记录' } },
				{ path: 'user/HrUserCredential', component: _import('oa/hr/user/HrUserCredential'), name: 'HrUserCredential', meta: { title: '资格证书' } },
				{ path: 'user/HrUserIncentiveInfo', component: _import('oa/hr/user/HrUserIncentiveInfo'), name: 'HrUserIncentiveInfo', meta: { title: '奖惩信息' } },
				{ path: 'user/HrUserAccessoryMng', component: _import('oa/hr/user/hrUserAccessory/HrUserAccessoryMng'), name: 'HrUserAccessoryMng', meta: { title: '附件管理' } },
			]
		},
		{
			path: '/oa/hr/user/addUserInfo',
			name: '添加员工',
			iconCls: 'fa el-icon-menu',
			meta: {
				title: '添加员工',
				icon: 'example'
			},
			component: _import('oa/hr/user/addUserInfo')
		},
		{
			path: '/oa/hr/user/editUserBaseInfo',
			name: '修改员工信息',
			iconCls: 'fa el-icon-menu',
			meta: {
				title: '修改员工信息',
				icon: 'example'
			},
			component: _import('oa/hr/user/editUserBaseInfo')
		},
		
	]
}
