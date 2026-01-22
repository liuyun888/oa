/* Layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)

export default {
  routes: [{
    path: '/oa/duban', component: Layout, name: 'DubanMngCenter', iconCls: 'fa el-icon-menu', meta: {
      title: '督办管理', icon: 'supervise-and-handle'
    }, // leaf: true,//只有一个节点
    children: [{
      path: 'dubanItem/DubanItem',
      component: _import('oa/duban/dubanItem/Index'),
      name: 'DubanItem',
      meta: {title: '督办立项'}
    }, {
      path: 'dubanItem/DutyDubanItem',
      component: _import('oa/duban/dubanItem/DutyDubanItem'),
      name: 'DutyDubanItem',
      meta: {title: '责任事项'}
    }, {
      path: 'dubanItem/CreateDubanItem',
      component: _import('oa/duban/dubanItem/CreateDubanItem'),
      name: 'CreateDubanItem',
      meta: {title: '代发事项'}
    }, {
      path: 'dubanItem/MonitorDubanItem',
      component: _import('oa/duban/dubanItem/MonitorDubanItem'),
      name: 'MonitorDubanItem',
      meta: {title: '监控列表'}
    }, {
      path: 'dubanItem/DubanItemMng',
      component: _import('oa/duban/dubanItem/DubanItemMng'),
      name: 'DubanItemMng',
      meta: {title: '督办管理'}
    }, {
      path: 'dubanCategory/DubanCategoryMng',
      component: _import('oa/duban/dubanCategory/Index'),
      name: 'DubanCategoryMng',
      meta: {title: '督办分类'}
    },]
  }, {
    path: '/oa/duban', component: Layout, name: 'DubanTaskMngCenter', iconCls: 'fa el-icon-menu', meta: {
      title: '督办任务', icon: 'supervise-and-handle-task'
    }, children: [{
      path: 'dubanItemTask/HostDubanItemTask',
      component: _import('oa/duban/dubanItemTask/HostDubanItemTask'),
      name: 'HostDubanItemTask',
      meta: {title: '我的主办'}
    }, {
      path: 'dubanItemTask/CoopDubanItemTask',
      component: _import('oa/duban/dubanItemTask/CoopDubanItemTask'),
      name: 'CoopDubanItemTask',
      meta: {title: '我的协办'}
    }, {
      path: 'dubanItemTask/FixDubanItemTask',
      component: _import('oa/duban/dubanItemTask/FixDubanItemTask'),
      name: 'FixDubanItemTask',
      meta: {title: '归档任务'}
    }, // { path: 'dubanItemTask/DubanItemTaskMng', component: _import('oa/duban/dubanItemTask/DubanItemTaskMng'), name: 'DubanItemTaskMng', meta: { title: '任务管理' }},
    ]
  }, {
    path: '/oa/duban/detail', name: '', iconCls: 'fa el-icon-menu', meta: {
      title: '督办详细', icon: 'example'
    }, component: _import('oa/duban/components/DubanDetail')
  }]
}
