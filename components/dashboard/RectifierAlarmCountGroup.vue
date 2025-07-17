<template>
  <div class="col-span-12 px-6 py-4 md:col-span-3 md:py-0">
    <div class="flex items-center">
      <span v-if="!masked" class="text-sm font-semibold text-gray-600">
        {{ title }}
      </span>
      <LoadingSpinner v-if="!allRectifierAlarms.length" class="scale-50" />
    </div>

    <div v-if="!masked" class="mt-2 flex flex-col items-stretch justify-start space-y-2.5 over overflow-y-auto"
      :class="{ 'max-h-[calc(10*3rem+20px)]': allRectifierAlarms.length > 9 }"
      style="-ms-overflow-style: none; scrollbar-width: none;">
      <RectifierAlarmCountItem v-for="(alarm, i) in allRectifierAlarms" :key="i" :alarm-item="alarm"
        :count="alarm.count" />
    </div>
    <div v-if="masked" class="flex w-full flex-col items-center justify-start py-[20vh]">
      <i class="w-6 h-auto text-sm font-semibold text-center fas fa-ban text-slate-500"></i>
      <span class="text-sm italic font-normal text-center text-slate-500"> Not Available </span>
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
        intervalId: null,

      }
    },


    computed: {
      ...mapGetters('dashboard', ['frequency', 'selectedTenant']),
      ...mapGetters('oem', ['rectifierAlarms', 'isRectifierAlarmFetched']),
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

      allRectifierAlarms() {
        return this.alarms;

      },



    },

    mounted() {


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
      async getRectifierAlarms() {
        await this.$store.dispatch('oem/getAllRectifierAlarms')

      },

      setDataFetchInterval() {
        this.intervalId = setInterval(() => {
          this.getRectifierAlarms()
        }, 10000)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
