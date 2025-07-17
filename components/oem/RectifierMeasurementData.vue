<template>
  <div class="w-full">
    <LoadingContainer v-if="loading" />
    <div v-else class="grid w-full grid-cols-12 gap-2 p-2">
      <div class="col-span-12 flex w-full flex-col gap-y-4 md:col-span-4">
        <div class="flex flex-col items-center rounded">
          <span class="w-full select-none bg-sky-100 p-1 text-center text-xs font-bold text-gray-700 shadow"
            >Grid Voltage</span
          >
          <div v-if="acVoltageItems.length" class="flex w-full flex-col shadow">
            <OEMMeasurementItem v-for="(item, i) in acVoltageItems" :key="i" :item="item" :serial="i + 1" />
          </div>
        </div>
        <div class="flex flex-col items-center rounded">
          <span class="w-full select-none bg-sky-100 p-1 text-center text-xs font-bold text-gray-700 shadow"
            >DC Voltage</span
          >
          <div v-if="dcVoltageItems.length" class="flex w-full flex-col shadow">
            <OEMMeasurementItem v-for="(item, i) in dcVoltageItems" :key="i" :item="item" :serial="i + 1" />
          </div>
        </div>
      </div>
      <div class="col-span-12 flex flex-col gap-2 md:col-span-4">
        <div v-if="currentItems.length" class="flex h-auto flex-col items-center rounded-t">
          <span class="w-full select-none bg-sky-100 p-1 text-center text-xs font-bold text-gray-700 shadow"
            >Current</span
          >
          <div class="flex w-full flex-col rounded-b shadow">
            <OEMMeasurementItem v-for="(item, i) in currentItems" :key="i" :item="item" :serial="i + 1" />
          </div>
        </div>
        <div v-if="llvdItems.length" class="flex h-auto flex-col items-center rounded-t">
          <span class="w-full select-none bg-sky-100 p-1 text-center text-xs font-bold text-gray-700 shadow"
            >LLVD Measurements</span
          >
          <div class="flex w-full flex-col rounded-b shadow">
            <OEMMeasurementItem v-for="(item, i) in llvdItems" :key="i" :item="item" :serial="i + 1" />
          </div>
        </div>
      </div>
      <div class="col-span-12 flex w-full flex-col gap-y-4 md:col-span-4">
        <div v-if="energyItems.length" class="flex flex-col items-center rounded">
          <span class="w-full select-none bg-sky-100 p-1 text-center text-xs font-bold text-gray-700 shadow"
            >Energy</span
          >
          <div class="flex w-full flex-col shadow">
            <OEMMeasurementItem v-for="(item, i) in energyItems" :key="i" :item="item" :serial="i + 1" />
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
      <div v-if="!rectifierMeasurementData.length" class="col-span-12 p-2">
        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">No Data Found</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    rectifierType: {
      type: String,
      required: true,
    },
    siteUid: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    specificGroups: ['current', 'ac_voltage', 'dc_voltage', 'energy', 'llvd'],
    fetchInterval: 0,
    intervalId: null,
    loading: true,
  }),
  computed: {
    ...mapGetters('oem', ['rectifierMeasurementData']),
    currentItems() {
      return this.rectifierMeasurementData.filter(item => item.type === 'current')
    },
    acVoltageItems() {
      return this.rectifierMeasurementData.filter(item => item.type === 'ac_voltage')
    },
    dcVoltageItems() {
      return this.rectifierMeasurementData.filter(item => item.type === 'dc_voltage')
    },
    llvdItems() {
      return this.rectifierMeasurementData.filter(item => item.type === 'llvd')
    },
    energyItems() {
      return this.rectifierMeasurementData.filter(item => item.type === 'energy')
    },
    otherItems() {
      return this.rectifierMeasurementData.filter(item => !this.specificGroups.includes(item.type))
    },
  },
  async mounted() {
    this.loading = true
    await this.getRectifierMeasurementData()
    this.setDataFetchInterval()
    this.loading = false
  },
  destroyed() {
    clearInterval(this.intervalId)
  },
  methods: {
    setDataFetchInterval() {
      this.intervalId = setInterval(() => {
        this.getRectifierMeasurementData()
      }, 10000)
    },
    async getRectifierMeasurementData() {
      await this.$store.dispatch('oem/getRectifierMeasurementData', {
        site_uid: this.siteUid,
        rectifier_type: this.rectifierType,
      })
      this.$emit('update')
    },
  },
}
</script>

<style>
.clock-container {
  background: radial-gradient(ellipse at center, #0a2e38 0%, #010b21 70%);
}
</style>
