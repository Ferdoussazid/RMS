export const state = () => ({
  sites: {},
  site: null,
  siteSearchText: '',
  devices: [],
  companies: [],
  selectedCompany: '',
  selectedPage: 1,
  siteConfig: null,
  pinConfigs: [],
  serviceStrings: {},
  deviceHealth: {},
  oemRecords: [],
  fetchingSites: true,
  billingList: {},
})

export const getters = {
  site(state) {
    return state.site
  },

  sites(state) {
    return state.sites
  },

  siteSearchText(state) {
    return state.siteSearchText
  },

  devices(state) {
    return state.devices
  },

  companies(state) {
    return state.companies
  },

  selectedCompany(state) {
    return state.selectedCompany
  },

  selectedPage(state) {
    return state.selectedPage
  },

  siteConfig(state) {
    return state.siteConfig
  },

  serviceStrings(state) {
    return state.serviceStrings
  },

  deviceHealth(state) {
    return state.deviceHealth
  },

  oemRecords(state) {
    return state.oemRecords
  },
  fetchingSites(state) {
    return state.fetchingSites
  },
  billingList(state) {
    return state.billingList
  },
}

export const mutations = {
  SET_SITE(state, site) {
    state.site = site
  },

  SET_SITE_LIST(state, list) {
    state.sites = list
  },

  CLEAR_SITE_LIST(state) {
    state.sites = {}
  },

  SET_SITE_SEARCH_TEXT(state, text) {
    state.siteSearchText = text
  },

  SET_DEVICE_LIST(state, list) {
    state.devices = list
  },

  SET_COMPANY_LIST(state, list) {
    state.companies = list
  },

  SET_SELECTED_COMPANY(state, company) {
    state.selectedCompany = company
  },

  SET_SELECTED_PAGE(state, page) {
    state.selectedPage = page
  },

  CLEAR_SELECTED_PAGE(state, page) {
    state.selectedPage = 1
  },

  SET_SITE_CONFIG(state, data) {
    state.siteConfig = data
  },

  SET_SERVICE_STRING(state, list) {
    state.serviceStrings = list
  },

  CLEAR_SERVICE_STRING(state) {
    state.serviceStrings = {}
  },

  SET_DEVICE_HEALTH(state, list) {
    state.deviceHealth = list
  },

  CLEAR_DEVICE_HEALTH(state) {
    state.deviceHealth = {}
  },

  CLEAR_OEM_RECORDS(state) {
    state.oemRecords = []
  },

  SET_OEM_RECORDS(state, list) {
    state.oemRecords = list
  },
  SET_SITE_FETCH_STATUS(state, list) {
    state.fetchingSites = list
  },

  UPDATE_PIN_CONFIG(state, pin) {
    const index = state.siteConfig.pinConfigs.findIndex(p => p.id === pin.id)
    if (index !== -1) {
      state.siteConfig.pinConfigs.splice(index, 1, pin)
    } else {
      state.siteConfig.pinConfigs.push(pin)
    }
  },
  ADD_PIN(state, pin) {
    state.siteConfig.pinConfigs.push(pin)
  },
  SET_BILLING_LIST(state, list) {
    state.billingList = list
  },
}

export const actions = {
  async getSiteInfo({ commit }, query) {
    const res = await this.$axios.$get(`/user/site/fetch`, { params: query })
    commit('SET_SITE', res.items[0])
  },

  async saveSite({ commit }, data) {
    await this.$axios.$post(`/user/site/save`, data)
  },

  async updateSite({ commit }, data) {
    await this.$axios.$post(`/user/site/update`, data)
  },

  async getSiteList({ commit }, query) {
    commit('SET_SITE_FETCH_STATUS', true)
    try {
      const sites = await this.$axios.$get(`/user/site/fetch`, { params: query })
      commit('SET_SITE_LIST', sites)
    } catch (error) {}
    commit('SET_SITE_FETCH_STATUS', false)
  },

  setSiteSearchText({ commit }, text) {
    commit('SET_SITE_SEARCH_TEXT', text)
  },

  async createComId() {
    const res = await this.$axios.get('/user/device/com-id')
    return res
  },

  async createDevice({ commit }, data) {
    await this.$axios.$post(`/user/device/save`, data)
  },

  async getDeviceList({ commit }, query) {
    const devices = await this.$axios.$get(`/user/device/list`, { params: query })
    commit('SET_DEVICE_LIST', devices)
  },

  async getCompanyList({ commit }) {
    const companies = await this.$axios.$get(`/user/company/list`)
    commit('SET_COMPANY_LIST', companies)
  },

  setSelectedCompany({ commit }, data) {
    commit('SET_SELECTED_COMPANY', data)
  },

  setSelectedPage({ commit }, data) {
    commit('SET_SELECTED_PAGE', data)
  },

  async bindDevice({ commit }, data) {
    await this.$axios.$post(`/user/device/bind`, data)
  },

  async unbindDevice({ commit }, data) {
    await this.$axios.$post(`/user/device/unbind`, data)
  },

  async getSiteConfig({ commit }, query) {
    const siteConfig = await this.$axios.$get(`/user/site/details`, {
      params: query,
    })
    commit('SET_SITE_CONFIG', siteConfig)
  },

  async savePinConfig({ commit, state }, data) {
    const res = await this.$axios.$post(`/user/device/save-config`, data)
    return res
  },

  async removePinConfig({ commit }, configId) {
    await this.$axios.$post(`/user/device/remove-config`, {
      id: configId,
    })
  },

  updatePinConfig({ commit }, pin) {
    commit('UPDATE_PIN_CONFIG', pin)
  },

  addPin({ commit }, pin) {
    commit('ADD_PIN', pin)
  },

  async getServiceString({ commit }, query) {
    const res = await this.$axios.$get(`/user/pulse/list`, { params: query })
    commit('SET_SERVICE_STRING', res)
  },

  async getDeviceHealth({ commit }, query) {
    const res = await this.$axios.$get(`/user/health/list`, { params: query })
    commit('SET_DEVICE_HEALTH', res)
  },

  async getOemRecords({ commit }, query) {
    commit('CLEAR_OEM_RECORDS')
    const res = await this.$axios.$get(`/oem/api/fetch/oem-records`, { params: query })
    if (res.items) commit('SET_OEM_RECORDS', res)
  },
  async getBillingList({ commit }, query) {
    const res = await this.$axios.$get(`/user/payment/list`, { params: query })
    commit('SET_BILLING_LIST', res)
  },
}
