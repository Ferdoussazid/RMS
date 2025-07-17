<template>
  <div class="col-span-12 px-6 py-4 md:col-span-3 md:py-0">
    <span v-if="!masked" class="text-sm font-semibold text-gray-600">
      {{ title }}
    </span>
    <div v-if="!masked" class="mt-2 flex flex-col items-stretch justify-start space-y-2.5">
      <AlarmCountItem v-for="(alarm, i) in visibleAlarms" :key="i" :alarm-item="alarm" :count="getAlarmCount(alarm)" />
      <div
        v-if="canExpand"
        class="flex w-full cursor-pointer items-stretch justify-center"
        @click="isExpanded = !isExpanded"
      >
        <i
          class="fas text-sm font-semibold text-slate-500"
          :class="[isExpanded ? 'fa-chevron-up' : 'fa-chevron-down']"
        ></i>
      </div>
    </div>
    <div v-if="masked" class="flex w-full flex-col items-center justify-start py-[20vh]">
      <i class="fas fa-ban h-auto w-6 text-center text-sm font-semibold text-slate-500"></i>
      <span class="text-center text-sm font-normal italic text-slate-500"> Not Available </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { powerAlarms } from '~/assets/js/AlarmHelper'
import { SITE_ALARM } from '~/assets/js/Constant'
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    alarms: {
      type: Array,
      required: true,
    },
    masked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hiddenAlarmIds: [SITE_ALARM.DOOR_STATUS, SITE_ALARM.DEVICE_ONLINE, SITE_ALARM.SECURITY_BREACH],
      isExpanded: false,
    }
  },
  computed: {
    ...mapGetters('dashboard', ['frequency', 'selectedTenant']),
    ...mapGetters('user', ['allowedTenants']),
    filteredTenantList() {
      if (this.selectedTenant) {
        return this.allowedTenants.filter(tenant => tenant === this.selectedTenant)
      }
      return this.allowedTenants
    },
    filteredAlarms() {
      return this.alarms.filter(alarm => !this.hiddenAlarmIds.includes(alarm.id))
    },
    canExpand() {
      return this.filteredAlarms.length > 9
    },
    visibleAlarms() {
      return this.isExpanded ? this.filteredAlarms : this.filteredAlarms.slice(0, 9)
    },
  },
  methods: {
    getAlarmCount(alarm) {
      if (alarm.tenant) return this.frequency[alarm.id + '_' + alarm.tenant] || 0
      if (powerAlarms.includes(alarm.id)) {
        let alarmCount = 0
        for (const tenant of this.filteredTenantList) {
          alarmCount += this.frequency[alarm.id + '_' + tenant] || 0
        }
        return alarmCount
      }
      return this.frequency[alarm.id] || 0
    },
  },
}
</script>

<style lang="scss" scoped></style>
