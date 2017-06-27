import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  actions,
  modules: {
    user
  }
})
