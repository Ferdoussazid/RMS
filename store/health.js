export const state = () => ({
  loading: false,
  counts: null,
  devices: [],
})

export const getters = {
  loading(state) {
    return state.loading
  },
  counts(state) {
    return state.counts
  },
  devices(state) {
    return category => state.devices.filter(dev => dev.category === category)
  }
}

export const mutations = {
  SET_LOADING(state, flag) {
    state.loading = flag
  },
  SET_COUNTS(state, data) {
    state.counts = data
  },
  SET_DEVICES(state, items) {
    state.devices = items
  }
}

export const actions = {
  async getDevices({ commit }, userUid) {
    commit('SET_LOADING', true)
    const res = await this.$axios.$get('/site/healths', { params: { userUid } })
    commit('SET_COUNTS', res.counts)
    commit('SET_DEVICES', res.devices)
    commit('SET_LOADING', false)
  }
}