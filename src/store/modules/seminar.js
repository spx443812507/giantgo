import Vue from 'vue'

const state = {
  seminar: {}
}

const getters = {
  seminar: state => state.seminar
}

const actions = {
  getSeminar ({commit, state}, seminarId) {
    return new Promise((resolve, reject) => {
      if (state.seminar.hasOwnProperty('id') && state.seminar.id === seminarId) {
        resolve(state.seminar)
      } else {
        Vue.axios.get('/api/seminars/' + seminarId).then((response) => {
          commit('setSeminar', response['data'])
          resolve(response['data'])
        }, (response) => {
          reject(response)
        })
      }
    })
  },
  updateSeminar ({commit, state}, seminarId, seminarInfo) {
    return new Promise((resolve, reject) => {
      Vue.axios.put('/api/seminars/' + seminarId, {
        data: seminarInfo
      }).then((response) => {
        commit('setSeminar', response['data'])
        resolve(response['data'])
      }, (response) => {
        reject(response)
      })
    })
  },
  deleteSeminar ({commit, state}, seminarId) {
    return new Promise((resolve, reject) => {
      Vue.axios.delete('/api/seminars/' + seminarId).then((response) => {
        commit('deleteSeminar')
        resolve(response['data'])
      }, (response) => {
        reject(response)
      })
    })
  }
}

const mutations = {
  setSeminar (state, seminarInfo) {
    state.seminar = seminarInfo
  },
  deleteSeminar (state) {
    state.seminar = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
