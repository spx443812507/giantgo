import Vue from 'vue'

const state = {
  userInfo: {},
  token: ''
}

const getters = {
  userInfo: state => state.userInfo,
  token: state => state.token
}

const actions = {
  signUp ({commit, state}, userInfo) {
    return new Promise((resolve, reject) => {
      Vue.axios.post('/api/user', userInfo).then((response) => {
        let token = response['data']['token']
        commit('setUserInfo', {
          email: userInfo['email']
        })
        Vue.cookie.set('token', token)
        resolve(response)
      }, (response) => {
        reject(response)
      })
    })
  },
  signIn ({commit, state}, userInfo) {
    return new Promise((resolve, reject) => {
      Vue.axios.patch('/api/user', userInfo).then((response) => {
        let token = response['data']['token']
        commit('setUserInfo', {
          email: userInfo['email']
        })
        Vue.cookie.set('token', token)
        resolve(response)
      }, (response) => {
        reject(response)
      })
    })
  },
  getMyInfo ({commit, state}) {
    return new Promise((resolve, reject) => {
      Vue.axios.get('/api/user').then((response) => {
        let userInfo = response['data']
        commit('setUserInfo', {
          email: userInfo['email']
        })
        resolve(response)
      })
    })
  },
  clearUserInfo ({commit, state}) {
    commit('clearUserInfo')
    Vue.cookie.delete('token')
  }
}

const mutations = {
  setUserInfo (state, userInfo) {
    state.userInfo = {
      email: userInfo['email']
    }
  },
  logout () {
    state.userInfo = null
    state.token = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
