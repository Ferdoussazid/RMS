<template>
  <NLink
    class="flex items-stretch w-full transition-all duration-300 ease-out rounded-md shadow cursor-pointer group bg-slate-100 hover:bg-slate-100"
    :to="targetUrl">
    <div
      class="flex items-center justify-between w-full px-4 space-x-2 overflow-hidden border-l rounded-l-md border-y border-slate-200">
      <span class="text-xs font-semibold text-slate-800 group-hover:text-blue-500">{{ alarmLabel }}</span>
    </div>
    <div :class="[count === 0 ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500']"
      class="flex items-center justify-center w-10 py-2 border-r shrink-0 rounded-r-md border-y">
      <span class="text-sm font-bold text-center text-white">
        {{ count }}
      </span>
    </div>
  </NLink>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { powerAlarms } from '~/assets/js/AlarmHelper'
  import { SITE_ALARM } from '~/assets/js/Constant'
  import { getLabelOfRectifierAlarm } from '~/assets/js/RectifierHelper'
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
      ...mapGetters('user', ['rootUserUid']),
      targetUrl() {
        const query = { type: 'alarm', user_uid: this.rootUserUid, event_name: this.alarmItem.name }
        if (this.alarmItem.tenant) {
          query.tenant = this.alarmItem.tenant
        } else if (powerAlarms.includes(this.alarmItem.id) && this.selectedTenant) {
          query.tenant = this.selectedTenant
        }
        const redirectionPath = '/site/rectifier'
        return this.siteListUrl(query, redirectionPath)
      },
      alarmLabel() {
        return getLabelOfRectifierAlarm(this.alarmItem.name)
      }
    },
  }
</script>

<style lang="scss" scoped></style>
