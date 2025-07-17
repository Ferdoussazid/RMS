import _ from 'lodash'
import fuzzysearch from 'fuzzysearch'
import { differenceInMinutes } from 'date-fns'
import { powerAlarms, powerEvents } from './AlarmHelper'
import { SITE_TENANT } from './Constant'

export const filterSiteListByTextSearch = (items, search) => {
  const searchQuery = search.trim().toLowerCase()
  return items.filter(s => {
    const nameMatched = fuzzysearch(searchQuery, s.name.toLowerCase())

    const genericId = (_.get(s, 'meta.generic_site_id', '') || '').toLowerCase()
    const genericIdMatched = fuzzysearch(searchQuery, genericId)

    const zoneText = [
      _.get(s, 'place.thana', '') || '',
      _.get(s, 'place.district', '') || '',
      _.get(s, 'place.division', '') || '',
    ]
      .filter(v => !!v.trim())
      .join(' ')
      .toLowerCase()
    const zoneMatched = fuzzysearch(searchQuery, zoneText)

    return nameMatched || genericIdMatched || zoneMatched
  })
}

export const siteListAlphabeticSort = (a, b) => {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}

export const filterExpectedAlarms = (alarms, expectedAlarm) => {
  const { id, tenant } = expectedAlarm
  if (powerAlarms.includes(id) && tenant !== undefined) {
    let filteredAlarms = alarms.filter(isAlarmOfTenant(expectedAlarm))
    if (!filteredAlarms.length && tenant === SITE_TENANT.BANGLALINK) {
      filteredAlarms = alarms.filter(isAlarmOfNullTenant(expectedAlarm))
    }
    return filteredAlarms
  }
  return alarms.filter(isAlarm(expectedAlarm))
}

export const findExpectedAlarm = (alarms, expectedAlarm) => {
  const { id, tenant } = expectedAlarm
  if (powerAlarms.includes(id) && tenant) {
    let alarm = alarms.find(isAlarmOfTenant(expectedAlarm))

    if (!alarm && tenant === SITE_TENANT.BANGLALINK) {
      alarm = alarms.find(isAlarmOfNullTenant(expectedAlarm))
    }
    return alarm
  }
  return alarms.find(isAlarm(expectedAlarm))
}
export const findExpectedAlarmForRectifier = (alarms, expectedAlarm) => {
  const alarm = alarms.find(alarmItem => alarmItem.id === expectedAlarm.id && alarmItem.tenant === expectedAlarm.tenant)
  return alarm
}

const createAlarmFilter = expectedAlarm => alarm => {
  const { id, tenant, expected, minDuration, maxDuration } = expectedAlarm
  if (alarm.id !== id) {
    return false
  }
  if (tenant !== undefined && alarm.tenant !== tenant) {
    return false
  }
  if (+expected === 1 && alarm.isNormal !== true) {
    return false
  }
  if (+expected === 0 && alarm.isNormal !== false) {
    return false
  }
  const alarmStartTime = new Date(alarm.lastEvent)
  const alarmDuration = differenceInMinutes(new Date(), alarmStartTime)
  if (minDuration !== undefined && alarmDuration < +minDuration) {
    return false
  }
  if (maxDuration !== undefined && alarmDuration >= +maxDuration) {
    return false
  }
  return true
}

const isAlarm = alarm =>
  createAlarmFilter({
    id: alarm.id,
    tenant: undefined,
    expected: alarm.expected,
    minDuration: alarm.minDuration,
    maxDuration: alarm.maxDuration,
  })
const isAlarmOfTenant = alarm =>
  createAlarmFilter({
    id: alarm.id,
    tenant: alarm.tenant,
    expected: alarm.expected,
    minDuration: alarm.minDuration,
    maxDuration: alarm.maxDuration,
  })
const isAlarmOfNullTenant = alarm =>
  createAlarmFilter({
    id: alarm.id,
    tenant: null,
    expected: alarm.expected,
    minDuration: alarm.minDuration,
    maxDuration: alarm.maxDuration,
  })

export const siteListEventTimeSort = filter => {
  return (a, b) => {
    const alarmA = findExpectedAlarm(a.alarms, filter)
    const alarmB = findExpectedAlarm(b.alarms, filter)

    let timeA = 0
    let timeB = 0

    if (alarmA && alarmA.lastEvent) {
      timeA = new Date(alarmA.lastEvent).getTime()
    }
    if (alarmB && alarmB.lastEvent) {
      timeB = new Date(alarmB.lastEvent).getTime()
    }
    if (timeA < timeB) return -1
    if (timeA > timeB) return 1
    return 0
  }
}

export const checkAlarmInclusivity = (alarm, tenants) => {
  const tenant = alarm.tenant || SITE_TENANT.BANGLALINK
  const isTenantAgnostic = !powerAlarms.includes(alarm.id)
  return isTenantAgnostic || tenants.includes(tenant)
}

export const checkEventInclusivity = (event, tenants) => {
  const tenant = event.tenant || SITE_TENANT.BANGLALINK
  const isTenantAgnostic = !powerEvents.includes(event.name)
  return isTenantAgnostic || tenants.includes(tenant)
}

export const filterAllowedTenantsOfSite = (siteTenants, allowedTenants) => {
  return siteTenants.filter(tenant => allowedTenants.includes(tenant))
}

export const getTenantListFromAlarms = (site, filter) => {
  const alarmName = _.get(filter, 'id', null)
  if (!powerAlarms.includes(alarmName)) {
    return site.tenants
  }
  const runningAlarms = filterExpectedAlarms(site.alarms, {
    id: alarmName,
    expected: filter.expected,
    minDuration: filter.minDuration,
    maxDuration: filter.maxDuration,
  })
  const tenants = runningAlarms.map(alarm => alarm.tenant || SITE_TENANT.BANGLALINK)
  return tenants
}

export const getTenantListfromProperties = (site, filter) => {
  const expectedValue = _.get(filter, 'expected', null)
  const tenants = site.dc_load
    .filter(d => {
      const isExpectedValue = d.value === expectedValue
      const tenant = d.tenant || SITE_TENANT.BANGLALINK
      const isTenant = site.tenants.includes(tenant)
      return isExpectedValue && isTenant
    })
    .map(d => d.tenant || SITE_TENANT.BANGLALINK)
  return tenants
}

export const getTenantsFromFilters = (site, filters) => {
  const filterType = _.get(filters[0], 'type', null)
  const siteTenants = site.tenants || []
  const filterName = _.get(filters[0], 'id', null)
  const isDcLoadProperty = filterName === 'dc_load'
  const filterTenantName = _.get(filters[0], 'tenant', null)

  if (filterTenantName) {
    return siteTenants.filter(s => s === filterTenantName)
  }

  if (filterType === 'property' && isDcLoadProperty) {
    return getTenantListfromProperties(site, filters[0])
  }

  if (filterType === 'alarm') {
    return _.uniq(getTenantListFromAlarms(site, filters[0]))
  }

  return siteTenants
}

export const sortPinsByTenant = (a, b) => {
  if (a.type < b.type) return -1
  if (a.type > b.type) return 1
  if (a.tenant < b.tenant) return -1
  if (a.tenant > b.tenant) return 1
  return 0
}

export const getSnapshotValue = ({ type, snapshotName, expected }) => {
  if (type === 'alarm') {
    const snapshotToValue = {
      door_status: {
        0: 'OPEN',
        1: 'CLOSE',
      },
      dg_status: {
        0: 'ON',
        1: 'OFF',
      },
      pg_status: {
        0: 'ON',
        1: 'OFF',
      },
      mains_status: {
        0: 'OFF',
        1: 'ON',
      },
      lt_mains_status: {
        0: 'OFF',
        1: 'ON',
      },
      mdb_fault: {
        0: 'YES',
        1: 'NO',
      },
      battery_status: {
        0: 'OFF',
        1: 'ON',
      },
      site_down: {
        0: 'YES',
        1: 'NO',
      },
      mains_fail: {
        0: 'YES',
        1: 'NO',
      },
      dc_low_voltage: {
        0: 'YES',
        1: 'NO',
      },
      dc_critical_voltage: {
        0: 'YES',
        1: 'NO',
      },
      critical_disconnect: {
        0: 'YES',
        1: 'NO',
      },
      dc_power_fail: {
        0: 'YES',
        1: 'NO',
      },
      rectifier_fail: {
        0: 'YES',
        1: 'NO',
      },
      high_temperature: {
        0: 'YES',
        1: 'NO',
      },
      aviation_light_fail: {
        0: 'YES',
        1: 'NO',
      },
      solar_control_fail: {
        0: 'YES',
        1: 'NO',
      },
      dg_low_fuel: {
        0: 'YES',
        1: 'NO',
      },
      dg_start_fail: {
        0: 'YES',
        1: 'NO',
      },
      lock_status: {
        0: 'OPEN',
        1: 'CLOSE',
      },
      lock_open_fail: {
        0: 'YES',
        1: 'NO',
      },
      lock_close_fail: {
        0: 'YES',
        1: 'NO',
      },
      lock_fault: {
        0: 'YES',
        1: 'NO',
      },
      card_reader_fault: {
        0: 'YES',
        1: 'NO',
      },
      door_open_timeout: {
        0: 'YES',
        1: 'NO',
      },
      security_breach: {
        0: 'YES',
        1: 'NO',
      },
      vibration_level: {
        0: 'HIGH',
        1: 'LOW',
      },
      motion_level: {
        0: 'HIGH',
        1: 'LOW',
      },
      device_online: {
        0: 'NO',
        1: 'YES',
      },
      ac_line_fail: {
        0: 'YES',
        1: 'NO',
      },
      dc_load_fail: {
        0: 'YES',
        1: 'NO',
      },
      solar_power_generation_fail: {
        0: 'YES',
        1: 'NO',
      },
      smoke: {
        0: 'YES',
        1: 'NO',
      },
      water: {
        0: 'YES',
        1: 'NO',
      },
      dc_fan_fault: {
        0: 'YES',
        1: 'NO',
      },
    }

    if (expected === undefined) {
      return null
    }

    if (!snapshotToValue[snapshotName]) {
      return null
    }

    return snapshotToValue[snapshotName][expected]
  }

  if (snapshotName === 'devices') {
    return null
  }

  return expected
}
