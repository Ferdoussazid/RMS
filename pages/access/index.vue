<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Site Access" />
    <SiteTabMenu class="mt-2" />
    <div v-if="hasAccessService" class="grid grid-cols-12 items-stretch gap-2">
      <LiveAccessStatus class="col-span-12 md:col-span-6 lg:col-span-3" />
      <DigitalPinControl class="col-span-12 md:col-span-6 lg:col-span-9" />

      <EventListCard
        title="Door & Lock Events"
        :items="events"
        :loading="loadingEvents"
        :can-load-more="!allEventsFetched"
        class="col-span-12 md:col-span-6 lg:col-span-3"
        @load-more="fetchEvents"
      />

      <AccessRecordList
        :items="accessRecords"
        :loading="loadingRecords"
        class="col-span-12 md:col-span-6 lg:col-span-3"
      />
      <AccessCardList :items="accessCards" :loading="loadingCards" class="col-span-12 md:col-span-6 lg:col-span-3" />
      <AccessCardAddForm class="col-span-12 md:col-span-6 lg:col-span-3" />

      <DoorOpenHourChart class="col-span-12" :height="300" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup', 'user', 'site'],
  data: () => ({
    loadingEvents: false,
    loadingRecords: false,
    loadingCards: false,
  }),
  computed: {
    ...mapGetters('access', {
      hasAccessService: 'isServiceAvailable',
    }),
    ...mapGetters('access', ['pins', 'events', 'accessRecords', 'accessCards', 'allEventsFetched']),
    ...mapGetters('site', ['siteConfig']),
  },
  mounted() {
    this.fetchEvents()
    this.fetchAccessRecords()
    this.fetchAccessCards()
  },
  methods: {
    async fetchEvents() {
      this.loadingEvents = true
      try {
        await this.$store.dispatch('access/getEvents', this.siteConfig.site.uid)
      } catch (error) {}
      this.loadingEvents = false
    },

    async fetchAccessRecords() {
      this.loadingRecords = true
      try {
        await this.$store.dispatch('access/getAccessRecords')
      } catch (error) {}
      this.loadingRecords = false
    },

    async fetchAccessCards() {
      this.loadingCards = true
      try {
        await this.$store.dispatch('access/getAccessCards')
      } catch (error) {}
      this.loadingCards = false
    },

    // async toggleSwitch() {
    //   try {
    //     const data = { site_id: this.siteConfig.siteId, dc1: 1, dc2: 0 }
    //     await this.$store.dispatch('site/updateDigitalControls', data)
    //     this.$toast.success('Update successful')
    //   } catch (error) {
    //     this.$toast.error(error.message)
    //   }
    // },
  },
}
</script>
