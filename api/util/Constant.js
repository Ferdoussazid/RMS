module.exports = {
  PIN_TYPE: {
    MAIN_PHASE: 'main_phase',
    DG_STATUS: 'dg_status',
    PG_STATUS: 'pg_status',
    DG_FUEL: 'dg_fuel',
    TEMPERATURE: 'temperature',

    // PLAN: remove access_control type, bring back door_status and add lock_status
    ACCESS_CONTROL: 'access_control',
    // DOOR_STATUS: 'door_status',
    VIBRATION_SENSOR: 'vibration_sensor',

    BATTERY_TERMINAL: 'battery_terminal',
    BATTERY_CURRENT: 'battery_current',
    SMOKE_DETECTOR: 'smoke_detector',
    RECTIFIER_FAULT: 'rectifier_fault',
    DC_LOW_VOLTAGE: 'battery_low',

    MAINS_FAIL: 'mains_fail',
    RECTIFIER_FAIL: 'rectifier_fail',
    DC_LOAD_FAIL: 'dc_load_fail',
    AVIATION_LIGHT_FAIL: 'aviation_light_fail',
  },
}
