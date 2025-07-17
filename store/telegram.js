export const state = () => ({
  telegramGroups: [],
  telegramFocusGroup: null,
  isLoading: false,
})

export const getters = {
  isLoading(state) {
    return state.loading
  },
  telegramGroups(state) {
    return state.telegramGroups
  },
  telegramFocusGroup(state) {
    // Get the focus group
    return state.telegramFocusGroup
  },
}

export const mutations = {
  SET_TELEGRAM_GROUPS(state, telegramGroups) {
    state.telegramGroups = telegramGroups
  },
  SET_TELEGRAM_FOCUS_GROUP(state, telegramFocusGroup) {
    state.telegramFocusGroup = telegramFocusGroup
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading
  },
}

export const actions = {
  async fetchTelegramGroups({ commit, state }, companyId) {
    try {
      const { data } = await this.$axios.get('/telegram/group', { params: { company_id: companyId } })
      commit('SET_TELEGRAM_GROUPS', data)
    } catch (error) {
      throw new Error(error)
    }
  },

  async getTelegramFocusGroup({ commit }, chatId) {
    try {
      const res = await this.$axios.$get('/telegram/group/details', { params: { chat_id: chatId } })
      commit('SET_TELEGRAM_FOCUS_GROUP', res)
    } catch (error) {
      throw new Error(error)
    }
  },
  clearTelegramFocusGroup({ commit }) {
    commit('SET_TELEGRAM_FOCUS_GROUP', null)
  },

  async updateTelegramGroup({ commit }, query) {
    try {
      await this.$axios.$patch('/telegram/group', query, {
        params: { chat_id: query.chat_id },
      })
    } catch (error) {
      throw new Error(error)
    }
  },

  async createTelegramGroup({ commit }, query) {
    try {
      await this.$axios.$post('/telegram/group', query)
    } catch (error) {
      throw new Error(error)
    }
  },
  async addSiteToGroup({ commit }, query) {
    try {
      await this.$axios.$post('/telegram//site', query)
    } catch (error) {
      throw new Error(error)
    }
  },
  async removeSiteFromGroup({ commit }, query) {
    try {
      // Call the remove site logic first
      await this.$axios.$delete('/telegram/site', { params: query })
    } catch (error) {
      throw new Error(error)
    }
  },
  async ChangeSiteStatus({ commit }, query) {
    try {
      const { chat_id, status } = query

      // Perform the PATCH request
      await this.$axios.$patch('/telegram/group', { status }, { params: { chat_id } })
    } catch (error) {
      throw new Error(error)
    }
  },

  async renewInviteLink({ commit }, query) {
    try {
      const { chat_id } = query

      await this.$axios.$patch('/telegram/group/update-link', {
        params: chat_id, // Place chat_id in params
      })
      // Fetch the updated group information
      await this.getTelegramFocusGroup(chat_id)
    } catch (error) {
      throw new Error(error)
    }
  },

  async deleteGroup({ commit }, chat_id) {
    try {
      await this.$axios.$delete('/telegram/group', {
        params: { chat_id },
      })
      commit('SET_TELEGRAM_FOCUS_GROUP', null)
    } catch (error) {
      throw new Error(error)
    }
  },
}
