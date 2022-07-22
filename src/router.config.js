export default [
  {
    path: '/',
    redirect: '/visitorList'
  },
  {
    path: '/error/:type',
    name: 'Error',
    component: 'Error' // 注意提供ErrorPage组件内的多语言翻译
  },
  {
    name: 'inviteVisitor',
    path: '/inviteVisitor',
    menuCode: '001',
    component: 'visitor/index',
    meta: { menuCode: '001', title: '开卡/绑定' }
  },
  {
    name: 'register',
    path: '/register',
    menuCode: '005',
    component: 'visitor/register',
    meta: { menuCode: '005', title: '人员登记' }
  },
  {
    name: 'transfer',
    path: '/transfer',
    menuCode: '004',
    component: 'visitor/transfer',
    meta: { menuCode: '004', title: '转账' }
  },
  {
    name: 'visitorList',
    path: '/visitorList',
    menuCode: '002',
    component: 'visitor/list',
    meta: { menuCode: '002', title: '登录' }
  },
  {
    name: 'visitorDetail',
    path: '/visitorDetail',
    menuCode: '003',
    component: 'visitor/detail',
    meta: { menuCode: '003', title: '个人中心' }
  }
]
