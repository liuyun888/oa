/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
  routes: [
    {
      path: '/oa/meet',
      component: Layout,
      name: 'MeetingMngCenter',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '会议管理',
        icon: 'conference'
      },
      // leaf: true,//只有一个节点
      children: [
        { path: 'meetMeeting/MeetMeetingRequire', component: _import('oa/meet/meetMeeting/MeetMeetingRequire'), name: 'MeetMeetingRequire', meta: { title: '会议申请' }},
        { path: 'meetMeeting/MyMeetMeeting', component: _import('oa/meet/meetMeeting/MyMeetMeeting'), name: 'MyMeetMeeting', meta: { title: '我的会议' }},
        { path: 'meetMeeting/MeetMeetingMng', component: _import('oa/meet/meetMeeting/MeetMeetingMng'), name: 'MeetMeetingMng', meta: { title: '会议管理' }},
        { path: 'meetCategory/MeetCategoryMng', component: _import('oa/meet/meetCategory/MeetCategoryMng'), name: 'MeetCategoryMng', meta: { title: '分类管理' }},
        { path: 'meetBoardroomType/MeetBoardroomTypeMng', component: _import('oa/meet/meetBoardroomType/MeetBoardroomTypeMng'), name: 'MeetBoardroomTypeMng', meta: { title: '会议室分类' }},
        { path: 'meetBoardroom/MeetBoardroomMng', component: _import('oa/meet/meetBoardroom/MeetBoardroomMng'), name: 'MeetBoardroomMng', meta: { title: '会议室管理' }},
        { path: 'meetDevice/MeetDeviceMng', component: _import('oa/meet/meetDevice/MeetDeviceMng'), name: 'MeetDeviceMng', meta: { title: '设备管理' }},
      ]
    },
    {
      path: '/oa/meet/mine/attence',
      component: _import('oa/meet/meetMeeting/MeetMeetingAttend'),
      name: 'MeetMeetingAttend',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '参加会议',
        icon: 'example'
      },
    },
  ]
}
