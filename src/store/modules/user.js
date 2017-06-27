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
      Vue.http.post('/api/passports', userInfo).then((result) => {
        let token = result['body']['token']
        commit('setUserInfo', {
          email: userInfo['email'],
          token: token
        })
        Vue.cookie.set('token', token)
        resolve(result)
      }, (result) => {
        reject(result)
      })
    })
  },
  signIn ({commit, state}, userInfo) {
    return new Promise((resolve, reject) => {
      Vue.http.patch('/api/passports', userInfo).then((result) => {
        let token = result['body']['token']
        commit('setUserInfo', {
          email: userInfo['email'],
          token: token
        })
        Vue.cookie.set('token', token)
        resolve(result)
      }, (result) => {
        reject(result)
      })
    })
  },
  getMyInfo ({commit, state}) {
    return Vue.http.get('/api/users/me')
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
    state.token = userInfo['token']
  },
  clearUserInfo () {
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
