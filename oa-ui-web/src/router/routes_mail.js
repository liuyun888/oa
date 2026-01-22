/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
  routes: [
    {
      path: '/oa/mail',
      component: Layout,
      name: 'OuterMailMngCenter',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '外部邮件',
        icon: 'auter-email'
      },
      children: [
        { path: 'mailAccount/MailAccountMng', component: _import('oa/mail/mailAccount/MailAccountMng'), name: 'MailAccountMng', meta: { title: '账号管理' }},
        { path: 'outMailEmail/MailEmailInbox', component: _import('oa/mail/outMailEmail/MailEmailInbox'), name: 'OutMailEmailInbox', meta: { title: '收件箱' }},
        { path: 'outMailEmail/MailEmailDraftbox', component: _import('oa/mail/outMailEmail/MailEmailDraftbox'), name: 'OutMailEmailDraftbox', meta: { title: '草稿箱' }},
        { path: 'outMailEmail/MailEmailMng', component: _import('oa/mail/outMailEmail/MailEmailMng'), name: 'OutMailEmailMng', meta: { title: '发件箱' }},
        { path: 'outMailEmail/MailEmailStar', component: _import('oa/mail/outMailEmail/MailEmailStar'), name: 'OutMailEmailStar', meta: { title: '星标邮件' }},
      ]
    },
    {
      path: '/oa/mail',
      component: Layout,
      name: 'MailMngCenter',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '内部邮件',
        icon: 'internal-email'
      },
      children: [
        { path: 'mailEmail/MailEmailInbox', component: _import('oa/mail/mailEmail/MailEmailInbox'), name: 'MailEmailInbox', meta: { title: '收件箱' }},
        { path: 'mailEmail/MailEmailDraftbox', component: _import('oa/mail/mailEmail/MailEmailDraftbox'), name: 'MailEmailDraftbox', meta: { title: '草稿箱' }},
        { path: 'mailEmail/MailEmailMng', component: _import('oa/mail/mailEmail/MailEmailMng'), name: 'MailEmailMng', meta: { title: '发件箱' }},
        { path: 'mailEmail/MailEmailStar', component: _import('oa/mail/mailEmail/MailEmailStar'), name: 'MailEmailStar', meta: { title: '星标邮件' }},
      ]
    },
  ]
}
