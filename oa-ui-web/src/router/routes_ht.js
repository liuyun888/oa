import Vue from 'vue'
/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {

   routes: [
        {
            path: '/oa/ht',
            component: Layout,
            name: '合同管理',
            meta: {
                title: '合同管理',
                icon: 'contract'
            },
            iconCls: 'fa el-icon-menu',
            //leaf: true,//只有一个节点
            children: [
                { path: 'contractCard/ContractCardMng', component: _import('oa/ht/contractCard/ContractCardMng'), name: '合同信息', meta: { title: '合同信息' } },
                { path: 'contractType/ContractTypeMng', component: _import('oa/ht/contractType/ContractTypeMng'), name: '合同起草', meta: { title: '合同起草' } },
                { path: 'contractDraft/ContractDraftMng', component: _import('oa/ht/contractDraft/ContractDraftMng'), name: '我的起草', meta: { title: '我的起草' } },
                { path: 'contractTemplate/ContractTemplateMng', component: _import('oa/ht/contractTemplate/ContractTemplateMng'), name: '合同模板', meta: { title: '合同模板' } },
                { path: 'contractPayment/ContractPaymentMng', component: _import('oa/ht/contractPayment/ContractPaymentMng'), name: '付款管理', meta: { title: '付款管理' } },
                { path: 'contractReceive/ContractReceiveMng', component: _import('oa/ht/contractReceive/ContractReceiveMng'), name: '收款管理', meta: { title: '收款管理' } },
                { path: 'contractInvoice/ContractInvoiceMng', component: _import('oa/ht/contractInvoice/ContractInvoiceMng'), name: '发票管理', meta: { title: '发票管理' } },
                { path: 'counterparty/CounterpartyMng', component: _import('oa/ht/counterparty/CounterpartyMng'), name: '相对方管理', meta: { title: '相对方管理' } },
                { path: 'contractRisk/ContractRiskMng', component: _import('oa/ht/contractRisk/ContractRiskMng'), name: '风险管理', meta: { title: '风险管理' } },
                { path: 'contractRiskRule/ContractRiskRuleMng', component: _import('oa/ht/contractRiskRule/ContractRiskRuleMng'), name: '风险规则', meta: { title: '风险规则' } },
                { path: 'contractReport/ContractReportMng', component: _import('oa/ht/contractReport/ContractReportMng'), name: '合同报表', meta: { title: '合同报表' } },
            ]
        },
        { path: '/ht/oa/contractCard/detail', component: _import('oa/ht/contractCard/ContractCardDetailRoute'), name: '合同信息',
          meta: {
            title: '合同信息',
            hidden:true
          }
        },

        {
            path: '/oa/ht',
            component: Layout,
            redirect: 'noredirect',
            name: '合同分析',
            hidden: true,
            meta: {
                title: '合同分析',
                icon: 'example'
            },
            children: [
                {
                    path: 'contractReport/ContractAnalyzeMng',
                    component: _import('oa/ht/contractReport/ContractAnalyzeMng'),
                    name: '合同分析',
                    meta: {
                        title: '合同分析',
                        icon: 'example'
                    }
                },
            ]
        },



   ]

}
