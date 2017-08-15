const home = r => require.ensure([], () => r(require('./views/Index.vue')), 'home')
const signIn = r => require.ensure([], () => r(require('./views/Passport/SignIn.vue')), 'passport')
const entity = r => require.ensure([], () => r(require('./views/Entity.vue')), 'entities')
const entityContact = r => require.ensure([], () => r(require('./views/Entity/Contact/Index.vue')), 'entities')
const entityContactDetail = r => require.ensure([], () => r(require('./views/Entity/Contact/Detail.vue')), 'entities')
const seminarList = r => require.ensure([], () => r(require('./views/Seminar/List.vue')), 'seminars')
const seminar = r => require.ensure([], () => r(require('./views/Seminar.vue')), 'seminars')
const seminarDetail = r => require.ensure([], () => r(require('./views/Seminar/Detail.vue')), 'seminars')

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
    path: '/entities',
    component: entity,
    children: [
      {
        path: 'contact',
        name: 'entityContact',
        component: entityContact
      }, {
        path: 'contact/:entityTypeId',
        name: 'entityContactDetail',
        component: entityContactDetail
      }
    ]
  }, {
    path: '/seminars',
    name: 'seminarList',
    component: seminarList
  }, {
    path: '/seminars',
    component: seminar,
    children: [
      {
        path: ':seminarId',
        name: 'seminarDetail',
        component: seminarDetail
      }
    ]
  }, {
    path: '*',
    component: home
  }
]

export default routers
