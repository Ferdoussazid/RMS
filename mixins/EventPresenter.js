import { SITE_EVENT, RECTIFIER_ALARM } from '~/assets/js/Constant'

export default {
  methods: {
    findEventComponent(e) {
      switch (e.name) {
        case SITE_EVENT.MAINS_OUTAGE:
          return 'MainsOutageEvent'
        // case SITE_EVENT.LT_MAINS_OUTAGE:
        //   return 'LongTermMFEvent'
        case SITE_EVENT.MDB_FAULT:
          return 'MDBFaultEvent'
        case SITE_EVENT.MAINS_FAIL:
          return 'MainsFailEvent'
        case SITE_EVENT.HIGH_TEMPERATURE:
          return 'TemperatureEvent'
        case SITE_EVENT.BATTERY_POWER:
          return 'SiteOnBatteryEvent'
        case SITE_EVENT.DC_LOW_VOLTAGE:
          return 'DCLowVoltageEvent'
        case SITE_EVENT.DC_CRITICAL_VOLTAGE:
          return 'DCCriticalVoltageEvent'
        case SITE_EVENT.SITE_DOWN:
          return 'SiteDownEvent'
        case SITE_EVENT.DC_FAIL:
          return 'DCPowerFailEvent'
        case SITE_EVENT.DC_LOAD_FAIL:
          return 'DCLoadFailEvent'
        case SITE_EVENT.DC_OVERLOAD:
          return 'DCOverloadEvent'
        case SITE_EVENT.DOOR_OPEN:
          return 'DoorOpenEvent'
        case SITE_EVENT.DOOR_CLOSE:
          return 'DoorCloseEvent'
        case SITE_EVENT.LOCK_OPEN:
          return 'LockOpenEvent'
        case SITE_EVENT.LOCK_CLOSE:
          return 'LockCloseEvent'
        case SITE_EVENT.LOCK_OPEN_FAIL:
          return 'LockOpenFailEvent'
        case SITE_EVENT.LOCK_CLOSE_FAIL:
          return 'LockCloseFailEvent'
        case SITE_EVENT.LOCK_FAULT:
          return 'LockFaultEvent'
        case SITE_EVENT.CARD_READER_FAULT:
          return 'CardReaderFaultEvent'
        case SITE_EVENT.SECURITY_BREACH:
          return 'SecurityBreachEvent'
        case SITE_EVENT.SECURITY_BREACH_CLEARED:
          return 'SecurityBreachClearEvent'
        case SITE_EVENT.DG_POWER:
          return 'DGRunEvent'
        case SITE_EVENT.PG_POWER:
          return 'PGRunEvent'
        case SITE_EVENT.DEVICE_OFFLINE:
          return 'DeviceOfflineEvent'
        case SITE_EVENT.HIGH_VIBRATION:
          return 'HighVibrationEvent'
        case SITE_EVENT.LOW_VIBRATION:
          return 'LowVibrationEvent'
        case SITE_EVENT.HIGH_MOTION:
          return 'HighMotionEvent'
        case SITE_EVENT.AVIATION_LIGHT_FAIL:
          return 'AviationLightFailEvent'
        case SITE_EVENT.RECTIFIER_FAIL:
          return 'RectifierFailEvent'
        case SITE_EVENT.DC_FAN_FAULT:
          return 'DCFanFaultEvent'
        case SITE_EVENT.WATER_DETECTION:
          return 'WaterDetectionEvent'
        case SITE_EVENT.SMOKE_DETECTION:
          return 'SmokeDetectionEvent'
        case SITE_EVENT.INVERTER_BATTERY_LOW:
          return 'InverterFailEvent'

        default:
          return null
      }
    },
    findRectifierEventComponent(e) {
      switch (e.name) {
        case RECTIFIER_ALARM.DC_LOW_VOLTAGE:
        case RECTIFIER_ALARM.DC_LOW:
          return 'RectifierDCLowVoltageEvent'
        case RECTIFIER_ALARM.BATTERY_LOW:
          return 'DCPowerFailEvent'
        case RECTIFIER_ALARM.MAINS_FAILURE:
        case RECTIFIER_ALARM.AC_FAIL:
          return 'RectifierMainsFailEvent'
        case RECTIFIER_ALARM.SITE_DOWN:
          return 'RectifierSiteDownEvent'
        case RECTIFIER_ALARM.RECTIFIER_FAILURE:
        case RECTIFIER_ALARM.MODULE_1_COMM_FAIL:
        case RECTIFIER_ALARM.MODULE_1_FAIL:
        case RECTIFIER_ALARM.MODULE_2_COMM_FAIL:
        case RECTIFIER_ALARM.MODULE_2_FAIL:
        case RECTIFIER_ALARM.MODULE_3_COMM_FAIL:
        case RECTIFIER_ALARM.MODULE_3_FAIL:
        case RECTIFIER_ALARM.MODULE_4_COMM_FAIL:
        case RECTIFIER_ALARM.MODULE_4_FAIL:
        case RECTIFIER_ALARM.MODULE_5_COMM_FAIL:
        case RECTIFIER_ALARM.MODULE_5_FAIL:
        case RECTIFIER_ALARM.MODULE_6_COMM_FAIL:
        case RECTIFIER_ALARM.MODULE_6_FAIL:
          return 'RectifierFailureEvent'
        // all general alarms
        case RECTIFIER_ALARM.DC_HIGH_VOLTAGE:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.BLVD:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.LLVD:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.BATTERY_DISCHARGE:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.RECTIFIER_OVERLOAD:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.HIGH_TEMPERATURE:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.DOOR_OPEN:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.SPD_FAIL_1:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.SMOKE:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.SPD_FAIL_2:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.SPD_FAIL_3:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.SPD_FAIL_4:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.SPD_FAIL_5:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.SPD_FAIL_6:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.COMMUNICATION_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.OVER_TEMPERATURE:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.RECTIFIER_FAULT:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.PROTECTION_MODE:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.FAN_FAULT:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.POWER_LIMIT:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.CURRENT_IMBALANCE:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_FAILURE:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.HIGH_VOLTAGE_SHUTDOWN:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_POWER_LIMIT:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.TEMPERATURE_POWER_LIMIT:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.DG_STATE:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_MODE:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.SYSTEM_VOLTS_LOW:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.SYSTEM_VOLTS_HIGH:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.ENV_HUMIDITY_LOW:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.ENV_HUMIDITY_HIGH:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_L1_PH_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_L1_VOL_LOW:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_L1_VOL_HIGH:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_L2_PH_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_L2_VOL_LOW:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_L2_VOL_HIGH:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_L3_PH_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_L3_VOL_LOW:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_L3_VOL_HIGH:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.DIGITAL_ALARM_1:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.DIGITAL_ALARM_2:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.DIGITAL_ALARM_3:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.DIGITAL_ALARM_4:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.DIGITAL_ALARM_5:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.DIGITAL_ALARM_6:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.DIGITAL_ALARM_7:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.DIGITAL_ALARM_8:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.SPD_ALARM:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.LOAD_1_FUSE_ALARM:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.LOAD_2_FUSE_ALARM:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.SHORT_TEST_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.BATTERY_TEST_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.LLVD1:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.LLVD2:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.LLVD3:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.LLVD4:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.ECO:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.LOAD_OVER_CURRENT:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_1_AC_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_1_TEMP_HIGH:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_1_PROTECT:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_1_FAN_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_1_VOL_OVER:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_2_AC_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_2_TEMP_HIGH:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_2_PROTECT:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_2_FAN_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_2_VOL_OVER:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_3_AC_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_3_TEMP_HIGH:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_3_PROTECT:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_3_FAN_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_3_VOL_OVER:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_4_AC_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_4_TEMP_HIGH:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_4_PROTECT:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_4_FAN_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_4_VOL_OVER:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_5_AC_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_5_TEMP_HIGH:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_5_PROTECT:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_5_FAN_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_5_VOL_OVER:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_6_AC_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.MODULE_6_TEMP_HIGH:
          return 'RectifierGeneralEvent'

        // ELTEK
        case RECTIFIER_ALARM.ANY_MAINS_ALARM:
        case RECTIFIER_ALARM.ANY_MAINS_GROUP_ALARM:
        case RECTIFIER_ALARM.ANY_MAINS_ALARM_MINOR:
        case RECTIFIER_ALARM.ANY_MAINS_GROUP_ALARM_MINOR:
        case RECTIFIER_ALARM.BATTERY_HIGH_TEMPERATURE:
        case RECTIFIER_ALARM.BATTERY_HIGH_TEMPERATURE_MINOR:
        case RECTIFIER_ALARM.BATTERY_LOW_TEMPERATURE_MINOR:
        case RECTIFIER_ALARM.BATTERY_LOW_TEMPERATURE:
        case RECTIFIER_ALARM.ANY_BATTERY_ALARM:
        case RECTIFIER_ALARM.ANY_BATTERY_ALARM_MINOR:
        case RECTIFIER_ALARM.BATTERY_HIGH_VOLTAGE:
        case RECTIFIER_ALARM.BATTERY_LOW_VOLTAGE:
        case RECTIFIER_ALARM.BATTERY_HIGH_CURRENT:
        case RECTIFIER_ALARM.BATTERY_LOW_CURRENT:
        case RECTIFIER_ALARM.BATTERY_LIFE_TIME:
        case RECTIFIER_ALARM.BATTERY_LOW_VOLTAGE_DISCONNECT:
        case RECTIFIER_ALARM.ANY_LOAD_ALARM:
        case RECTIFIER_ALARM.ANY_LOAD_ALARM_MINOR:
        case RECTIFIER_ALARM.DISCHARGED_TIME_LEFT:
        case RECTIFIER_ALARM.BATTERY_QUALITY:
        case RECTIFIER_ALARM.ANY_RECTIFIER_ALARM:
        case RECTIFIER_ALARM.ANY_CONTROLSYSTEM_ALARM:
        case RECTIFIER_ALARM.ANY_DCDC_ALARM:
        case RECTIFIER_ALARM.ANY_RECTIFIER_ALARM_MINOR:
        case RECTIFIER_ALARM.ANY_CONTROLSYSTEM_ALARM_MINOR:
        case RECTIFIER_ALARM.ANY_DCDC_ALARM_MINOR:
        case RECTIFIER_ALARM.USED_CAPACITY:
        case RECTIFIER_ALARM.TOTAL_CAPACITY:
        case RECTIFIER_ALARM.REMAINING_CAPACITY:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.DISCHARGED_TIME_LEFT_MINOR:
        case RECTIFIER_ALARM.BATTERY_QUALITY_MINOR:
        case RECTIFIER_ALARM.USED_CAPACITY_MINOR:
        case RECTIFIER_ALARM.TOTAL_CAPACITY_MINOR:
        case RECTIFIER_ALARM.REMAINING_CAPACITY_MINOR:
        case RECTIFIER_ALARM.BATTERY_HIGH_VOLTAGE_MINOR:
        case RECTIFIER_ALARM.BATTERY_LOW_VOLTAGE_MINOR:
        case RECTIFIER_ALARM.BATTERY_HIGH_CURRENT_MINOR:
        case RECTIFIER_ALARM.BATTERY_LOW_CURRENT_MINOR:
        case RECTIFIER_ALARM.BATTERY_LIFE_TIME_MINOR:
          return 'RectifierGeneralEvent'

        case RECTIFIER_ALARM.MODULE_1_FAN_1_FAIL:
        case RECTIFIER_ALARM.MODULE_1_FAN_2_FAIL:
        case RECTIFIER_ALARM.MODULE_2_FAN_1_FAIL:
        case RECTIFIER_ALARM.MODULE_2_FAN_2_FAIL:
        case RECTIFIER_ALARM.MODULE_3_FAN_1_FAIL:
        case RECTIFIER_ALARM.MODULE_3_FAN_2_FAIL:
        case RECTIFIER_ALARM.MODULE_4_FAN_1_FAIL:
        case RECTIFIER_ALARM.MODULE_4_FAN_2_FAIL:
        case RECTIFIER_ALARM.MODULE_5_FAN_1_FAIL:
        case RECTIFIER_ALARM.MODULE_5_FAN_2_FAIL:
        case RECTIFIER_ALARM.MODULE_6_FAN_1_FAIL:
        case RECTIFIER_ALARM.MODULE_6_FAN_2_FAIL:
          return 'RectifierGeneralEvent'
        case RECTIFIER_ALARM.AC_SDP_STATUS:
        case RECTIFIER_ALARM.LOAD_FUSE_STATUS:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_FAULT:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_COMM_INTERRUPTED:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_1_COMM_INTERRUPTED:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_1_FAILURE:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_1_PROTECTION:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_2_COMM_INTERRUPTED:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_2_FAILURE:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_2_PROTECTION:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_3_COMM_INTERRUPTED:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_3_FAILURE:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_3_PROTECTION:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_4_COMM_INTERRUPTED:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_4_FAILURE:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_4_PROTECTION:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_5_COMM_INTERRUPTED:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_5_FAILURE:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_5_PROTECTION:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_6_COMM_INTERRUPTED:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_6_FAILURE:
        case RECTIFIER_ALARM.RECTIFIER_MODULE_6_PROTECTION:
          return 'RectifierGeneralEvent'
        default:
          return null
      }
    },
  },
}
