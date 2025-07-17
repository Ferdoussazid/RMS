export const state = () => ({
  device_vendors: [],
  fetchingDeviceVendors: false,
  selectedCompany: '',
  deviceVendorsSearchText: '',
  filteredDeviceVendors: [],
  selectedDeviceVendor: null,
})

export const getters = {
  device_vendors(state) {
    return state.device_vendors
  },
  fetchingDeviceVendors(state) {
    return state.fetchingDeviceVendors
  },
  selectedCompany(state) {
    return state.selectedCompany
  },
  deviceVendorsSearchText(state) {
    return state.deviceVendorsSearchText
  },
  filteredDeviceVendors(state) {
    return state.filteredDeviceVendors
  },
  selectedDeviceVendor(state) {
    return state.selectedDeviceVendor
  },
}

export const mutations = {
  SET_DEVICE_VENDORS(state, device_vendors) {
    state.device_vendors = device_vendors
  },
  SET_FETCHING_DEVICE_VENDORS(state, status) {
    state.fetchingDeviceVendors = status
  },
  SET_SELECTED_COMPANY(state, company) {
    state.selectedCompany = company
  },
  SET_SITE_SEARCH_TEXT(state, text) {
    state.deviceVendorsSearchText = text
  },
  SET_FILTERED_DEVICE_VENDORS(state, device_vendors) {
    state.filteredDeviceVendors = device_vendors
  },
  SET_SELECTED_DEVICE_VENDOR(state, device_vendor) {
    state.selectedDeviceVendor = device_vendor
  },
}

export const actions = {
  async fetchDeviceVendors({ commit, dispatch }) {
    commit('SET_FETCHING_DEVICE_VENDORS', true)
    try {
      const { data } = await this.$axios.get('/urms/admin/vendor')

      commit(
        'SET_DEVICE_VENDORS',
        data.map(device_vendor => ({
          ...device_vendor,
          address: device_vendor.address || '',
          logo: device_vendor.logo || '',
        }))
      )
      dispatch('searchDeviceVendor', state.deviceVendorsSearchText)
    } catch (error) {
    } finally {
      commit('SET_FETCHING_DEVICE_VENDORS', false)
    }
  },
  async updateDeviceVendor({ dispatch }, data) {
    await this.$axios.$post(`/urms/admin/create-vendor`, data)
    dispatch('fetchDeviceVendors')
  },
  async createDeviceVendor({ dispatch }, data) {
    await this.$axios.$post('/urms/admin/create-vendor', data)
    dispatch('fetchDeviceVendors')
  },
  async deleteDeviceVendor({ dispatch }, id) {
    await this.$axios.$delete(`/urms/admin/delete-vendor/${id}`)
    dispatch('fetchDeviceVendors')
  },
  async genAPIKeyDeviceVendor({ dispatch }, data) {
    return await this.$axios.$post(`/urms/admin/generate-api-token`, data)
  },
  searchDeviceVendor({ commit, state }, searchText = '') {
    const filteredDeviceVendors = state.device_vendors
      .filter(device_vendor =>
        searchText === '' ? true : device_vendor.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter(device_vendor => {
        if (state.selectedCompany === '') {
          return true
        } else {
          return device_vendor.company_id === state.selectedCompany
        }
      })
    commit('SET_SITE_SEARCH_TEXT', searchText)
    commit('SET_FILTERED_DEVICE_VENDORS', filteredDeviceVendors)
  },

  setSelectedCompany({ commit, dispatch }, company) {
    commit('SET_SELECTED_COMPANY', company)
    dispatch('searchDeviceVendor', state.deviceVendorsSearchText)
  },
}
