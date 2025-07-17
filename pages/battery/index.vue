<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Battery Status">
      <template #overview>
        <div class="flex flex-row items-stretch space-x-2 py-2 md:py-0">
          <BatteryCurrentLabel v-for="(pin, i) in currentPinsOfFocusedTenant" :key="i" :pin="pin" />
          <PowerLabel
            v-if="showPowerLabel"
            :current-pins="currentPinsOfFocusedTenant"
            :voltage-pins="voltagePinsOfFocusedTenant"
          />
        </div>
        <!-- <PowerConsumptionIndicator :consumption="0" @change="onConsumptionMonthChanged" /> -->
      </template>
    </AppToolbar>
    <SiteTabMenu class="mt-2" />
    <div class="grid grid-flow-row-dense grid-cols-12 items-stretch gap-2">
      <LiveBatteryBankStatus class="col-span-12 md:col-span-6 lg:col-span-3" />
      <EventListCard
        class="col-span-12 md:col-span-6 lg:col-span-3"
        title="DC Power Events"
        :can-load-more="!allEventsFetched"
        :items="events"
        :loading="loadingEvents"
        @load-more="fetchEvents"
      />
      <DCPowerChart class="col-span-12 md:col-span-6 lg:col-span-6" :height="300" :tenant="focusedTenant" />
      <BatteryVoltageHistoryChart
        v-for="pin in voltagePinsOfFocusedTenant"
        :key="pin.id"
        :pin="pin"
        class="col-span-12 md:col-span-6 lg:col-span-6"
      />
      <BatteryCurrentHistoryChart :tenant="focusedTenant" class="col-span-12 md:col-span-6 lg:col-span-6" />
      <BatteryDischargeProfile />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SITE_TENANT } from '~/assets/js/Constant'

export default {
  middleware: ['auth', 'setup', 'user', 'site'],
  data: () => ({
    loadingEvents: true,
    dummyCriticalLoadPin: {
      label: 'Critical Load',
      ampere: 0.0,
    },
  }),
  computed: {
    ...mapGetters('site', ['siteConfig', 'focusedTenant']),
    ...mapGetters('user', ['rootUserUid', 'allowedTenants']),
    ...mapGetters('battery', ['events', 'voltagePins', 'currentPins', 'allEventsFetched']),
    currentPinsOfFocusedTenant() {
      const pins = this.currentPins.filter(pin => this.focusedTenant === (pin.tenant || SITE_TENANT.BANGLALINK))
      return this._.uniqBy(pins, 'priority')
    },
    voltagePinsOfFocusedTenant() {
      return this.voltagePins.filter(pin => this.focusedTenant === (pin.tenant || SITE_TENANT.BANGLALINK))
    },
    showPowerLabel() {
      return this.currentPinsOfFocusedTenant.length && this.voltagePinsOfFocusedTenant.length
    },
  },
  watch: {
    focusedTenant(val, old) {
      this.$store.commit('battery/CLEAR_EVENTS')
      this.fetchEvents()
    },
  },
  mounted() {
    this.$store.commit('battery/CLEAR_EVENTS')
    this.fetchEvents()
    this.fetchSettings()
    this.onConsumptionMonthChanged(new Date())
  },
  destroyed() {
    this.$store.commit('battery/CLEAR_EVENTS')
  },
  methods: {
    async fetchEvents() {
      this.loadingEvents = true
      try {
        await this.$store.dispatch('battery/getEvents', this.siteConfig.siteUid)
      } catch (error) {}
      this.loadingEvents = false
    },

    async fetchSettings() {
      const query = {
        site_uid: this.siteConfig.siteUid,
        user_uid: this.rootUserUid,
        page: 1,
        limit: 1,
      }
      await this.$store.dispatch('settings/fetchSiteSettings', query)
    },

    async onConsumptionMonthChanged(date) {
      try {
        await this.$store.dispatch('battery/getEnergyConsumption', {
          siteUid: this.siteConfig.site.uid,
          date: date.toISOString(),
        })
      } catch (error) {
        this.$toast.error(error.message)
      }
    },
  },
}
</script>
