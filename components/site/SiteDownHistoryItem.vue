<template>
  <div
    class="grid grid-cols-12 items-stretch justify-center divide-x-2 divide-slate-200 border-b border-slate-200 bg-white py-4 transition duration-300 md:border-0 md:py-0"
    :class="[theme]">
    <div class="col-span-6 flex flex-col items-start justify-center px-4 py-3 md:col-span-2">
      <div class="flex flex-row items-start space-x-2">
        <span class="text-xs font-semibold text-gray-700">{{ serial }}.</span>
        <span class="text-xs font-semibold text-gray-700">{{ siteName }}</span>
      </div>
    </div>
    <div class="col-span-6 flex flex-col items-center justify-center break-words break-all py-4 md:col-span-1">
      <span class="text-xs font-medium capitalize text-gray-700">{{ getLabelOfTenant(tenant) }}</span>
    </div>
    <div class="col-span-12 grid grid-cols-7 place-items-center divide-x-2 divide-slate-200 md:col-span-9">
      <div class="col-span-7 grid w-full grid-cols-12 divide-x-2 divide-slate-200 md:col-span-2">
        <div class="col-span-6 flex flex-col items-center justify-center py-4">
          <span class="text-xs font-semibold text-red-500">{{ acFailEventStartTime }}</span>
          <span class="block text-center text-xs font-semibold text-gray-500 md:hidden">AC Fail Start</span>
        </div>
        <div class="col-span-6 flex flex-col items-center justify-center py-4">
          <span class="text-xs font-semibold text-red-500">{{ acFailEventEndTime }}</span>
          <span class="block text-center text-xs font-semibold text-gray-500 md:hidden">AC Fail End</span>
        </div>
      </div>

      <div class="col-span-7 grid w-full grid-cols-12 divide-x-2 divide-slate-200 md:col-span-2">
        <div class="col-span-6 flex flex-col items-center justify-center py-4">
          <span class="text-xs font-semibold text-red-500">{{ dcLowEventStartTime }}</span>
          <span class="block text-center text-xs font-semibold text-gray-500 md:hidden">DC Low Start</span>
        </div>
        <div class="col-span-6 flex flex-col items-center justify-center py-4">
          <span class="text-xs font-semibold text-red-500">{{ dcLowEventEndTime }}</span>
          <span class="block text-center text-xs font-semibold text-gray-500 md:hidden">DC Low End</span>
        </div>
      </div>
      <div class="col-span-7 grid w-full grid-cols-12 divide-x-2 divide-slate-200 md:col-span-2">
        <div class="col-span-6 flex flex-col items-center justify-center py-4">
          <span class="text-xs font-semibold text-red-500">{{ siteDownEventStartTime }}</span>
          <span class="block text-center text-xs font-semibold text-gray-500 md:hidden">Site Down Start</span>
        </div>
        <div class="col-span-6 flex flex-col items-center justify-center py-4">
          <span class="text-xs font-semibold text-red-500">{{ siteDownEventEndTime }}</span>
          <span class="block text-center text-xs font-semibold text-gray-500 md:hidden">Site Down End</span>
        </div>
      </div>
      <div class="col-span-7 grid w-full grid-cols-12 items-center justify-center py-4 md:col-span-1">
        <span class="col-span-12 text-center text-xs font-normal">{{ batteryBackup }}</span>
        <span class="col-span-12 block text-center text-xs font-normal text-gray-500 md:hidden">Battery Backup</span>
      </div>
    </div>
  </div>
</template>

<script>
import { differenceInSeconds, format } from 'date-fns'
import { SITE_EVENT } from '~/assets/js/Constant'
import { getTenantLabel } from '~/assets/js/Helper';
export default {
  props: {
    serial: {
      type: Number,
      required: true,
    },
    siteName: {
      type: String,
      default: '',
    },
    tenant: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      default: () => { },
    },
  },

  computed: {
    acFailEventStartTime() {
      return this.getEventStartTime(SITE_EVENT.MAINS_OUTAGE)
    },
    dcLowEventStartTime() {
      return this.getEventStartTime(SITE_EVENT.DC_LOW_VOLTAGE)
    },
    siteDownEventStartTime() {
      return this.getEventStartTime(SITE_EVENT.SITE_DOWN)
    },
    acFailEventEndTime() {
      return this.getEventEndTime(SITE_EVENT.MAINS_OUTAGE)
    },
    dcLowEventEndTime() {
      return this.getEventEndTime(SITE_EVENT.DC_LOW_VOLTAGE)
    },
    siteDownEventEndTime() {
      return this.getEventEndTime(SITE_EVENT.SITE_DOWN)
    },
    batteryBackup() {
      if (this.acFailEventStartTime !== '-') {
        const diff = differenceInSeconds(new Date(this.siteDownEventStartTime), new Date(this.acFailEventStartTime))
        return this.$utils.toTimeDuration(diff)
      }
      return '-'
    },
    theme() {
      return this.serial % 2 === 0 ? 'md:bg-gray-100' : ''
    },
  },

  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
    getEventStartTime(eventName) {
      const event = this._.get(this.item, eventName, null)
      return this.getFormattedTime(event, 'time')
    },
    getEventEndTime(eventName) {
      const event = this._.get(this.item, eventName, null)
      if (event && event.status === 'running') return 'Running'
      return this.getFormattedTime(event, 'end_at')
    },
    getFormattedTime(event, time) {
      return event ? format(new Date(event[time]), 'h:mm a, d MMM yy') : '-'
    },
  },
}
</script>

<style lang="scss" scoped></style>
