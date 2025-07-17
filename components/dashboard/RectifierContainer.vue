<template>
  <div class="flex flex-col w-full h-full px-4 overflow-hidden bg-white">
    <div class="flex justify-center w-full">
      <div class="grid w-full gap-2 p-4 md:grid-cols-5">
        <AggregatedCount class=" w-50" :count="sites.length ? siteCount.rectifier : '_'" :filter="filter.RECTIFIER"
          label="RECTIFIER INTEGRATED" theme="bg-cyan-600" :disable-link="!sites.length" />
        <AggregatedCount class="" :count="sites.length ? siteCount.eltek : '_'" :filter="filter.ELTEK" label="ELTEK"
          theme="bg-cyan-600" :disable-link="!sites.length || !siteCount.eltek > 0" v-if="isScl" />
        <AggregatedCount class="" :count="sites.length ? siteCount.sarbs : '_'" :filter="filter.SARBS" label="SARBS"
          theme="bg-cyan-600" :disable-link="!sites.length || !siteCount.sarbs > 0" />
        <AggregatedCount class="" :count="sites.length ? siteCount.vertiv : '_'" :filter="filter.VERTIV" label="VERTIV"
          theme="bg-cyan-600" :disable-link="!sites.length || !siteCount.vertiv > 0" />
        <AggregatedCount class="" :count="0" label="HUAWEI" theme="bg-cyan-600" :disable-link="true" />
        <AggregatedCount class="" :count="0" label="DPC " v-if="!isScl" theme="bg-cyan-600" :disable-link="true" />
      </div>
    </div>

    <div class="grid h-full grid-cols-12 gap-4 pb-2 mt-2">
      <RectifierAlarmCountGroup class="col-span-12 md:col-span-4" title="Alarms" :alarms="filteredAndReorderedAlarms" />

      <RectifierEventListCard title="Rectifier Events" class="h-full col-span-12 md:col-span-4" :items="rectifierEvents"
        :is-at-top="false" :loading="loading" :can-load-more="!allRectifierEventsFetched"
        @load-more="getRectifierEvents()" />
      <RectifierExport class="col-span-12 md:col-span-4" title="Export Events" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { alarmFilterGroups } from '~/assets/js/AlarmHelper'
import { COMPANY, INSTALLED_TENANTS, SITE_PROPERTY, SITE_FILTER_TYPE } from '~/assets/js/Constant'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import utils from '~/mixins/utils'

export default {
  mixins: [utils, UserTypeChecker],
  data() {
    return {
      intervalId: null,
      fixedOrder: ["mains_fail", "battery_low", "site_down", "rectifier_fail"],
      loading: false,
      filter: {
        RECTIFIER: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.RECTIFIER, exists: 1 },
        SARBS: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.RECTIFIER, rectifier_type: SITE_PROPERTY.SARBS, exists: 1 },
        ELTEK: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.RECTIFIER, rectifier_type: SITE_PROPERTY.ELTEK, exists: 1 },
        VERTIV: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.RECTIFIER, rectifier_type: SITE_PROPERTY.VERTIV, exists: 1 }

      },
    }
  },
  computed: {
    ...mapGetters('user', ['companyName', 'rootUserUid']),
    ...mapGetters('dashboard', ['selectedTenant']),
    ...mapGetters('site', ['sites', 'siteCount']),
    ...mapGetters('oem', ['rectifierEvents', 'allRectifierEventsFetched', 'rectifierAlarms']),

    visibleAlarms() {
      return this.rectifierAlarms
    },

    powerAlarms() {
      return this.getMappedAlarms(
        alarmFilterGroups[0].items.filter(item => {
          if (item.tenant) {
            if (this.selectedTenant) {
              return item.tenant === this.selectedTenant
            }
            return INSTALLED_TENANTS.includes(item.tenant)
          }
          return true
        })
      )
    },
    isFTB() {
      return this.companyName === COMPANY.FRONTIER_TOWERS_BD
    },
    firstPowerAlarms() {
      if (this.isFTB && this.selectedTenant) {
        return this.powerAlarms.slice(0, 5)
      }
      return this.powerAlarms.slice(0, 9)
    },
    secondPowerAlarms() {
      if (this.isFTB && this.selectedTenant) {
        return this.powerAlarms.slice(5, this.powerAlarms.length)
      }
      return this.powerAlarms.slice(9, this.powerAlarms.length)
    },
    envAlarms() {
      return alarmFilterGroups[2].items
    },
    accessAlarms() {
      return alarmFilterGroups[1].items
    },

    filteredAndReorderedAlarms() {
      // Ensure fixedOrder alarms always appear, even if their count is 0
      const fixedAlarms = this.fixedOrder.map((name) =>
        this.rectifierAlarms.find((alarm) => alarm.name === name) || { name, count: 0 }
      );

      // Include other alarms only if their count is greater than 0
      const otherAlarms = this.rectifierAlarms.filter(
        (alarm) => !this.fixedOrder.includes(alarm.name) && alarm.count > 0
      );

      // Combine fixed alarms with other alarms
      return [...fixedAlarms, ...otherAlarms];
    },
  },
  async mounted() {
    await this.getRectifierAlarms()
    await this.getRectifierEvents()
    this.setDataFetchInterval()
  },
  destroyed() {
    clearInterval(this.intervalId)

  },

  methods: {

    async getRectifierEvents() {
      this.loading = true
      await this.$store.dispatch('oem/getRectifierEvent', { user_uid: this.rootUserUid })
      this.loading = false

    },

    async getRectifierAlarms() {
      await this.$store.dispatch('oem/getAllRectifierAlarms', { user_uid: this.rootUserUid });

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
