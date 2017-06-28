const home = r => require.ensure([], () => r(require('./views/Home/Index.vue')), 'home')
const signIn = r => require.ensure([], () => r(require('./views/Passport/SignIn.vue')), 'signin')
const entityUser = r => require.ensure([], () => r(require('./views/Entity/User.vue')), 'entityUser')
const entityUserDetail = r => require.ensure([], () => r(require('./views/Entity/Detail.vue')), 'entityUserDetail')

const routers = [
  {
    path: '/home',
    name: 'home',
    component: home,
    meta: {authorization: true}
  }, {
    path: '/passport/signin',
    name: 'signin',
    component: signIn
  }, {
    path: '/entity/user',
    name: 'entityUser',
    component: entityUser
  }, {
    path: '/entity/user/detail',
    name: 'entityUserDetail',
    component: entityUserDetail
  }, {
    path: '*',
    component: home
  }
]

export default routers
