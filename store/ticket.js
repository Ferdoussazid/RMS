export const state = () => ({
  tickets: { total: 0, items: [] },
})

export const getters = {
  tickets(state) {
    return state.tickets
  },
}

export const mutations = {
  SET_TICKET_LIST(state, list) {
    state.tickets = list
  },
  UPDATE_TICKET_LIST(state, item) {
    const index = state.tickets.items.findIndex(ticket => ticket.id === item.id)
    if (index !== -1) {
      state.tickets.items.splice(index, 1, item)
    } else {
      state.tickets.items = [item, ...state.tickets.items]
    }
  },
  CLEAR_TICKET_LIST(state) {
    state.tickets = []
  },
}

export const actions = {
  async getTicketList({ commit }, query) {
    const tickets = await this.$axios.$get('/ticket/api/ticket-list', { params: query })
    commit('SET_TICKET_LIST', tickets)
  },

  async createTicket({ commit }, data) {
    const res = await this.$axios.$post('/ticket/api/ticket-create', data)
    const ticket = res[0]
    commit('UPDATE_TICKET_LIST', ticket)
  },

  async updateTicket({ commit }, data) {
    await this.$axios.$post('/ticket/api/ticket-update', data)
  },
}
