export const state = () => ({
  siteSettings: {}, // all settings of the current site\
  siteIncStatus: [],
})

export const getters = {
  siteSettings(state) {
    return state.siteSettings
  },
  siteIncStatus(state) {
    return state.siteIncStatus
  },
}

export const mutations = {
  SET_SITE_SETTINGS(state, data) {
    state.siteSettings = data
  },
  SET_SITE_INC_STATUS(state, data) {
    state.siteIncStatus = data
  },
  UPDATE_SITE_SETTINGS(state, { prop, value }) {
    const isIncSettingUpdating = prop === 'inc'
    if (isIncSettingUpdating) {
      const index = state.siteIncStatus.findIndex(inc => inc.tenant === value.tenant)
      if (index !== -1) {
        state.siteIncStatus[index].value = value.value
      }
    } else {
      state.siteSettings[prop] = value
    }
  },
}

export const actions = {
  async fetchSiteSettings({ commit }, query) {
    const res = await this.$axios.$get('/user/site/fetch', {
      params: query,
    })
    const [site = null] = res.items
    if (site && site.inc) {
      commit('SET_SITE_INC_STATUS', site.inc)
    }
    if (site && site.settings) {
      commit('SET_SITE_SETTINGS', site.settings)
    }
    if (site && site.rectifier) {
      commit('UPDATE_SITE_SETTINGS', { prop: 'rectifier', value: site.rectifier })
    }
    if (site && site.bms) {
      commit('UPDATE_SITE_SETTINGS', { prop: 'bms', value: site.bms })
    }
  },

  async saveSettings({ commit }, { siteUid, prop, value }) {
    await this.$axios.$post('/user/settings/save', { siteUid, prop, value })
    commit('UPDATE_SITE_SETTINGS', { prop, value })
  },
}
