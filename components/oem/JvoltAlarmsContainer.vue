<template>
  <div class="col-span-12 min-h-[60vh] w-full rounded bg-slate-100 lg:col-span-5">
    <LoadingContainer v-if="loading" />
    <div v-else class="flex flex-col gap-2 overflow-hidden">
      <div v-if="!sarbsAlarmItems.length" class="col-span-12 m-auto flex flex-col items-center space-y-6">
        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">No Alarms Found</span>
      </div>
      <div v-if="sarbsAlarmItems.length" class="col-span-12 flex flex-col items-center justify-start">
        <div class="flex items-center justify-center pt-4">
          <span class="select-none text-sm font-medium text-gray-700">RECTIFIER ALARMS</span>
        </div>
        <div class="flex w-full flex-col items-start justify-center md:flex-row">
          <OEMAlarmGroup :alarm-group="leftSarbsAlarms" class="col-span-12 md:col-span-6" />
          <OEMAlarmGroup :alarm-group="rightSarbsAlarms" class="col-span-12 md:col-span-6" />
        </div>
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
      priorityIds: ['mains_failure', 'system_volts_low', 'llvd1', 'blvd'],
    }
  },
  computed: {
    ...mapGetters('oem', ['rectifierAlarmGroups']),
    sarbsAlarmItems() {
      const sarbsRectifierAlarmGroup = this.rectifierAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.JVOLT_ALARM)

      if (sarbsRectifierAlarmGroup) {
        // Sort priority alarms based on their order in priorityIds
        const priorityAlarms = sarbsRectifierAlarmGroup.items
          .filter(alarm => this.priorityIds.includes(alarm.id))
          .sort((a, b) => this.priorityIds.indexOf(a.id) - this.priorityIds.indexOf(b.id))

        const otherAlarms = sarbsRectifierAlarmGroup.items.filter(alarm => !this.priorityIds.includes(alarm.id))

        return [...priorityAlarms, ...otherAlarms]
      } else {
        return []
      }
    },
    leftSarbsAlarms() {
      return { label: '', items: this.sarbsAlarmItems.slice(0, this.sarbsAlarmItems.length / 2 + 1) }
    },
    rightSarbsAlarms() {
      return {
        label: '',
        items: this.sarbsAlarmItems.slice(this.sarbsAlarmItems.length / 2 + 1, this.sarbsAlarmItems.length),
      }
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
        rectifier_type: 'jvolt',
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
