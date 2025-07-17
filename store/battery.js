import { get } from 'lodash'
import { format } from 'date-fns'
import { RMS_SERVICE, APP_EVENT } from '~/assets/js/Constant'
import { getXAxisDateLabels } from '~/assets/js/ChartHelper'

export const state = () => ({
  voltagePins: [],
  currentPins: [],

  dcBackup: {
    maximum: 0,
    remaining: 0,
    isAvailable: false,
  },
  isServiceAvailable: false,

  events: [],
  consumption: 0,

  dischargeProfile: null,
  refreshDischargeProfileChart: 0,

  historicTrendSeries: [],
  chartFilter: null,
  shouldUpdateHistoryChart: 0,

  dcPowerSeries: [],
  refreshDCPowerChart: 0,

  allEventsFetched: false,
  siteWiseDCMetrics: {},
})

export const getters = {
  voltagePins(state) {
    return state.voltagePins
  },
  currentPins(state) {
    return state.currentPins
  },
  dcBackup(state) {
    return state.dcBackup
  },
  isServiceAvailable(state) {
    return state.isServiceAvailable
  },

  events(state) {
    return state.events
  },
  consumption(state) {
    return state.consumption
  },

  chartFilter(state) {
    return state.chartFilter
  },
  dateLabelsOfChart(state) {
    return getXAxisDateLabels(state.historicTrendSeries[0], state.chartFilter.zoom)
  },
  healthChartSeries(state) {
    return index => {
      try {
        return state.historicTrendSeries[index].map(v => v.seconds)
      } catch (error) {
        console.log('battery:: healthChartSeries', error)
        return []
      }
    }
  },

  shouldUpdateHistoryChart(state) {
    return state.shouldUpdateHistoryChart
  },

  dischargeProfileEvent(state) {
    return state.dischargeProfile?.event
  },
  dischargeProfileSeries(state) {
    // TODO: state.dischargeProfile.data might be undefined, check this for exception handling
    try {
      return state.dischargeProfile.data.map(record => [new Date(record.bucket), record.average])
    } catch (error) {
      return []
    }
  },
  refreshDischargeProfileChart(state) {
    return state.refreshDischargeProfileChart
  },

  dcPowerSeries(state) {
    return state.dcPowerSeries
  },

  refreshDCPowerChart(state) {
    return state.refreshDCPowerChart
  },

  allEventsFetched(state) {
    return state.allEventsFetched
  },
  siteWiseDCMetrics(state) {
    return state.siteWiseDCMetrics
  },
}

export const mutations = {
  UPDATE_TERMINAL_VOLTAGE(state, { comId, pinName, voltage }) {
    const pins = state.voltagePins.map(pin => {
      if (pin.com_id === comId && pin.pin_name === pinName) {
        return { ...pin, voltage }
      }
      return { ...pin }
    })

    state.voltagePins = [...pins]
  },
  UPDATE_BATTERY_BACKUP(state, { comId, pinName, batteryMax, batteryLeft }) {
    const pins = state.voltagePins.map(pin => {
      if (pin.com_id === comId && pin.pin_name === pinName) {
        return { ...pin, maximum: +batteryMax, remaining: +batteryLeft }
      }
      return { ...pin }
    })

    state.voltagePins = [...pins]
    // const index = state.voltagePins.findIndex(pin => pin.com_id === comId && pin.pin_name === pinName)
    // if (index !== -1) {
    //   const pin = state.voltagePins[index]
    //   pin.maximum = +batteryMax
    //   pin.remaining = +batteryLeft
    //   state.voltagePins.splice(index, 1, pin)
    // }
    state.dcBackup = {
      maximum: batteryMax,
      remaining: batteryLeft,
      isAvailable: true,
    }
  },
  SET_VOLTAGE_PINS(state, pins) {
    state.isServiceAvailable = pins.length > 0
    state.voltagePins = pins.map(p => ({
      ...p,
      voltage: -1,
      maximum: -1,
      remaining: -1,
    }))
  },
  SET_CURRENT_PINS(state, pins) {
    state.currentPins = pins.map(p => ({ ...p, ampere: 0 }))
    state.isServiceAvailable = pins.length > 0
  },
  UPDATE_BATTERY_CURRENT(state, { comId, pinName, ampere }) {
    const pins = state.currentPins.map(pin => {
      if (pin.com_id === comId && pin.pin_name === pinName) {
        return { ...pin, ampere }
      }
      return { ...pin }
    })

    state.currentPins = [...pins]
    // const index = state.currentPins.findIndex(p => p.pin_name === pinName && p.com_id === comId)
    // if (index !== -1) {
    //   const pin = state.currentPins[index]
    //   pin.ampere = ampere
    //   state.currentPins.splice(index, 1, pin)
    // }
  },
  SET_DISCHARGE_PROFILE(state, profile) {
    state.dischargeProfile = profile
    state.refreshDischargeProfileChart++
  },
  SET_CHART_FILTER(state, filter) {
    state.chartFilter = filter
  },
  SET_HEALTH_HISTORY(state, data) {
    state.historicTrendSeries = data
    state.shouldUpdateHistoryChart++
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
  UPDATE_CONSUMPTION(state, energy) {
    state.consumption = energy
  },
  SET_DC_POWER_SERIES(state, data) {
    state.dcPowerSeries = data
    state.refreshDCPowerChart++
  },
  SET_DC_POWER_TREND(state, { data, tenant }) {
    state.powerTrend.tenant = tenant
    state.powerTrend.data = data
    state.refreshPowerTrend++
  },
  SET_LIVE_DC_METRICS(state, list) {
    const dcMetricsMap = {}
    list.forEach(item => {
      // eslint-disable-next-line camelcase
      const { site_uid, tenant, ...rest } = item

      if (!dcMetricsMap[site_uid]) {
        dcMetricsMap[site_uid] = {}
      }
      dcMetricsMap[site_uid][tenant] = rest
    })
    state.siteWiseDCMetrics = dcMetricsMap
  },
}

export const actions = {
  initBatteryPins({ commit }, siteConfig) {
    const pins = siteConfig.pinConfigs.filter(p => p.type === RMS_SERVICE.BATTERY_CURRENT)
    commit('SET_CURRENT_PINS', pins)
    const voltagePins = siteConfig.pinConfigs.filter(p => p.type === RMS_SERVICE.BATTERY_TERMINAL)
    commit('SET_VOLTAGE_PINS', voltagePins)
    commit('CLEAR_EVENTS')
  },

  publishTerminalVoltage({ commit, dispatch, rootGetters }, { comId, pinName, voltage }) {
    const devices = get(rootGetters['site/siteConfig'], 'devices', [])
    if (devices.includes(comId)) {
      commit('UPDATE_TERMINAL_VOLTAGE', { comId, pinName, voltage })
      this.$bus.$emit(APP_EVENT.DC_VOLTAGE_PUBLISHED)
    }
  },
  publishCurrent({ commit, rootGetters }, { comId, pinName, ampere }) {
    const devices = get(rootGetters['site/siteConfig'], 'devices', [])
    if (devices.includes(comId)) {
      commit('UPDATE_BATTERY_CURRENT', { comId, pinName, ampere })
      this.$bus.$emit(APP_EVENT.DC_CURRENT_PUBLISHED)
    }
  },
  publishEvent({ commit, dispatch }, event) {
    commit('PREPEND_EVENT', event)
  },

  publishBackupTime({ commit, rootGetters }, { comId, pinName, batteryMax, batteryLeft }) {
    const devices = get(rootGetters['site/siteConfig'], 'devices', [])
    if (devices.includes(comId)) {
      commit('UPDATE_BATTERY_BACKUP', { comId, pinName, batteryMax, batteryLeft })
    }
  },

  async getVoltageProfile({ commit, state }, { siteUid, comId, tenant }) {
    const params = {
      siteUid,
      comId,
      pinName: 'am6',
      tenant,
      factor: 1,
      offset: 0,
    }
    const profile = await this.$axios.$get('/battery/voltage/profile', { params })
    commit('SET_DISCHARGE_PROFILE', profile)
  },

  async getBatteryHealthHistory({ commit, state }, { fromDate, untilDate, zoom }) {
    if (fromDate instanceof Date) {
      fromDate = format(fromDate, 'yyyy-MM-dd')
    }
    if (untilDate instanceof Date) {
      untilDate = format(untilDate, 'yyyy-MM-dd')
    }

    const data = []
    // DEBT: this threshold values should come from site settings
    for (const volt of [42, 52, 56]) {
      const res = await this.$axios.$get('/battery/health-history', {
        params: {
          comId: state.pin.com_id,
          pinName: state.pin.pin_name,
          fromDate,
          untilDate,
          zoom,
          value: volt,
        },
      })

      data.push(res)
    }

    commit('SET_CHART_FILTER', { fromDate, untilDate, zoom })
    commit('SET_HEALTH_HISTORY', data)
  },

  async getEvents({ commit, state, dispatch, rootGetters }, siteUid) {
    const tenant = rootGetters['site/focusedTenant'] || undefined

    const oldestId = state.events.length ? state.events[state.events.length - 1].id : Math.pow(2, 31) - 1

    const res = await this.$axios.$get('/battery/event/fetch', {
      params: { site_uid: siteUid, oldest_id: oldestId, tenant },
    })
    commit('SET_EVENTS', { list: res, count: res.length })
  },

  async getEnergyConsumption({ commit }, { siteUid, date }) {
    const res = await this.$axios.$get('/battery/energy/consumption', { params: { siteUid, date } })

    commit('UPDATE_CONSUMPTION', get(res, 'energy', 0.0))
  },

  async getDCPowerTrend({ commit }, { siteUid, date }) {
    const res = await this.$axios.$get('/battery/power-trend', { params: { siteUid, date } })

    commit('SET_DC_POWER_SERIES', res)
  },
  async getLiveDCMetrics({ commit, rootGetters }) {
    const userUid = rootGetters['user/rootUserUid']
    const res = await this.$axios.$get('battery/power/last-avg-history', { params: { user_uid: userUid } })

    commit('SET_LIVE_DC_METRICS', res)
  },
}
