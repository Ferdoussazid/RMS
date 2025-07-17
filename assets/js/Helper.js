const _ = require('lodash')
const { SITE_EVENT, SITE_ALARM, SITE_TENANT, COMPANY, SITE_PROPERTY, USER_TYPE, SCOMM_TENANTS } = require('./Constant')

module.exports = {
  RMS_EVENTS: [
    SITE_EVENT.AC_FAIL,
    SITE_EVENT.DC_FAIL,
    SITE_EVENT.DG_POWER,
    SITE_EVENT.PG_POWER,
    SITE_EVENT.SITE_DOWN,
    SITE_EVENT.MAINS_FAIL,
    SITE_EVENT.MAINS_OUTAGE,
    // SITE_EVENT.LT_MAINS_OUTAGE,
    SITE_EVENT.BATTERY_POWER,
    SITE_EVENT.HIGH_TEMPERATURE,
    SITE_EVENT.DC_LOW_VOLTAGE,
    SITE_EVENT.DC_CRITICAL_VOLTAGE,
    SITE_EVENT.AVIATION_LIGHT_FAIL,
    SITE_EVENT.RECTIFIER_FAIL,
    SITE_EVENT.DEVICE_OFFLINE,
    SITE_EVENT.MDB_FAULT,
    SITE_EVENT.DC_FAN_FAULT,
    SITE_EVENT.DC_LOAD_FAIL,
    SITE_EVENT.DC_OVERLOAD,
    SITE_EVENT.SMOKE_DETECTION,
    SITE_EVENT.WATER_DETECTION,
    SITE_EVENT.INVERTER_BATTERY_LOW,
  ],

  ACS_EVENTS: [
    SITE_EVENT.DOOR_OPEN,
    SITE_EVENT.DOOR_CLOSE,
    SITE_EVENT.LOCK_OPEN,
    SITE_EVENT.LOCK_CLOSE,
    SITE_EVENT.LOCK_CLOSE_FAIL,
    SITE_EVENT.LOCK_OPEN_FAIL,
    SITE_EVENT.LOCK_FAULT,
    SITE_EVENT.CARD_READER_FAULT,
    SITE_EVENT.SECURITY_BREACH,
    SITE_EVENT.SECURITY_BREACH_CLEARED,
    SITE_EVENT.HIGH_VIBRATION,
    SITE_EVENT.LOW_VIBRATION,
    SITE_EVENT.HIGH_MOTION,
  ],

  monitoringUsers: [USER_TYPE.COMPANY, USER_TYPE.EMPLOYEE, USER_TYPE.SUPERUSER],

  ALARM_TO_SNAPSHOT_PROP: {
    [SITE_ALARM.MAINS_FAIL]: 'mains_fail',
    [SITE_ALARM.AC_LINE_FAIL]: 'mains_status',
    [SITE_ALARM.LT_AC_LINE_FAIL]: 'lt_mains_status',
    [SITE_ALARM.MDB_FAULT]: 'mdb_fault',
    [SITE_ALARM.DC_POWER_FAIL]: 'dc_power_fail',
    [SITE_ALARM.DC_LOW_VOLTAGE]: 'dc_low_voltage',
    [SITE_ALARM.RECTIFIER_FAIL]: 'rectifier_fail',
    [SITE_ALARM.INVERTER_BATTERY_LOW]: 'inverter_battery_low',
    [SITE_ALARM.DEVICE_ONLINE]: 'device_online',
    [SITE_ALARM.DC_LOAD_FAIL]: 'dc_load_fail',
    [SITE_ALARM.SITE_DOWN]: 'site_down',
    [SITE_ALARM.DOOR_STATUS]: 'door_status',
    [SITE_ALARM.LOCK_STATUS]: 'lock_status',
    [SITE_ALARM.LOCK_OPEN_FAIL]: 'lock_open_fail',
    [SITE_ALARM.LOCK_CLOSE_FAIL]: 'lock_close_fail',
    [SITE_ALARM.DOOR_OPEN_TIMEOUT]: 'door_open_timeout',
    [SITE_ALARM.CARD_READER_FAULT]: 'card_reader_fault',
    [SITE_ALARM.LOCK_FAULT]: 'lock_fault',
    [SITE_ALARM.MOTION]: 'motion_level',
    [SITE_ALARM.VIBRATION]: 'vibration_level',
    [SITE_ALARM.SECURITY_BREACH]: 'security_breach',
    [SITE_ALARM.HIGH_TEMPERATURE]: 'high_temperature',
    [SITE_ALARM.DG_LOW_FUEL]: 'dg_low_fuel',
    [SITE_ALARM.DG_START_FAIL]: 'dg_start_fail',
    [SITE_ALARM.DG_ON]: 'dg_status',
    [SITE_ALARM.PG_ON]: 'pg_status',
    [SITE_ALARM.WATER]: 'water',
    [SITE_ALARM.SMOKE]: 'smoke',
    [SITE_ALARM.DC_FAN_FAULT]: 'dc_fan_fault',
    [SITE_ALARM.AVIATION_LIGHT_FAIL]: 'aviation_light_fail',
    [SITE_ALARM.SOLAR_POWER_GENERATION_FAIL]: 'solar_power_generation_fail',
    [SITE_ALARM.SOLAR_CONTROL_FAIL]: 'solar_control_fail',
    [SITE_PROPERTY.DC_LOAD]: 'dc_load',
  },

  getSiteEventLabel(eventName) {
    const labels = {
      [SITE_EVENT.AC_FAIL]: 'AC Fail',
      [SITE_EVENT.DC_FAIL]: 'DC Fail',
      [SITE_EVENT.DG_POWER]: 'DG Power',
      [SITE_EVENT.PG_POWER]: 'PG Power',
      [SITE_EVENT.SITE_DOWN]: 'Site Down',
      [SITE_EVENT.MAINS_FAIL]: 'Mains Fail',
      [SITE_EVENT.MAINS_OUTAGE]: 'AC Line Fail',
      // [SITE_EVENT.LT_MAINS_OUTAGE]: 'Long Term MF',
      [SITE_EVENT.INVERTER_BATTERY_LOW]: 'Inverter Battery Low',
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
      [SITE_ALARM.INVERTER_BATTERY_LOW]: SITE_EVENT.INVERTER_BATTERY_LOW,
    }

    return mapping[alarmName] || ''
  },

  getAlarmFromEvent(eventName) {
    const mapping = {
      [SITE_EVENT.SITE_DOWN]: SITE_ALARM.SITE_DOWN,
      [SITE_EVENT.MAINS_FAIL]: SITE_ALARM.MAINS_FAIL,
      [SITE_EVENT.MAINS_OUTAGE]: SITE_ALARM.AC_LINE_FAIL,
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
      [SITE_EVENT.INVERTER_BATTERY_LOW]: SITE_ALARM.INVERTER_BATTERY_LOW,
    }
    return mapping[eventName] || ''
  },

  getColorOfPieLabel(label) {
    const colors = {
      ac_line_fail_banglalink: '#FC766AFF',
      ac_line_fail_robi: '#F13C59',
      ac_line_fail_grameenphone: '#F95700FF',
      ac_line_fail_scom_rect_1: '#FC766AFF',
      ac_line_fail_scom_rect_2: '#F13C59',

      mains_available: '#2ed573',
      dg_on: '#7770F1',
      pg_on: '#2D87BB',

      dc_low_voltage_banglalink: '#F2AA4CFF',
      dc_low_voltage_robi: '#CE4A7EFF',
      dc_low_voltage_grameenphone: '#0098F2',
      dc_low_voltage_scom_rect_1: '#F2AA4CFF',
      dc_low_voltage_scom_rect_2: '#CE4A7EFF',

      site_down_banglalink: '#7D2BD8',
      site_down_robi: '#00B5CC',
      site_down_grameenphone: '#0A9E9F',
      site_down_scom_rect_1: '#7D2BD8',
      site_down_scom_rect_2: '#00B5CC',
    }

    return colors[label] || ''
  },

  getTenantLabel(tenant, isShortForm = true) {
    const shortForm = {
      [SITE_TENANT.BANGLALINK]: isShortForm ? 'BL' : 'Banglalink',
      [SITE_TENANT.GRAMEENPHONE]: isShortForm ? 'GP' : 'Grameenphone',
      [SITE_TENANT.ROBI]: 'Robi',
      [SITE_TENANT.TELETALK]: isShortForm ? 'TT' : 'Teletalk',
      scom_rect_1: isShortForm ? 'Rect 1' : SCOMM_TENANTS.scom_rect_1,
      scom_rect_2: isShortForm ? 'Rect 2' : SCOMM_TENANTS.scom_rect_2,
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
      31: COMPANY.EDOTCO,
    }
    return company[id] || ''
  },

  getCompanyLabel(company) {
    switch (company) {
      case COMPANY.KIRTONKHOLA_TOWERS_BD_LTD:
        return 'KTBL'
      case COMPANY.EDOTCO:
        return 'EDOTCO'
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
      [USER_TYPE.FINANCE]: 'Finance',
      other: 'Other',
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
      case COMPANY.EDOTCO:
        return '/image/edotco.png'
      case COMPANY.SUMMIT_COM:
        return '/image/summit-comm-logo-sq.png'
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
    const companySpecificEventLabel = _.get(eventLabel, eventName, null)
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

  decimalToBinary(decimal) {
    if (!decimal) {
      return '--'
    }
    let binary = decimal.toString(2)
    binary = binary.padStart(5, '0')
    return binary
  },

  getOEMBackgroundTheme(name, item) {
    const value = this._.get(item.data, 'value', 0)
    switch (name) {
      case 'dcVoltageTheme':
        if (value <= 23) return 'from-red-500 to-red-300'
        if (value <= 48) return 'from-blue-500 to-blue-300'
        return 'from-green-500 to-green-300'

      case 'acVoltageTheme':
        if (value <= 12) return 'from-red-500 to-red-300'
        if (value <= 180) return 'from-blue-500 to-blue-300'
        return 'from-green-500 to-green-300'

      case 'currentTheme':
        if (value <= 10) return 'from-red-500 to-red-300'
        if (value <= 20) return 'from-blue-500 to-blue-300'
        return 'from-green-500 to-green-300'

      case 'loadEnergyTheme':
        if (value <= 0) return 'from-red-500 to-red-300'
        return 'from-green-500 to-green-300'

      case 'mainsEnergyTheme':
        if (value <= 0) return 'from-red-500 to-red-300'
        return 'from-teal-500 to-teal-300'

      case 'capacityTheme':
        if (value <= 20) return 'from-red-500 to-red-300'
        if (value <= 500) return 'from-yellow-500 to-yellow-300'
        return 'from-green-500 to-green-300'

      case 'sohTheme':
        if (value <= 75) return 'from-red-500 to-red-300'
        if (value <= 85) return 'from-yellow-500 to-yellow-300'
        return 'from-green-500 to-green-300'

      case 'percentageTheme':
        if (value <= 20) return 'from-red-500 to-red-300'
        if (value <= 50) return 'from-sky-500 to-sky-300'
        return 'from-emerald-500 to-emerald-300'

      case 'acFrequencyTheme':
        if (value <= 40) return 'from-red-500 to-red-300'

        if (value > 60) return 'from-red-500 to-red-300'
        return 'from-green-500 to-green-300'

      case 'runHourTheme':
        return 'from-teal-500 to-teal-300'

      case 'humidityTheme':
        return 'from-cyan-500 to-cyan-300'

      case 'ntcTheme':
        return 'from-teal-500 to-teal-300'

      case 'temperatureTheme':
        if (item.value <= 0) return 'from-red-500 to-red-300'

        if (item.value > 45) return 'from-red-500 to-red-300'
        return 'from-teal-500 to-teal-300'

      case 'numberTheme':
        return 'from-emerald-500 to-emerald-300'
    }
  },
  getDeviceVendorName(vendorId, vendors) {
    if (vendorId === null) return 'RAADAR'
    if (vendors && vendors.length > 0) {
      const selectedVendor = vendors.find(vendor => vendor.uid === vendorId)
      if (selectedVendor) {
        return selectedVendor.name
      }
    }
    return '-'
  },
}
