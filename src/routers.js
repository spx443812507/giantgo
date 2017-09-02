const home = r => require.ensure([], () => r(require('./views/Index.vue')), 'home')
const signIn = r => require.ensure([], () => r(require('./views/Passport/SignIn.vue')), 'passport')
const entity = r => require.ensure([], () => r(require('./views/Entity.vue')), 'entities')
const entityContact = r => require.ensure([], () => r(require('./views/Entity/Contact/Index.vue')), 'entities')
const entitySeminar = r => require.ensure([], () => r(require('./views/Entity/Seminar/Index.vue')), 'entities')
const entityAgenda = r => require.ensure([], () => r(require('./views/Entity/Agenda/Index.vue')), 'entities')
const entitySpeaker = r => require.ensure([], () => r(require('./views/Entity/Speaker/Index.vue')), 'entities')
const entityContactDetail = r => require.ensure([], () => r(require('./views/Entity/Contact/Detail.vue')), 'entities')
const entitySeminarDetail = r => require.ensure([], () => r(require('./views/Entity/Seminar/Detail.vue')), 'entities')
const entityAgendaDetail = r => require.ensure([], () => r(require('./views/Entity/Agenda/Detail.vue')), 'entities')
const entitySpeakerDetail = r => require.ensure([], () => r(require('./views/Entity/Speaker/Detail.vue')), 'entities')
const seminarList = r => require.ensure([], () => r(require('./views/Seminar/List.vue')), 'seminars')
const seminar = r => require.ensure([], () => r(require('./views/Seminar.vue')), 'seminars')
const seminarDetail = r => require.ensure([], () => r(require('./views/Seminar/Detail.vue')), 'seminars')
const seminarAgenda = r => require.ensure([], () => r(require('./views/Seminar/Agenda.vue')), 'seminars')
const seminarContact = r => require.ensure([], () => r(require('./views/Seminar/Contact.vue')), 'seminars')
const seminarSpeaker = r => require.ensure([], () => r(require('./views/Seminar/Speaker.vue')), 'seminars')
const seminarCheckin = r => require.ensure([], () => r(require('./views/Seminar/Checkin.vue')), 'seminars')

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
      }, {
        path: 'seminar',
        name: 'entitySeminar',
        component: entitySeminar
      }, {
        path: 'seminar/:entityTypeId',
        name: 'entitySeminarDetail',
        component: entitySeminarDetail
      }, {
        path: 'speaker',
        name: 'entitySpeaker',
        component: entitySpeaker
      }, {
        path: 'speaker/:entityTypeId',
        name: 'entitySpeakerDetail',
        component: entitySpeakerDetail
      }, {
        path: 'agenda',
        name: 'entityAgenda',
        component: entityAgenda
      }, {
        path: 'agenda/:entityTypeId',
        name: 'entityAgendaDetail',
        component: entityAgendaDetail
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
      },
      {
        path: ':seminarId/agendas',
        name: 'seminarAgenda',
        component: seminarAgenda
      },
      {
        path: ':seminarId/contacts',
        name: 'seminarContact',
        component: seminarContact
      },
      {
        path: ':seminarId/speakers',
        name: 'seminarSpeaker',
        component: seminarSpeaker
      },
      {
        path: ':seminarId/checkins',
        name: 'seminarCheckin',
        component: seminarCheckin
      }
    ]
  }, {
    path: '*',
    component: home
  }
]

export default routers
