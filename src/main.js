import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routers'
import VueCookie from 'vue-cookie'
import axios from 'axios'
import VueAxios from 'vue-axios'
import moment from 'vue-moment'
import lodash from 'lodash'
import VueLodash from 'vue-lodash'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style.less'
import store from './store'
import App from './App.vue'

Vue.use(Element)
Vue.use(VueRouter)
Vue.use(VueCookie)
Vue.use(moment)
Vue.use(VueLodash, lodash)
Vue.use(VueAxios, axios)

/* eslint-disable no-new */
const router = new VueRouter({
  mode: 'hash',
  routes,
  linkActiveClass: 'active'
})

router.beforeEach(function (to, from, next) {
  if (to.matched.some(record => record.meta.authorization)) {
    if (Vue.cookie.get('token')) {
      next()
    } else {
      next({
        path: '/passport/signin',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

axios.interceptors.request.use(function (config) {
  if (Vue.cookie.get('token')) {
    config.headers['authorization'] = 'Bearer ' + Vue.cookie.get('token')
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // Do something with response data

  return response
}, function (error) {
  // Do something with response error
  if (error.response.status === 401) {
    router.app.$router.push({name: 'signin', query: {redirect: router.app.$route.fullPath}})
  }

  return Promise.reject(error)
})

new Vue(
  Vue.util.extend({
    router,
    store
  }, App)).$mount('#app')
