const Home = resolve => {
  require.ensure(['./views/Home/Index.vue'], () => {
    resolve(require('./views/Home/Index.vue'))
  })
}

const routers = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {authorization: true}
  }, {
    path: '/passport/signin',
    name: 'signin',
    component (resolve) {
      require.ensure(['./views/Passport/SignIn.vue'], () => {
        resolve(require('./views/Passport/SignIn.vue'))
      })
    }
  }, {
    path: '/entity/user',
    name: 'entity_user',
    component (resolve) {
      require.ensure(['./views/Entity/User.vue'], () => {
        resolve(require('./views/Entity/User.vue'))
      })
    }
  }, {
    path: '*',
    component: Home
  }
]

export default routers
