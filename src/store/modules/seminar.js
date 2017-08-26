import Vue from 'vue'

const state = {
  seminar: {}
}

const getters = {
  seminar: state => {
    return {
      title: state.seminar['title'],
      start_at: new Date(state.seminar['start_at']),
      end_at: new Date(state.seminar['end_at']),
      entity_type_id: state.seminar['entity_type_id'] || '',
      attributes: state.seminar['attributes'] || []
    }
  }
}

const actions = {
  getSeminar ({commit, state}, seminarId) {
    return new Promise((resolve, reject) => {
      Vue.axios.get('/api/seminars/' + seminarId).then((response) => {
        commit('setSeminar', response['data'])
        resolve(response['data'])
      }, (response) => {
        reject(response)
      })
    })
  },
  updateSeminar ({commit, state}, seminarInfo) {
    return new Promise((resolve, reject) => {
      Vue.axios.put('/api/seminars/' + seminarInfo.id, seminarInfo).then((response) => {
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
