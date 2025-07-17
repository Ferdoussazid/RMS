<template>
  <div class="col-span-12 flex min-h-[60vh] w-full flex-col gap-2 overflow-hidden rounded bg-slate-100 lg:col-span-5">
    <div v-if="!bmsAlarmItems.length" class="col-span-12 m-auto flex flex-col items-center space-y-6">
      <img src="/icon/empty.png" alt="" class="h-auto w-16" />
      <span class="text-sm font-light text-gray-500">No Alarms Found</span>
    </div>
    <div v-if="bmsAlarmItems.length" class="col-span-12 flex flex-col items-center justify-start">
      <div class="flex items-center justify-center pt-4">
        <span class="select-none text-sm font-medium text-gray-700">BMS ALARMS</span>
      </div>
      <div class="flex w-full flex-col items-start justify-center md:flex-row">
        <OEMAlarmGroup :alarm-group="leftBMSAlarms" class="col-span-12 md:col-span-6" />
        <OEMAlarmGroup :alarm-group="rightBMSAlarms" class="col-span-12 md:col-span-6" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { OEM_ALARM_GROUP } from '~/assets/js/Constant'

export default {
  computed: {
    ...mapGetters('oem', ['bmsAlarmGroups', 'selectedBatteryAddress']),
    bmsAlarmItems() {
      const bmsAlarmGroup = this.bmsAlarmGroups.find(g => g.name === OEM_ALARM_GROUP.BMS_ALARM)
      if (bmsAlarmGroup) {
        return bmsAlarmGroup.items.filter(i => i.battery_address === this.selectedBatteryAddress)
      }
      return []
    },
    leftBMSAlarms() {
      return { label: '', items: this.bmsAlarmItems.slice(0, this.bmsAlarmItems.length / 2 + 1) }
    },
    rightBMSAlarms() {
      return {
        label: '',
        items: this.bmsAlarmItems.slice(this.bmsAlarmItems.length / 2 + 1, this.bmsAlarmItems.length),
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
