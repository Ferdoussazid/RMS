<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Temperature" />
    <SiteTabMenu class="mt-2" />
    <div class="grid grid-flow-row-dense grid-cols-12 items-stretch gap-2">
      <LiveTemperatureValue class="col-span-12 md:col-span-6 lg:col-span-3" />
      <LiveHumidityValue class="col-span-12 md:col-span-6 lg:col-span-3" />
      <TemperatureValueChart class="col-span-12 lg:col-span-6" :height="300" />

      <EventListCard
        title="Temperature Events"
        :items="events"
        :can-load-more="!allEventsFetched"
        :loading="loadingEvents"
        class="col-span-12 md:col-span-6 lg:col-span-3"
        @load-more="fetchEvents"
      />
      <TemperatureHistoryChart class="col-span-12 lg:col-span-9" :height="300" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup', 'user', 'site'],
  data: () => ({
    loadingEvents: true,
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('temperature', ['events', 'allEventsFetched']),
  },
  mounted() {
    this.fetchEvents()
  },
  methods: {
    async fetchEvents() {
      this.loadingEvents = true
      try {
        await this.$store.dispatch('temperature/getEvents', this.siteConfig.siteUid)
      } catch (error) {}
      this.loadingEvents = false
    },
  },
}
</script>
