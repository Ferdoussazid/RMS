<template>
  <div class="col-span-12 min-h-[60vh] w-full rounded bg-slate-100 lg:col-span-5">
    <LoadingContainer v-if="loading" />
    <div v-else class="flex flex-col gap-2 overflow-hidden md:flex-row">
      <div
        v-if="!canShowDCPSAlarms && !canShowRectifierAlarms"
        class="col-span-12 m-auto flex flex-col items-center space-y-6"
      >
        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">No Alarms Found</span>
      </div>
      <OEMAlarmGroup v-if="canShowDCPSAlarms" :alarm-group="dcpsAlarms" class="col-span-12 md:col-span-6" />
      <div
        v-if="canShowRectifierAlarms && canShowDCPSAlarms"
        class="col-span-12 flex w-full flex-col items-center gap-y-2 md:col-span-6"
      >
        <div class="flex w-full flex-col items-center gap-y-2 p-4">
          <span class="select-none text-xs font-medium text-gray-700">AC Mode</span>
          <div class="flex w-full flex-row items-stretch space-x-2 opacity-100">
            <div
              class="flex grow flex-row items-center justify-between space-x-2 overflow-hidden rounded-md bg-blue-100 px-3 py-2 shadow-lg"
            >
              <span class="select-none text-xs font-semibold text-gray-700">AC Mode: {{ acMode }}</span>
            </div>
          </div>
        </div>
        <OEMAlarmGroup :alarm-group="rectifierAlarms" />
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
    ...mapGetters('oem', ['rectifierAlarmGroups', 'acMode']),
    rectifierAlarms() {
      const rectifierAlarmGroup = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.RECTIFIER_ALARM_1)
      const rectifierAlarmGroupItems = rectifierAlarmGroup ? rectifierAlarmGroup.items : []
      return { label: 'Rectifier Alarms', items: rectifierAlarmGroupItems }
    },
    dcpsAlarms() {
      const dcpsAlarmGroup = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.DCPS_ALARM_3)
      const dcpsAlarmGroupItems = dcpsAlarmGroup ? [...dcpsAlarmGroup.items] : []
      const dgStateAlarmGroup = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.DG_STATE)
      if (dgStateAlarmGroup) {
        dcpsAlarmGroupItems.splice(9, 0, dgStateAlarmGroup.items[0])
      }
      return { label: 'DCPS Alarm', items: dcpsAlarmGroupItems }
    },
    canShowDCPSAlarms() {
      return !!this.dcpsAlarms.items.length
    },
    canShowRectifierAlarms() {
      return !!this.rectifierAlarms.items.length
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
        rectifier_type: 'vertiv',
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
