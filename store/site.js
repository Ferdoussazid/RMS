import _, { get, uniq } from 'lodash'
import { emergencyAlarms, powerEvents } from '~/assets/js/AlarmHelper'
import { SITE_ALARM, SITE_EVENT, USER_TYPE } from '~/assets/js/Constant'
import { ALARM_TO_SNAPSHOT_PROP, monitoringUsers } from '~/assets/js/Helper'
import { checkAlarmInclusivity, getSnapshotValue } from '~/assets/js/SiteHelper'

export const state = () => ({
  sites: [],
  paginatedSites: [],
  // siteInfoList: [],
  fetchingPaginatedSites: false,
  hasMoreSites: true,

  eventsLoading: false,
  events: [],

  alarmsLoading: false,
  alarms: [], // alarms of current site

  availability: [], // availability of current site
  siteConfig: null, // current site

  tasks: [],

  focusedSite: null,
  focusedTenant: null,

  /**
   * This mapping is used for finding the site id of an Event
   * Object.create(null) creates an empty object
   */
  siteUid2Name: Object.create(null),
  siteUids: [],
  allEventsFetched: false,
  siteDownHistory: [],
  siteCount: { total: 0, rms: 0, acs: 0, rectifier: 0, sarbs: 0, vertiv: 0, eltek: 0 },
  rectifierSites: [],
  fetchingSites: false,
  showSecurityBreachClearModal: false,
})

export const getters = {
  rectifierSites(state) {
    return state.rectifierSites
  },
  paginatedSites(state) {
    return state.paginatedSites
  },
  // siteInfoList(state) {
  //   return state.siteInfoList
  // },
  fetchingPaginatedSites(state) {
    return state.fetchingPaginatedSites
  },
  hasMoreSites(state) {
    return state.hasMoreSites
  },

  sites(state) {
    return state.sites
  },
  siteCount(state) {
    return state.siteCount
  },
  eventsLoading(state) {
    return state.eventsLoading
  },
  events(state) {
    return state.events
  },

  alarmsLoading(state) {
    return state.alarmsLoading
  },
  getAlarmsOfGroup(state) {
    return group => {
      return state.alarms.filter(a => a.group === group)
    }
  },
  availability(state) {
    return state.availability
  },
  siteConfig(state) {
    return state.siteConfig
  },
  firstAvailableUserUid(state) {
    for (const site of state.sites) {
      if (site.user_uid) {
        return site.user_uid
      }
    }
    return 0
  },

  tasks(state) {
    return state.tasks
  },

  siteUid2Name(state) {
    return state.siteUid2Name
  },

  siteUids(state) {
    return state.siteUids
  },

  focusedSite(state) {
    return state.focusedSite
  },
  focusedTenant(state) {
    return state.focusedTenant
  },
  allEventsFetched(state) {
    return state.allEventsFetched
  },
  siteDownHistory(state) {
    return state.siteDownHistory
  },
  fetchingSites(state) {
    return state.fetchingSites
  },
  showSecurityBreachClearModal(state) {
    return state.showSecurityBreachClearModal
  },
}

export const mutations = {
  SET_RECTIFEER_SITES(state, sites) {
    state.rectifierSites = sites
  },
  SET_SITES(state, sites) {
    state.paginatedSites = sites
  },
  ADD_SITES(state, sites) {
    state.paginatedSites = [...state.paginatedSites, ...sites]
  },
  // SET_SITE_INFO_LIST(state, sites) {
  //   state.siteInfoList = sites
  // },
  SET_FETCHING_SITES(state, status) {
    state.fetchingPaginatedSites = status
  },
  SET_HAS_MORE_SITES(state, status) {
    state.hasMoreSites = status
  },
  SET_SITE_CONFIG(state, { siteUid, site, pinConfigs, controls }) {
    const commercialIds = uniq(pinConfigs.map(conf => conf.com_id))
    state.siteConfig = { siteUid, site, devices: commercialIds, pinConfigs, controls }
  },

  SET_SITE_DIGITAL_CONTROLS(state, controls) {
    state.siteConfig = { ...state.siteConfig, controls }
  },

  SET_UNLOCK_SITE(state, controls) {
    state.siteConfig = { ...state.siteConfig, controls }
  },

  SET_SITE_LIST(state, list) {
    state.sites = list.map(l => ({ ...l }))
    state.siteUid2Name = list.reduce(
      (mapping, site) => ({
        ...mapping,
        [site.uid]: site.name,
      }),
      Object.create(null)
    )
    state.siteUids = Object.keys(state.siteUid2Name)
  },

  SET_SITE_EVENTS(state, list) {
    state.sites = state.sites.map(site => {
      const item = list.find(e => e.siteUid === site.uid)
      const events = item ? item.events : []
      return { ...site, events }
    })
  },

  SET_SITE_COUNTS(state, count) {
    state.siteCount = count
  },

  UPDATE_SITE_NAME(state, { siteUid, siteName }) {
    const index = state.sites.findIndex(site => site.uid === siteUid)
    if (index !== -1) {
      const temp = state.sites[index]
      temp.name = siteName
      state.sites.splice(index, 1, temp)

      if (state.siteConfig.siteUid === siteUid) {
        const tempConfig = state.siteConfig
        tempConfig.site = temp
        state.siteConfig = tempConfig
      }
    }
  },

  UPDATE_AVAILABILITY(state, percentage) {
    state.availability = percentage
  },

  SET_EVENTS_LOADING(state, flag) {
    state.eventsLoading = flag
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
    const index = state.events.findIndex(e => +e.id === +item.id)
    if (index === -1) {
      state.events = [item, ...state.events]
    } else {
      state.events.splice(index, 1, item)
    }
  },
  APPEND_SITE_DOWN_HISTORY(state, items) {
    state.siteDownHistory.push(...items)
  },
  CLEAR_EVENTS(state) {
    state.events = []
  },

  CACHE_SITE_EVENT(state, event) {
    const siteIndex = state.sites.findIndex(site => site.uid === event.siteUid)
    if (siteIndex > -1) {
      const site = state.sites[siteIndex]
      const eventIndex = site.events.findIndex(e => e.name === event.name && e.tenant === event.tenant)
      const item = { ...event }

      if (eventIndex > -1) {
        site.events.splice(eventIndex, 1, item)
      } else {
        site.events.push(item)
      }

      state.sites.splice(siteIndex, 1, site)
    }
  },

  SET_ALARMS_LOADING(state, flag) {
    state.alarmsLoading = flag
  },
  SET_ALARMS(state, list) {
    state.alarms = list
  },
  SET_SITE_ALARMS(state, { siteUid, alarms }) {
    const index = state.sites.findIndex(site => site.uid === siteUid)
    if (index !== -1) {
      const temp = state.sites[index]
      temp.alarms = alarms
      state.sites.splice(index, 1, temp)
    }
  },

  UPDATE_SITE_STATUS(state, { siteUid, site, status, alarms }) {
    const index = state.sites.findIndex(s => s.uid === siteUid)
    const sitePrevInfo = state.sites.find(s => s.uid === siteUid)
    const devices = _.get(sitePrevInfo, 'devices', [])
    delete site.events
    const siteWithDevice = { ...site, devices }
    if (index !== -1) {
      const temp = { ...state.sites[index], ...siteWithDevice }
      if (temp.status !== status) {
        state.tasks.push({ id: siteUid, status, action: 'redraw' })
      }
      temp.status = status
      temp.alarms = alarms
      state.sites.splice(index, 1, temp)
      if (get(state.siteConfig, 'site.uid', '') === siteUid) {
        state.focusedSite = temp
      }
    }
  },

  UPDATE_SITE(state, site) {
    const index = state.sites.findIndex(s => s.uid === site.uid)
    if (index !== -1) {
      state.sites.splice(index, 1, site)
    } else {
      state.sites.push(site)
    }
  },

  CLEAR_TASKS(state) {
    state.tasks = []
  },

  CLEAR_COUNTS(state) {
    state.sites = []
    state.siteUids = []
    state.siteUid2Name = Object.create(null)
    state.siteCount = { total: 0, rms: 0, acs: 0, offline: 0 }
  },

  SET_FOCUSED_SITE(state, site) {
    state.focusedSite = { ...site, isHslDeviceVendor: site.device_vendor === null }
  },
  UPDATE_FOCUSED_SITE_PROPERTY(state, { prop, value }) {
    state.focusedSite[prop] = value
  },
  SET_FOCUSED_TENANT(state, tenant) {
    this.$cookiz.set('last_site_tenant', tenant)
    state.focusedTenant = tenant
  },
  SET_SITE_FETCH_STATUS(state, status) {
    state.fetchingSites = status
  },
  SET_SECURITY_BREACH_CLEAR_MODAL(state, status) {
    state.showSecurityBreachClearModal = status
  },
}

export const actions = {
  async fetchRectifierSites({ commit, rootGetters, dispatch, state }, { filters, page, limit }) {
    commit('SET_FETCHING_SITES', true)
    try {
      const userUid = rootGetters['user/rootUserUid']
      const params = {
        user_uid: userUid,
        event_name: filters.event_name,
        limit,
        with_devices: 'YES',
      }

      const { data } = await this.$axios.get('oem/api/site-list', {
        params,
      })

      const allSites = [...state.sites]

      // Map and filter sites based on matching `site_uid`
      const list = allSites
        .filter(site => data.some(apiSite => apiSite.site_uid === site.uid))
        .map(site => {
          // Find the matching API site
          const moreDetails = data.find(apiSite => apiSite.site_uid === site.uid)

          // Return the site with `more_details` key added
          return {
            ...site,
            more_details: moreDetails,
          }
        })

      commit('SET_SITES', list)
      commit('SET_HAS_MORE_SITES', data.length === limit)
    } catch (error) {
    } finally {
      commit('SET_FETCHING_SITES', false)
    }
  },
  async loadMoreRectifierSites({ commit, rootGetters, dispatch, state }, { filters, page, limit }) {
    commit('SET_FETCHING_SITES', true)
    try {
      const userUid = rootGetters['user/rootUserUid']
      const params = {
        user_uid: userUid,
        event_name: filters.event_name,
        limit,
        with_devices: 'YES',
      }

      const { data } = await this.$axios.get('oem/api/site-list', {
        params,
      })

      const allSites = [...state.sites]

      // Map and filter sites based on matching `site_uid`
      const list = allSites
        .filter(site => data.some(apiSite => apiSite.site_uid === site.uid))
        .map(site => {
          // Find the matching API site
          const moreDetails = data.find(apiSite => apiSite.site_uid === site.uid)

          // Return the site with `more_details` key added
          return {
            ...site,
            more_details: moreDetails,
          }
        })

      commit('ADD_SITES', list)
      commit('SET_HAS_MORE_SITES', data.length === limit)
    } catch (error) {
    } finally {
      commit('SET_FETCHING_SITES', false)
    }
  },

  async fetchSites({ commit, rootGetters, dispatch }, { filters, page, limit }) {
    commit('SET_FETCHING_SITES', true)
    try {
      const userUid = rootGetters['user/rootUserUid']
      const tenants = rootGetters['user/allowedTenants']
      const params = {
        user_uid: userUid,
        page,
        limit,
        with_devices: 'YES',
      }
      if (filters && filters.id) {
        const property = ALARM_TO_SNAPSHOT_PROP[filters.id]
        const value = getSnapshotValue({
          type: filters.type,
          snapshotName: property,
          expected: filters.expected,
        })
        if (property) {
          params.alarmName = property
        }
        if (value !== null) {
          params.alarmValue = value
        }
        if (filters.tenant) {
          params.tenant = filters.tenant
        }
      }

      const { data } = await this.$axios.get('/user/site/filter', {
        params,
      })
      const list = data.items.map(site => {
        return {
          ...site,
          tenants: site.tenants ? site.tenants.filter(tenant => tenants.includes(tenant)) : [],
        }
      })
      commit('SET_SITES', list)
      commit('SET_HAS_MORE_SITES', data.items.length === limit)
    } catch (error) {
    } finally {
      commit('SET_FETCHING_SITES', false)
    }
  },
  async loadMoreSites({ commit, rootGetters, dispatch }, { filters, page, limit }) {
    commit('SET_FETCHING_SITES', true)
    try {
      const userUid = rootGetters['user/rootUserUid']
      const tenants = rootGetters['user/allowedTenants']
      const params = {
        user_uid: userUid,
        page,
        limit,
        with_devices: 'YES',
      }
      if (filters && filters.id) {
        const property = ALARM_TO_SNAPSHOT_PROP[filters.id]
        const value = getSnapshotValue({
          type: filters.type,
          snapshotName: property,
          expected: filters.expected,
        })
        if (property) {
          params.alarmName = property
        }
        if (value !== null) {
          params.alarmValue = value
        }
        if (filters.tenant) {
          params.tenant = filters.tenant
        }
      }
      const { data } = await this.$axios.get('/user/site/filter', {
        params,
      })
      const list = data.items.map(site => {
        return {
          ...site,
          tenants: site.tenants ? site.tenants.filter(tenant => tenants.includes(tenant)) : [],
        }
      })
      commit('ADD_SITES', list)
      commit('SET_HAS_MORE_SITES', data.items.length === limit)
    } catch (error) {
    } finally {
      commit('SET_FETCHING_SITES', false)
    }
  },
  // async fetchSiteInfoList({ commit, rootGetters }) {
  //   try {
  //     const userUid = rootGetters['user/rootUserUid']
  //     const allowedTenants = rootGetters['user/allowedTenants']
  //     const { data } = await this.$axios.get('/user/site/fetch', {
  //       params: {
  //         user_uid: userUid,
  //         tenants: allowedTenants,
  //         page: 1,
  //         limit: 3000,
  //       },
  //     })
  //     commit('SET_SITE_INFO_LIST', data.items)
  //   } catch (error) {}
  // },
  async setupSites({ state, commit, dispatch, rootGetters, rootState }) {
    commit('SET_SITE_FETCH_STATUS', true)
    if ([USER_TYPE.SUDO, USER_TYPE.SUPPORT].includes(rootState.auth.user.type)) {
      await dispatch(
        'customer/getSiteList',
        {
          user_uid: '',
          page: 1,
          limit: 25,
          with_devices: 'YES',
        },
        { root: true }
      )
      await dispatch('getSiteList', {
        user_uid: '',
        page: 1,
        limit: 3000,
        with_devices: 'YES',
      })
      commit('SET_SITE_FETCH_STATUS', false)
    } else {
      const userUid = rootGetters['user/rootUserUid']
      const allowedTenants = rootGetters['user/allowedTenants']
      dispatch('dashboard/getDashboardItemCount', { userUid }, { root: true })
      await dispatch('getSiteList', {
        user_uid: userUid,
        page: 1,
        limit: 1000,
        with_devices: 'YES',
        tenants: allowedTenants,
      })
      commit('SET_SITE_FETCH_STATUS', false)
      // await dispatch('getSiteEvents', {
      //   user_uid: userUid,
      //   tenants: allowedTenants,
      // })
      if (state.sites.length) {
        const lastVisitedSiteUid = this.$cookiz.get('last_site_uid')
        const isValidSiteUid = state.sites.map(s => s.uid).includes(lastVisitedSiteUid)
        const activeSiteUid = isValidSiteUid ? lastVisitedSiteUid : state.sites[0].uid
        dispatch('dashboard/updateAlarmDashboard', state.sites, { root: true })
        await dispatch('getSiteConfig', activeSiteUid)
      }
    }
  },

  async getSiteList({ commit, dispatch, rootGetters }, query) {
    const allowedTenants = rootGetters['user/allowedTenants']
    const sites = await this.$axios.$get('/user/site/fetch', {
      params: query,
    })
    const list = sites.items.map(site => ({
      ...site,
      tenants: site.tenants ? site.tenants.filter(tenant => allowedTenants.includes(tenant)) : [],
    }))

    commit('SET_SITE_LIST', list)
    dispatch('getSiteCounts', list)
  },

  async updateSite({ commit, rootGetters }, siteUid) {
    const allowedTenants = rootGetters['user/allowedTenants']
    const query = {
      user_uid: '',
      site_uid: siteUid,
      page: 1,
      limit: 1,
      with_devices: 'YES',
    }
    const site = await this.$axios.$get('/user/site/fetch', {
      params: query,
    })
    if (site.items.length) {
      const updatedSite = {
        ...site.items[0],
        tenants: site.items[0].tenants ? site.items[0].tenants.filter(tenant => allowedTenants.includes(tenant)) : null,
      }
      commit('UPDATE_SITE', updatedSite)
    }
  },

  async getSiteEvents({ commit, state }, query) {
    const events = await this.$axios.$get('/user/network/last-events', {
      params: query,
    })
    commit('SET_SITE_EVENTS', events)
  },

  getSiteCounts({ commit }, list) {
    const sitesWithRms = list.filter(site => !!site.devices && !!site.devices.length)
    const sitesWithAcs = list.filter(
      site =>
        !!site.alarms.find(alarm => alarm.id === SITE_ALARM.DOOR_STATUS) &&
        !!site.alarms.find(alarm => alarm.id === SITE_ALARM.LOCK_STATUS)
    )
    const sitesWithRectifier = list.filter(site => site.rectifier && Object.keys(site.rectifier).length)

    let sitesWithSarbs = 0
    let sitesWithVertiv = 0
    let sitesWithEltek = 0

    if (sitesWithRectifier.length) {
      sitesWithSarbs = sitesWithRectifier.reduce((count, site) => {
        if (site.rectifier.rectifier_type === 'sarbs') count++
        if (site.rectifier.rectifier_type_2 === 'sarbs') count++
        return count
      }, 0)

      sitesWithVertiv = sitesWithRectifier.reduce((count, site) => {
        if (site.rectifier.rectifier_type === 'vertiv') count++
        if (site.rectifier.rectifier_type_2 === 'vertiv') count++
        return count
      }, 0)
      sitesWithEltek = sitesWithRectifier.reduce((count, site) => {
        if (site.rectifier.rectifier_type === 'eltek') count++
        if (site.rectifier.rectifier_type_2 === 'eltek') count++
        return count
      }, 0)
    }

    commit('SET_SITE_COUNTS', {
      total: list.length,
      rms: sitesWithRms.length,
      acs: sitesWithAcs.length,
      rectifier: sitesWithRectifier.length,
      sarbs: sitesWithSarbs,
      vertiv: sitesWithVertiv,
      eltek: sitesWithEltek,
    })
  },

  UpdateSiteCounts({ commit, state }) {
    const list = state.sites
    const sitesWithRms = list.filter(site => !!site.devices && !!site.devices.length)
    const sitesWithAcs = list.filter(
      site =>
        !!site.alarms.find(alarm => alarm.id === SITE_ALARM.DOOR_STATUS) &&
        !!site.alarms.find(alarm => alarm.id === SITE_ALARM.LOCK_STATUS)
    )
    const sitesWithRectifier = list.filter(site => site.rectifier && Object.keys(site.rectifier).length)

    let sitesWithSarbs = 0
    let sitesWithVertiv = 0

    if (sitesWithRectifier.length) {
      sitesWithSarbs = sitesWithRectifier.reduce((count, site) => {
        if (site.rectifier.rectifier_type === 'sarbs') count++
        if (site.rectifier.rectifier_type_2 === 'sarbs') count++
        return count
      }, 0)

      sitesWithVertiv = sitesWithRectifier.reduce((count, site) => {
        if (site.rectifier.rectifier_type === 'vertiv') count++
        if (site.rectifier.rectifier_type_2 === 'vertiv') count++
        return count
      }, 0)
    }

    commit('SET_SITE_COUNTS', {
      total: list.length,
      rms: sitesWithRms.length,
      acs: sitesWithAcs.length,
      rectifier: sitesWithRectifier.length,
      sarbs: sitesWithSarbs,
      vertiv: sitesWithVertiv,
    })
  },

  async getSiteDownHistory({ commit }, query) {
    const res = await this.$axios.$get('/user/site/down-history', { params: query })
    if (res) {
      commit('APPEND_SITE_DOWN_HISTORY', res)
    }
  },

  clearSiteDownHistory({ state }) {
    state.siteDownHistory.length = 0
  },

  publishSiteConfigUpdate({ commit, dispatch, state }, { site_uid: siteUid, site_name: siteName }) {
    commit('UPDATE_SITE_NAME', { siteUid, siteName })
    if (state.siteConfig.siteUid === siteUid) {
      dispatch('getSiteConfig', siteUid)
    }
    dispatch('getSiteCounts', state.sites)
  },

  publishSiteStatusUpdate({ commit, state, rootGetters, dispatch }, { siteUid, site, status, alarms }) {
    const tenants = rootGetters['user/allowedTenants']
    const alarmsOfAllowedTenants = alarms.filter(alarm => checkAlarmInclusivity(alarm, tenants))

    if (get(state.siteConfig, 'site.uid', '') === siteUid) {
      commit('SET_ALARMS', alarmsOfAllowedTenants)
    }
    const updatedSite = {
      ...site,
      tenants: site.tenants ? site.tenants.filter(tenant => tenants.includes(tenant)) : [],
    }
    commit('UPDATE_SITE_STATUS', {
      siteUid,
      site: updatedSite,
      status,
      alarms: alarmsOfAllowedTenants,
    })
  },

  publishSiteEvent({ commit, dispatch, state, rootGetters, rootState }, event) {
    const allowedTenants = rootGetters['user/allowedTenants']
    const userType = rootState.auth.user.type
    const isNOCUser = userType === USER_TYPE.READ_ONLY && allowedTenants.length !== 1

    const isMonitoringUser = monitoringUsers.includes(userType)
    const isEmergencyAlarm = emergencyAlarms.includes(event.name)
    if (isEmergencyAlarm && (isNOCUser || isMonitoringUser)) {
      this.$bus.$emit('emergency-alarm', event)
    }

    commit('CACHE_SITE_EVENT', event)

    const focusedSiteUid = get(state.siteConfig, 'site.uid', 0)
    let canPublish = event.siteUid === focusedSiteUid
    if (canPublish && powerEvents.includes(event.name)) {
      canPublish = canPublish && event.tenant === rootGetters['site/focusedTenant']
    }
    if (canPublish) {
      commit('PREPEND_EVENT', event)
      switch (event.name) {
        case SITE_EVENT.MAINS_OUTAGE:
          return dispatch('mains/publishEvent', event, { root: true })
        case SITE_EVENT.MAINS_FAIL:
          return dispatch('mains/publishEvent', event, { root: true })
        case SITE_EVENT.SITE_DOWN:
          return dispatch('mains/publishEvent', event, { root: true })
        case SITE_EVENT.RECTIFIER_FAIL:
          return dispatch('mains/publishEvent', event, { root: true })
        case SITE_EVENT.HIGH_TEMPERATURE:
          return dispatch('temperature/publishEvent', event, { root: true })
        case SITE_EVENT.BATTERY_POWER:
          return dispatch('battery/publishEvent', event, { root: true })
        case SITE_EVENT.DC_LOW_VOLTAGE:
          return dispatch('battery/publishEvent', event, { root: true })
        case SITE_EVENT.DC_FAIL:
          return dispatch('battery/publishEvent', event, { root: true })
        case SITE_EVENT.DOOR_OPEN:
          return dispatch('access/publishEvent', event, { root: true })
        case SITE_EVENT.DOOR_CLOSE:
          return dispatch('access/publishEvent', event, { root: true })
        case SITE_EVENT.LOCK_OPEN:
          return dispatch('access/publishEvent', event, { root: true })
        case SITE_EVENT.LOCK_CLOSE:
          return dispatch('access/publishEvent', event, { root: true })
        case SITE_EVENT.LOCK_CLOSE_FAIL:
          return dispatch('access/publishEvent', event, { root: true })
        case SITE_EVENT.LOCK_OPEN_FAIL:
          return dispatch('access/publishEvent', event, { root: true })
        case SITE_EVENT.LOCK_FAULT:
          return dispatch('access/publishEvent', event, { root: true })
        case SITE_EVENT.CARD_READER_FAULT:
          return dispatch('access/publishEvent', event, { root: true })
        case SITE_EVENT.SECURITY_BREACH:
          return dispatch('access/publishEvent', event, { root: true })
        case SITE_EVENT.HIGH_VIBRATION:
          return dispatch('access/publishEvent', event, { root: true })
        case SITE_EVENT.DG_POWER:
          return dispatch('generator/publishDGEvent', event, { root: true })
        case SITE_EVENT.PG_POWER:
          return dispatch('generator/publishPGEvent', event, { root: true })

        default:
          return null
      }
    }
  },

  async getSiteConfig({ state, commit, dispatch, rootGetters }, siteUid) {
    const res = await this.$axios.$get('/user/site/details', { params: { site_uid: siteUid } })
    const controls = await this.$axios.$get('/user/site/digital-control', { params: { site_uid: siteUid } })
    // TODO: Find the uses of 'controls' and possibly remove them in future
    const config = { siteUid, site: res.siteInfo, pinConfigs: res.pinConfigs, controls }
    commit('SET_SITE_CONFIG', config)

    const activeSite = state.sites.find(s => s.uid === siteUid)
    this.$cookiz.set('last_site_uid', siteUid)

    const allowedTenants = rootGetters['user/allowedTenants']

    const lastVisitedSiteTenant = this.$cookiz.get('last_site_tenant')
    const isValidSiteTenant = allowedTenants.includes(lastVisitedSiteTenant)
    const activeSiteTenant = isValidSiteTenant
      ? lastVisitedSiteTenant
      : activeSite.tenants.find(tenant => allowedTenants.includes(tenant))

    if (activeSite) {
      commit('SET_FOCUSED_TENANT', activeSiteTenant)
      commit('SET_FOCUSED_SITE', activeSite)
      // TODO: Revise the following action
      dispatch(
        'battery/publishBackupTime',
        {
          siteUid,
          batteryMax: activeSite.battery_max,
          batteryLeft: activeSite.battery_left,
        },
        { root: true }
      )
    }

    dispatch('access/initPins', config, { root: true })
    dispatch('mains/initPhases', config, { root: true })
    dispatch('generator/initPins', config, { root: true })
    dispatch('battery/initBatteryPins', config, { root: true })
    dispatch('temperature/initTemperature', config, { root: true })
    dispatch('temperature/initHumidity', config, { root: true })
    dispatch('user/startSession', config.siteUid, { root: true })
    dispatch('oem/clearOemData', {}, { root: true })
  },

  async updateDigitalControls({ commit }, data) {
    const controls = await this.$axios.$post('/site/digital-control', data)
    commit('SET_SITE_DIGITAL_CONTROLS', controls)
  },

  async unlockSite({ commit }, data) {
    const controls = await this.$axios.$post('/user/site/unlock', data)
    commit('SET_UNLOCK_SITE', controls)
  },

  async getAvailability({ commit }, { siteUid, date }) {
    const res = await this.$axios.$get('/battery/analytics/availability', {
      params: { site_uid: siteUid, date },
    })
    commit('UPDATE_AVAILABILITY', res)
  },

  /**
   * Called when user selects a site from Map by clicking it
   */
  focusSite({ commit }, site) {
    commit('SET_FOCUSED_SITE', site)
  },

  async getEvents({ commit, state, dispatch }, siteUid) {
    commit('SET_EVENTS_LOADING', true)

    const oldestId = state.events.length ? state.events[state.events.length - 1].id : Math.pow(2, 31) - 1
    const tenant = state.focusedTenant || undefined
    const res = await this.$axios.$get('/user/site/events', {
      params: { site_uid: siteUid, oldest_id: oldestId, tenant },
    })

    commit('ADD_EVENTS', { list: res, count: res.length })
    commit('SET_EVENTS_LOADING', false)
  },

  async getAlarms({ commit, rootGetters }, siteUid) {
    commit('SET_ALARMS_LOADING', true)

    const res = await this.$axios.$get('/user/site/alarms', {
      params: { site_uid: siteUid },
    })

    const allowedTenants = rootGetters['user/allowedTenants']
    const alarmsOfAllowedTenants = res.filter(a => checkAlarmInclusivity(a, allowedTenants))
    commit('SET_SITE_ALARMS', { siteUid, alarms: alarmsOfAllowedTenants })
    commit('SET_ALARMS_LOADING', false)
  },

  async clearSecurityBreach({ commit }, data) {
    await this.$axios.$post('/user/site/clear-security-breach', data, { root: true })
  },
  async clearLockOpenFail({ commit }, data) {
    await this.$axios.$post('/user/site/clear-lock-open-fail', data, { root: true })
  },
  setSecurityBreachClearModal({ commit }, status) {
    commit('SET_SECURITY_BREACH_CLEAR_MODAL', status)
  },
}
