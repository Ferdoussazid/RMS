import { OEM_ALARM_GROUP } from '~/assets/js/Constant'
import { getOEMBackgroundTheme } from '~/assets/js/Helper'
import {
  acMode,
  getLabelOfRectifierAlarm,
  getPropertyOfRectifierMeasurementData,
  getPropertyOfRectifierSettings,
} from '~/assets/js/RectifierHelper'
import { getLabelOfBMSAlarm, getPropertyOfBMSMeasurementData } from '~/assets/js/BMSHelper'

export const state = () => ({
  rectifierAlarmGroups: [],
  bmsAlarmGroups: [],
  rectifierMeasurementData: [],
  rectifierSettings: [],
  bmsMeasurementData: [],
  acMode: '',
  oemTime: null,
  selectedBatteryAddress: 1,
  selectedTab: 'rectifier',
  rectifierAlarms: [],
  isRectifierAlarmFetched: false,
  rectifierEvents: [],
  allRectifierEventsFetched: false,
})

export const getters = {
  rectifierAlarms(state) {
    return state.rectifierAlarms
  },
  rectifierEvents(state) {
    return state.rectifierEvents
  },
  allRectifierEventsFetched(state) {
    return state.allRectifierEventsFetched
  },
  isRectifierAlarmFetched(state) {
    return state.isRectifierAlarmFetched
  },
  rectifierAlarmGroups(state) {
    return state.rectifierAlarmGroups
  },

  rectifierMeasurementData(state) {
    return state.rectifierMeasurementData
  },
  rectifierSettings(state) {
    return state.rectifierSettings
  },
  bmsMeasurementData(state) {
    return state.bmsMeasurementData
  },
  bmsAlarmGroups(state) {
    return state.bmsAlarmGroups
  },
  acMode(state) {
    return state.acMode
  },
  oemTime(state) {
    return state.oemTime
  },
  selectedBatteryAddress(state) {
    return state.selectedBatteryAddress
  },
  selectedTab(state) {
    return state.selectedTab
  },
}

export const mutations = {
  SET_ALARM_LIST(state, group) {
    state[group.type] = group.data
  },
  SET_RECTIFIER_ALARM_LIST(state, items) {
    state.rectifierAlarms = items
  },
  SET_RECTIFIER_EVENT_LIST(state, { list, limit, count }) {
    state.rectifierEvents = list
    state.allRectifierEventsFetched = count < limit
  },
  ADD_RECTIFIER_EVENT_LIST(state, { list, limit, count }) {
    let oldestId = state.rectifierEvents.length
      ? state.rectifierEvents[state.rectifierEvents.length - 1].id
      : Math.pow(2, 31) - 1
    for (const event of list) {
      if (+event.id < +oldestId) {
        oldestId = event.id
        state.rectifierEvents.push(event)
      }
    }
    state.allRectifierEventsFetched = count < limit
  },

  SET_RECTIFIER_ALARM_FETCHED_STATUS(state, status) {
    state.isRectifierAlarmFetched = status
  },
  SET_RECTIFIER_EVENTS_FETCHED_STATUS(state, status) {
    state.allRectifierEventsFetched = status
  },
  CLEAR_RECTIFIER_ALARM_GROUPS(state, group) {
    state.rectifierAlarmGroups = []
  },
  CLEAR_BMS_ALARM_GROUPS(state, group) {
    state.rectifierAlarmGroups = []
  },
  CLEAR_RECTIFIER_MEASUREMENT_DATA(state, group) {
    state.rectifierMeasurementData = []
  },
  CLEAR_BMS_MEASUREMENT_DATA(state, group) {
    state.bmsMeasurementData = []
  },
  UPDATE_RECTIFIER_ALARM_GROUPS(state, group) {
    const index = state.rectifierAlarmGroups.findIndex(g => g.name === group.name)
    if (index !== -1) {
      state.rectifierAlarmGroups.splice(index, 1, group)
    } else {
      state.rectifierAlarmGroups.push(group)
    }
  },
  UPDATE_BMS_ALARM_GROUPS(state, group) {
    const index = state.bmsAlarmGroups.findIndex(g => g.name === group.name)
    if (index !== -1) {
      state.bmsAlarmGroups.splice(index, 1, group)
    } else {
      state.bmsAlarmGroups.push(group)
    }
  },
  SET_RECTIFIER_MEASUREMENT_DATA(state, items) {
    state.rectifierMeasurementData = items
  },
  SET_RECTIFIER_SETTINGS(state, items) {
    state.rectifierSettings = items
  },
  SET_BMS_MEASUREMENT_DATA(state, items) {
    state.bmsMeasurementData = items
  },
  SET_AC_MODE(state, data) {
    state.acMode = acMode[data]
  },
  SET_INFO(state, data) {
    state.oemTime = data.date
  },
  SET_SELECTED_BATTERY_ADDRESS(state, data) {
    state.selectedBatteryAddress = data
  },
  SET_SELECTED_TAB(state, tab) {
    state.selectedTab = tab
  },

  PREPEND_EVENT(state, item) {
    const index = state.rectifierEvents.findIndex(e => +e.id === +item.id)
    if (index === -1) {
      state.rectifierEvents = [item, ...state.rectifierEvents]
    } else {
      state.rectifierEvents.splice(index, 1, item)
    }
  },
}

export const actions = {
  async getRectifierInfo({ commit }, query) {
    const res = await this.$axios.get('/oem/api/rectifier-info', { params: query })
    if (Object.keys(res.data).length) {
      const { year, month, date, hour, minute, seconds } = res.data

      const fullYear = parseInt(year, 10) < 100 ? 2000 + parseInt(year, 10) : parseInt(year, 10)

      const parsedDate = new Date(
        fullYear,
        parseInt(month, 10) - 1,
        parseInt(date, 10),
        parseInt(hour, 10),
        parseInt(minute, 10),
        parseInt(seconds ?? 0, 10)
      )

      commit('SET_INFO', { date: parsedDate, name: res.data.site_id || '' })
    }
  },

  async getRectifierAlarms({ commit, dispatch }, query) {
    const res = await this.$axios.$get(`/oem/api/rectifier-alarm`, { params: query })
    res.forEach(r => {
      if (r.group === OEM_ALARM_GROUP.AC_MODE) {
        commit('SET_AC_MODE', r.items[0].status)
      } else if (r.group) {
        dispatch('setRectifierAlarmsByGroup', { group: r.group, items: r.items })
      }
    })
  },

  async getRectifierEvent({ commit, state }, query) {
    const limit = 100

    const oldestId = state.rectifierEvents.length
      ? state.rectifierEvents[state.rectifierEvents.length - 1].id
      : Math.pow(2, 31) - 1

    const events = await this.$axios.$get('/oem/api/event', {
      params: { ...query, oldestId, limit },
    })

    commit('ADD_RECTIFIER_EVENT_LIST', { list: events.items, limit, count: events.items.length })
  },
  publishRectifierSiteEvent({ commit }, event) {
    commit('PREPEND_EVENT', event)
  },
  async getAllRectifierAlarms({ commit, state }, query) {
    commit('SET_RECTIFIER_ALARM_FETCHED_STATUS', true)

    try {
      const alarms = await this.$axios.$get('/oem/api/event-count', {
        params: query,
      })
      commit('SET_RECTIFIER_ALARM_LIST', alarms)
    } catch (error) {
    } finally {
      commit('SET_RECTIFIER_ALARM_FETCHED_STATUS', false)
    }

    // Fetch alarms and commit to the store
  },

  async getBMSAlarms({ commit, dispatch }, query) {
    const res = await this.$axios.$get(`/oem/api/bms-alarm`, { params: query })
    res.forEach(r => {
      dispatch('setBMSAlarmsByGroup', { group: r.group, items: r.items })
    })
  },

  setRectifierAlarmsByGroup({ commit }, { group, items }) {
    const alarms = []
    items.forEach(item => {
      const mappedItem = {
        ...item,
        label: getLabelOfRectifierAlarm(item.id),
      }
      if (mappedItem.label) {
        alarms.push(mappedItem)
      }
    })
    commit('UPDATE_RECTIFIER_ALARM_GROUPS', {
      name: group,
      items: alarms,
    })
  },

  setBMSAlarmsByGroup({ commit }, { group, items }) {
    const alarms = []
    items.forEach(item => {
      const mappedItem = {
        ...item,
        label: getLabelOfBMSAlarm(item.id),
      }
      if (mappedItem.label) {
        alarms.push(mappedItem)
      }
    })
    commit('UPDATE_BMS_ALARM_GROUPS', {
      name: group,
      items: alarms,
    })
  },

  async getRectifierMeasurementData({ commit }, query) {
    const items = []
    const res = await this.$axios.$get(`/oem/api/rectifier-measurement`, { params: query })
    res.forEach(item => {
      const property = getPropertyOfRectifierMeasurementData(item.id)
      const mappedItem = {
        ...item,
        ...property,
        theme: getOEMBackgroundTheme(property.theme, item),
      }
      if (mappedItem.label) {
        items.push(mappedItem)
      }
    })

    commit('SET_RECTIFIER_MEASUREMENT_DATA', items)
  },
  async getRectifierSettings({ commit }, query) {
    const items = []
    const res = await this.$axios.$get(`/oem/api/rectifier-setting`, { params: query })
    res.forEach(item => {
      const property = getPropertyOfRectifierSettings(item.id)
      const mappedItem = {
        ...item,
        ...property,
      }
      if (mappedItem.label) {
        items.push(mappedItem)
      }
    })

    commit('SET_RECTIFIER_SETTINGS', items)
  },
  async getBMSMeasurementData({ commit }, query) {
    const items = []
    const res = await this.$axios.$get(`/oem/api/bms-measurement`, { params: query })
    res.forEach(item => {
      const property = getPropertyOfBMSMeasurementData(item.id)
      const mappedItem = {
        ...item,
        ...property,
        theme: getOEMBackgroundTheme(property.theme, item),
      }
      if (mappedItem.label) {
        items.push(mappedItem)
      }
    })

    commit('SET_BMS_MEASUREMENT_DATA', items)
  },
  clearOemData({ commit }, query) {
    commit('CLEAR_RECTIFIER_MEASUREMENT_DATA')
    commit('CLEAR_RECTIFIER_ALARM_GROUPS')
    commit('CLEAR_BMS_ALARM_GROUPS')
    commit('CLEAR_BMS_MEASUREMENT_DATA')
  },
}
