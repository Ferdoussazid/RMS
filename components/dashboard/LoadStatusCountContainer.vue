<template>
  <div class="flex grow flex-col items-center lg:min-h-[70vh]">
    <div
      class="flex w-full shrink-0 flex-row items-center justify-between border-b border-gray-200 bg-slate-100 px-4 py-1"
    >
      <h3 class="text-sm font-semibold text-gray-600">Load Status</h3>
      <button
        class="rounded border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition duration-300 hover:bg-slate-100"
        @click="onDatePickerClick"
      >
        <i class="fas fa-calendar"></i>
        <span class="ml-1">{{ selectedDateLabel }}</span>
      </button>
    </div>
    <DateTimePickerModal
      ref="datePicker"
      :range-picker="true"
      tag="availability"
      :time-picker="false"
      :range="selectedLoadCountItem.date"
      @range="onDateRangePicked"
    />

    <div class="grid w-full grid-cols-12 justify-center gap-2 p-2">
      <div class="relative col-span-12 w-full md:col-span-5">
        <div
          v-if="fetching.power"
          class="absolute inset-0 z-50 flex h-[52vh] w-full items-center justify-center bg-white opacity-70"
        >
          <CircularSpinner />
        </div>
        <LoadStatusCountTable v-if="!fetching.power" @range="onRangeSelect" @filter="onSitesFitered" />
      </div>
      <div class="relative col-span-12 flex flex-col items-center gap-2 md:col-span-7">
        <div
          v-if="fetching.site || fetching.power"
          class="absolute inset-0 z-50 flex h-[52vh] w-full items-center justify-center bg-white opacity-70"
        >
          <CircularSpinner />
        </div>
        <div class="flex w-full items-center justify-between rounded bg-sky-300 p-2 shadow-md">
          <span class="text-sm font-semibold text-slate-900">Range: {{ selectedRangeStr }}</span>
          <SearchableSiteDropdown
            class="md:w-48"
            :with-all-sites-option="false"
            placeholder="Search a site"
            :sites="sitesInRangeWithName"
            @single="onSiteSelect"
          />
        </div>
        <div class="flex h-full w-full flex-col items-center justify-end">
          <DCPowerChart
            v-if="!(fetching.site || fetching.power) && selectedLoadCountItem.site"
            :show-site-name="true"
            :tenant="focusedTenant"
            class="w-full"
            :range="selectedLoadCountItem.date"
            :is-at-top="false"
          />
          <div
            v-if="!(fetching.site || fetching.power) && !selectedLoadCountItem.site"
            class="flex h-full w-full flex-col items-center justify-center rounded bg-sky-100 shadow-md"
          >
            <img src="/icon/empty.png" alt="" class="h-auto w-16" />
            <span class="text-sm font-light text-gray-500">No Site Found in This Range</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { differenceInSeconds, format } from 'date-fns'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      fetching: { power: false, site: false },
      selectedRange: null,
      sitesInSelectedRange: [],
    }
  },

  computed: {
    ...mapGetters('site', ['siteUid2Name', 'focusedSite', 'focusedTenant']),
    ...mapGetters('dashboard', ['powerData', 'selectedLoadCountItem']),
    ...mapGetters('user', ['rootUserUid']),
    selectedDateLabel() {
      const startDate = this.selectedLoadCountItem.date.start
      const endDate = this.selectedLoadCountItem.date.end

      if (differenceInSeconds(endDate, startDate) > 86400) {
        const start = format(startDate, 'd MMM yy')
        const end = format(endDate, 'd MMM yy')
        return start + ' - ' + end
      }
      return format(startDate, 'd MMM yyyy')
    },
    selectedRangeStr() {
      let rangeStart = this.selectedLoadCountItem.range.start
      if (rangeStart === -1) {
        rangeStart = 0
      }
      const rangeEnd = this.selectedLoadCountItem.range.end

      if (rangeEnd === Infinity) {
        return `${rangeStart}KW <`
      }
      return `${rangeStart}KW - ${rangeEnd}KW`
    },
    sitesInRangeWithName() {
      return this.sitesInSelectedRange.map(item => ({
        ...item,
        id: item.site_uid,
        name: this.siteUid2Name[item.site_uid],
      }))
    },
  },
  mounted() {
    if (!this.powerData.length) {
      this.fetchPowerData()
    }
  },
  methods: {
    async fetchPowerData() {
      try {
        this.fetching.power = true
        await this.$store.dispatch('dashboard/getPowerData', {
          user_uid: this.rootUserUid,
          from_time: this.selectedLoadCountItem.date.start,
          until_time: this.selectedLoadCountItem.date.end,
        })
      } catch (error) {}
      this.fetching.power = false
    },
    onDatePickerClick() {
      this.$refs.datePicker.show()
    },
    async onDateRangePicked(range) {
      this.$refs.datePicker.dismiss()
      this.setSelectedItem('date', range)
      await this.fetchPowerData()
    },
    onSitesFitered(sites) {
      this.sitesInSelectedRange = [...sites]
    },
    onRangeSelect({ range, sites }) {
      this.selectedRange = range
      this.sitesInSelectedRange = [...sites]
      const selectedSite = sites.length ? sites[0] : null
      this.onSiteSelect(selectedSite)
    },
    async onSiteSelect(site) {
      this.setSelectedItem('site', site)
      if (site) {
        // For Power Graph
        this.fetching.site = true
        this.$store.commit('site/SET_FOCUSED_TENANT', this.selectedLoadCountItem.site.tenant)
        await this.$store.dispatch('site/getSiteConfig', this.selectedLoadCountItem.site.site_uid)
        this.fetching.site = false
      }
    },

    setSelectedItem(key, value) {
      this.$store.commit('dashboard/SET_SELECTED_LOAD_COUNT_ITEM', { key, value })
    },
  },
}
</script>

<style lang="scss" scoped></style>
