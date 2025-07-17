<template>
  <div class="h-full w-full">
    <div v-if="filteredBMSMeasurementData.length" class="flex w-full flex-col gap-2">
      <div
        class="clock-container flex flex-col items-center justify-between bg-slate-200 px-4 py-2 shadow-md md:flex-row"
      >
        <div class="hidden flex-1 flex-col items-center md:flex">
          <span class="text-lg font-normal text-[#daf6ff]">BMS Measurement Data</span>
        </div>
        <div id="clock" class="flex flex-1 flex-col items-center px-4 py-2">
          <span class="select-none text-xs font-medium text-[#daf6ff]">Updated</span>
          <span class="text-base font-bold text-[#daf6ff]">{{ fetchInterval }} ago</span>
        </div>
      </div>
      <div class="grid w-full grid-cols-12 gap-2 p-2">
        <div class="col-span-12 flex w-full flex-col gap-y-4 md:col-span-4">
          <div v-if="leftVoltageItems.length" class="flex flex-col items-center rounded">
            <span class="w-full select-none bg-sky-100 p-1 text-center text-xs font-bold text-gray-700 shadow"
              >DC Voltage</span
            >
            <div class="flex w-full flex-col shadow">
              <OEMMeasurementItem v-for="(item, i) in leftVoltageItems" :key="i" :item="item" :serial="i + 1" />
            </div>
          </div>
        </div>

        <div class="col-span-12 flex flex-col gap-2 md:col-span-4">
          <div v-if="rightVoltageItems.length" class="flex flex-col items-center rounded">
            <span class="w-full select-none bg-sky-100 p-1 text-center text-xs font-bold text-gray-700 shadow"
              >DC Voltage</span
            >
            <div class="flex w-full flex-col shadow">
              <OEMMeasurementItem v-for="(item, i) in rightVoltageItems" :key="i" :item="item" :serial="i + 1" />
            </div>
          </div>
        </div>
        <div class="col-span-12 flex w-full flex-col gap-y-4 md:col-span-4">
          <div v-if="currentItems.length" class="flex h-auto flex-col items-center rounded-t">
            <span class="w-full select-none bg-sky-100 p-1 text-center text-xs font-bold text-gray-700 shadow"
              >Current</span
            >
            <div class="flex w-full flex-col rounded-b shadow">
              <OEMMeasurementItem v-for="(item, i) in currentItems" :key="i" :item="item" :serial="i + 1" />
            </div>
          </div>
          <div v-if="ntcItems.length" class="flex flex-col items-center rounded">
            <span class="w-full select-none bg-sky-100 p-1 text-center text-xs font-bold text-gray-700 shadow"
              >NTC</span
            >
            <div class="flex w-full flex-col shadow">
              <OEMMeasurementItem v-for="(item, i) in ntcItems" :key="i" :item="item" :serial="i + 1" />
            </div>
          </div>
          <div v-if="otherItems.length" class="flex flex-col items-center rounded">
            <span class="w-full select-none bg-sky-100 p-1 text-center text-xs font-bold text-gray-700 shadow"
              >Others</span
            >
            <div class="flex w-full flex-col shadow">
              <OEMMeasurementItem v-for="(item, i) in otherItems" :key="i" :item="item" :serial="i + 1" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="col-span-1 m-auto flex h-full w-full flex-col items-center justify-center space-y-6">
      <img src="/icon/empty.png" alt="" class="h-auto w-16" />
      <span class="text-sm font-light text-gray-500">No Data Found</span>
    </div>
  </div>
</template>

<script>
import { formatDistanceStrict } from 'date-fns'
import { mapGetters } from 'vuex'

export default {
  props: {
    siteUid: {
      type: Number,
      required: true,
    },
    lastFetchTime: {
      type: Date,
      default: new Date(),
    },
  },
  data: () => ({
    specificGroups: ['current', 'ac_voltage', 'dc_voltage', 'energy', 'ntc'],
    fetchInterval: 0,
    intervalId: null,
  }),
  computed: {
    ...mapGetters('oem', ['bmsMeasurementData', 'selectedBatteryAddress']),
    filteredBMSMeasurementData() {
      return this.bmsMeasurementData.filter(item => item.battery_address === this.selectedBatteryAddress)
    },
    currentItems() {
      return this.filteredBMSMeasurementData.filter(item => item.type === 'current')
    },
    dcVoltageItems() {
      return this.filteredBMSMeasurementData.filter(item => item.type === 'dc_voltage')
    },
    leftVoltageItems() {
      return this.dcVoltageItems.slice(0, this.dcVoltageItems.length / 2 + 1)
    },
    rightVoltageItems() {
      return this.dcVoltageItems.slice(this.dcVoltageItems.length / 2 + 1, this.dcVoltageItems.length)
    },
    ntcItems() {
      return this.filteredBMSMeasurementData.filter(item => item.type === 'ntc')
    },
    otherItems() {
      return this.filteredBMSMeasurementData.filter(item => !this.specificGroups.includes(item.type))
    },
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.updateFetchInterval()
    }, 1000)
  },
  destroyed() {
    clearInterval(this.intervalId)
  },
  methods: {
    updateFetchInterval() {
      this.fetchInterval = formatDistanceStrict(new Date(), this.lastFetchTime)
    },
  },
}
</script>

<style>
.clock-container {
  background: radial-gradient(ellipse at center, #0a2e38 0%, #010b21 70%);
}
</style>
