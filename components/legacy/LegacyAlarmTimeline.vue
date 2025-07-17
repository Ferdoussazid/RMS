<template>
  <div class="flex h-full w-full flex-col items-center justify-start bg-white">
    <div class="borde h-[700px] w-1/2 rounded py-2">
      <EventListCard
        title="Events"
        :items="allEvents"
        :loading="loading.ALL"
        :is-at-top="false"
        show-site-name
        :can-load-more="!allEventsFetched"
        class="h-[700px]"
        @load-more="fetchEvents('ALL')"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  middleware: ['auth', 'user'],
  data() {
    return {
      loading: {
        ALL: false,
      },
      intervalId: null,
      loadingExport: false,
      tenant: '',
      showExport: false,
    }
  },
  computed: {
    ...mapGetters('site', ['sites', 'fetchingSites']),
    ...mapGetters('user', ['rootUserUid', 'tokenExpired', 'allowedTenants']),
    ...mapGetters('dashboard', ['selectedTab', 'selectedTenant', 'fetchingDashboard', 'allEvents', 'allEventsFetched']),
  },

  watch: {
    tenant(val, old) {
      this.$store.commit('dashboard/SET_SELECTED_TENANT', val)
    },
  },
  mounted() {
    this.initializeEvents()
    this.initializeCounts()
  },
  destroyed() {
    clearInterval(this.intervalId)
  },

  methods: {
    onTabClick(tab) {
      this.$store.commit('dashboard/SET_SELECTED_TAB', tab)
    },
    initializeEvents() {
      this.fetchEvents('ALL')
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
  },
}
</script>
