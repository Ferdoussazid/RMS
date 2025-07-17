<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Site Details">
      <template #overview>
        <SiteAvailabilityPercentage :site="siteConfig.site" />
      </template>
    </AppToolbar>
    <SiteTabMenu class="mt-2" />
    <div :class="['grid grid-flow-row-dense grid-cols-12 gap-2']">
      <LivePowerStatus
        v-if="hasMainsService || isExternalDeviceVendor"
        class="col-span-12 md:col-span-6 lg:col-span-3"
        with-dg
      />

      <LiveBatteryBankStatus
        v-if="hasBatteryService || isExternalDeviceVendor"
        class="col-span-12 md:col-span-6 lg:col-span-3"
      />
      <LiveAccessStatus
        v-if="!isReadOnlyUser && hasAccessService && canAccessAcs"
        class="col-span-12 md:col-span-6 lg:col-span-3"
        can-unlock
      />
      <div
        v-if="isReadOnlyUser"
        class="md:min-h-auto relative col-span-12 h-full min-h-[50vh] w-full overflow-hidden bg-slate-100 md:col-span-6 lg:col-span-3"
      >
        <div class="absolute inset-0 flex flex-col items-start justify-start py-1 shadow-inner">
          <div class="flex h-full w-full flex-col items-center justify-center">
            <i class="fas fa-ban h-auto w-8 text-center text-sm font-semibold text-slate-500"></i>
            <span class="text-center text-sm font-normal italic text-slate-500"> Not Available </span>
          </div>
        </div>
      </div>

      <EventListCard
        title="Site Events"
        :items="events"
        :loading="loadingEvents"
        show-site-name
        :can-load-more="!allEventsFetched"
        class="col-span-12 md:col-span-6 lg:col-span-3"
        @load-more="fetchEvents"
      />

      <LiveFuelValue v-if="hasFuelService || isExternalDeviceVendor" />

      <div v-if="hasMainsService || isExternalDeviceVendor" class="col-span-12 grid grid-cols-6 gap-2">
        <PhaseVoltageChart
          :tenant="focusedTenant"
          class="col-span-12 md:col-span-6 lg:col-span-6"
          :is-at-top="false"
          :height="250"
        />
      </div>

      <TemperatureValueChart
        v-if="!isReadOnlyUser && hasTemperatureService"
        :is-at-top="false"
        class="col-span-12 lg:col-span-9"
        :height="250"
      />

      <LiveTemperatureValue
        v-if="!isReadOnlyUser && hasTemperatureService"
        :is-at-top="false"
        class="col-span-12 md:col-span-6 lg:col-span-3"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  middleware: ['auth', 'setup', 'user', 'site'],
  data: () => ({
    loadingEvents: false,
  }),
  computed: {
    ...mapGetters('site', ['siteConfig', 'events', 'allEventsFetched', 'focusedTenant', 'focusedSite']),
    ...mapGetters('mains', {
      hasMainsService: 'isServiceAvailable',
    }),
    ...mapGetters('battery', {
      hasBatteryService: 'isServiceAvailable',
    }),
    ...mapGetters('temperature', {
      hasTemperatureService: 'isServiceAvailable',
    }),
    ...mapGetters('access', {
      hasAccessService: 'isServiceAvailable',
    }),
    ...mapGetters('fuel', {
      hasFuelService: 'isServiceAvailable',
    }),
    isExternalDeviceVendor() {
      return !this.focusedSite?.isHslDeviceVendor
    },
  },
  watch: {
    focusedTenant(val, old) {
      this.$store.commit('site/CLEAR_EVENTS')
      this.fetchEvents()
    },
  },
  mounted() {
    this.$store.commit('site/CLEAR_EVENTS')
    this.fetchEvents()
  },
  methods: {
    async fetchEvents() {
      this.loadingEvents = true
      try {
        await this.$store.dispatch('site/getEvents', this.siteConfig.site.uid)
      } catch (error) {}
      this.loadingEvents = false
    },
  },
}
</script>
