<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Dashboard" :with-site-id="false">
      <template #action>
        <NLink
          to="/dashboard/legacy"
          v-if="canAccessLegacyDashboard"
          class="flex flex-row items-center space-x-2 rounded bg-blue-500 px-4 py-1.5 text-xs font-medium text-white transition duration-300 hover:bg-blue-600"
        >
          <i class="fas fa-layer-group"></i>
          <span>Legacy Dashboard</span>
        </NLink>
        <NLink
          to="/dashboard/business"
          class="flex flex-row items-center space-x-2 rounded bg-blue-500 px-4 py-1.5 text-xs font-medium text-white transition duration-300 hover:bg-blue-600"
        >
          <i class="fas fa-chart-pie"></i>
          <span>Business Dashboard</span>
        </NLink>
      </template>
    </AppToolbar>
    <CountSummaryBar />
    <div :class="['grid  auto-rows-max gap-2', !isRmsUser ? 'grid-cols-12' : 'grid-cols-9']">
      <EventListCard
        title="RMS Events"
        :items="rmsEvents"
        :loading="loading.RMS"
        :is-at-top="false"
        show-site-name
        :can-load-more="!allRMSEventsFetched"
        class="col-span-12 md:col-span-6 lg:col-span-3"
        @load-more="fetchEvents('RMS')"
      />
      <EventListCard
        v-if="!isReadOnlyUser && !isRmsUser"
        title="ACS Events"
        :items="acsEvents"
        :loading="loading.ACS"
        :is-at-top="false"
        show-site-name
        :can-load-more="!allACSEventsFetched"
        class="col-span-12 md:col-span-6 lg:col-span-3"
        @load-more="fetchEvents('ACS')"
      />
      <div
        v-else-if="!isRmsUser"
        class="md:min-h-auto relative col-span-12 h-full min-h-[50vh] w-full overflow-hidden bg-slate-100 md:col-span-6 lg:col-span-3"
      >
        <div class="absolute inset-0 flex flex-col items-start justify-start py-1 shadow-inner">
          <div class="flex h-full w-full flex-col items-center justify-center">
            <!-- <img src="/icon/unavailable.png" alt="" class="" /> -->
            <i class="fas fa-ban h-auto w-8 text-center text-sm font-semibold text-slate-500"></i>
            <span class="text-center text-sm font-normal italic text-slate-500"> Not Available </span>
          </div>
        </div>
      </div>

      <div class="col-span-12 grid auto-rows-max grid-cols-12 gap-2 lg:col-span-6">
        <MasterExport class="col-span-12" title="Export Data (All Sites)" :is-at-top="false" />
        <div class="col-span-12 flex flex-col items-center justify-center gap-2 md:flex-row">
          <PowerAlarmExport />
        </div>
        <div class="col-span-12 flex flex-col items-center justify-center gap-2 md:flex-row">
          <DgBackupCounts :masked="isReadOnlyUser" @export="exportExcel('dg')" />
          <TemperatureStatusCounts :masked="isReadOnlyUser" @export="exportExcel('temperature')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  middleware: ['auth', 'user', 'setup'],
  data: () => ({
    loading: {
      RMS: false,
      ACS: false,
    },
    intervalId: null,
  }),
  computed: {
    ...mapGetters('site', ['siteConfig', 'sites']),
    ...mapGetters('user', ['rootUserUid', 'allowedTenants']),
    ...mapGetters('dashboard', ['counts', 'rmsEvents', 'acsEvents', 'allRMSEventsFetched', 'allACSEventsFetched']),
  },
  mounted() {
    this.initializeEvents()
    this.initializeCounts()
  },
  destroyed() {
    clearInterval(this.intervalId)
  },
  methods: {
    initializeEvents() {
      this.fetchEvents('RMS')
      if (!this.isReadOnlyUser) {
        this.fetchEvents('ACS')
      }
    },
    initializeCounts() {
      this.countDashboardAlarms()
      this.$store.dispatch('dashboard/getStatusCounts', this.rootUserUid)
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
      } catch (error) {}
      this.loading[group] = false
    },
    async exportExcel(type) {
      try {
        const fileNames = {
          dg: 'DG running sites',
          mains: 'Mains availability of sites',
          battery: 'Site battery backup',
          temperature: 'Site temperature',
        }
        const options = {
          type,
          file_name: fileNames[type],
          user_uid: this.rootUserUid,
        }
        await this.$store.dispatch('dashboard/excelExport', options)
      } catch (e) {
        this.$toast.error(e.message)
      }
    },
  },
}
</script>
