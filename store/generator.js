import { get } from 'lodash'
import { RMS_SERVICE } from '~/assets/js/Constant'
import { getXAxisDateLabels } from '~/assets/js/ChartHelper'

export const state = () => ({
  dgPin: null,
  dgPins: [],
  pgPin: null,
  pgPins: [],

  isServiceAvailable: false,

  dgEvents: [],
  pgEvents: [],

  dgRunHours: [],
  pgRunHours: [],

  dgChartFilter: null,
  pgChartFilter: null,

  dgRefreshTick: 0,
  pgRefreshTick: 0,
  alldgEventsFetched: false,
  allpgEventsFetched: false,
})

export const getters = {
  dgPin(state) {
    return state.dgPin
  },
  pgPin(state) {
    return state.pgPin
  },
  dgPins(state) {
    return state.dgPins
  },
  pgPins(state) {
    return state.pgPins
  },
  isServiceAvailable(state) {
    return state.isServiceAvailable
  },

  dgEvents(state) {
    return state.dgEvents
  },
  pgEvents(state) {
    return state.pgEvents
  },

  dateLabelsOfChart(state) {
    return name => {
      // name = 'dg'/'pg'
      if (name === 'dg') {
        return getXAxisDateLabels(state.dgRunHours, state.dgChartFilter.zoom)
      }
      return getXAxisDateLabels(state.pgRunHours, state.pgChartFilter.zoom)
    }
  },
  runHourChartSeries(state) {
    return name => {
      // name = 'dg'/'pg'
      if (name === 'dg') {
        return state.dgRunHours.map(v => v.seconds)
      }
      return state.pgRunHours.map(v => v.seconds)
    }
  },

  totalRunHour(state) {
    return name => {
      // name = 'dg'/'pg'
      if (name === 'dg') {
        return state.dgRunHours.reduce((acc, v) => acc + v.seconds, 0)
      }
      return state.pgRunHours.reduce((acc, v) => acc + v.seconds, 0)
    }
  },

  chartFilter(state) {
    return name => {
      // name = 'dg'/'pg'
      return name === 'dg' ? state.dgChartFilter : state.pgChartFilter
    }
  },
  dgRefreshTick(state) {
    return state.dgRefreshTick
  },
  pgRefreshTick(state) {
    return state.pgRefreshTick
  },
  alldgEventsFetched(state) {
    return state.alldgEventsFetched
  },
  allpgEventsFetched(state) {
    return state.allpgEventsFetched
  },
}

export const mutations = {
  SET_PINS(state, pins) {
    const dgPin = pins.find(p => p.type === RMS_SERVICE.DG_STATUS)
    const pgPin = pins.find(p => p.type === RMS_SERVICE.PG_STATUS)

    if (dgPin) state.dgPin = { ...dgPin, status: 0 }
    if (pgPin) state.pgPin = { ...pgPin, status: 0 }
    const dgPins = pins.filter(p => p.type === RMS_SERVICE.DG_STATUS).map(pin => ({ ...pin, status: 0 }))
    const pgPins = pins.filter(p => p.type === RMS_SERVICE.PG_STATUS).map(pin => ({ ...pin, status: 0 }))

    if (dgPins) state.dgPins = dgPins
    if (pgPins) state.pgPins = pgPins

    state.isServiceAvailable = pins.length > 0
  },

  SET_DG_PIN_STATUS(state, { comId, pinName, status, tenant }) {
    // console.log(tenant)

    if (state.isServiceAvailable && state.dgPins.length) {
      const pins = state.dgPins.map(pin => {
        if (pin.com_id === comId && pin.pin_name === pinName && pin.tenant === tenant) {
          return { ...pin, status }
        }
        return { ...pin }
      })
      state.dgPins = [...pins]
    }
    if (state.isServiceAvailable && state.dgPin) {
      state.dgPin = { ...state.dgPin, status }
    }
  },
  SET_PG_PIN_STATUS(state, { comId, pinName, status, tenant }) {
    // console.log('ACTION PG')
    // console.log(comId, pinName, status, tenant)
    if (state.isServiceAvailable && state.pgPins.length) {
      const pins = state.pgPins.map(pin => {
        if (pin.com_id === comId && pin.pin_name === pinName && pin.tenant === tenant) {
          return { ...pin, status }
        }
        return { ...pin }
      })
      state.pgPins = [...pins]
    }
    if (state.isServiceAvailable && state.pgPin) {
      state.pgPin = { ...state.pgPin, status }
    }
  },

  SET_DG_RUN_HOURS(state, items) {
    state.dgRunHours = items
    state.dgRefreshTick++
  },
  SET_PG_RUN_HOURS(state, items) {
    state.pgRunHours = items
    state.pgRefreshTick++
  },

  SET_DG_CHART_FILTER(state, filter) {
    state.dgChartFilter = filter
  },
  SET_PG_CHART_FILTER(state, filter) {
    state.pgChartFilter = filter
  },

  ADD_DG_EVENTS(state, list) {
    const limit = 100
    let oldestId = Math.pow(2, 31) - 1
    if (state.dgEvents.length) {
      oldestId = state.dgEvents[state.dgEvents.length - 1].id
    }
    for (const event of list) {
      if (+event.id < +oldestId) {
        oldestId = event.id
        state.dgEvents.push(event)
      }
    }
    state.alldgEventsFetched = list.length < limit
  },
  ADD_PG_EVENTS(state, list) {
    const limit = 100
    let oldestId = Math.pow(2, 31) - 1
    if (state.pgEvents.length) {
      oldestId = state.pgEvents[state.pgEvents.length - 1].id
    }

    for (const event of list) {
      if (+event.id < +oldestId) {
        oldestId = event.id
        state.pgEvents.push(event)
      }
    }

    state.allpgEventsFetched = list.length < limit
  },
  PREPEND_DG_EVENTS(state, item) {
    const index = state.dgEvents.findIndex(e => e.id === item.id)
    if (index === -1) {
      state.dgEvents = [item, ...state.dgEvents]
    }
  },
  PREPEND_PG_EVENTS(state, item) {
    const index = state.pgEvents.findIndex(e => e.id === item.id)
    if (index === -1) {
      state.pgEvents = [item, ...state.pgEvents]
    }
  },
  CLEAR_ALL_EVENTS(state) {
    state.dgEvents = []
    state.pgEvents = []
  },
  alldgEventsFetched(state) {
    return state.alldgEventsFetched
  },
}

export const actions = {
  initPins({ commit }, siteConfig) {
    const pins = siteConfig.pinConfigs.filter(p => [RMS_SERVICE.DG_STATUS, RMS_SERVICE.PG_STATUS].includes(p.type))
    commit('SET_PINS', pins)
    commit('CLEAR_ALL_EVENTS')
  },

  publishStatus({ state, commit, rootGetters }, config) {
    const { comId, pinName, status, tenant } = config
    // console.log('PUBLISH STATUS')
    // console.log(config)
    // console.log('PUBLISH STATUS END')
    const devices = get(rootGetters['site/siteConfig'], 'devices', [])
    if (devices.includes(comId)) {
      const data = { comId, pinName, status, tenant }
      const dgPin = state.dgPins.find(p => p.com_id === comId && p.pin_name === pinName)

      if (dgPin) {
        if (get(state.dgPin, 'pin_name', '') === pinName) {
          commit('SET_DG_PIN_STATUS', data)
        }
      } else {
        // console.log(data)
        commit('SET_PG_PIN_STATUS', data)
      }
    }
  },

  publisgDGEvent({ commit }, event) {
    commit('PREPEND_DG_EVENT', event)
  },
  publisgPGEvent({ commit }, event) {
    commit('PREPEND_PG_EVENT', event)
  },

  async getRunHours({ commit }, { name, siteUid, fromDate, untilDate, zoom, tenant }) {
    // name = 'dg' / 'pg'
    const event = name === 'dg' ? 'dg_power' : 'pg_power'
    const res = await this.$axios.$get('/dg/api/run-hours', {
      params: {
        siteUid,
        event,
        fromDate,
        untilDate,
        zoom,
        tenant,
      },
    })

    if (name === 'dg') {
      commit('SET_DG_CHART_FILTER', { fromDate, untilDate, zoom })
      commit('SET_DG_RUN_HOURS', res)
    } else {
      commit('SET_PG_CHART_FILTER', { fromDate, untilDate, zoom })
      commit('SET_PG_RUN_HOURS', res)
    }
  },

  async getEvents({ commit, state }, { siteUid, event, tag, tenant }) {
    let oldestId = 0

    if (tag === 'pg') {
      oldestId = state.pgEvents.length ? state.pgEvents[state.pgEvents.length - 1].id : Math.pow(2, 31) - 1
    } else {
      oldestId = state.dgEvents.length ? state.dgEvents[state.dgEvents.length - 1].id : Math.pow(2, 31) - 1
    }

    const res = await this.$axios.$get('/dg/api/events', {
      params: {
        event,
        siteUid,
        oldestId,
        tenant,
      },
    })

    if (tag === 'dg') {
      commit('ADD_DG_EVENTS', res)
    } else {
      commit('ADD_PG_EVENTS', res)
    }
  },
}
