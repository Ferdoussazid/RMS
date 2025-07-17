export const state = () => ({
  loading: false,
  viewOpen: false,
  dcEnergyMeter: null,
  dcEnergyMeterSort: 'desc',
  alarm: null,
  alarmSort: 'desc',
  climate: null,
  climateSort: 'desc',
  battery: null,
  batterySort: 'desc',
  rectifier: null,
  rectifierSort: 'desc',
  selectedTenant: '',
  selectedTab: null,
})

export const getters = {
  loading(state) {
    return state.loading
  },
  dcEnergyMeter(state) {
    return state.dcEnergyMeter
  },
  viewOpen(state) {
    return state.viewOpen
  },
  dcEnergyMeterSort(state) {
    return state.dcEnergyMeterSort
  },
  alarm(state) {
    return state.alarm
  },
  alarmSort(state) {
    return state.alarmSort
  },
  climate(state) {
    return state.climate
  },
  climateSort(state) {
    return state.climateSort
  },
  rectifier(state) {
    return state.rectifier
  },
  rectifierSort(state) {
    return state.rectifierSort
  },
  battery(state) {
    return state.battery
  },
  batterySort(state) {
    return state.batterySort
  },
  selectedTab(state) {
    return state.selectedTab
  },
  selectedTenant(state) {
    return state.selectedTenant
  },
  getLegacySort(state) {
    return state.sort
  },
}

export const mutations = {
  SORT_DC_ENERGY_METER(state, sort, key) {
    state.dcEnergyMeter = [...state.dcEnergyMeter].sort((a, b) => {
      if (sort === 'asc') {
        return a[key] > b[key] ? 1 : -1
      } else {
        return a[key] < b[key] ? 1 : -1
      }
    })
  },
  SORT_ALARM(state, sort) {
    state.alarm = [...state.alarm].sort((a, b) => {
      if (sort === 'desc') {
        return new Date(b.time).getTime() - new Date(a.time).getTime()
      } else {
        return new Date(a.time).getTime() - new Date(b.time).getTime()
      }
    })
  },
  SORT_CLIMATE(state, sort, key) {
    state.climate = [...state.climate].sort((a, b) => {
      if (sort === 'asc') {
        return a[key] > b[key] ? 1 : -1
      } else {
        return a[key] < b[key] ? 1 : -1
      }
    })
  },
  SORT_RECTIFIER(state, sort, key) {
    state.rectifier = [...state.rectifier].sort((a, b) => {
      if (sort === 'asc') {
        return a[key] > b[key] ? 1 : -1
      } else {
        return a[key] < b[key] ? 1 : -1
      }
    })
  },
  SORT_BATTERY(state, sort, key) {
    state.battery = [...state.battery].sort((a, b) => {
      if (sort === 'asc') {
        return a[key] > b[key] ? 1 : -1
      } else {
        return a[key] < b[key] ? 1 : -1
      }
    })
  },
  SET_LOADING(state, flag) {
    state.loading = flag
  },
  SET_VIEW_OPEN(state, flag) {
    state.viewOpen = flag
  },
  SET_SELECTED_TAB(state, tab) {
    state.selectedTab = tab
  },
  SET_DC_ENERGY_METER_SORT(state, sort) {
    state.dcEnergyMeterSort = sort
  },
  SET_ALARM_SORT(state, sort) {
    state.alarmSort = sort
  },
  SET_ALARM(state, data) {
    state.alarm = data
  },
  SET_DC_ENERGY_METER(state, data) {
    state.dcEnergyMeter = data
  },
  SET_CLIMATE_SORT(state, sort) {
    state.climateSort = sort
  },
  SET_CLIMATE(state, data) {
    state.climate = data
  },
  SET_RECTIFIER_SORT(state, sort) {
    state.rectifierSort = sort
  },
  SET_RECTIFIER(state, data) {
    state.rectifier = data
  },
  SET_BATTERY_SORT(state, sort) {
    state.batterySort = sort
  },
  SET_BATTERY(state, data) {
    state.battery = data
  },
  SET_SELECTED_TENANT(state, tenant) {
    state.selectedTenant = tenant
  },
  SET_SORT(state, { page, sort }) {
    console.log('SET_SORT', page, sort)
    state.sort[page] = sort
  },
}

export const actions = {
  async getDcEnergyMeter({ commit, state }, query) {
    try {
      const res = await this.$axios.$get('/battery/energy/last', {
        params: { ...query, order: state.dcEnergyMeterSort },
      })

      commit('SET_DC_ENERGY_METER', res)
    } catch (error) {
      this.$toast.error(error.response?.data?.message)
    }
  },
  async getAlarm({ commit, state }, query) {
    try {
      const res = await this.$axios.$get('/user/site/running-events', {
        params: { ...query, order: state.alarmSort },
      })

      let finalRes = res.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

      commit(
        'SET_ALARM',
        finalRes.map(r => ({ ...r, name: undefined }))
      )
    } catch (error) {
      this.$toast.error(error.response?.data?.message)
    }
  },
  async attendEvent({ commit, state }, eventId) {
    try {
      await this.$axios.post(`/user/network/acknowledge-event`, {
        eventId,
      })
    } catch (error) {
      this.$toast.error(error.response?.data?.message)
    }
  },
  async getRectifier({ commit, state }, query) {
    try {
      let res = await this.$axios.$get('/battery/voltage/last', {
        params: { ...query },
      })

      res = res.map(r => ({ ...r, voltage: r.voltage, site_uid: +r.site_uid }))
      commit('SET_RECTIFIER', [...res.sort((a, b) => b.voltage - a.voltage)])
    } catch (error) {
      this.$toast.error(error.response?.data?.message)
    }
  },
  async getClimate({ commit, state }, query) {
    try {
      let res = await this.$axios.$get('/temperature/temperature/climate', {
        params: { ...query },
      })

      res = res.map(r => ({ ...r, temperature: r.temperature ? parseFloat(r.temperature) : 0 }))

      commit('SET_CLIMATE', [...res.sort((a, b) => b.temperature - a.temperature)])
    } catch (error) {
      this.$toast.error(error.response?.data?.message)
    }
  },
  async getBattery({ commit, state }, query) {
    try {
      // let res = await this.$axios.$get('/temperature/temperature/climate', {
      //   params: { ...query },
      // })

      // res = res.map(r => ({ ...r, temperature: r.temperature ? parseFloat(r.temperature) : 0 }))

      // commit('SET_BATTERY', [...res.sort((a, b) => b.temperature - a.temperature)])
      commit('SET_BATTERY', [])
    } catch (error) {
      this.$toast.error(error.response?.data?.message)
    }
  },

  setSort({ commit, rootGetters }, { page, sort }) {
    commit('SET_SORT', { page, sort })
  },
  setViewOpen({ commit, rootGetters }, status) {
    commit('SET_VIEW_OPEN', status)
  },
  sortDcEnergyMeter({ commit, rootGetters, state, key }) {
    commit('SORT_DC_ENERGY_METER', state.dcEnergyMeterSort === 'asc' ? 'desc' : 'asc', { key })
    commit('SET_DC_ENERGY_METER_SORT', state.dcEnergyMeterSort === 'asc' ? 'desc' : 'asc')
  },
  sortAlarm({ commit, rootGetters, state, key }) {
    commit('SORT_ALARM', state.alarmSort === 'asc' ? 'desc' : 'asc')
    commit('SET_ALARM_SORT', state.alarmSort === 'asc' ? 'desc' : 'asc')
  },
  sortRectifier({ commit, rootGetters, state, key }) {
    commit('SORT_RECTIFIER', state.rectifierSort === 'asc' ? 'desc' : 'asc', { key })
    commit('SET_RECTIFIER_SORT', state.rectifierSort === 'asc' ? 'desc' : 'asc')
  },
  sortClimate({ commit, rootGetters, state, key }) {
    commit('SORT_CLIMATE', state.climateSort === 'asc' ? 'desc' : 'asc', { key })
    commit('SET_CLIMATE_SORT', state.climateSort === 'asc' ? 'desc' : 'asc')
  },
  sortBattery({ commit, rootGetters, state, key }) {
    commit('SORT_BATTERY', state.batterySort === 'asc' ? 'desc' : 'asc', { key })
    commit('SET_BATTERY_SORT', state.batterySort === 'asc' ? 'desc' : 'asc')
  },
}
