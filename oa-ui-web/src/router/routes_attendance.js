/* Layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)

export default {
  routes: [{
    path: '/oa/kq', component: Layout, name: 'AttendanceCenter', iconCls: 'fa el-icon-menu', meta: {
      title: '考勤中心', icon: 'checking-in'
    }, // leaf: true,//只有一个节点
    children: [{
      path: 'kqVacationType/KqVacationTypeMng',
      component: _import('oa/kq/kqVacationType/Index'),
      name: 'KqVacationTypeMng',
      meta: {title: '假期定义'}
    }, {
      path: 'attendance/leaveApply',
      component: _import('oa/kq/attendance/leaveApply'),
      name: 'leaveApply',
      meta: {title: '请假申请'}
    }, {
      path: 'attendance/MyKqEmpVacationInfoMng',
      component: _import('oa/kq/attendance/kqEmpVacationInfo/MyKqEmpVacationInfoMng'),
      name: 'MyKqEmpVacationInfoMng',
      meta: {title: '我的假条'}
    }, {
      path: 'attendance/kqEmpVacationInfo/KqEmpVacationInfoMng',
      component: _import('oa/kq/attendance/kqEmpVacationInfo/Index'),
      name: 'KqEmpVacationInfoMng',
      meta: {title: '请假管理'}
    }, {
      path: 'attendance/kqEmpVacationInfo/KqEmpVacationInfoCalc',
      component: _import('oa/kq/attendance/kqEmpVacationInfo/KqEmpVacationInfoCalc'),
      name: 'KqEmpVacationInfoCalc',
      meta: {title: '员工假期统计'}
    }, {
      path: 'attendance/overtimeApply',
      component: _import('oa/kq/attendance/overtimeApply'),
      name: 'overtimeApply',
      meta: {title: '加班申请'}
    }, {
      path: 'attendance/kqWorkOvertimeInfo/KqWorkOvertimeInfoMng',
      component: _import('oa/kq/attendance/kqWorkOvertimeInfo/Index'),
      name: 'KqWorkOvertimeInfoMng',
      meta: {title: '加班管理'}
    }, // { path: 'attendance/kqHolidays/KqHolidaysMng', component: _import('oa/kq/attendance/kqHolidays/KqHolidaysMng'), name: 'KqHolidaysMng', meta: {title: '节假日管理' }},
      {
        path: 'attendance/workingCalendar',
        component: _import('oa/kq/attendance/workingCalendar'),
        name: 'workingCalendar',
        meta: {title: '工作日历'}
      }, {
        path: 'attendance/AttendanceMonth',
        component: _import('oa/kq/attendance/AttendanceMonth'),
        name: 'AttendanceMonth',
        meta: {title: '每月考勤'}
      }, // { path: 'attendance/AttendanceDaily', component: _import('oa/kq/attendance/AttendanceDaily'), name: 'AttendanceDaily', meta: { title: '每日考勤' }},
      {
        path: 'attendance/AttendanceMng',
        component: _import('oa/kq/attendance/AttendanceMng'),
        name: 'AttendanceMng',
        meta: {title: '考勤管理'}
      }, {
        path: 'attendance/Attendance',
        component: _import('oa/kq/attendance/Attendance'),
        name: 'Attendance',
        meta: {title: '个人考勤'}
      },]
  },]
}
