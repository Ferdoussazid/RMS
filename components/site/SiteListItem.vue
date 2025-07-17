<template>
  <div
    class="grid grid-cols-12 items-stretch justify-center border-b border-slate-200 bg-white py-4 transition duration-300 md:border-0 md:py-0"
    :class="[theme]"
  >
    <div class="col-span-6 flex flex-col items-start justify-center space-y-1 px-4 py-3 md:col-span-2">
      <div class="flex flex-row items-start space-x-2">
        <span class="text-xs font-semibold text-gray-700">{{ serial }}.</span>
        <span
          class="break-words break-all text-xs font-semibold text-gray-700 hover:cursor-pointer hover:text-blue-600 hover:underline hover:underline-offset-2"
          @click="onActionClick({ id: 'status' })"
        >
          {{ siteName }}</span
        >
      </div>
      <div v-if="!shouldHideEventname" class="flex flex-col pl-4">
        <span class="text-xs font-medium capitalize text-indigo-500">
          {{ eventName }}
        </span>
        <span class="text-xs font-normal italic text-gray-600">{{ eventTime }} </span>
      </div>
    </div>

    <div
      class="col-span-6 space-y-1 break-words break-all border-0 border-gray-200 py-4 pl-4 pr-2 text-center md:col-span-1 md:border-l lg:text-left"
    >
      <span class="text-xs font-medium capitalize text-gray-700">{{ getLabelOfTenant(tenant) }}</span>
    </div>
    <div
      class="col-span-6 space-y-1 break-words break-all border-0 border-gray-200 py-4 pl-4 pr-2 text-center md:col-span-1 md:border-x lg:text-left"
    >
      <span class="text-xs font-medium capitalize text-gray-700">{{ MNOSiteID }}</span>
    </div>
    <div
      class="col-span-6 space-y-1 break-words break-all border-0 border-gray-200 py-4 pl-4 pr-2 text-center md:col-span-1 md:border-x lg:text-left"
    >
      <span class="text-xs font-medium capitalize text-gray-700">{{ device_vendor }}</span>
    </div>
    <div class="col-span-12 grid grid-cols-12 place-items-center md:col-span-7 md:flex">
      <div v-if="!isReadOnlyUser" class="col-span-6 flex h-full w-full items-start justify-center px-1 py-3 md:flex-1">
        <SimpleIconStatus
          :type="deviceAlarm"
          :with-device="siteWithDevice"
          label="Device"
          ic-success="fa-signal"
          ic-error="fa-ban"
        />
      </div>

      <div class="col-span-6 flex h-full items-start justify-center px-1 py-3 md:flex-1">
        <SimpleIconStatus :type="acFailAlarm" label="AC Fail" />
      </div>
      <div class="col-span-6 flex h-full items-start justify-center px-1 py-3 md:flex-1">
        <SimpleIconStatus :type="dcLowAlarm" label="DC Low" />
      </div>
      <div v-if="!isReadOnlyUser" class="col-span-6 flex h-full items-start justify-center px-1 py-3 md:flex-1">
        <SimpleIconStatus :type="rectifierFailAlarm" label="Rectifier Fail" />
      </div>
      <div
        class="col-span-6 flex h-full items-start justify-center border-0 border-gray-200 px-1 py-3 md:flex-1 md:border-l"
      >
        <SimpleIconStatus :type="siteDownAlarm" label="Site Down" />
      </div>

      <div v-if="!isReadOnlyUser" class="col-span-6 flex h-full items-start justify-center px-1 py-3 md:flex-1">
        <SimpleIconStatus :type="dgPgRunningAlarm" label="DG/PG ON" />
      </div>
      <div
        v-if="!isReadOnlyUser && !isRmsUser"
        class="col-span-6 flex h-full items-start justify-center px-1 py-3 md:flex-1"
      >
        <SimpleIconStatus :type="vibrationAlarm" label="Vibration" />
      </div>
      <div
        v-if="!isReadOnlyUser && !isRmsUser"
        class="col-span-6 flex h-full items-start justify-center px-1 py-3 md:flex-1"
      >
        <SimpleIconStatus :type="motionAlarm" label="Motion" />
      </div>
      <div
        v-if="!isReadOnlyUser && !isRmsUser"
        class="col-span-6 flex h-full items-start justify-center border-0 border-gray-200 px-1 py-3 md:flex-1 md:border-l"
      >
        <SimpleIconStatus
          :type="doorAlarm"
          label="Door"
          flat
          ic-success="fa-door-closed"
          ic-error="fa-door-open"
          ic-unavailable="fa-door-closed"
          size="lg"
        />
      </div>
      <div
        v-if="!isReadOnlyUser && !isRmsUser"
        class="col-span-6 flex h-full items-start justify-center px-1 py-3 md:flex-1"
      >
        <SimpleIconStatus
          :type="lockAlarm"
          label="Lock"
          flat
          ic-success="fa-lock"
          ic-error="fa-lock-open"
          ic-unavailable="fa-lock"
          size="lg"
        />
      </div>

      <div
        v-if="!isReadOnlyUser && !isRmsUser"
        class="col-span-6 flex h-full items-start justify-center px-1 py-3 md:flex-1"
      >
        <SimpleIconStatus :type="securityBreachAlarm" label="Security Breach" />
      </div>
      <div
        v-if="isFTB && !isReadOnlyUser"
        class="col-span-6 flex h-full flex-col items-center justify-center border-0 border-gray-200 px-1 py-3 md:flex-1 md:flex-row md:items-start md:border-l"
      >
        <span class="text-xs font-semibold text-blue-900">{{ terminalVoltage }}</span>
        <span class="block text-center text-xs font-normal text-gray-500 md:hidden">Terminal Voltage</span>
      </div>
      <div
        v-if="isFTB && !isReadOnlyUser"
        class="col-span-6 flex h-full flex-col items-center justify-center px-1 py-3 md:flex-1 md:flex-row md:items-start"
      >
        <span class="text-xs font-semibold text-blue-900">{{ nonCriticalLoad }}</span>
        <span class="block text-center text-xs font-normal text-gray-500 md:hidden">Non Critical Load</span>
      </div>
      <div
        v-if="isFTB && !isReadOnlyUser"
        class="col-span-6 flex h-full flex-col items-center justify-center px-1 py-3 md:flex-1 md:flex-row md:items-start"
      >
        <span class="text-xs font-semibold text-blue-900">{{ criticalLoad }}</span>
        <span class="block text-center text-xs font-normal text-gray-500 md:hidden">Critical Load</span>
      </div>

      <div
        class="col-span-6 flex h-full items-center justify-center border-0 border-gray-200 py-3 md:flex-1 md:border-l"
        @click="handleDropdownPosition"
      >
        <DropdownButton
          :dropdown-position="dropdownMenuPosition"
          label="More"
          :options="allowedActions"
          @item-click="onActionClick"
          @show="shouldCalculatePosition = true"
          @hide="shouldCalculatePosition = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { format } from 'date-fns'
import { mapGetters } from 'vuex'
import { COMPANY, SITE_ALARM } from '~/assets/js/Constant'
import { getAlarmFromEvent, getDeviceVendorName, getSiteEventLabel, getTenantLabel } from '~/assets/js/Helper'
import { powerEvents } from '~/assets/js/AlarmHelper'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { findExpectedAlarm, findExpectedAlarmForRectifier } from '~/assets/js/SiteHelper'

const ALARM_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  UNAVAILABLE: 'unavailable',
}

const SITE_ACTION = {
  AC_POWER: 'ac_power',
  DC_POWER: 'dc_power',
  SITE_ACCESS: 'site_access',
  SITE_ALARM: 'alarms',
  OEM_INTEGRATION: 'oem_integration',
  SITE_STATUS: 'status',
  SITE_REPORT: 'report',
  SITE_SETTINGS: 'settings',
}

export default {
  mixins: [UserTypeChecker],
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
    isMultiTenant: false,
    // eventName: '',
    // eventTime: '',
    percentageY: 0,
    shouldCalculatePosition: true,
    dash: _,
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
    accessAlarms: [SITE_ALARM.DOOR_STATUS, SITE_ALARM.LOCK_STATUS],
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('user', ['companyName']),
    ...mapGetters('mains', ['pins']),
    ...mapGetters('battery', ['siteWiseDCMetrics']),
    ...mapGetters('device-vendor', ['device_vendors']),
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
    device_vendor() {
      return getDeviceVendorName(this.site.device_vendor, this.device_vendors)
    },
    MNOSiteID() {
      if (!this.site.meta.telecom_site_ids) {
        return '-'
      }
      const telecomIds = this._.get(this.site.meta, 'telecom_site_ids', [])
      const telecomSiteId = telecomIds.find(site => site.tenant === this.tenant)
      return telecomSiteId ? telecomSiteId.id : '-'
    },
    siteWithDevice() {
      return !!(this.site.devices && this.site.devices.length)
    },
    isFTB() {
      return this.companyName === COMPANY.FRONTIER_TOWERS_BD
    },
    focusedAlarmName() {
      return getAlarmFromEvent(this.withEvent)
    },
    zoneLabel() {
      const label = [
        _.get(this.site, 'place.thana', '') || '',
        _.get(this.site, 'place.district', '') || '',
        _.get(this.site, 'place.division', '') || '',
      ]
        .filter(v => !!v.trim())
        .join(', ')
      return label || 'No Zone Found'
    },
    shouldHideEventname() {
      return this.withEvent === ''
    },
    siteDownAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.SITE_DOWN,
        tenant: this.tenant,
      })
      return this.getAlarmStatus(alarm)
    },
    dcLowAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.DC_LOW_VOLTAGE,
        tenant: this.tenant,
      })
      return this.getAlarmStatus(alarm)
    },
    acFailAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.AC_LINE_FAIL,
        tenant: this.tenant,
      })
      return this.getAlarmStatus(alarm)
    },
    rectifierFailAlarm() {
      if (this.isScl) {
        const alarm = findExpectedAlarmForRectifier(this.site.alarms, {
          id: SITE_ALARM.RECTIFIER_FAIL,
          tenant: this.tenant,
        })
        return this.getAlarmStatus(alarm)
      } else {
        const alarm = findExpectedAlarm(this.site.alarms, {
          id: SITE_ALARM.RECTIFIER_FAIL,
        })
        return this.getAlarmStatus(alarm)
      }
    },
    dgAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.DG_ON,
      })
      return this.getAlarmStatus(alarm)
    },
    pgAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.PG_ON,
      })
      return this.getAlarmStatus(alarm)
    },
    dgPgRunningAlarm() {
      const dgUnavailable = this.dgAlarm === ALARM_STATUS.UNAVAILABLE
      const pgUnavailable = this.pgAlarm === ALARM_STATUS.UNAVAILABLE
      if (dgUnavailable && pgUnavailable) {
        return ALARM_STATUS.UNAVAILABLE
      }
      const dgRunning = this.dgAlarm === ALARM_STATUS.ERROR
      const pgRunning = this.pgAlarm === ALARM_STATUS.ERROR
      if (dgRunning || pgRunning) {
        return ALARM_STATUS.ERROR
      }

      return ALARM_STATUS.SUCCESS
    },
    vibrationAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.VIBRATION,
      })
      return this.getAlarmStatus(alarm)
    },
    motionAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.MOTION,
      })
      return this.getAlarmStatus(alarm)
    },
    doorAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.DOOR_STATUS,
      })
      return this.getAlarmStatus(alarm)
    },
    lockAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.LOCK_STATUS,
      })
      return this.getAlarmStatus(alarm)
    },
    securityBreachAlarm() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.SECURITY_BREACH,
      })
      return this.getAlarmStatus(alarm)
    },
    deviceAlarm() {
      if (this.site.devices.length === 0) {
        return ALARM_STATUS.ERROR
      }
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: SITE_ALARM.DEVICE_ONLINE,
        tenant: this.tenant,
      })
      return this.getAlarmStatus(alarm)
    },
    theme() {
      return this.serial % 2 === 0 ? 'md:bg-gray-100' : ''
    },
    dropdownMenuPosition() {
      if (this.percentageY < 60) {
        return 'ease-in-out mt-2 top-full'
      } else {
        return 'ease-in-out-reverse -top-[700%]'
      }
    },
    eventTenant() {
      if (powerEvents.includes(this.withEvent)) {
        return this.tenant
      }
      return ''
    },
    eventName() {
      const label = getSiteEventLabel(this.withEvent)
      const tenant = this.eventTenant
      if (!tenant) {
        return label
      }
      return `${label} (${tenant})`
    },
    eventTime() {
      const alarm = findExpectedAlarm(this.site.alarms, {
        id: this.focusedAlarmName,
        tenant: this.eventTenant,
      })
      if (!alarm || !alarm.lastEvent) {
        return ''
      }
      const lastEventTime = new Date(alarm.lastEvent)
      return format(lastEventTime, 'h:mm a, d MMM yy')
    },
    dcMetrics() {
      const dcMetrics = this.siteWiseDCMetrics[this.site.uid]
      if (!dcMetrics) {
        return null
      }
      const tenantMetrics = dcMetrics[this.tenant]
      return tenantMetrics || null
    },
    terminalVoltage() {
      if (!this.dcMetrics || !this.dcMetrics.voltage) {
        return '--'
      }
      return this.dcMetrics.voltage.toFixed(1) + 'V'
    },
    nonCriticalLoad() {
      if (!this.dcMetrics || !this.dcMetrics.ncl) {
        return '--'
      }
      return this.dcMetrics.ncl.toFixed(1) + 'A'
    },
    criticalLoad() {
      if (!this.dcMetrics || !this.dcMetrics.cl) {
        return '--'
      }
      return this.dcMetrics.cl.toFixed(1) + 'A'
    },
  },

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

    handleDropdownPosition(event) {
      const viewportHeight = window.innerHeight
      const clickVerticalPosition = event.clientY
      if (this.shouldCalculatePosition) {
        this.percentageY = (clickVerticalPosition / viewportHeight) * 100
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
