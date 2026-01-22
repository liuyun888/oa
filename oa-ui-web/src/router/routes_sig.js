import Vue from 'vue'
/* Layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)

export default {
    routes: [{
        path: '/oa/sig', component: Layout, name: '印章中心', iconCls: 'fa el-icon-menu', meta: {
            title: '印章中心', icon: 'seal'
        }, // leaf: true,//只有一个节点
        children: [{
            path: 'sigSignet/SigSignetMng',
            component: _import('oa/sig/sigSignet/Index'),
            name: 'SigSignetMng',
            meta: {title: '印章管理'}
        }, {
            path: 'sigSeal/SigSealMng',
            component: _import('oa/sig/sigSeal/Index'),
            name: 'SigSealMng',
            meta: {title: '用印管理'}
        }, {
            path: 'sigSeal/SigSealAddApply',
            component: _import('oa/sig/sigSeal/SigSealAddApply'),
            name: 'SigSealAddApply',
            meta: {title: '用印申请'}
        }, {
            path: 'sigDevice/SigDeviceMng',
            component: _import('oa/sig/sigDevice/Index'),
            name: 'SigDeviceMng',
            meta: {title: '设备管理'}
        },]
    },


    ]
}
