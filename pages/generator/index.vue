<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Generator Status" />
    <SiteTabMenu class="mt-2" />
    <div class="grid grid-cols-12 items-stretch gap-2">
      <LiveGeneratorStatus v-if="dgPinOfFocusedTenant" :pin="dgPinOfFocusedTenant" title="DG Status"
        class="col-span-12 md:col-span-6 lg:col-span-3" />
      <GeneratorRunHourChart v-if="dgPin" :height="260" tag="dg" title="DG Run Hour History"
        @change-date="onDateChanged" />

      <LiveGeneratorStatus v-if="pgPinOfFocusedTenant" :pin="pgPinOfFocusedTenant" title="PG Status"
        class="col-span-12 md:col-span-6 lg:col-span-3" />
      <GeneratorRunHourChart v-if="pgPin" :height="260" tag="pg" title="PG Run Hour History"
        @change-date="onDateChanged" />

      <GeneratorRunHour v-if="dgTotalRunHourParams" tag="dg" :run-hour="totalDGRunHour" />
      <EventListCard v-if="dgPin" class="col-span-12 md:col-span-6 lg:col-span-3" title="DG Events" :items="dgEvents"
        :can-load-more="!alldgEventsFetched" :loading="loadingDGEvents" @load-more="fetchDGEvents" />

      <GeneratorRunHour v-if="pgTotalRunHourParams" tag="pg" :run-hour="totalPGRunHour" />
      <EventListCard v-if="pgPin" title="PG Events" :items="pgEvents" :can-load-more="!allpgEventsFetched"
        :loading="loadingPGEvents" class="col-span-12 md:col-span-6 lg:col-span-3" @load-more="fetchPGEvents" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup', 'user', 'site'],
  data: () => ({
    dgTotalRunHourParams: null,
    pgTotalRunHourParams: null,

    loadingDGEvents: false,
    loadingPGEvents: false,
  }),
  computed: {
    ...mapGetters('site', ['siteConfig', 'focusedTenant']),
    ...mapGetters('generator', {
      hasGeneratorService: 'isServiceAvailable',
    }),
    ...mapGetters('generator', [
      'dgPin',
      'dgPins',
      'pgPin',
      'pgPins',
      'totalRunHour',
      'dgEvents',
      'pgEvents',
      'alldgEventsFetched',
      'allpgEventsFetched',
    ]),
    dgPinOfFocusedTenant() {
      const pin = this.dgPins.find(pin => this.focusedTenant === pin.tenant)
      if (pin) {
        return pin
      }
      return this.dgPins.find(pin => !pin.tenant)
    },
    pgPinOfFocusedTenant() {
      const pin = this.pgPins.find(pin => this.focusedTenant === pin.tenant)
      if (pin) {
        return pin
      }
      return this.pgPins.find(pin => !pin.tenant)
    },
    totalDGRunHour() {
      return {
        ...this.dgTotalRunHourParams,
        duration: this.totalRunHour('dg'),
      }
    },
    totalPGRunHour() {
      return {
        ...this.pgTotalRunHourParams,
        duration: this.totalRunHour('pg'),
      }
    },
    siteUid() {
      return this.siteConfig.site.uid
    },
  },
  watch: {
    focusedTenant(val, old) {
      this.$store.commit('generator/CLEAR_ALL_EVENTS')
      this.fetchDGEvents()
      this.fetchPGEvents()
    },
  },
  mounted() {
    this.fetchDGEvents()
    this.fetchPGEvents()
  },
  methods: {
    onDateChanged(tag, params) {
      if (tag === 'dg') {
        this.dgTotalRunHourParams = params
      } else {
        this.pgTotalRunHourParams = params
      }
    },
    async fetchDGEvents() {
      this.loadingDGEvents = true
      try {
        await this.$store.dispatch('generator/getEvents', {
          siteUid: this.siteUid,
          event: 'dg_power',
          tag: 'dg',
          tenant: this.focusedTenant,
        })
      } catch (error) { }
      this.loadingDGEvents = false
    },
    async fetchPGEvents() {
      this.loadingPGEvents = true
      try {
        await this.$store.dispatch('generator/getEvents', {
          siteUid: this.siteUid,
          event: 'pg_power',
          tag: 'pg',
          tenant: this.focusedTenant,
        })
      } catch (error) { }
      this.loadingPGEvents = false
    },
  },
}
</script>
