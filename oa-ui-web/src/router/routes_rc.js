/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
  routes: [{
    path: '/oa/rc',
    component: Layout,
    name: '日程管理',
    iconCls: 'fa el-icon-menu',
    alwaysShow:true,
    meta: {
      title: '日程管理',
      icon: 'schedule'
    },
    // alwaysShow: true, // 就是这行显隐起作用的
    // leaf: true,//只有一个节点
    children: [
      // {
      //   path: 'rcScheduleMy/RcScheduleMyMng',
      //   component: _import('oa/rc/rcScheduleMy/RcScheduleMyMng'),
      //   name: 'RcScheduleMyMng',
      //   meta: {
      //     title: '我的日程'
      //   },
      // },
      // {
      //   path: 'rcScheduleAll/RcScheduleAllMng',
      //   component: _import('oa/rc/rcScheduleAll/RcScheduleAllMng'),
      //   name: 'RcScheduleAllMng',
      //   meta: {
      //     title: '所有日程'
      //   }
      // },
      {
        path: 'rcSchedule/RcScheduleMng',
        component: _import('oa/rc/rcSchedule/RcScheduleMng'),
        name: 'RcScheduleMng',
        meta: {
          title: '日程管理'
        }
      },
    ]
  }]
}
