
/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
	routes: [
		{
			path: '/oa/jx',
			component: Layout,
			name: '绩效考核',
			iconCls: 'fa el-icon-menu',
			meta: {
				title: '绩效考核',
				icon: 'performance'
			},
			// leaf: true,//只有一个节点
			children: [
				{ path: 'MyAssessment', component: _import('oa/jx/MyAssessment'), name: 'MyAssessment', meta: { title: '我的绩效' } },
				{ path: 'MySelfConfirm', component: _import('oa/jx/jxAssessGrade/MySelfConfirm'), name: 'MySelfConfirm', meta: { title: '待我签约' } },
				{ path: 'MyReConfirm', component: _import('oa/jx/jxAssessGrade/MyReConfirm'), name: 'MyReConfirm', meta: { title: '待我确认' } },
				{ path: 'MySelfEval', component: _import('oa/jx/jxAssessGrade/MySelfEval'), name: 'MySelfEval', meta: { title: '待我自评' } },
				{ path: 'MyReEval', component: _import('oa/jx/jxAssessGrade/MyReEval'), name: 'MyReEval', meta: { title: '待我复评' } },
				{ path: 'MyVouch', component: _import('oa/jx/jxAssessGrade/MyVouch'), name: 'MyVouch', meta: { title: '待我核定' } },
				{ path: 'JxAssessGradeMng', component: _import('oa/jx/jxAssessGrade/JxAssessGradeMng'), name: 'JxAssessGradeMng', meta: { title: '绩效管理' } },

				{ path: 'AppraisalProgram', component: _import('oa/jx/AppraisalProgram'), name: 'AppraisalProgram', meta: { title: '考核方案' } },
				{ path: 'AssessTemplate', component: _import('oa/jx/AssessTemplate'), name: 'AssessTemplate', meta: { title: '考核模板' } },
				{ path: 'UserAssesssSatistical', component: _import('oa/jx/AssesssSatistical'), name: 'AssesssSatistical', meta: { title: '员工绩效统计' } },
				{ path: 'DeptAssesssSatistical', component: _import('oa/jx/DeptAssesssSatistical'), name: 'DeptAssesssSatistical', meta: { title: '部门绩效统计' } },
				
			]
		}
		
	]
}
