const home = r => require.ensure([], () => r(require('./views/Home/Index.vue')), 'home')
const signIn = r => require.ensure([], () => r(require('./views/Passport/SignIn.vue')), 'signin')
const entity = r => require.ensure([], () => r(require('./views/Entity.vue')), 'entity')
const entityUser = r => require.ensure([], () => r(require('./views/Entity/User/Index.vue')), 'entityUser')
const entityUserDetail = r => require.ensure([], () => r(require('./views/Entity/User/Detail.vue')), 'entityUserDetail')

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
    path: '/entity',
    name: 'entityUser',
    component: entity,
    children: [
      {
        path: 'user',
        component: entityUser
      }, {
        path: 'user/detail',
        component: entityUserDetail
      }
    ]
  }, {
    path: '*',
    component: home
  }
]

export default routers
