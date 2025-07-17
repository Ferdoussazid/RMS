<template>
  <div class="flex flex-col w-full min-h-screen gap-2">
    <AppToolbar title="Dashboard" :with-site-id="false">
      <template #action>
        <div class="flex flex-row items-center space-x-2 px-4 py-1.5 text-xs font-medium">
          <span></span>
        </div>
      </template>
    </AppToolbar>
    <div class="grid grid-cols-12 gap-2">
      <div class="flex flex-col col-span-12 space-y-2 lg:col-span-4">
        <div class="grid grid-cols-6 col-span-12 gap-2 p-2 bg-white rounded-md lg:col-span-4">
          <AggregatedCount class="col-span-3 md:col-span-2" :count="siteCount.total" icon="/icon/tower.png"
            label="Total Sites" theme="bg-green-500" />
          <AggregatedCount class="col-span-3 md:col-span-2" :count="getStatusCount('DOWN')" icon="/icon/battery11.png"
            label="DC No Load" :filter="filter.DC_NO_LOAD" theme="bg-red-500" />
          <AggregatedCount class="col-span-3 md:col-span-2" :count="getStatusCount('OVER')" icon="/icon/battery11.png"
            label="DC Overload" :filter="filter.DC_OVER" theme="bg-red-500" />
        </div>

        <ContentCard title="Power" class="" :is-top-blending="false">
          <template #content>
            <div v-if="loading.RMS && !rmsEvents.length" class="flex items-center justify-center w-full h-full">
              <CircularSpinner />
            </div>
            <div v-else class="grid w-full h-full grid-cols-12">
              <MainPowerDashboard
                class="col-span-12 border-b border-r-0 border-slate-300 md:col-span-6 md:border-b-0 md:border-r lg:col-span-12 lg:border-b lg:border-r-0" />
              <MainOutageDashboard class="col-span-12 md:col-span-6 lg:col-span-12" />
            </div>
          </template>
        </ContentCard>
      </div>
      <div class="flex flex-col col-span-12 space-y-2 lg:col-span-4">
        <div class="h-[250px]">
          <ContentCard title="Alarms" class="">
            <template #content>
              <div v-if="loading.alarms" class="flex h-[250px] items-center justify-center">
                <CircularSpinner />
              </div>
              <div v-else class="grid h-[250px] grid-cols-3 divide-y divide-slate-200 p-4 md:divide-x md:divide-y-0">
                <AlarmCountGroup title=" " :alarms="powerAlarms" />
              </div>
            </template>
          </ContentCard>
        </div>
        <MasterExport class="" title="Export Data (All Sites)" :show-all-tags="true" />
      </div>

      <div class="flex flex-col col-span-12 space-y-2 lg:col-span-4">
        <EventListCard title="RMS Events" :items="rmsEvents" :loading="loading.RMS" show-site-name
          :can-load-more="!allRMSEventsFetched" :is-at-top="false" class="col-span-12 md:col-span-6 lg:col-span-3"
          @load-more="fetchEvents('RMS')" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { alarmFilterGroups } from '~/assets/js/AlarmHelper'
  import { SITE_FILTER_TYPE, SITE_PROPERTY } from '~/assets/js/Constant'
  import UserTypeChecker from '~/mixins/UserTypeChecker'

  export default {
    mixins: [UserTypeChecker],
    middleware: ['auth', 'user'],
    data() {
      return {
        loading: {
          alarms: false,
          RMS: true,
        },
        intervalId: null,
        filter: {
          DC_NO_LOAD: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.DC_LOAD, expected: 'DOWN' },
          DC_OVER: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.DC_LOAD, expected: 'OVER' },
        },
      }
    },
    computed: {
      ...mapGetters('site', ['siteConfig', 'sites', 'siteCount']),
      ...mapGetters('user', ['rootUserUid', 'allowedTenants', 'tokenExpired']),
      ...mapGetters('dashboard', ['rmsEvents', 'allRMSEventsFetched', 'loadCount']),

      tenant() {
        return this.$route.params.tenant
      },
      powerAlarms() {
        const alarms = alarmFilterGroups[0].items.filter(item => (item.tenant ? this.tenant === item.tenant : true))
        return alarms.slice(0, 3)
      },
    },

    mounted() {
      this.fetchEvents('RMS')
      if (this.sites.length === 0 && !this.tokenExpired) {
        this.$store.dispatch('site/setupSites')
      }
      this.initializeCounts()
    },
    destroyed() {
      clearInterval(this.intervalId)
    },

    methods: {
      initializeCounts() {
        this.loading.alarms = true
        this.countDashboardAlarms()
        this.$store.dispatch('dashboard/getStatusCounts', this.rootUserUid)
        this.loading.alarms = false
      },
      countDashboardAlarms() {
        this.intervalId = setInterval(async () => {
          await this.$store.dispatch('dashboard/updateAlarmDashboard')
        }, 2000)
      },
      async fetchEvents(group) {
        this.loading[group] = true
        try {
          await this.$store.dispatch('dashboard/getEvents', { userUid: this.rootUserUid, group })
        } catch (error) { }
        this.loading[group] = false
      },
      getStatusCount(status) {
        let count = 0
        for (const tenant of this.allowedTenants) {
          count += this.loadCount[status][tenant]
        }
        return count
      },
    },
  }
</script>
