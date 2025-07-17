import { SITE_ALARM, SITE_FILTER_TYPE } from './Constant'

export const SCOMM_POWER_ALARM = {
  label: 'Power',
  items: [
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.AC_LINE_FAIL,
      label: 'Grid Fail (Rect 1)',
      tenant: 'scom_rect_1',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.AC_LINE_FAIL,
      label: 'Grid Fail (Rect 2)',
      tenant: 'scom_rect_2',
      expected: false,
    },

    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.DC_LOW_VOLTAGE,
      label: 'DC Low Voltage (Rect 1)',
      tenant: 'scom_rect_1',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.DC_LOW_VOLTAGE,
      label: 'DC Low Voltage (Rect 2)',
      tenant: 'scom_rect_2',
      expected: false,
    },

    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.SITE_DOWN,
      label: 'Site Down (Rect 1)',
      tenant: 'scom_rect_1',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.SITE_DOWN,
      label: 'Site Down (Rect 2)',
      tenant: 'scom_rect_2',
      expected: false,
    },

    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.MDB_FAULT,
      label: 'MDB Fault (Rect 1)',
      tenant: 'scom_rect_1',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.MDB_FAULT,
      label: 'MDB Fault (Rect 2)',
      tenant: 'scom_rect_2',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.MAINS_FAIL,
      label: 'Mains Fail',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.DC_POWER_FAIL,
      label: 'DC Power Fail',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.RECTIFIER_FAIL,
      label: 'Rectifier Fail',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.DEVICE_ONLINE,
      label: 'Device Offline',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.DC_LOAD_FAIL,
      label: 'DC Load Fail',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.INVERTER_BATTERY_LOW,
      label: 'Inverter Battery Low',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.SOLAR_POWER_GENERATION_FAIL,
      label: 'Solar Power Generation Fail',
      expected: false,
    },
    {
      type: SITE_FILTER_TYPE.ALARM,
      id: SITE_ALARM.SOLAR_CONTROL_FAIL,
      label: 'Solar Control Fail',
      expected: false,
    },
  ],
}
