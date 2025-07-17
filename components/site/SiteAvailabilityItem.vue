<template>
  <div v-if="!loading"
    class="grid items-stretch justify-center grid-cols-12 py-4 transition duration-300 bg-white border-b divide-x-0 border-slate-200 md:divide-x md:border-0 md:py-0"
    :class="[theme]">
    <div class="flex flex-col items-start justify-center col-span-6 px-4 py-3 space-y-1 md:col-span-2">
      <div class="flex flex-row items-start space-x-2">
        <span class="text-xs font-semibold text-gray-700">{{ serial }}.</span>
        <span
          class="text-xs font-semibold text-gray-700 break-words break-all hover:cursor-pointer hover:text-blue-600 hover:underline hover:underline-offset-2"
          @click="onActionClick({ id: 'status' })">{{ siteName }}</span>
      </div>

      <div v-if="!shouldHideEventname" class="flex flex-col pl-4">
        <span class="text-xs font-medium text-indigo-500 capitalize">
          {{ eventName }}
        </span>
        <span class="text-xs italic font-normal text-gray-600">{{ eventTime }} </span>
      </div>
    </div>
    <div
      class="flex flex-col items-start justify-center col-span-6 py-4 pl-4 pr-2 space-y-1 break-words break-all border-gray-200 md:col-span-1 md:border-l">
      <!-- <img class="object-cover w-10 h-8" :src="tenantIcon" /> -->
      <span class="text-xs font-medium text-gray-700 capitalize">{{ getLabelOfTenant(tenant) }}</span>
    </div>
    <div
      class="flex flex-col items-start justify-center col-span-6 py-4 pl-4 pr-2 space-y-1 text-center break-words break-all border-0 border-gray-200 md:col-span-1 md:border-x lg:text-left">
      <span class="text-xs font-medium text-gray-700 capitalize">{{ MNOSiteID }}</span>
    </div>
    <div :class="[isReadOnlyUser ? 'grid-cols-8' : 'grid-cols-10']"
      class="grid col-span-12 divide-x-0 place-items-center md:col-span-6 md:divide-x">
      <div :class="[isReadOnlyUser ? 'col-span-4' : 'col-span-5']"
        class="flex items-center justify-center w-full h-full px-1 py-4 md:col-span-2">
        <SimpleIconStatus v-if="acFailStatus === 'success'" :type="acFailStatus" label="AC Fail" />
        <div v-else class="flex flex-col items-center justify-center">
          <span class="text-xs font-semibold text-red-500">{{ acFailStartTime }}</span>
          <span class="block text-xs font-normal text-center text-gray-500 md:hidden">AC Fail</span>
        </div>
      </div>

      <div :class="[isReadOnlyUser ? 'col-span-4' : 'col-span-5']"
        class="flex items-center justify-center w-full h-full px-1 py-4 md:col-span-2">
        <SimpleIconStatus v-if="dcLowStatus === 'success'" :type="dcLowStatus" label="DC Low" />
        <div v-else class="flex flex-col items-center justify-center">
          <span class="text-xs font-semibold text-red-500">{{ dcLowStartTime }}</span>
          <span class="block text-xs font-normal text-center text-gray-500 md:hidden">DC Low</span>
        </div>
      </div>
      <div :class="[isReadOnlyUser ? 'col-span-4' : 'col-span-5']"
        class="flex items-center justify-center w-full h-full px-1 py-4 md:col-span-2">
        <SimpleIconStatus v-if="siteDownStatus === 'success'" :type="siteDownStatus" label="Site Down" />
        <div v-else class="flex flex-col items-center justify-center">
          <span class="text-xs font-semibold text-red-500">{{ siteDownStartTime }}</span>
          <span class="block text-xs font-normal text-center text-gray-500 md:hidden">Site Down</span>
        </div>
      </div>
      <div :class="[isReadOnlyUser ? 'col-span-4' : 'col-span-5']"
        class="flex flex-col items-center justify-center w-full h-full px-1 py-4 md:col-span-2">
        <span class="text-xs font-medium">{{ batteryBackup }}</span>
        <span class="block text-xs font-normal text-center text-gray-500 md:hidden">Battery Backup</span>
      </div>
      <div v-if="!isReadOnlyUser"
        class="flex items-center justify-center w-full h-full col-span-5 px-1 py-4 md:col-span-2">
        <SimpleIconStatus :type="dgPgAlarmStatus" label="DG/PG ON" />
      </div>
    </div>
    <div class="grid grid-cols-12 col-span-12 divide-x-0 place-items-center md:col-span-2 md:divide-x">
      <div class="flex items-center justify-center w-full h-full col-span-6 py-4">
        <NLink class="px-3 py-1 bg-blue-500 rounded shadow hover:bg-blue-600 hover:shadow-md" :to="targetUrl">
          <span class="text-xs font-normal text-white">History</span>
        </NLink>
      </div>
      <div class="flex items-center justify-center w-full h-full col-span-6 py-4" @click="handleDropdownPosition">
        <DropdownButton label="More" :dropdown-position="dropdownMenuPosition" :options="allowedActions"
          @item-click="onActionClick" @show="shouldCalculatePosition = true" @hide="shouldCalculatePosition = false" />
      </div>
    </div>
  </div>
</template>

<script>
import { differenceInSeconds, format, isBefore } from 'date-fns'
import { mapGetters } from 'vuex'
import { SITE_ALARM } from '~/assets/js/Constant'
import { getAlarmFromEvent, getCompanySpecificEventLabel, getSiteEventLabel, getTenantLabel } from '~/assets/js/Helper'
import utils from '~/mixins/utils'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { findExpectedAlarm } from '~/assets/js/SiteHelper'

const ALARM_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
}

const SITE_ACTION = {
  SITE_STATUS: 'status',
  SITE_ALARM: 'alarms',
  OEM_INTEGRATION: 'oem_integration',
  SITE_ACCESS: 'site_access',
  AC_POWER: 'ac_power',
  DC_POWER: 'dc_power',
  SITE_REPORT: 'report',
  SITE_SETTINGS: 'settings',
}

export default {
  mixins: [utils, UserTypeChecker],
  props: {
    serial: {
      type: Number,
      required: true,
    },
    site: {
      type: Object,
      required: true,
    },
    withEvent: {
      type: String,
      default: () => null,
    },
    tenant: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    loading: false,
    percentageY: 0,
    shouldCalculatePosition: true,
    actions: [
      { id: SITE_ACTION.SITE_STATUS, label: 'Site Details', icon: 'fas fa-layer-group' },
      { id: SITE_ACTION.SITE_ALARM, label: 'Alarms', icon: 'fas fa-exclamation-circle' },
      { id: SITE_ACTION.OEM_INTEGRATION, label: 'OEM Int.', icon: 'fas fa-microchip' },
      { id: SITE_ACTION.SITE_ACCESS, label: 'Site Access', icon: 'fas fa-door-open' },
      { id: SITE_ACTION.AC_POWER, label: 'AC Power', icon: 'fas fa-bolt' },
      { id: SITE_ACTION.DC_POWER, label: 'DC Power', icon: 'fas fa-car-battery' },
      { id: SITE_ACTION.SITE_REPORT, label: 'Report', icon: 'fas fa-file-excel' },
      { id: SITE_ACTION.SITE_SETTINGS, label: 'Settings', icon: 'fas fa-cog' },
    ],
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('user', ['companyName']),
    ...mapGetters('mains', ['pins']),
    allowedActions() {
      if (this.isReadOnlyUser) {
        const unallowedActionIDs = [SITE_ACTION.SITE_ACCESS, SITE_ACTION.OEM_INTEGRATION]
        return this.actions.filter(action => !unallowedActionIDs.includes(action.id))
      }
      return this.actions
    },
    siteName() {
      return this.site.name
    },
    MNOSiteID() {
      if (!this.site.meta.telecom_site_ids) {
        return '-'
      }
      const telecomIds = this._.get(this.site.meta, 'telecom_site_ids', [])
      const telecomSiteId = telecomIds.find(site => site.tenant === this.tenant)
      return telecomSiteId ? telecomSiteId.id : '-'
    },
    focusedAlarmName() {
      return getAlarmFromEvent(this.withEvent)
    },
    zoneLabel() {
      const label = [
        this._.get(this.site, 'place.thana', '') || '',
        this._.get(this.site, 'place.district', '') || '',
        this._.get(this.site, 'place.division', '') || '',
      ]
        .filter(v => !!v.trim())
        .join(', ')
      return label || 'No Zone Found'
    },
    shouldHideEventname() {
      return this.withEvent === ''
    },
    acFailAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.AC_LINE_FAIL,
        tenant: this.tenant,
      })
      return alarm
    },
    dcLowAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.DC_LOW_VOLTAGE,
        tenant: this.tenant,
      })
      return alarm
    },
    siteDownAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.SITE_DOWN,
        tenant: this.tenant,
      })
      return alarm
    },
    dgRunningAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.DG_ON,
      })
      return alarm
    },
    pgRunningAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.PG_ON,
      })
      return alarm
    },
    deviceOfflineAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.DEVICE_OFFLINE,
        tenant: this.tenant,
      })
      return alarm
    },
    acFailStatus() {
      return this.getAlarmStatus(this.acFailAlarm)
    },
    dcLowStatus() {
      return this.getAlarmStatus(this.dcLowAlarm)
    },
    siteDownStatus() {
      return this.getAlarmStatus(this.siteDownAlarm)
    },
    dgAlarmStatus() {
      return this.getAlarmStatus(this.dgRunningAlarm)
    },
    pgAlarmStatus() {
      return this.getAlarmStatus(this.pgRunningAlarm)
    },
    dgPgAlarmStatus() {
      const hasDgAlarm = this.dgAlarmStatus === ALARM_STATUS.ERROR
      const hasPgAlarm = this.pgAlarmStatus === ALARM_STATUS.ERROR
      if (hasDgAlarm || hasPgAlarm) {
        return ALARM_STATUS.ERROR
      }
      return ALARM_STATUS.SUCCESS
    },
    theme() {
      return this.serial % 2 === 0 ? 'md:bg-gray-100' : ''
    },
    siteDownStartTime() {
      return this.getEventTime(this.siteDownAlarm)
    },
    acFailStartTime() {
      return this.getEventTime(this.acFailAlarm)
    },
    dcLowStartTime() {
      return this.getEventTime(this.dcLowAlarm)
    },
    shouldCalculateBackup() {
      const activeACFail = this.acFailStatus === ALARM_STATUS.ERROR
      const activeSiteDown = this.siteDownStatus === ALARM_STATUS.ERROR
      const inactiveAlarm = !activeACFail || !activeSiteDown

      const invalidACFailTime = this.acFailStartTime === '-'
      const invalidSiteDownTime = this.siteDownStartTime === '-'
      const invalidTime = invalidACFailTime || invalidSiteDownTime

      if (inactiveAlarm || invalidTime) {
        return false
      }

      const startTime = new Date(this.acFailStartTime)
      const endTime = new Date(this.siteDownStartTime)
      return isBefore(startTime, endTime)
    },
    batteryBackup() {
      if (!this.shouldCalculateBackup) {
        return '-'
      }
      const acFailTime = new Date(this.acFailStartTime)
      const siteDownTime = new Date(this.siteDownStartTime)
      const batteryRunDuration = differenceInSeconds(siteDownTime, acFailTime)
      return this.$utils.toTimeDuration(batteryRunDuration)
    },
    targetUrl() {
      return this.siteListUrl(
        {
          siteUid: this.site.uid,
          tenant: this.tenant,
        },
        '/site/history'
      )
    },
    dropdownMenuPosition() {
      if (this.percentageY < 60) {
        return 'ease-in-out mt-2 top-full'
      }
      return 'ease-in-out-reverse -top-[700%]'
    },
    eventName() {
      const label = this.getCompanySpecificLabel(this.withEvent)
      const tenant = this.tenant
      return `${label} (${this.getLabelOfTenant(tenant)})`
    },
    eventTime() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: this.focusedAlarmName,
        tenant: this.tenant,
      })
      if (!alarm || !alarm.lastEvent) {
        return ''
      }
      const lastEventTime = new Date(alarm.lastEvent)
      return format(lastEventTime, 'h:mm a, d MMM yy')
    },
  },

  mounted() { },
  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
    getAlarmStatus(alarm) {
      const isAvailable = this._.get(alarm, 'isAvailable', false)
      const isAlarmInactive = this._.get(alarm, 'isNormal', false)

      if (!isAvailable) {
        return ALARM_STATUS.SUCCESS
      }
      if (!isAlarmInactive) {
        return ALARM_STATUS.ERROR
      }
      return ALARM_STATUS.SUCCESS
    },

    getEventTime(alarm) {
      if (!alarm || !alarm.lastEvent) {
        return ''
      }
      const lastEventTime = new Date(alarm.lastEvent)
      return format(lastEventTime, 'h:mm a, d MMM yy')
    },

    getCompanySpecificLabel(eventName) {
      const event = getCompanySpecificEventLabel(this.companyName, eventName)
      if (event) {
        return event
      }
      return getSiteEventLabel(eventName)
    },
    getBatteryBackupTime() {
      const siteDownTime = new Date(this.siteDownStartTime)
      const acFailTime = new Date(this.acFailStartTime)
      const batteryRunDuration = differenceInSeconds(siteDownTime, acFailTime)
      return this.$utils.toTimeDuration(batteryRunDuration)
    },

    handleDropdownPosition(event) {
      const viewportHeight = window.innerHeight
      const clickVerticalPosition = event.clientY
      if (this.shouldCalculatePosition) {
        this.percentageY = (clickVerticalPosition / viewportHeight) * 100
      }
    },

    async onActionClick(item) {
      await this.$store.commit('site/SET_FOCUSED_TENANT', this.tenant)
      await this.$store.dispatch('site/getSiteConfig', this.site.uid)

      switch (item.id) {
        case SITE_ACTION.SITE_STATUS:
          this.$router.push('/site')
          break
        case SITE_ACTION.SITE_ALARM:
          this.$router.push('/alarm')
          break
        case SITE_ACTION.OEM_INTEGRATION:
          this.$router.push('/oem/data')
          break
        case SITE_ACTION.SITE_ACCESS:
          this.$router.push('/access')
          break
        case SITE_ACTION.AC_POWER:
          this.$router.push('/mains')
          break
        case SITE_ACTION.DC_POWER:
          this.$router.push('/battery')
          break
        case SITE_ACTION.SITE_REPORT:
          this.$router.push('/report')
          break
        case SITE_ACTION.SITE_SETTINGS:
          this.$router.push('/settings')
          break

        default:
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
