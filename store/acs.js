const defaultAttachParams = {
  cardGroupId: 0,
  cardGroupType: '',
  siteGroupId: 0,
  siteGroupType: '',
}

export const state = () => ({
  cards: [],

  siteGroups: [],
  cardGroups: [],
  attachedCardGroups: [],
  groupAttachParams: defaultAttachParams,
  groupDettachParams: defaultAttachParams,
  focusedGroupSites: [],
})

export const getters = {
  cards(state) {
    return state.cards
  },

  siteGroups(state) {
    return state.siteGroups
  },

  cardGroups(state) {
    return state.cardGroups
  },
  attachedCardGroups(state) {
    return state.attachedCardGroups
  },
  focusedGroupSites(state) {
    return state.focusedGroupSites
  },
}

export const mutations = {
  SET_CARDS(state, list) {
    state.cards = list
  },

  SET_SITE_GROUPS(state, list) {
    state.siteGroups = list
  },

  SET_CARD_GROUPS(state, list) {
    state.cardGroups = list
  },

  RESET_GROUP_ATTACH_PARAMS(state) {
    state.groupAttachParams = defaultAttachParams
  },
  RESET_GROUP_DETTACH_PARAMS(state) {
    state.groupDettachParams = defaultAttachParams
  },

  UPDATE_GROUP_ATTACH_PARAMS(state, partial) {
    state.groupAttachParams = { ...state.groupAttachParams, ...partial }
  },

  UPDATE_GROUP_DETTACH_PARAMS(state, partial) {
    state.groupDettachParams = { ...state.groupDettachParams, ...partial }
  },
  SET_ATTACHED_CARD_GROUPS(state, groups) {
    state.attachedCardGroups = groups
  },
  SET_FOCUSED_SITE_GROUPS(state, sites) {
    state.focusedGroupSites = sites
  },
}

export const actions = {
  async getSiteGroups({ commit }, userUid) {
    const res = await this.$axios.$get('/door/manage/site/group-list', { params: { userUid } })

    commit('SET_SITE_GROUPS', res)
  },

  async saveSiteGroup({ commit }, data) {
    await this.$axios.post('/door/manage/site/save-group', data)
  },

  async deleteSiteGroup({ commit }, groupId) {
    await this.$axios.post('/door/manage/site/delete-group', { groupId })
  },

  async getCardList({ commit }, userUid) {
    const res = await this.$axios.$get('/door/manage/card/list', { params: { userUid } })

    commit('SET_CARDS', res)
  },
  async getAttachedCardGroups({ commit }, siteGroupId) {
    const res = await this.$axios.$get('/door/manage/card/attached-card-group', { params: { groupId: siteGroupId } })

    commit('SET_ATTACHED_CARD_GROUPS', res)
  },

  async saveAccessCard({ commit }, data) {
    await this.$axios.$post('/door/manage/card/save', data)
  },

  async getCardGroups({ commit }, userUid) {
    const res = await this.$axios.$get('/door/manage/card/group-list', { params: { userUid } })

    commit('SET_CARD_GROUPS', res)
  },

  async saveCardGroup({ commit }, data) {
    await this.$axios.post('/door/manage/card/save-group', data)
  },

  async deleteCardGroup({ commit }, groupId) {
    await this.$axios.post('/door/manage/card/delete-group', { groupId })
  },

  async attachGroups({ state, commit }) {
    const params = state.groupAttachParams
    if (!params.siteGroupId || !params.siteGroupType) {
      throw new Error('Please drop the item on a Site or Site Group')
    }
    if (!params.cardGroupId || !params.siteGroupType) {
      throw new Error('Please drop the item on a Card or Card Group')
    }

    await this.$axios.$post('/door/manage/attach-groups', params)
  },
  async dettachGroups({ state, commit }) {
    const params = state.groupDettachParams
    if (!params.siteGroupId || !params.siteGroupType) {
      throw new Error('something wrong')
    }
    if (!params.cardGroupId || !params.siteGroupType) {
      throw new Error('something wrong')
    }

    await this.$axios.$post('/door/manage/detach-groups', params)
  },
}
