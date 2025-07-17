import { get } from 'lodash'
import { RMS_SERVICE } from '~/assets/js/Constant'

export const state = () => ({
  pins: [],
  isServiceAvailable: false,

  availability: [], // Availability percentage of the current site
  events: [],

  allEventsFetched: false,
})

export const getters = {
  pins(state) {
    return state.pins
  },
  primaryPin(state) {
    if (!state.pins.length) {
      return null
    }
    return state.pins[0]
  },
  events(state) {
    return state.events
  },

  availability(state) {
    return state.availability
  },

  isServiceAvailable(state) {
    return state.isServiceAvailable
  },

  allEventsFetched(state) {
    return state.allEventsFetched
  },
}

export const mutations = {
  SET_PINS(state, pins) {
    pins = pins.map(pin => ({ ...pin, voltage: 0 }))
    state.pins = pins
    state.isServiceAvailable = pins.length > 0
  },
  SET_PIN_VOLTAGE(state, { comId, pinName, voltage }) {
    const pins = state.pins.map(pin => {
      if (pin.com_id === comId && pin.pin_name === pinName) {
        return { ...pin, voltage }
      }
      return { ...pin }
    })

    state.pins = [...pins]

    // const index = state.pins.findIndex(pin => pin.com_id === comId && pin.pin_name === pinName)
    // if (index !== -1) {
    //   const temp = state.pins[index]
    //   temp.voltage = voltage
    //   state.pins.splice(index, 1, temp)
    // }
  },

  SET_CHART_FILTER(state, filter) {
    state.chartFilter = filter
  },

  UPDATE_AVAILABILITY(state, percentage) {
    state.availability = percentage
  },

  ADD_EVENTS(state, { list, count }) {
    const limit = 100
    let oldestId = state.events.length ? state.events[state.events.length - 1].id : Math.pow(2, 31) - 1
    for (const event of list) {
      if (+event.id < +oldestId) {
        oldestId = event.id
        state.events.push(event)
      }
    }
    state.allEventsFetched = count < limit
  },
  PREPEND_EVENT(state, item) {
    const index = state.events.findIndex(e => e.id === item.id)
    if (index === -1) {
      state.events = [item, ...state.events]
    }
  },
  CLEAR_EVENTS(state) {
    state.events = []
  },
}

export const actions = {
  initPhases({ commit }, siteConfig) {
    const pins = siteConfig.pinConfigs.filter(pin => pin.type === RMS_SERVICE.MAIN_PHASE)
    commit('SET_PINS', pins)
    commit('CLEAR_EVENTS')
  },

  publishVoltage({ commit, dispatch, rootGetters }, { comId, pinName, voltage }) {
    const devices = get(rootGetters['site/siteConfig'], 'devices', [])
    if (devices.includes(comId)) {
      commit('SET_PIN_VOLTAGE', { comId, pinName, voltage })
      // TODO: Find the validity of calling this commit here, or else find another way to call this commit
      // dispatch('getRecentValues')
    }
  },

  publishEvent({ commit }, event) {
    commit('PREPEND_EVENT', event)
  },

  async getAvailability({ commit }, { siteUid, date }) {
    const res = await this.$axios.$get('/mains/analytics/availability', { params: { site_uid: siteUid, date } })
    commit('UPDATE_AVAILABILITY', res)
  },

  async getEvents({ commit, state, dispatch, rootGetters }) {
    const tenant = rootGetters['site/focusedTenant'] || undefined
    let primaryPin = state.pins.find(p => p.priority === 'primary')
    if (!primaryPin) primaryPin = state.pins[0]

    const siteUid = primaryPin.site_uid
    const oldestId = state.events.length ? state.events[state.events.length - 1].id : Math.pow(2, 31) - 1

    const res = await this.$axios.$get('/mains/event/fetch', {
      params: { site_uid: siteUid, oldest_id: oldestId, tenant },
    })

    commit('ADD_EVENTS', { list: res, count: res.length })
  },
}
