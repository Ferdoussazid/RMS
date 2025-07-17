<template>
  <div class="col-span-12 min-h-[60vh] w-full rounded bg-slate-100 lg:col-span-5">
    <LoadingContainer v-if="loading" />
    <div v-else class="flex flex-col gap-2 overflow-hidden md:flex-row">
      <div v-if="!canShowRectifierAlarms" class="col-span-12 m-auto flex flex-col items-center space-y-6">
        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">No Alarms Found</span>
      </div>
      <div class="col-span-12 flex w-full flex-col items-center gap-y-2 md:col-span-6" v-if="canShowRectifierAlarms">
        <OEMAlarmGroup :alarm-group="dcAlarmsMajor" />
        <OEMAlarmGroup :alarm-group="batteryAlarmsMajor" />
        <OEMAlarmGroup :alarm-group="dcAlarmsMinor" />

      </div>
      <div v-if="canShowRectifierAlarms" class="col-span-12 flex w-full flex-col items-center gap-y-2 md:col-span-6">
        <OEMAlarmGroup :alarm-group="rectifierAlarms" />

        <OEMAlarmGroup :alarm-group="batteryAlarmsMinor" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { OEM_ALARM_GROUP } from '~/assets/js/Constant'

export default {
  props: {
    siteUid: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      intervalId: null,
    }
  },
  computed: {
    ...mapGetters('oem', ['rectifierAlarmGroups']),
    dcAlarmsMajor() {
      const rectifierAlarmGroup = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.DC_PLANT_MAJOR)
      const rectifierAlarmGroupItems = rectifierAlarmGroup ? rectifierAlarmGroup.items : []
      return { label: 'DC Alarms Major', items: rectifierAlarmGroupItems }
    },
    dcAlarmsMinor() {
      const rectifierAlarmGroup = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.DC_PLANT_MINOR)
      const rectifierAlarmGroupItems = rectifierAlarmGroup ? rectifierAlarmGroup.items : []
      return { label: 'DC Alarms Minor', items: rectifierAlarmGroupItems }
    },
    batteryAlarmsMajor() {
      const rectifierAlarmGroup = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.BATTERY_MAJOR)
      const rectifierAlarmGroupItems = rectifierAlarmGroup ? rectifierAlarmGroup.items : []
      return { label: 'Battery Alarms Major', items: rectifierAlarmGroupItems }
    },
    batteryAlarmsMinor() {
      const rectifierAlarmGroup = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.BATTERY_MINOR)
      const rectifierAlarmGroupItems = rectifierAlarmGroup ? rectifierAlarmGroup.items : []
      return { label: 'Battery Alarms Minor', items: rectifierAlarmGroupItems }
    },
    rectifierAlarms() {
      const rectifierAlarmGroup1 = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.MODULE_1)
      const rectifierAlarmGroupItems1 = rectifierAlarmGroup1 ? rectifierAlarmGroup1.items : []

      const rectifierAlarmGroup2 = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.MODULE_2)
      const rectifierAlarmGroupItems2 = rectifierAlarmGroup2 ? rectifierAlarmGroup2.items : []

      const rectifierAlarmGroup3 = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.MODULE_3)
      const rectifierAlarmGroupItems3 = rectifierAlarmGroup3 ? rectifierAlarmGroup3.items : []

      const rectifierAlarmGroup4 = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.MODULE_4)
      const rectifierAlarmGroupItems4 = rectifierAlarmGroup4 ? rectifierAlarmGroup4.items : []

      const rectifierAlarmGroup5 = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.MODULE_5)
      const rectifierAlarmGroupItems5 = rectifierAlarmGroup5 ? rectifierAlarmGroup5.items : []

      const rectifierAlarmGroup6 = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.MODULE_6)
      const rectifierAlarmGroupItems6 = rectifierAlarmGroup6 ? rectifierAlarmGroup6.items : []

      return { label: 'Rectifier Alarms', items: [...rectifierAlarmGroupItems1, ...rectifierAlarmGroupItems2, ...rectifierAlarmGroupItems3, ...rectifierAlarmGroupItems4, ...rectifierAlarmGroupItems5, ...rectifierAlarmGroupItems6] }
    },

    canShowRectifierAlarms() {
      return this.rectifierAlarmGroups && this.rectifierAlarmGroups.length
    },
  },
  async mounted() {
    this.loading = true
    await this.getRectifierAlarms()
    this.setDataFetchInterval()
    this.loading = false
  },
  destroyed() {
    clearInterval(this.intervalId)
  },
  methods: {
    setDataFetchInterval() {
      this.intervalId = setInterval(() => {
        this.getRectifierAlarms()
      }, 10000)
    },
    async getRectifierAlarms() {
      await this.$store.dispatch('oem/getRectifierAlarms', {
        site_uid: this.siteUid,
        rectifier_type: 'eltek',
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
