import { startOfDay, startOfToday, sub } from 'date-fns'
import { powerAlarms, readOnlyUserEvents } from '~/assets/js/AlarmHelper'
import { SITE_TENANT } from '~/assets/js/Constant'
import { ACS_EVENTS, RMS_EVENTS } from '~/assets/js/Helper'
import { checkEventInclusivity } from '~/assets/js/SiteHelper'
const downloadFile = require('js-file-download')

export const state = () => ({
  loading: false,

  // Dashboards
  power: {
    mains_on: 0,
    mains_off: 0,
    dc_low: 0,
    dg_power: 0,
    pg_power: 0,
    site_down: 0,
    site_on_battery: 0,
  },
  dcPower: {
    no_load: 0,
    normal_load: 0,
    over_load: 0,
  },
  alarm: {
    mains_fail: 0,
    ac_line_fail: 0,
    mdb_fault: 0,
    dc_power_fail: 0,
    dc_low_voltage: 0,
    site_on_battery: 0,
    rectifier_fail: 0,
    device_online: 0,
    dc_load_fail: 0,

    door_status: 0,
    lock_status: 0,
    lock_open_fail: 0,
    lock_close_fail: 0,
    door_open_timeout: 0,
    lock_fault: 0,
    card_reader_fault: 0,
    vibration: 0,
    motion: 0,
    security_breach: 0,

    high_temperature: 0,
    dg_low_fuel: 0,
    dg_start_fail: 0,
    dg_on: 0,
    pg_on: 0,
    aviation_light_fail: 0,
    solar_power_generation_fail: 0,
    solar_control_fail: 0,
  },
  access: {
    total_door: 0,
    door_open: 0,
    lock_open: 0,
    lock_open_fail: 0,
    lock_close_fail: 0,
    security_breach: 0,
    vibration: 0,
  },

  battery: {
    full: 0, // > 4 hrs
    good: 0, // 2-4 hrs
    ok: 0, // 1-2 hrs
    bad: 0, // < 1 hrs
    loading: true,
  },

  // TODO: deprecated, remove these dashboards in future
  mains: { on: 0, off: 0, loading: true },
  dg: { on: 0, off: 0, loading: true },
  temperature: { normal: 0, high: 0, loading: true },

  rmsEvents: [],
  allRMSEventsFetched: false,

  allEvents: [],
  allEventsFetched: false,

  acsEvents: [],
  allACSEventsFetched: false,
  frequency: {},
  fetchingDashboard: true,
  loadCount: {
    DOWN: {
      [SITE_TENANT.BANGLALINK]: 0,
      [SITE_TENANT.ROBI]: 0,
      [SITE_TENANT.GRAMEENPHONE]: 0,
      scom_rect_1: 0,
      scom_rect_2: 0,
      total: 0,
    },
    NORMAL: {
      [SITE_TENANT.BANGLALINK]: 0,
      [SITE_TENANT.ROBI]: 0,
      [SITE_TENANT.GRAMEENPHONE]: 0,
      scom_rect_1: 0,
      scom_rect_2: 0,
      total: 0,
    },
    OVER: {
      [SITE_TENANT.BANGLALINK]: 0,
      [SITE_TENANT.ROBI]: 0,
      [SITE_TENANT.GRAMEENPHONE]: 0,
      scom_rect_1: 0,
      scom_rect_2: 0,
      total: 0,
    },
  },
  availabilityData: [],
  powerData: [],
  selectedTab: null,
  selectedLoadCountItem: {
    site: null,
    range: { id: 1, start: -1, end: 2 },
    type: 'sites',
    date: {
      start: sub(startOfDay(new Date()), { days: 7, hours: 6 }),
      end: new Date(),
    },
  },

  availabilityGraphDate: {
    start: sub(startOfDay(new Date()), { days: 7, hours: 6 }),
    end: new Date(),
  },
  selectedTenant: '',
})

export const getters = {
  loading(state) {
    return state.loading
  },
  power(state) {
    return state.power
  },
  dcPower(state) {
    return state.dcPower
  },
  alarm(state) {
    return state.alarm
  },
  access(state) {
    return state.access
  },
  mains(state) {
    return state.mains
  },
  dg(state) {
    return state.dg
  },
  battery(state) {
    return state.battery
  },
  temperature(state) {
    return state.temperature
  },
  rmsEvents(state) {
    return state.rmsEvents
  },
  allRMSEventsFetched(state) {
    return state.allRMSEventsFetched
  },
  allEvents(state) {
    return state.allEvents
  },
  allEventsFetched(state) {
    return state.allRMSEventsFetched
  },
  acsEvents(state) {
    return state.acsEvents
  },
  allACSEventsFetched(state) {
    return state.allACSEventsFetched
  },
  frequency(state) {
    return state.frequency
  },
  fetchingDashboard(state) {
    return state.fetchingDashboard
  },
  loadCount(state) {
    return state.loadCount
  },
  availabilityData(state) {
    return state.availabilityData
  },
  powerData(state) {
    return state.powerData
  },
  selectedTab(state) {
    return state.selectedTab
  },
  selectedSite(state) {
    return state.selectedSite
  },
  selectedLoadCountItem(state) {
    return state.selectedLoadCountItem
  },
  selectedTenant(state) {
    return state.selectedTenant
  },
  loadStatusCountDate(state) {
    return state.loadStatusCountDate
  },
  availabilityGraphDate(state) {
    return state.availabilityGraphDate
  },
}

export const mutations = {
  SET_LOADING(state, flag) {
    state.loading = flag
  },
  SET_POWER_DASHBOARD(state, counts) {
    state.power = counts
  },
  SET_DC_POWER_DASHBOARD(state, counts) {
    state.dcPower = counts
  },
  SET_ACCESS_DASHBOARD(state, counts) {
    state.access = counts
  },
  SET_ALARM_DASHBOARD(state, counts) {
    state.alarm = counts
  },
  SET_MAINS(state, counts) {
    state.mains = counts
  },
  SET_DG(state, counts) {
    state.dg = counts
  },
  SET_BATTERY(state, counts) {
    state.battery = counts
  },
  SET_TEMPERATURE(state, counts) {
    state.temperature = counts
  },
  ADD_EVENTS(state, { list, group, limit, count }) {
    let oldestId = Math.pow(2, 31) - 1
    if (group === 'RMS') {
      if (state.rmsEvents.length) {
        oldestId = state.rmsEvents[state.rmsEvents.length - 1].id
      }
      for (const event of list) {
        if (+event.id < +oldestId) {
          oldestId = event.id
          state.rmsEvents.push(event)
        }
      }
      state.allRMSEventsFetched = count < limit
    } else if (group === 'ACS') {
      if (state.acsEvents.length) {
        oldestId = state.acsEvents[state.acsEvents.length - 1].id
      }
      for (const event of list) {
        if (+event.id < +oldestId) {
          oldestId = event.id
          state.acsEvents.push(event)
        }
      }
      state.allACSEventsFetched = count < limit
    } else if (group === 'ALL') {
      if (state.allEvents.length) {
        oldestId = state.allEvents[state.allEvents.length - 1].id
      }
      for (const event of list) {
        if (+event.id < +oldestId) {
          oldestId = event.id
          state.allEvents.push(event)
        }
      }
      state.allEventsFetched = count < limit
    }
  },
  PREPEND_EVENT(state, item) {
    if (RMS_EVENTS.includes(item.name)) {
      const index = state.rmsEvents.findIndex(e => +e.id === +item.id)
      if (index === -1) {
        state.rmsEvents = [item, ...state.rmsEvents]
      } else {
        state.rmsEvents.splice(index, 1, item)
      }
    } else if (ACS_EVENTS.includes(item.name)) {
      const index = state.acsEvents.findIndex(e => +e.id === +item.id)
      if (index === -1) {
        state.acsEvents = [item, ...state.acsEvents]
      } else {
        state.acsEvents.splice(index, 1, item)
      }
    }
  },
  SET_ALAMRS_COUNT(state, alarmCounts) {
    state.frequency = { ...alarmCounts }
  },
  SET_LOAD_COUNT_STATUS(state, count) {
    state.loadCount = count
  },
  CLEAR_RMS_EVENTS(state) {
    state.rmsEvents = []
    state.allRMSEventsFetched = false
  },
  CLEAR_ACS_EVENTS(state) {
    state.acsEvents = []
    state.allACSEventsFetched = false
  },
  SET_DASHBOARD_ITEMS(state, data) {
    state.frequency = { ...data.alarmCount }
    state.loadCount = { ...data.dcLoadCount }
  },
  CLEAR_COUNTS(state) {
    state.frequency = {}
    state.loadCount = {
      DOWN: {
        [SITE_TENANT.BANGLALINK]: 0,
        [SITE_TENANT.ROBI]: 0,
        [SITE_TENANT.GRAMEENPHONE]: 0,
        scom_rect_1: 0,
        scom_rect_2: 0,
        total: 0,
      },
      NORMAL: {
        [SITE_TENANT.BANGLALINK]: 0,
        [SITE_TENANT.ROBI]: 0,
        [SITE_TENANT.GRAMEENPHONE]: 0,
        scom_rect_1: 0,
        scom_rect_2: 0,
        total: 0,
      },
      OVER: {
        [SITE_TENANT.BANGLALINK]: 0,
        [SITE_TENANT.ROBI]: 0,
        [SITE_TENANT.GRAMEENPHONE]: 0,
        scom_rect_1: 0,
        scom_rect_2: 0,
        total: 0,
      },
    }
  },
  SET_FETCHING_DASHBOARD(state, flag) {
    state.fetchingDashboard = flag
  },
  SET_AVAILABILITY_DATA(state, list) {
    state.availabilityData = list
  },
  SET_POWER_DATA(state, list) {
    state.powerData = list
  },
  SET_SELECTED_TAB(state, tab) {
    state.selectedTab = tab
  },
  SET_SELECTED_SITE(state, site) {
    state.selectedSite = site
  },
  SET_SELECTED_LOAD_COUNT_ITEM(state, { key, value }) {
    state.selectedLoadCountItem[key] = value
  },
  SET_AVAILABILITY_GRAPH_DATE(state, date) {
    state.availabilityGraphDate = date
  },
  CLEAR_LOAD_DASHBOARD(state) {
    state.availabilityData = []
    state.powerData = []
    state.selectedTab = null
    state.selectedLoadCountItem = {
      site: null,
      range: { id: 1, start: -1, end: 2 },
      type: 'sites',
      date: {
        start: sub(startOfToday(), { days: 7 }),
        end: startOfToday(),
      },
    }
    state.availabilityGraphDate = {
      start: sub(startOfToday(), { days: 7 }),
      end: startOfToday(),
    }
  },
  SET_SELECTED_TENANT(state, tenant) {
    state.selectedTenant = tenant
  },
}

export const actions = {
  publishPowerDashboard({ commit }, data) {
    commit('SET_POWER_DASHBOARD', data)
  },
  publishDCPowerDashboard({ commit, dispatch }, data) {
    dispatch('updateDCLoadStatusCount')
    commit('SET_DC_POWER_DASHBOARD', data)
  },
  publishAccessDashboard({ commit }, data) {
    commit('SET_ACCESS_DASHBOARD', data)
  },
  publishAlarmDashboard({ commit }, data) {
    commit('SET_ALARM_DASHBOARD', data)
  },

  publishMainsCount({ commit }, data) {
    commit('SET_MAINS', data)
  },
  publishDgCount({ commit }, data) {
    commit('SET_DG', data)
  },
  publishBatteryCount({ commit }, data) {
    commit('SET_BATTERY', data)
  },
  publishTemperatureCount({ commit }, data) {
    commit('SET_TEMPERATURE', data)
  },
  publishSiteEvent({ commit, rootGetters, rootState }, event) {
    const siteUids = rootGetters['site/siteUids']
    const publishableToSite = siteUids.includes(event.siteUid.toString())

    const allowedTenants = rootGetters['user/allowedTenants']
    const ofPublishableTenant = checkEventInclusivity(event, allowedTenants)

    const isReadOnlyUser = rootState.auth.user.type === 'read_only' && allowedTenants.length === 1
    const isReadOnlyEvent = readOnlyUserEvents.includes(event.name)

    if (publishableToSite && ofPublishableTenant && (isReadOnlyUser ? isReadOnlyEvent : true)) {
      commit('PREPEND_EVENT', event)
    }
  },

  async getStatusCounts({ commit, dispatch }, userUid) {
    const res = await this.$axios.$get('/user/site/status-counts', {
      params: { user_uid: userUid },
    })

    dispatch('updateDCLoadStatusCount')

    commit('SET_POWER_DASHBOARD', res.power)
    commit('SET_ALARM_DASHBOARD', res.alarm)
    commit('SET_ACCESS_DASHBOARD', res.access)

    commit('SET_DG', res.dg)
    commit('SET_MAINS', res.mains)
    commit('SET_BATTERY', res.battery)
    commit('SET_TEMPERATURE', res.temperature)
  },

  async excelExport({ commit }, options) {
    const res = await this.$axios.$post('/site/excel-export', options, {
      responseType: 'arraybuffer',
    })
    downloadFile(res, `${options.file_name}.xlsx`)
  },

  /**
   * group = 'RMS' / 'ACS'
   */
  async getEvents({ commit, state, rootGetters }, { userUid, group }) {
    // FIX: Vue component is mounted twice & calling this action twice.
    // to fix this, I called with the same oldestId. Find the bug for twice mounting
    // const oldestId = state.events.reduce((acc, e) => Math.min(acc, e.id), Math.pow(2, 31) - 1)
    const limit = 100
    let oldestId = Math.pow(2, 31) - 1
    const allowedTenants = rootGetters['user/allowedTenants']

    if (group === 'RMS' && state.rmsEvents.length) {
      oldestId = state.rmsEvents[state.rmsEvents.length - 1].id
    } else if (group === 'ACS' && state.acsEvents.length) {
      oldestId = state.acsEvents[state.acsEvents.length - 1].id
    } else if (group === 'ALL' && state.allEvents.length) {
      oldestId = state.allEvents[state.allEvents.length - 1].id
    }
    const res = await this.$axios.$get('/user/network/events', {
      params: { userUid, oldestId, group, limit, tenants: allowedTenants },
    })
    commit('ADD_EVENTS', { list: res, group, limit, count: res.length })
  },

  updateAlarmDashboard({ commit, rootGetters }) {
    const frequency = rootGetters['site/sites'].reduce((accumulator, site) => {
      site.alarms.forEach(alarm => {
        if (alarm.isAvailable && !alarm.isNormal) {
          const tenant = alarm.tenant || SITE_TENANT.BANGLALINK
          const canAppendTenant = powerAlarms.includes(alarm.id)
          let alarmName = alarm.id
          if (canAppendTenant) {
            alarmName = `${alarm.id}_${tenant}`
          }
          accumulator[alarmName] = (accumulator[alarmName] || 0) + 1
        }
      })
      return accumulator
    }, {})

    commit('SET_ALAMRS_COUNT', frequency)
  },

  updateDCLoadStatusCount({ commit, rootGetters }) {
    const sites = rootGetters['site/sites']
    const statusCount = {
      DOWN: {
        [SITE_TENANT.BANGLALINK]: 0,
        [SITE_TENANT.ROBI]: 0,
        [SITE_TENANT.GRAMEENPHONE]: 0,
        scom_rect_1: 0,
        scom_rect_2: 0,
        total: 0,
      },
      NORMAL: {
        [SITE_TENANT.BANGLALINK]: 0,
        [SITE_TENANT.ROBI]: 0,
        [SITE_TENANT.GRAMEENPHONE]: 0,
        scom_rect_1: 0,
        scom_rect_2: 0,
        total: 0,
      },
      OVER: {
        [SITE_TENANT.BANGLALINK]: 0,
        [SITE_TENANT.ROBI]: 0,
        [SITE_TENANT.GRAMEENPHONE]: 0,
        scom_rect_1: 0,
        scom_rect_2: 0,
        total: 0,
      },
    }

    sites.forEach(site => {
      site.dc_load.forEach(load => {
        statusCount[load.value][load.tenant || SITE_TENANT.BANGLALINK]++
        statusCount[load.value].total++
      })
    })

    commit('SET_LOAD_COUNT_STATUS', statusCount)
  },
  async getDashboardItemCount({ commit }, query) {
    commit('SET_FETCHING_DASHBOARD', true)
    try {
      const res = await this.$axios.$get('user/network/dashboard-count', {
        params: query,
      })
      if (res.siteCount) {
        commit('site/SET_SITE_COUNTS', res.siteCount, { root: true })
      }
      commit('SET_DASHBOARD_ITEMS', res)
    } catch (error) {}
    commit('SET_FETCHING_DASHBOARD', false)
  },
  async getAvailabilityData({ commit }, query) {
    try {
      const res = await this.$axios.$get('user/network/availability', {
        params: query,
      })
      commit('SET_AVAILABILITY_DATA', res)
    } catch (error) {}
  },
  async getPowerData({ commit, rootGetters }, query) {
    try {
      const res = await this.$axios.$get('battery/power/avg-load', {
        params: query,
      })
      commit('SET_POWER_DATA', res)
    } catch (error) {}
  },
}
