export const TelegramAlarm = {
  // ac_fail: 'AC Fail',
  dc_fail: 'DC Fail',
  dg_power: 'DG Run',
  pg_power: 'PG Run',
  site_down: 'Site Down',
  mdb_fault: 'MDB Fault',
  mains_fail: 'Mains Fail',
  mains_outage: 'AC Line Fail',
  lt_mains_outage: 'Long Term MF',
  battery_power: 'Site On Battery',
  high_temperature: 'High Temperature',
  dc_low_voltage: 'DC Low Voltage',
  dc_critical_voltage: 'Battery Critical',
  aviation_light_fail: 'Aviation Light Fail',
  rectifier_fail: 'Rectifier Fail',
  door_open: 'Door Open',
  door_close: 'Door Close',
  lock_open: 'Lock Open',
  lock_close: 'Lock Close',
  lock_close_fail: 'Lock Close Fail',
  lock_open_fail: 'Lock Open Fail',
  card_reader_fault: 'Card Reader Fault',
  lock_fault: 'Lock Fault',
  security_breach: 'Security Breach',
  security_breach_cleared: 'Security Breach Clear',
  high_vibration: 'High Vibration',
  mild_vibration: 'Low Vibration',
  high_motion: 'High Motion',
  smoke_detection: 'Smoke Detection',
  water_detection: 'Water Detection',
  dc_fan_fault: 'DC Fan Fault',
  device_offline: 'Device Offline',
  dc_overload: 'DC Overload',
  dc_load_fail: 'DC No Load', // DC Load Fail alarm
}

export const TelegramAlarmNames = Object.values(TelegramAlarm)

export const getSiteEventKeyName = eventName => {
  return Object.keys(TelegramAlarm).find(key => TelegramAlarm[key] === eventName)
}
export const getSiteEventValueName = eventKey => {
  return TelegramAlarm[eventKey]
}

export const SITE_EVENT_NAME = {
  // AC_FAIL: 'ac_fail',
  DC_FAIL: 'dc_fail',
  DC_LOAD_FAIL: 'dc_load_fail',
  DG_POWER: 'dg_power',
  PG_POWER: 'pg_power',
  MDB_FAULT: 'mdb_fault',
  SITE_DOWN: 'site_down',
  MAINS_FAIL: 'mains_fail', // this event is triggered from MainsFail Digital pin
  /**
   * in practice, this is actually AC LINE FAIL event,
   * there is another ac_fail event defined here but that is not being used
   */
  MAINS_OUTAGE: 'mains_outage',
  LT_MAINS_OUTAGE: 'lt_mains_outage', // long term mains outage
  BATTERY_POWER: 'battery_power', // Site On Battery Event
  HIGH_TEMPERATURE: 'high_temperature',
  DC_LOW_VOLTAGE: 'dc_low_voltage',
  DC_CRITICAL_VOLTAGE: 'dc_critical_voltage',
  DC_OVERLOAD: 'dc_overload',
  AVIATION_LIGHT_FAIL: 'aviation_light_fail',

  SMOKE_DETECTION: 'smoke_detection',
  WATER_DETECTION: 'water_detection',
  DC_FAN_FAULT: 'dc_fan_fault',

  DOOR_OPEN: 'door_open',
  DOOR_CLOSE: 'door_close',
  LOCK_OPEN: 'lock_open',
  LOCK_CLOSE: 'lock_close',
  LOCK_CLOSE_FAIL: 'lock_close_fail',
  LOCK_OPEN_FAIL: 'lock_open_fail',
  SECURITY_BREACH: 'security_breach',
  SECURITY_BREACH_CLEARED: 'security_breach_cleared',
  HIGH_VIBRATION: 'high_vibration',
  MILD_VIBRATION: 'mild_vibration',
  HIGH_MOTION: 'high_motion',
  LOCK_FAULT: 'lock_fault',
  RECTIFIER_FAIL: 'rectifier_fail',
  CARD_READER_FAULT: 'card_reader_fault',

  DEVICE_OFFLINE: 'device_offline',

  // Following 4 events are not used till now, their purpose is beign served by 'dg_power' & 'pg_power'
  PG_ON: 'pg_on',
  PG_OFF: 'pg_off',
  DG_ON: 'dg_on',
  DG_OFF: 'dg_off',
}

export const RMS_EVENTS = [
  // SITE_EVENT_NAME.AC_FAIL,
  SITE_EVENT_NAME.DC_FAIL,
  SITE_EVENT_NAME.DC_LOAD_FAIL,
  SITE_EVENT_NAME.DG_POWER,
  SITE_EVENT_NAME.PG_POWER,
  SITE_EVENT_NAME.SITE_DOWN,
  SITE_EVENT_NAME.MDB_FAULT,
  SITE_EVENT_NAME.MAINS_FAIL,
  SITE_EVENT_NAME.MAINS_OUTAGE,
  SITE_EVENT_NAME.LT_MAINS_OUTAGE,
  // SITE_EVENT_NAME.BATTERY_POWER, NOTE: deprecated event
  SITE_EVENT_NAME.DC_LOW_VOLTAGE,
  SITE_EVENT_NAME.DC_CRITICAL_VOLTAGE,
  SITE_EVENT_NAME.DC_OVERLOAD,
  SITE_EVENT_NAME.AVIATION_LIGHT_FAIL,
  SITE_EVENT_NAME.RECTIFIER_FAIL,
  SITE_EVENT_NAME.DEVICE_OFFLINE,
  SITE_EVENT_NAME.SMOKE_DETECTION,
  SITE_EVENT_NAME.WATER_DETECTION,
  SITE_EVENT_NAME.HIGH_TEMPERATURE,
  SITE_EVENT_NAME.DC_FAN_FAULT,
]

export const ACS_EVENTS = [
  SITE_EVENT_NAME.DOOR_OPEN,
  SITE_EVENT_NAME.DOOR_CLOSE,
  SITE_EVENT_NAME.LOCK_OPEN,
  SITE_EVENT_NAME.LOCK_CLOSE,
  SITE_EVENT_NAME.LOCK_OPEN_FAIL,
  SITE_EVENT_NAME.LOCK_CLOSE_FAIL,
  SITE_EVENT_NAME.SECURITY_BREACH,
  SITE_EVENT_NAME.SECURITY_BREACH_CLEARED,
  SITE_EVENT_NAME.HIGH_VIBRATION,
  SITE_EVENT_NAME.MILD_VIBRATION,
  SITE_EVENT_NAME.HIGH_MOTION,
  SITE_EVENT_NAME.LOCK_FAULT,
  SITE_EVENT_NAME.CARD_READER_FAULT,
]

export const isAcsEvent = eventName => {
  const key = getSiteEventKeyName(eventName)
  if (ACS_EVENTS.includes(key)) return true
  return false
}

export const isRmsEvent = eventName => {
  const key = getSiteEventKeyName(eventName)
  if (RMS_EVENTS.includes(key)) return true
  return false
}

export const TELEGRAM_ENVIRONMENT_ALARMS = [
  SITE_EVENT_NAME.HIGH_TEMPERATURE,
  SITE_EVENT_NAME.DG_ON,
  SITE_EVENT_NAME.PG_ON,
  SITE_EVENT_NAME.AVIATION_LIGHT_FAIL,
  SITE_EVENT_NAME.DC_FAN_FAULT,
  SITE_EVENT_NAME.WATER_DETECTION,
  SITE_EVENT_NAME.SMOKE_DETECTION,
]

export const TELEGRAM_POWER_ALARMS = RMS_EVENTS.filter(event => !TELEGRAM_ENVIRONMENT_ALARMS.includes(event))
