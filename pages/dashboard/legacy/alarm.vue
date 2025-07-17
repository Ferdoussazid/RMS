<template>
  <div class="grid grid-cols-12 gap-5 p-4">
    <div class="col-span-12 min-h-screen lg:col-span-3" v-if="selectedFilter !== 'timeline'">
      <LegacyAlarmSidebar
        :selectedAlarms="selectedAlarms"
        @update:selectedAlarms="handleSelectedAlarms"
        @update:dateRange="updateDateRange"
      />
    </div>
    <div
      class="col-span-12 min-h-screen w-full rounded-md border bg-slate-100"
      :class="selectedFilter === 'all' ? 'lg:col-span-9' : 'lg:col-span-12'"
    >
      <div class="">
        <LegacyAlarmFilterForm
          :alarm-filters="filters"
          :filterTabs="filterTabs"
          :focused-event-name="focusedEventName"
          @filter="handleFilteredSites"
          @tenant="handleDropdownTenant"
          @filter-click="handleFilterClick"
          @filter-tabs="handleFilterTabs"
          :downloadData="downloadData"
          @search-result="handleSearchResult"
        />
        <div
          class="flex w-full flex-col divide-y divide-gray-100"
          v-if="formattedData !== null && selectedFilter !== 'timeline'"
        >
          <LegacySiteListHeader v-show="!fetching && formattedData.length" />
          <div
            ref="listContainer"
            class="flex max-h-[120vh] w-full flex-col items-stretch overflow-x-hidden overflow-y-scroll"
          >
            <div v-if="fetching && !formattedData.length" class="flex h-[70vh] flex-col space-y-2 p-2">
              <TableHeaderPlaceholder />
              <TableItemPlaceholder v-for="index in 8" :key="index" />
            </div>
            <div
              v-if="!fetching && !formattedData.length"
              class="flex h-full min-h-[80vh] w-full flex-col items-center space-y-6 pt-20 align-middle"
            >
              <img src="/icon/empty.png" alt="" class="h-auto w-16" />
              <span class="text-sm font-light text-gray-500">No Site Found</span>
            </div>

            <div v-for="(site, j) in formattedData" :key="site.id + '' + j" class="divide-y">
              <LegacySiteListItem
                :dataValues="generateDataValues(site)"
                :serial="j + 1"
                :site="site"
                :with-event="focusedEventName"
                :tenant="site.tenant"
              />
            </div>
            <div ref="sentinel" class="flex flex-col p-2">
              <!-- <LoadingSpinner v-if="isLoadingMore" /> -->
              <TableItemPlaceholder v-if="fetching || isLoadingMore" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectedFilter === 'timeline'" class="w-100">
        <LegacyAlarmTimeline />
      </div>
      <div v-else></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format, formatDistance } from 'date-fns'
import { getCompanySpecificEventLabel, getSiteEventNameFromAlarm } from '~/assets/js/LegacyHelper'
import { COMPANY, SITE_PROPERTY } from '~/assets/js/Constant'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { getTenantsFromFilters } from '~/assets/js/SiteHelper'
import { getTenantLabel } from '~/assets/js/Helper'

export default {
  mixins: [UserTypeChecker],
  layout: 'legacy',
  middleware: ['auth', 'setup', 'user'],
  asyncData({ query }) {
    const filters = []
    if (query.type) {
      filters.push(query)
    }
    return { filters }
  },
  data: () => ({
    filteredSites: [],
    visibleSiteItems: [],
    dropdownTenant: '',
    page: 1,
    limit: 30,
    isLoadingMore: false,
    currentFilters: {},
    previousScrollPosition: 0,
    totalLoadedItems: 0,
    itemsPerLoad: 30,
    listEndObserver: null,
    intervalId: null,
    filterTabs: [
      { name: 'all', label: 'All', active: true },
      { name: 'timeline', label: 'Timeline' },
    ],
    search: '',
    selectedFilter: 'all',
    downloadData: [],
    searchResults: null,
    selectedAlarms: [],
    dateRange: {
      start: null,
      end: null,
    },
  }),
  computed: {
    ...mapGetters('user', ['allowedTenants', 'companyName', 'rootUserUid']),
    ...mapGetters('site', ['sites', 'paginatedSites', 'fetchingPaginatedSites', 'hasMoreSites', 'fetchingSites']),
    ...mapGetters('dashboard-legacy', ['alarm', 'selectedTenant']),
    focusedEventName() {
      const filterType = this._.get(this.filters[0], 'type', '')
      const filterName = this._.get(this.filters[0], 'id', '')
      const expected = this._.get(this.filters[0], 'expected', '')
      let eventName = getSiteEventNameFromAlarm(filterName)
      if (filterType === 'property' && filterName === SITE_PROPERTY.DC_LOAD && expected === 'DOWN') {
        eventName = ''
      }
      return eventName
    },
    fetching() {
      if (this.isReadOnlyUser) {
        return this.fetchingSites
      }
      return this.fetchingPaginatedSites
    },
    formattedData() {
      if (this.alarm === null) {
        this.downloadData = []
        return null
      }

      const dt = this.alarm
        .filter(item => {
          if (!this.dateRange.start || !this.dateRange.end) {
            return true
          }
          return (
            new Date(item.time).getTime() >= new Date(this.dateRange.start).getTime() &&
            new Date(item.time).getTime() <= new Date(this.dateRange.end).getTime()
          )
        })
        .filter(item => {
          if (this.selectedAlarms.length > 0) {
            return this.selectedAlarms.includes(item.event_name)
          } else {
            return true
          }
        })
        .filter(item => {
          if (this.searchResults === null) {
            return true
          }

          return this.searchResults.includes(item.site_uid)
        })
        .filter(item => {
          return this.sites.filter(site => site.uid === item.site_uid).length > 0
        })
        .filter(item => {
          if (this.selectedTenant) {
            return item.tenant === this.selectedTenant
          }
          return true
        })
        .map((item, i) => {
          return {
            ...item,
            ...this.sites.find(site => site.uid === item.site_uid),
          }
        })
      //   console.log(dt)
      this.downloadData = dt.map(item => ({
        site: item,
        event_name: getCompanySpecificEventLabel(this.companyName, item.event_name),
        tenant: item.tenant,
        time: item.time ? this.formattedTime(item) : '',
        duration: item.end_at ? this.durationCalculate(item) : '',
      }))

      return dt
    },
  },
  watch: {
    fetchingPaginatedSites(newValue) {
      if (!newValue) {
        this.restoreScrollPosition()
      }
    },
    siteList(newValue) {
      if (this.isLoadingMore) {
        this.restoreScrollPosition()
      }
    },
  },
  async mounted() {
    this.currentFilters = { ...this.filters[0] }

    // All sites ('sites' getter) are fetched in background, it takes a bit long to fetch all sites.
    // So, we are fetching sites in paginated way ('siteList' getter) to show the sites in the list
    // on landing till all sites are fetched.

    if (!this.sites.length && !this.isReadOnlyUser) {
      this.fetchPaginatedSites()
    }
    if (this.companyName === COMPANY.FRONTIER_TOWERS_BD && !this.isReadOnlyUser) {
      this.fetchLiveDCValues()
    }
    this.setUpIntersectionObserver()
    await this.fetchData()
  },
  destroyed() {
    if (this.listEndObserver) {
      this.listEndObserver.disconnect()
    }
  },
  methods: {
    updateDateRange(val) {
      this.dateRange = val
    },
    handleSelectedAlarms(val) {
      this.selectedAlarms = val
    },
    handleFilterTabs(val) {
      this.selectedFilter = val
    },
    handleSearchResult(val) {
      this.searchResults = val
    },
    async fetchData() {
      this.$store.dispatch('dashboard-legacy/getAlarm', { user_uid: this.rootUserUid })
    },
    async fetchPaginatedSites() {
      await this.$store.dispatch('site/fetchSites', {
        filters: this.currentFilters,
        page: this.page,
        limit: this.limit,
      })
      this.filteredSites = [...this.paginatedSites]
      this.setVisibleItems(0, this.paginatedSites.length)
    },
    async loadMorePaginatedSites() {
      this.isLoadingMore = true
      this.previousScrollPosition = this.$refs.listContainer.scrollTop
      await this.$store.dispatch('site/loadMoreSites', {
        filters: this.currentFilters,
        page: this.page,
        limit: this.limit,
      })
      this.filteredSites = [...this.paginatedSites]
      this.setVisibleItems(0, this.paginatedSites.length)
      this.isLoadingMore = false
    },
    async fetchLiveDCValues() {
      await this.$store.dispatch('battery/getLiveDCMetrics')
      this.intervalId = setInterval(async () => {
        await this.$store.dispatch('battery/getLiveDCMetrics')
      }, 120 * 1000)
    },
    handleFilteredSites($event) {
      this.filteredSites = $event
      this.setVisibleItems(0, this.visibleSiteItems.length || this.itemsPerLoad)
    },
    handleDropdownTenant($event) {
      this.dropdownTenant = $event
    },
    handleFilterClick() {
      this.setVisibleItems(0, this.itemsPerLoad)
    },
    setVisibleItems(start, end) {
      this.visibleSiteItems = this.filteredSites.slice(start, end)
      this.totalLoadedItems = this.visibleSiteItems.length
    },
    updateVisibleItems() {
      this.isLoadingMore = true
      const startIndex = this.totalLoadedItems
      const endIndex = this.totalLoadedItems + this.itemsPerLoad
      if (this.totalLoadedItems <= this.filteredSites.length) {
        const newVisibleItems = this.filteredSites.slice(startIndex, endIndex)
        this.visibleSiteItems = [...this.visibleSiteItems, ...newVisibleItems]
        this.totalLoadedItems += newVisibleItems.length
      }
      this.isLoadingMore = false
    },
    setUpIntersectionObserver() {
      const options = {
        root: this.$refs.listContainer,
        threshold: 0.1,
      }
      this.listEndObserver = new IntersectionObserver(this.handleIntersection, options)
      if (this.$refs.sentinel) {
        this.listEndObserver.observe(this.$refs.sentinel)
      }
    },
    handleIntersection(entries) {
      const entry = entries[0]
      if (entry.isIntersecting) {
        if (!this.sites.length && this.hasMoreSites && !this.isLoadingMore && !this.isReadOnlyUser) {
          this.page += 1
          this.loadMorePaginatedSites()
        } else {
          this.updateVisibleItems()
        }
      }
    },
    restoreScrollPosition() {
      this.$refs.listContainer.scrollTop = this.previousScrollPosition + 10
    },
    getFilteredTenants(site) {
      if (this.isReadOnlyUser) {
        return site.tenants
      }
      if (this.dropdownTenant && this.dropdownTenant !== 'all') {
        return [this.dropdownTenant]
      }
      return getTenantsFromFilters(site, this.filters)
    },
    formattedTime(event) {
      // return format(new Date(), 'h:mm aaa, d MMM yyyy')
      return format(new Date(event.time), 'h:mm aaa, d MMM yyyy')
    },
    durationCalculate(event) {
      // const duration = formatDistance(new Date(event.end_at), new Date(event.time))
      const duration = formatDistance(new Date(), new Date(event.time))

      return duration
    },
    generateDataValues(site) {
      return [
        {
          value: site.event_name ? `${getCompanySpecificEventLabel(this.companyName, site.event_name)}` : '-',
          label: 'Name',
        },
        {
          value: site.tenant ? `${getTenantLabel(site.tenant, false)}` : '-',
          label: 'Tenant',
        },

        {
          value: site.time && site.end_at ? `${this.durationCalculate(site)}` : '-',
          label: 'Duration',
        },
        {
          value: site.time ? `${this.formattedTime(site)}` : '-',
          label: 'Time',
        },
      ]
    },
  },
}
</script>

<style scoped></style>
