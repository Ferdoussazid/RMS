import { get } from 'lodash'
import { RMS_SERVICE } from '~/assets/js/Constant'
import { getXAxisDateLabels } from '~/assets/js/ChartHelper'
import { checkAlarmInclusivity, checkEventInclusivity } from '~/assets/js/SiteHelper'

export const state = () => ({
  pins: [],
  isServiceAvailable: false,

  eventsLoading: false,
  events: [],

  accessRecords: [],
  accessCards: [],

  openDurations: [],
  chartFilter: null,

  refreshTick: 0,
  allEventsFetched: false,
})

export const getters = {
  pins(state) {
    return state.pins
  },
  isServiceAvailable(state) {
    return state.isServiceAvailable
  },

  doorPin(state) {
    return state.pins.find(pin => pin.priority === 'door' || pin.label.toLowerCase().includes('door'))
  },

  lockPin(state) {
    return state.pins.find(pin => pin.priority === 'lock' || pin.label.toLowerCase().includes('lock'))
  },

  eventsLoading(state) {
    return state.eventsLoading
  },
  events(state) {
    return state.events
  },

  accessRecords(state) {
    return state.accessRecords
  },

  accessCards(state) {
    return state.accessCards
  },

  dateLabelsOfChart(state) {
    return getXAxisDateLabels(state.openDurations, state.chartFilter.zoom)
  },
  openDurationChartSeries(state) {
    return state.openDurations.map(v => v.seconds)
  },

  totalOpenDuration(state) {
    return Math.ceil(state.openDurations.reduce((acc, v) => acc + v.minutes, 0))
  },

  chartFilter(state) {
    return state.chartFilter
  },
  refreshTick(state) {
    return state.refreshTick
  },
  allEventsFetched(state) {
    return state.allEventsFetched
  },
}

export const mutations = {
  SET_PINS(state, pins) {
    state.pins = pins.map(pin => ({ ...pin, status: 1 }))
    state.isServiceAvailable = pins.length
  },

  SET_PIN_STATUS(state, { comId, pinName, status }) {
    const pins = state.pins.map(pin => {
      if (pin.com_id === comId && pin.pin_name === pinName) {
        return { ...pin, status }
      }
      return { ...pin }
    })
    state.pins = [...pins]
  },

  SET_OPEN_HOURS(state, items) {
    state.openDurations = items
    state.refreshTick++
  },

  SET_CHART_FILTER(state, filter) {
    state.chartFilter = filter
  },

  SET_EVENTS_LOADING(state, flag) {
    state.eventsLoading = flag
  },
  ADD_EVENTS(state, list) {
    const limit = 100
    let oldestId = state.events.length ? state.events[state.events.length - 1].id : Math.pow(2, 31) - 1
    for (const event of list) {
      if (+event.id < +oldestId) {
        oldestId = event.id
        state.events.push(event)
      }
    }
    state.allEventsFetched = list.length < limit
  },
  PREPEND_EVENT(state, item) {
    const index = state.events.findIndex(e => +e.id === +item.id)
    if (index === -1) {
      state.events = [item, ...state.events]
    } else {
      state.events.splice(index, 1, item)
    }
  },
  CLEAR_EVENTS(state) {
    state.events = []
  },

  ADD_ACCESS_RECORDS(state, items) {
    state.accessRecords = items
  },

  PREPEND_ACCESS_RECORD(state, record) {
    const index = state.accessRecords.findIndex(r => r.id === record.id)
    if (index === -1) {
      state.accessRecords = [record, ...state.accessRecords]
    }
  },

  ADD_ACCESS_CARDS(state, items) {
    state.accessCards = items
  },

  PREPEND_ACCESS_CARD(state, item) {
    state.accessCards = [item, ...state.accessCards]
  },

  REMOVE_ACCESS_CARD(state, accessId) {
    state.accessCards = state.accessCards.filter(access => access.access_id !== accessId)
  },

  CLEAR_ACCESS_CARDS(state) {
    state.accessCards = []
  },
}

export const actions = {
  initPins({ commit }, siteConfig) {
    const pins = siteConfig.pinConfigs.filter(pn => pn.type === RMS_SERVICE.ACCESS_CONTROL)
    commit('SET_PINS', pins)
    commit('CLEAR_EVENTS')
  },

  publishStatus({ commit, dispatch, rootGetters }, { comId, pinName, status }) {
    const devices = get(rootGetters['site/siteConfig'], 'devices', [])
    if (devices.includes(comId)) {
      commit('SET_PIN_STATUS', { comId, pinName, status })
    }
  },
  publishEvent({ commit, rootGetters }, event) {
    const tenants = rootGetters['user/allowedTenants']
    if (checkEventInclusivity(event, tenants)) {
      commit('PREPEND_EVENT', event)
    }
  },

  async getOpenDurations({ commit }, { siteUid, fromDate, untilDate, zoom }) {
    const res = await this.$axios.$get('/door/api/open-hours', {
      params: {
        siteUid,
        fromDate,
        untilDate,
        zoom,
      },
    })
    commit('SET_CHART_FILTER', { fromDate, untilDate, zoom })
    commit('SET_OPEN_HOURS', res)
  },

  async getEvents({ commit, state, rootGetters }, siteUid) {
    commit('SET_EVENTS_LOADING', true)

    const oldestId = state.events.length ? state.events[state.events.length - 1].id : Math.pow(2, 31) - 1

    const res = await this.$axios.$get('/door/api/events', { params: { siteUid, oldestId } })
    const allowedTenants = rootGetters['user/allowedTenants']
    const eventsOfAllowedTenants = res.filter(e => checkAlarmInclusivity(e, allowedTenants))
    commit('ADD_EVENTS', eventsOfAllowedTenants)
    commit('SET_EVENTS_LOADING', false)
  },

  async getAccessRecords({ commit, state }) {
    const siteUid = state.pins[0].site_uid
    const oldestId = Math.pow(2, 31) - 1

    const res = await this.$axios.$get('/door/access/fetch-records', { params: { siteUid, oldestId } })
    commit('ADD_ACCESS_RECORDS', res)
  },

  async getAccessCards({ commit, state }) {
    const siteUid = state.pins[0].site_uid
    const oldestId = Math.pow(2, 31) - 1

    const res = await this.$axios.$get('/door/access/fetch-cards', { params: { siteUid, oldestId } })
    commit('ADD_ACCESS_CARDS', res)
  },

  async addAccessCard({ commit, state }, data) {
    const siteUid = state.pins[0].site_uid
    const userUid = state.pins[0].user_uid

    const res = await this.$axios.$post('/door/access/add-card', {
      ...data,
      site_uid: siteUid,
      user_uid: userUid,
    })
    commit('ADD_ACCESS_CARDS', res)
  },

  async deleteAccessCard({ commit }, accessId) {
    await this.$axios.$post('/door/access/delete-card', { access_id: accessId })
    commit('REMOVE_ACCESS_CARD', accessId)
  },

  async deleteCardFromSystem({ commit, rootGetters }, cardNumber) {
    const res = await this.$axios.$post('/door/access/master-remove', {
      user_uid: rootGetters['user/rootUserUid'],
      card_number: cardNumber,
    })
    return res
  },

  async clearAccessCardList({ commit, state }) {
    const siteUid = state.pins[0].site_uid

    await this.$axios.$post('/door/access/clear-cards', { siteUid })
    commit('CLEAR_ACCESS_CARDS')
  },
}
