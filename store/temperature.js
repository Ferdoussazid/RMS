import { get } from 'lodash'
import { APP_EVENT, RMS_SERVICE } from '~/assets/js/Constant'
import { checkEventInclusivity } from '~/assets/js/SiteHelper'

export const state = () => ({
  pins: [],
  humidityPins: [],
  isServiceAvailable: false,

  events: [],
  allEventsFetched: false,
})

export const getters = {
  pins(state) {
    return state.pins
  },
  humidityPins(state) {
    return state.humidityPins
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

  isServiceAvailable(state) {
    return state.isServiceAvailable
  },

  allEventsFetched(state) {
    return state.allEventsFetched
  },
}

export const mutations = {
  SET_PINS(state, pins) {
    pins = pins.map(pin => ({ ...pin, temperature: 0 }))
    state.pins = pins
    state.recentValueSeries = pins.map(__ => [])
    state.historicTrendSeries = pins.map(__ => [])
    state.isServiceAvailable = pins.length > 0
  },

  SET_HUMIDITY_PINS(state, pins) {
    pins = pins.map(pin => ({ ...pin, humidity: 0 }))
    state.humidityPins = pins
  },

  SET_PIN_TEMPERATURE(state, { comId, pinName, temperature }) {
    const index = state.pins.findIndex(pin => pin.com_id === comId && pin.pin_name === pinName)
    if (index !== -1) {
      const temp = state.pins[index]
      temp.temperature = temperature
      state.pins.splice(index, 1, temp)
    }
  },
  SET_PIN_HUMIDITY(state, { comId, pinName, humidity }) {
    const index = state.humidityPins.findIndex(pin => pin.com_id === comId && pin.pin_name === pinName)
    if (index !== -1) {
      const temp = state.humidityPins[index]
      temp.humidity = humidity
      state.humidityPins.splice(index, 1, temp)
    }
  },

  SET_EVENTS(state, { list, count }) {
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
  initTemperature({ commit }, siteConfig) {
    const pins = siteConfig.pinConfigs.filter(pin => pin.type === RMS_SERVICE.TEMPERATURE)
    commit('SET_PINS', pins)
    commit('CLEAR_EVENTS', pins)
  },

  initHumidity({ commit }, siteConfig) {
    const pins = siteConfig.pinConfigs.filter(pin => pin.type === RMS_SERVICE.HUMIDITY)
    commit('SET_HUMIDITY_PINS', pins)
  },

  publishTemperature({ commit, dispatch, rootGetters }, { comId, pinName, temperature }) {
    const devices = get(rootGetters['site/siteConfig'], 'devices', [])
    if (devices.includes(comId)) {
      commit('SET_PIN_TEMPERATURE', { comId, pinName, temperature })
      this.$bus.$emit(APP_EVENT.TEMPERATURE_PUBLISHED)
    }
  },

  publishHumidity({ commit, dispatch, rootGetters }, { comId, pinName, humidity }) {
    const devices = get(rootGetters['site/siteConfig'], 'devices', [])
    if (devices.includes(comId)) {
      commit('SET_PIN_HUMIDITY', { comId, pinName, humidity })
    }
  },

  publishEvent({ commit, rootGetters }, event) {
    const tenants = rootGetters['user/allowedTenants']
    if (checkEventInclusivity(event, tenants)) {
      commit('PREPEND_EVENT', event)
    }
  },

  async getEvents({ commit, state, rootGetters }) {
    const siteUid = state.pins[0].site_uid
    const oldestId = state.events.length ? state.events[state.events.length - 1].id : Math.pow(2, 31) - 1

    const res = await this.$axios.$get('/temperature/api/events', {
      params: { siteUid, oldestId },
    })
    const allowedTenants = rootGetters['user/allowedTenants']
    const eventsOfAllowedTenants = res.filter(e => checkEventInclusivity(e, allowedTenants))
    commit('SET_EVENTS', { list: eventsOfAllowedTenants, count: res.length })
  },
}
