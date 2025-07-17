<template>
  <NLink
    class="group flex w-full cursor-pointer items-stretch rounded-md bg-slate-100 shadow transition-all duration-300 ease-out hover:bg-slate-100"
    :to="targetUrl"
  >
    <div
      class="flex w-full items-center justify-between space-x-2 overflow-hidden rounded-l-md border-y border-l border-slate-200 px-4"
    >
      <span class="text-xs font-semibold text-slate-800 group-hover:text-blue-500">{{ alarmItem.label }}</span>
    </div>
    <div
      :class="[count === 0 ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500']"
      class="flex w-10 shrink-0 items-center justify-center rounded-r-md border-y border-r py-2"
    >
      <span class="text-center text-sm font-bold text-white">
        {{ count }}
      </span>
    </div>
  </NLink>
</template>

<script>
import { mapGetters } from 'vuex'
import { powerAlarms } from '~/assets/js/AlarmHelper'
import { SITE_ALARM } from '~/assets/js/Constant'
import utils from '~/mixins/utils'
export default {
  mixins: [utils],
  props: {
    alarmItem: {
      type: Object,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      altUrlAlarms: [SITE_ALARM.SITE_DOWN, SITE_ALARM.DC_LOW_VOLTAGE, SITE_ALARM.AC_LINE_FAIL],
    }
  },
  computed: {
    ...mapGetters('dashboard', ['selectedTenant']),
    targetUrl() {
      const query = { type: 'alarm', id: this.alarmItem.id, expected: 0 }
      if (this.alarmItem.tenant) {
        query.tenant = this.alarmItem.tenant
      } else if (powerAlarms.includes(this.alarmItem.id) && this.selectedTenant) {
        query.tenant = this.selectedTenant
      }
      const redirectionPath = this.altUrlAlarms.includes(this.alarmItem.id) ? '/site/availability' : '/site/list'
      return this.siteListUrl(query, redirectionPath)
    },
  },
}
</script>

<style lang="scss" scoped></style>
