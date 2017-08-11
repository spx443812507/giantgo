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
      Vue.http.post('/api/user', userInfo).then((result) => {
        let token = result['body']['token']
        commit('setUserInfo', {
          email: userInfo['email']
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
      Vue.http.patch('/api/user', userInfo).then((result) => {
        let token = result['body']['token']
        commit('setUserInfo', {
          email: userInfo['email']
        })
        Vue.cookie.set('token', token)
        resolve(result)
      }, (result) => {
        reject(result)
      })
    })
  },
  getMyInfo ({commit, state}) {
    return new Promise((resolve, reject) => {
      Vue.http.get('/api/user').then((result) => {
        let userInfo = result['body']
        commit('setUserInfo', {
          email: userInfo['email']
        })
        resolve(result)
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
