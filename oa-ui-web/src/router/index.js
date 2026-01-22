import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import routesWorkflow from './routes_workflow'
import routesForm from './routes_form'
import routesAttendance from './routes_attendance'
import routesSig from './routes_sig'
import routesAsset from './routes_asset'
import routesCar from './routes_car'
import routesHr from './routes_hr'
import routesDuban from './routes_duban'
import routerCrm from './routes_crm'
import routerRc from './routes_rc'
import routerJx from './routes_jx'
import routerHt from './routes_ht'
import routerMeeting from './routes_meeting'
import routerXm from './routes_xm'
import routerMail from './routes_mail'
import routesPortal from './routes_portal'
import routesOm from './routes_om'
import routesZp from './routes_zp'
import routesArc from './routes_arc'
import routesIm from './routes_im'


export { Layout }

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  { path: '/changeEmailStepOne', component: _import('mdp/sys/user/ChangeEmailStepOne'), hidden: true },
  { path: '/changeEmailStepTwo', component: _import('mdp/sys/user/ChangeEmailStepTwo'), hidden: true },
  { path: '/menus', component: _import('mdp/menu/menuDef/MenuDefMng'), name: 'MenuDefMng', meta: { title: '菜单管理' ,menu:true},hidden:true},

  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    name:"首页",
    meta:{title:'首页',icon: 'home-page'},
    children: [{
      path: 'dashboard',
      component: _import('oa/portal/dailyOfficeWork'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'home-page', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

let allRoutes = []

allRoutes = allRoutes.concat(routesWorkflow.routes).concat(routesForm.routes).concat(routesAttendance.routes).concat(routesSig.routes).concat(routesAsset.routes).concat(routesCar.routes).concat(routesHr.routes).concat(routesDuban.routes).concat(routerCrm.routes).concat(routerRc.routes).concat(routerJx.routes).concat(routerMeeting.routes).concat(routerHt.routes).concat(routerXm.routes).concat(routerMail.routes).concat(routesPortal.routes).concat(routesOm.routes).concat(routesZp.routes)
allRoutes=allRoutes.concat(routesArc.routes);
allRoutes=allRoutes.concat(routesIm.routes);

export const asyncRouterMap = allRoutes
