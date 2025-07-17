<template>
  <div class="grid grid-cols-12 gap-2 py-2">
    <div :class="[
      'grid col-span-12 gap-2 p-2 bg-white rounded-md lg:col-span-4',
      canAccessAcs ? 'grid-cols-3' : 'grid-cols-2'
    ]">
      <AggregatedCount class="col-span-1" :count="siteCount.total" label="Total Sites" theme="bg-green-500" />

      <div class="relative flex md:col-span-1" @mouseover="expandRMSInstalledItem(true)"
        @mouseleave="expandRMSInstalledItem(false)">
        <AggregatedCount class="w-full" :count="siteCount.rms" label="RMS Installed" :filter="filter.DEVICE_INSTALLED"
          theme="bg-green-500" :masked="isReadOnlyUser" />
        <div v-if="isRMSInstalledExpanded && !isReadOnlyUser" class="absolute left-0 z-50 pt-4 top-10"
          @mousemove="expandRMSInstalledItem(true)" @mouseleave="expandRMSInstalledItem(false)">
          <div class="relative flex flex-col items-center gap-2 p-2 bg-white rounded shadow-md tooltip-triangle-top">
            <AggregatedCount class="w-[160px]" background-color="bg-gray-500"
              :count="sites.length ? siteCount.rectifier : '_'" label="Rectifier Integrated" :filter="filter.RECTIFIER"
              theme="bg-green-500" :disable-link="!sites.length" />
          </div>
        </div>
      </div>
      <AggregatedCount v-if="canAccessAcs" class="col-span-1" :count="siteCount.acs" label="ACS Installed"
        :filter="filter.ACS_INSTALLED" theme="bg-green-500" :masked="isReadOnlyUser" />
    </div>

    <div :class="[
      'grid col-span-12 gap-2 p-2 bg-white rounded-md lg:col-span-8',
      !canAccessAcs ? 'grid-cols-5' : 'grid-cols-6'
    ]">
      <div class="relative flex col-span-2 md:col-span-1" @mouseover="expandOfflineItem(true)"
        @mouseleave="expandOfflineItem(false)">
        <AggregatedCount class="w-full" :count="offlineCount" label="Device Offline" :filter="filter.DEVICE_OFFLINE"
          theme="bg-red-500" :masked="isReadOnlyUser" />
        <div v-if="isDeviceOfflineExpanded && !isReadOnlyUser" class="absolute left-0 z-50 pt-4 top-10"
          @mousemove="expandOfflineItem(true)" @mouseleave="expandOfflineItem(false)">
          <div class="relative flex flex-col items-center gap-2 p-2 bg-white rounded shadow-md tooltip-triangle-top">
            <AggregatedCount class="w-[150px]" background-color="bg-gray-500"
              :count="sites.length ? slabwiseOfflineCount.lessThan24 : '_'" label="<24 Hours"
              :filter="filter.DEVICE_OFFLINE_24" theme="bg-green-500" :masked="isReadOnlyUser"
              :disable-link="!sites.length" />
            <AggregatedCount class="w-[150px]" background-color="bg-gray-500"
              :count="sites.length ? slabwiseOfflineCount.lessThan48 : '_'" label="<48 Hours"
              :filter="filter.DEVICE_OFFLINE_48" theme="bg-yellow-500" :masked="isReadOnlyUser"
              :disable-link="!sites.length" />
            <AggregatedCount class="w-[150px]" background-color="bg-gray-500"
              :count="sites.length ? slabwiseOfflineCount.lessThan72 : '_'" label="<72 Hours"
              :filter="filter.DEVICE_OFFLINE_72" theme="bg-orange-500" :masked="isReadOnlyUser"
              :disable-link="!sites.length" />
            <AggregatedCount class="w-[150px]" background-color="bg-gray-500"
              :count="sites.length ? slabwiseOfflineCount.greaterThan72 : '_'" label=">72 Hours"
              :filter="filter.DEVICE_OFFLINE_72_PLUS" theme="bg-red-500" :masked="isReadOnlyUser"
              :disable-link="!sites.length" />
          </div>
        </div>
      </div>
      <AggregatedCount class="col-span-2 md:col-span-1" :count="pgOnSites" label="PG ON" :filter="filter.PG_ON"
        theme="bg-red-500" :masked="isReadOnlyUser" />
      <AggregatedCount class="col-span-2 md:col-span-1" :count="pausedAlarms ? pausedAlarms : 0" label="Paused Alarms"
        :filter="filter.PG_ON" theme="bg-red-500" v-if="canAccessRms && !canAccessAcs" :disableLink="true" />
      <AggregatedCount class="col-span-2 md:col-span-1" :count="noLoadCount" label="DC No Load"
        :filter="filter.DC_NO_LOAD" theme="bg-red-500" />
      <AggregatedCount class="col-span-2 md:col-span-1" :count="overLoadCount" label="DC Overload"
        :filter="filter.DC_OVER" theme="bg-red-500" />
      <AggregatedCount v-if="canAccessAcs" class="col-span-2 md:col-span-1" :count="doorOpenSites" label="Door Open"
        :filter="filter.DOOR_OPEN" theme="bg-red-500" :masked="isReadOnlyUser" />
      <AggregatedCount v-if="canAccessAcs" class="col-span-2 md:col-span-1" :count="securityBreachSites"
        label="Security Breach" :filter="filter.SECURITY_BREACH" theme="bg-red-500" :masked="isReadOnlyUser"
        :should-pulse="true" />
    </div>
  </div>
</template>

<script>
import { differenceInMinutes } from 'date-fns'
import { mapGetters } from 'vuex'
import { SITE_ALARM, SITE_PROPERTY, SITE_FILTER_TYPE } from '~/assets/js/Constant'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  middleware: ['auth'],
  data: () => ({
    loadingEvents: false,
    isDeviceOfflineExpanded: false,
    isRMSInstalledExpanded: false,
    pausedAlarm: 0,
    filter: {
      RECTIFIER: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.RECTIFIER, exists: 1 },
      DC_LOW: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.DC_LOW_VOLTAGE, expected: 0 },
      DC_NO_LOAD: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.DC_LOAD, expected: 'DOWN' },
      DC_OVER: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.DC_LOAD, expected: 'OVER' },
      DOOR_OPEN: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.DOOR_STATUS, expected: 0 },
      DEVICE_OFFLINE: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.DEVICE_ONLINE, expected: 0 },
      DEVICE_OFFLINE_24: {
        type: SITE_FILTER_TYPE.ALARM,
        id: SITE_ALARM.DEVICE_ONLINE,
        expected: 0,
        minDuration: 0,
        maxDuration: 24 * 60,
      },
      DEVICE_OFFLINE_48: {
        type: SITE_FILTER_TYPE.ALARM,
        id: SITE_ALARM.DEVICE_ONLINE,
        expected: 0,
        minDuration: 24 * 60,
        maxDuration: 48 * 60,
      },
      DEVICE_OFFLINE_72: {
        type: SITE_FILTER_TYPE.ALARM,
        id: SITE_ALARM.DEVICE_ONLINE,
        expected: 0,
        minDuration: 48 * 60,
        maxDuration: 72 * 60,
      },
      DEVICE_OFFLINE_72_PLUS: {
        type: SITE_FILTER_TYPE.ALARM,
        id: SITE_ALARM.DEVICE_ONLINE,
        expected: 0,
        minDuration: 72 * 60,
      },
      PG_ON: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.PG_ON, expected: 0 },
      ACS_INSTALLED: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.LOCK_STATUS },

      DEVICE_INSTALLED: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.COM_IDS, exists: 1 },
      SECURITY_BREACH: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.SECURITY_BREACH, expected: 0 },
    },
  }),
  computed: {
    ...mapGetters('dashboard', ['frequency', 'loadCount', 'selectedTenant']),
    ...mapGetters('site', ['sites', 'siteCount']),
    ...mapGetters('user', ['allowedTenants']),
    slabwiseOfflineCount() {
      const count = {
        lessThan24: 0,
        lessThan48: 0,
        lessThan72: 0,
        greaterThan72: 0,
      }
      const now = new Date()
      for (const site of this.sites) {
        const alarms = site.alarms.filter(
          alarm => alarm.id === SITE_ALARM.DEVICE_ONLINE && alarm.isAvailable && !alarm.isNormal
        )
        for (const alarm of alarms) {
          const timeDiff = differenceInMinutes(now, new Date(alarm.lastEvent))
          if (timeDiff < 24 * 60) {
            count.lessThan24++
          } else if (timeDiff < 48 * 60) {
            count.lessThan48++
          } else if (timeDiff < 72 * 60) {
            count.lessThan72++
          } else {
            count.greaterThan72++
          }
        }
      }
      return count
    },
    pgOnSites() {
      return this._.get(this.frequency, SITE_ALARM.PG_ON, 0)
    },
    noLoadCount() {
      return this.getLoadStatusCount('DOWN')
    },
    overLoadCount() {
      return this.getLoadStatusCount('OVER')
    },
    doorOpenSites() {
      return this._.get(this.frequency, SITE_ALARM.DOOR_STATUS, 0)
    },
    securityBreachSites() {
      return this._.get(this.frequency, SITE_ALARM.SECURITY_BREACH, 0)
    },
    offlineCount() {
      return this.getAlarmCount(SITE_ALARM.DEVICE_ONLINE)
    },
    pausedAlarms() {
      return this.getPausedAlarmCount()
    },
    isLegacyDashboard() {
      const path = this.$route.fullPath
      const match = path.match(/\/dashboard\/legacy/);

      if (match) {
        return true
      } else return false
    }
  },
  methods: {
    getAlarmCount(alarmName) {
      let count = 0
      for (const tenant of this.allowedTenants) {
        count += this._.get(this.frequency, `${alarmName}_${tenant}`, 0)
      }
      return count
    },
    getLoadStatusCount(status) {
      let count = 0
      for (const tenant of this.allowedTenants) {
        count += this._.get(this.loadCount[status], tenant, 0)
      }
      return count
    },
    expandOfflineItem(status) {
      this.isDeviceOfflineExpanded = status
    },
    expandRMSInstalledItem(status) {
      this.isRMSInstalledExpanded = status
    },
    getPausedAlarmCount() {
      let count = 0

      if (this.sites.length) {
        for (const site of this.sites) {
          for (const alarm of site.alarms) {
            if (alarm.isDisable && alarm.isAvailable) {
              count++
            }
          }
        }
        return count
      }

      return 0
    }
  },
}
</script>

<style scoped>
.tooltip-triangle-top::after {
  content: '';
  position: absolute;
  top: -0.5rem;
  left: 50%;
  z-index: 50;
  height: 0;
  width: 0;
  transform: translateX(-50%);
  border-left: 0.5rem solid transparent;
  border-right: 0.5rem solid transparent;
  border-bottom: 0.5rem solid white;
  transition: all 0.3s;
}
</style>
