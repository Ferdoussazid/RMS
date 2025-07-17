<template>
  <div class="min-h-[70vh] w-full rounded">
    <LoadingContainer v-if="loading" />
    <div v-if="!loading" class="grid w-full grid-cols-12 gap-2">
      <BMSAlarmsContainer v-if="batteryType" />
      <div
        v-if="batteryType"
        class="col-span-12 flex w-full flex-col items-center gap-2 overflow-hidden rounded bg-slate-100 lg:col-span-7 lg:min-h-[60vh]"
      >
        <BMSMeasurementData :site-uid="site.uid" :last-fetch-time="lastAlarmFetchTime" />
      </div>
      <div
        v-else
        class="col-span-12 m-auto flex min-h-[70vh] w-full flex-col items-center justify-center space-y-6 rounded bg-slate-100 md:p-4"
      >
        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">BMS not integrated</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    site: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    intervalId: null,
    lastAlarmFetchTime: null,
  }),
  computed: {
    ...mapGetters('oem', ['bmsMeasurementData', 'oemSiteName']),
    batteryType() {
      return this._.get(this.site.bms, 'bms_type', '')
    },
    batteryAddressCount() {
      return +this._.get(this.site.bms, 'bms_address', 0)
    },
  },
  async mounted() {
    if (this.batteryType) {
      this.loading = true
      await this.$store.commit('oem/CLEAR_BMS_ALARM_GROUPS')
      await this.$store.commit('oem/CLEAR_BMS_MEASUREMENT_DATA')
      await this.getBMSAlarms()
      await this.getBMSMeasurementData()
      this.setDataFetchInterval()
      this.loading = false
    }
  },
  destroyed() {
    clearInterval(this.intervalId)
  },
  methods: {
    setDataFetchInterval() {
      this.intervalId = setInterval(() => {
        this.getBMSAlarms()
        this.getBMSMeasurementData()
      }, 10000)
    },
    async getBMSAlarms() {
      this.lastAlarmFetchTime = new Date()
      await this.$store.dispatch('oem/getBMSAlarms', {
        site_uid: this.site.uid,
        bms_type: this.batteryType,
        bms_total_address: this.batteryAddressCount,
      })
    },
    async getBMSMeasurementData() {
      await this.$store.dispatch('oem/getBMSMeasurementData', {
        site_uid: this.site.uid,
        bms_type: this.batteryType,
        bms_total_address: this.batteryAddressCount,
      })
    },
  },
}
</script>

<style></style>
