<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Mains Status">
      <template #overview>
        <MainsAvailabilityPercentage :site="siteConfig.site" />
      </template>
    </AppToolbar>
    <SiteTabMenu class="mt-2" />
    <div class="grid grid-flow-row-dense grid-cols-12 items-stretch gap-2">
      <LivePowerStatus class="col-span-12 md:col-span-6 lg:col-span-3" />
      <EventListCard title="Mains Power Events" :items="events" :loading="loadingEvents"
        :can-load-more="!allEventsFetched" class="col-span-12 md:col-span-6 lg:col-span-3" @load-more="fetchEvents" />
      <PhaseVoltageChart :tenant="focusedTenant" class="col-span-12 lg:col-span-6" :height="300" />
      <MonthlyPowerTrendChart :tenant="focusedTenant" class="col-span-12 lg:col-span-6" :height="300" />
      <PhaseAvailableChart :tenant="focusedTenant" class="col-span-12 lg:col-span-6" :height="300" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup', 'user', 'site'],
  data: () => ({
    tenants: [],
    loadingEvents: false,
  }),
  computed: {
    ...mapGetters('site', ['siteConfig', 'focusedTenant']),
    ...mapGetters('mains', ['events', 'allEventsFetched']),
  },
  watch: {
    focusedTenant(val, old) {
      this.$store.commit('mains/CLEAR_EVENTS')
      this.fetchEvents()
    },
  },
  mounted() {
    this.$store.commit('mains/CLEAR_EVENTS')
    this.fetchEvents()
  },
  destroyed() {
    this.$store.commit('mains/CLEAR_EVENTS')
  },
  methods: {
    async fetchEvents() {
      this.loadingEvents = true
      try {
        await this.$store.dispatch('mains/getEvents')
      } catch (error) { }
      this.loadingEvents = false
    },
  },
}
</script>
