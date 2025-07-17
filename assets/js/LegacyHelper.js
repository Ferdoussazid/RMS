const _ = require('lodash')
const { SITE_EVENT, SITE_ALARM, SITE_TENANT, COMPANY, SITE_PROPERTY, USER_TYPE } = require('./Constant')

module.exports = {
  RMS_EVENTS: [
    // SITE_EVENT.AC_FAIL,
    SITE_EVENT.MAINS_FAIL,
    'lt_mains_outage',
    SITE_EVENT.DC_LOW_VOLTAGE,
    SITE_EVENT.SITE_DOWN,
    SITE_EVENT.MDB_FAULT,
    SITE_EVENT.RECTIFIER_FAIL,
    SITE_EVENT.DC_FAIL,
    SITE_EVENT.DC_LOAD_FAIL,
    SITE_EVENT.MAINS_OUTAGE,
    SITE_EVENT.DC_CRITICAL_VOLTAGE,
    SITE_EVENT.DC_OVERLOAD,
    SITE_EVENT.DEVICE_OFFLINE,
    SITE_EVENT.INVERTER_BATTERY_LOW,
  ],

  ENV_EVENTS: [
    SITE_EVENT.DG_POWER,
    SITE_EVENT.PG_POWER,
    SITE_EVENT.HIGH_TEMPERATURE,
    SITE_EVENT.AVIATION_LIGHT_FAIL,
    SITE_EVENT.SMOKE_DETECTION,
    SITE_EVENT.WATER_DETECTION,
    SITE_EVENT.DC_FAN_FAULT,
  ],
  ACS_EVENTS: [
    SITE_EVENT.DOOR_OPEN,
    SITE_EVENT.LOCK_OPEN,
    SITE_EVENT.SECURITY_BREACH,
    SITE_EVENT.HIGH_MOTION,
    SITE_EVENT.LOCK_FAULT,
    SITE_EVENT.CARD_READER_FAULT,
  ],

  getSiteEventLabel: eventName => {
    const labels = {
      // [SITE_EVENT.AC_FAIL]: 'AC Fail',
      [SITE_EVENT.DC_FAIL]: 'DC Fail',
      lt_mains_outage: 'Long Term MF',
      [SITE_EVENT.DG_POWER]: 'DG Power',
      [SITE_EVENT.PG_POWER]: 'PG Power',
      [SITE_EVENT.SITE_DOWN]: 'Site Down',
      [SITE_EVENT.MAINS_FAIL]: 'Mains Fail',
      [SITE_EVENT.MAINS_OUTAGE]: 'AC Line Fail',
      // [SITE_EVENT.LT_MAINS_OUTAGE]: 'Long Term MF',
      [SITE_EVENT.BATTERY_POWER]: 'Battery Power',
      [SITE_EVENT.HIGH_TEMPERATURE]: 'High Temperature',
      [SITE_EVENT.DC_LOW_VOLTAGE]: 'DC Low Voltage',
      [SITE_EVENT.DC_CRITICAL_VOLTAGE]: 'Battery Critical',
      [SITE_EVENT.DC_LOAD_FAIL]: 'DC Load Fail',
      [SITE_EVENT.AVIATION_LIGHT_FAIL]: 'Aviation Light Fail',
      [SITE_EVENT.RECTIFIER_FAIL]: 'Rectifier Fail',
      [SITE_EVENT.MDB_FAULT]: 'MDB Fault',
      [SITE_EVENT.DOOR_OPEN]: 'Door Open',
      [SITE_EVENT.LOCK_OPEN]: 'Lock Open',
      [SITE_EVENT.LOCK_CLOSE_FAIL]: 'Lock Close Fail',
      [SITE_EVENT.LOCK_OPEN_FAIL]: 'Lock Open Fail',
      [SITE_EVENT.LOCK_FAULT]: 'Lock Fault',
      [SITE_EVENT.CARD_READER_FAULT]: 'Card Reader Fault',
      [SITE_EVENT.SECURITY_BREACH]: 'Security Breach',
      [SITE_EVENT.HIGH_VIBRATION]: 'Vibration',
      [SITE_EVENT.HIGH_MOTION]: 'High Motion',
      [SITE_EVENT.DC_FAN_FAULT]: 'DC Fan Fault',
      [SITE_EVENT.WATER_DETECTION]: 'Water Detected',
      [SITE_EVENT.SMOKE_DETECTION]: 'Smoke Detected',
      [SITE_EVENT.DEVICE_OFFLINE]: 'Device Offline',
      [SITE_EVENT.DC_OVERLOAD]: 'DC Overload',
      [SITE_EVENT.INVERTER_BATTERY_LOW]: 'Inverter Battery Low',
    }

    return labels[eventName] || ''
  },

  getSiteEventNameFromAlarm(alarmName) {
    const mapping = {
      [SITE_ALARM.SITE_DOWN]: SITE_EVENT.SITE_DOWN,
      [SITE_ALARM.MAINS_FAIL]: SITE_EVENT.MAINS_FAIL,
      [SITE_ALARM.AC_LINE_FAIL]: SITE_EVENT.MAINS_OUTAGE,
      // [SITE_ALARM.LT_AC_LINE_FAIL]: SITE_EVENT.LT_MAINS_OUTAGE,
      [SITE_ALARM.DC_POWER_FAIL]: SITE_EVENT.DC_FAIL,
      [SITE_ALARM.DC_LOW_VOLTAGE]: SITE_EVENT.DC_LOW_VOLTAGE,
      [SITE_ALARM.SITE_ON_BATTERY]: SITE_EVENT.BATTERY_POWER,
      [SITE_ALARM.DC_FAN_FAULT]: SITE_EVENT.DC_FAN_FAULT,
      [SITE_ALARM.DEVICE_ONLINE]: SITE_EVENT.DEVICE_OFFLINE,
      [SITE_ALARM.DC_LOAD_FAIL]: SITE_EVENT.DC_LOAD_FAIL,
      [SITE_ALARM.DOOR_STATUS]: SITE_EVENT.DOOR_OPEN,
      [SITE_ALARM.LOCK_STATUS]: SITE_EVENT.LOCK_OPEN,
      [SITE_ALARM.LOCK_OPEN_FAIL]: SITE_EVENT.LOCK_OPEN_FAIL,
      [SITE_ALARM.LOCK_CLOSE_FAIL]: SITE_EVENT.LOCK_CLOSE_FAIL,
      [SITE_ALARM.LOCK_FAULT]: SITE_EVENT.LOCK_FAULT,
      [SITE_ALARM.CARD_READER_FAULT]: SITE_EVENT.CARD_READER_FAULT,
      [SITE_ALARM.MDB_FAULT]: SITE_EVENT.MDB_FAULT,
      [SITE_ALARM.INVERTER_BATTERY_LOW]: SITE_EVENT.INVERTER_BATTERY_LOW,
      // [SITE_ALARM.DOOR_OPEN_TIMEOUT]: SITE_EVENT.DOOR_OPEN_TIMEOUT,
      // [SITE_ALARM.LOCK_FAULT]: SITE_EVENT.,
      [SITE_ALARM.VIBRATION]: SITE_EVENT.HIGH_VIBRATION,
      [SITE_ALARM.MOTION]: SITE_EVENT.HIGH_MOTION,
      [SITE_ALARM.SECURITY_BREACH]: SITE_EVENT.SECURITY_BREACH,
      [SITE_ALARM.HIGH_TEMPERATURE]: SITE_EVENT.HIGH_TEMPERATURE,
      [SITE_ALARM.WATER]: SITE_EVENT.WATER_DETECTION,
      [SITE_ALARM.SMOKE]: SITE_EVENT.SMOKE_DETECTION,
      [SITE_ALARM.DG_ON]: SITE_EVENT.DG_POWER,
      [SITE_ALARM.PG_ON]: SITE_EVENT.PG_POWER,
      [SITE_ALARM.AVIATION_LIGHT_FAIL]: SITE_EVENT.AVIATION_LIGHT_FAIL,
      [SITE_ALARM.RECTIFIER_FAIL]: SITE_EVENT.RECTIFIER_FAIL,
      [SITE_PROPERTY.DC_LOAD]: SITE_EVENT.DC_OVERLOAD,
      // [SITE_ALARM.SOLAR_POWER_GENERATION_FAIL]: SITE_EVENT.,
      // [SITE_ALARM.SOLAR_CONTROL_FAIL]: SITE_EVENT.,
    }

    return mapping[alarmName] || ''
  },

  getAlarmFromEvent(eventName) {
    const mapping = {
      [SITE_EVENT.SITE_DOWN]: SITE_ALARM.SITE_DOWN,
      [SITE_EVENT.MAINS_FAIL]: SITE_ALARM.MAINS_FAIL,
      [SITE_EVENT.MAINS_OUTAGE]: SITE_ALARM.AC_LINE_FAIL,
      [SITE_EVENT.INVERTER_BATTERY_LOW]: SITE_ALARM.INVERTER_BATTERY_LOW,
      // [SITE_EVENT.LT_MAINS_OUTAGE]:SITE_ALARM.LT_AC_LINE_FAIL ,
      [SITE_EVENT.DC_FAIL]: SITE_ALARM.DC_POWER_FAIL,
      [SITE_EVENT.DC_LOW_VOLTAGE]: SITE_ALARM.DC_LOW_VOLTAGE,
      [SITE_EVENT.BATTERY_POWER]: SITE_ALARM.SITE_ON_BATTERY,
      [SITE_EVENT.DC_FAN_FAULT]: SITE_ALARM.DC_FAN_FAULT,
      [SITE_EVENT.DEVICE_OFFLINE]: SITE_ALARM.DEVICE_ONLINE,
      [SITE_EVENT.DC_LOAD_FAIL]: SITE_ALARM.DC_LOAD_FAIL,
      [SITE_EVENT.DOOR_OPEN]: SITE_ALARM.DOOR_STATUS,
      [SITE_EVENT.LOCK_OPEN]: SITE_ALARM.LOCK_STATUS,
      [SITE_EVENT.LOCK_OPEN_FAIL]: SITE_ALARM.LOCK_OPEN_FAIL,
      [SITE_EVENT.LOCK_CLOSE_FAIL]: SITE_ALARM.LOCK_CLOSE_FAIL,
      [SITE_EVENT.LOCK_FAULT]: SITE_ALARM.LOCK_FAULT,
      [SITE_EVENT.CARD_READER_FAULT]: SITE_ALARM.CARD_READER_FAULT,
      [SITE_EVENT.MDB_FAULT]: SITE_ALARM.MDB_FAULT,
      // [SITE_EVENT.DOOR_OPEN_TIMEOUT]:SITE_ALARM.DOOR_OPEN_TIMEOUT ,
      [SITE_EVENT.HIGH_VIBRATION]: SITE_ALARM.VIBRATION,
      [SITE_EVENT.HIGH_MOTION]: SITE_ALARM.MOTION,
      [SITE_EVENT.SECURITY_BREACH]: SITE_ALARM.SECURITY_BREACH,
      [SITE_EVENT.HIGH_TEMPERATURE]: SITE_ALARM.HIGH_TEMPERATURE,
      [SITE_EVENT.WATER_DETECTION]: SITE_ALARM.WATER,
      [SITE_EVENT.SMOKE_DETECTION]: SITE_ALARM.SMOKE,
      [SITE_EVENT.DG_POWER]: SITE_ALARM.DG_ON,
      [SITE_EVENT.PG_POWER]: SITE_ALARM.PG_ON,
      [SITE_EVENT.AVIATION_LIGHT_FAIL]: SITE_ALARM.AVIATION_LIGHT_FAIL,
      [SITE_EVENT.RECTIFIER_FAIL]: SITE_ALARM.RECTIFIER_FAIL,
      [SITE_EVENT.DC_OVERLOAD]: SITE_PROPERTY.DC_LOAD,
    }
    return mapping[eventName] || ''
  },

  getColorOfPieLabel(label) {
    const colors = {
      ac_line_fail_banglalink: '#FC766AFF',
      ac_line_fail_robi: '#F13C59',
      ac_line_fail_grameenphone: '#F95700FF',
      mains_available: '#2ed573',
      dg_on: '#7770F1',
      pg_on: '#2D87BB',

      dc_low_voltage_banglalink: '#F2AA4CFF',
      dc_low_voltage_robi: '#CE4A7EFF',
      dc_low_voltage_grameenphone: '#0098F2',

      site_down_banglalink: '#7D2BD8',
      site_down_robi: '#00B5CC',
      site_down_grameenphone: '#0A9E9F',
    }

    return colors[label] || ''
  },

  getTenantLabel(tenant, isShortForm = true) {
    const shortForm = {
      [SITE_TENANT.BANGLALINK]: isShortForm ? 'BL' : 'Banglalink',
      [SITE_TENANT.GRAMEENPHONE]: isShortForm ? 'GP' : 'Grameenphone',
      [SITE_TENANT.ROBI]: 'Robi',
      [SITE_TENANT.TELETALK]: isShortForm ? 'TT' : 'Teletalk',
    }
    return shortForm[tenant] || ''
  },
  getTenantLogo(tenant) {
    switch (tenant) {
      case SITE_TENANT.GRAMEENPHONE:
        return '/image/gp.png'
      case SITE_TENANT.ROBI:
        return '/image/robi.svg'
      case SITE_TENANT.TELETALK:
        return '/image/teletalk.svg'
      default:
        return '/image/bl.png'
    }
  },

  getCompanyById(id) {
    const company = {
      21: COMPANY.HSL_DEMO,
      22: COMPANY.HSL_RND,
      23: COMPANY.KIRTONKHOLA_TOWERS_BD_LTD,
      24: COMPANY.FRONTIER_TOWERS_BD,
      27: COMPANY.SUMMIT_TOWERS_LTD,
      28: COMPANY.SUMMIT_TOWERS_LTD,
      29: COMPANY.SUMMIT_TOWERS_LTD,
      30: COMPANY.SUMMIT_COM,
    }
    return company[id] || ''
  },
  getCompanyByShortName(name) {
    const company = {
      [COMPANY.HSL_DEMO]: 21,
      [COMPANY.HSL_RND]: 22,
      [COMPANY.KIRTONKHOLA_TOWERS_BD_LTD]: 23,
      [COMPANY.FRONTIER_TOWERS_BD]: 24,
      [COMPANY.SUMMIT_TOWERS_LTD]: 27,
      [COMPANY.SUMMIT_TOWERS_LTD]: 28,
      [COMPANY.SUMMIT_TOWERS_LTD]: 28,
      [COMPANY.SUMMIT_COM]: 30,
    }
    return company[name] || ''
  },

  getCompanyLabel(company) {
    switch (company) {
      case COMPANY.KIRTONKHOLA_TOWERS_BD_LTD:
        return 'KTBL'
      case COMPANY.FRONTIER_TOWERS_BD:
        return 'FTB'
      case COMPANY.SUMMIT_TOWERS_LTD:
        return 'STL'
      case COMPANY.HSL_DEMO:
        return 'HSL Demo'
      case COMPANY.HSL_RND:
        return 'HSL R&D'
      case COMPANY.SUMMIT_COM:
        return 'Summit Com'
      default:
        return ''
    }
  },

  getUserTypeLabel(user) {
    const label = {
      [USER_TYPE.COMPANY]: 'Company',
      [USER_TYPE.EMPLOYEE]: 'Employee',
      [USER_TYPE.SUPPORT]: 'Ops',
      [USER_TYPE.SUPERUSER]: 'Superuser',
      [USER_TYPE.READ_ONLY]: 'Read Only',
      [USER_TYPE.SUDO]: 'Admin',
    }

    if (user.type === USER_TYPE.READ_ONLY && !user.tenants) {
      return 'NOC'
    }

    return label[user.type] || ''
  },

  getCompanyLogo(company) {
    switch (company) {
      case COMPANY.KIRTONKHOLA_TOWERS_BD_LTD:
        return '/image/atc.png'
      case COMPANY.FRONTIER_TOWERS_BD:
        return '/image/abht.png'
      case COMPANY.SUMMIT_TOWERS_LTD:
        return '/image/stl.png'
      default:
        return '/image/logo.png'
    }
  },

  getCompanySpecificEventLabel(companyName, eventName) {
    const eventLabel = {
      [SITE_EVENT.MAINS_OUTAGE]: 'AC Line Fail',
      [SITE_EVENT.DC_LOW_VOLTAGE]: 'DC Low Voltage',
    }
    if (companyName === COMPANY.FRONTIER_TOWERS_BD) {
      eventLabel[SITE_EVENT.MAINS_OUTAGE] = 'Grid Fail'
    } else if (companyName === COMPANY.SUMMIT_TOWERS_LTD) {
      eventLabel[SITE_EVENT.MAINS_OUTAGE] = 'Grid Fail'
      eventLabel[SITE_EVENT.DC_LOW_VOLTAGE] = 'Battery Low'
    }
    let companySpecificEventLabel = _.get(eventLabel, eventName, null)

    if (!companySpecificEventLabel) {
      const labels = {
        // [SITE_EVENT.AC_FAIL]: 'AC Fail',
        [SITE_EVENT.DC_FAIL]: 'DC Fail',
        lt_mains_outage: 'Long Term MF',
        [SITE_EVENT.DG_POWER]: 'DG Power',
        [SITE_EVENT.PG_POWER]: 'PG Power',
        [SITE_EVENT.SITE_DOWN]: 'Site Down',
        [SITE_EVENT.MAINS_FAIL]: 'Mains Fail',
        [SITE_EVENT.MAINS_OUTAGE]: 'AC Line Fail',
        [SITE_EVENT.INVERTER_BATTERY_LOW]: 'Inverter Battery Low',
        // [SITE_EVENT.LT_MAINS_OUTAGE]: 'Long Term MF',
        [SITE_EVENT.BATTERY_POWER]: 'Battery Power',
        [SITE_EVENT.HIGH_TEMPERATURE]: 'High Temperature',
        [SITE_EVENT.DC_LOW_VOLTAGE]: 'DC Low Voltage',
        [SITE_EVENT.DC_CRITICAL_VOLTAGE]: 'Battery Critical',
        [SITE_EVENT.DC_LOAD_FAIL]: 'DC Load Fail',
        [SITE_EVENT.AVIATION_LIGHT_FAIL]: 'Aviation Light Fail',
        [SITE_EVENT.RECTIFIER_FAIL]: 'Rectifier Fail',
        [SITE_EVENT.MDB_FAULT]: 'MDB Fault',
        [SITE_EVENT.DOOR_OPEN]: 'Door Open',
        [SITE_EVENT.LOCK_OPEN]: 'Lock Open',
        [SITE_EVENT.LOCK_CLOSE_FAIL]: 'Lock Close Fail',
        [SITE_EVENT.LOCK_OPEN_FAIL]: 'Lock Open Fail',
        [SITE_EVENT.LOCK_FAULT]: 'Lock Fault',
        [SITE_EVENT.CARD_READER_FAULT]: 'Card Reader Fault',
        [SITE_EVENT.SECURITY_BREACH]: 'Security Breach',
        [SITE_EVENT.HIGH_VIBRATION]: 'Vibration',
        [SITE_EVENT.HIGH_MOTION]: 'High Motion',
        [SITE_EVENT.DC_FAN_FAULT]: 'DC Fan Fault',
        [SITE_EVENT.WATER_DETECTION]: 'Water Detected',
        [SITE_EVENT.SMOKE_DETECTION]: 'Smoke Detected',
        [SITE_EVENT.DEVICE_OFFLINE]: 'Device Offline',
        [SITE_EVENT.DC_OVERLOAD]: 'DC Overload',
      }

      companySpecificEventLabel = labels[eventName] || ''
    }
    return companySpecificEventLabel
  },

  getCompanySpecificAlarmLabel(companyName, alarmName) {
    const alarmLabel = {
      [SITE_ALARM.AC_LINE_FAIL]: 'AC Line Fail',
      [SITE_ALARM.DC_LOW_VOLTAGE]: 'DC Low Voltage',
    }
    if (companyName === COMPANY.FRONTIER_TOWERS_BD) {
      alarmLabel[SITE_ALARM.AC_LINE_FAIL] = 'Grid Fail'
    } else if (companyName === COMPANY.SUMMIT_TOWERS_LTD) {
      alarmLabel[SITE_ALARM.AC_LINE_FAIL] = 'Grid Fail'
      alarmLabel[SITE_ALARM.DC_LOW_VOLTAGE] = 'Battery Low'
    }
    const companySpecificAlarmLabel = _.get(alarmLabel, alarmName, null)
    return companySpecificAlarmLabel
  },

  ALL_RMS_STATION_GRAPH_COLOR: {
    mains_fail: '#008FFB',
    pg_run: '#00E396',
    battery_low: '#FEB019',
    site_down: '#fb0064',
  },
}
