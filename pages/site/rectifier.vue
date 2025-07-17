<template>
  <div class="flex flex-col w-full">
    <AppToolbar title="All Sites" :with-site-id="false" />
    <div class="flex flex-col w-full h-full mt-2 bg-white rounded shadow-md">
      <!-- <SiteFilterForm :alarm-filters="filters" :focused-event-name="focusedEventName" @tenant="handleDropdownTenant"
        @filter-click="handleFilterClick" /> -->
      <div class="flex flex-col w-full divide-y divide-gray-100">
        <SiteListHeader v-show="!fetching && filteredRectifierSites.length" />
        <div ref="listContainer" class="flex h-[70vh] w-full flex-col items-stretch overflow-scroll">
          <div v-if="fetching && !filteredSites.length" class="flex h-[70vh] flex-col space-y-2 p-2">
            <TableHeaderPlaceholder />
            <TableItemPlaceholder v-for="index in 8" :key="index" />
          </div>
          <div v-if="!filteredSites.length" class="flex flex-col items-center m-auto space-y-6">
            <img src="/icon/empty.png" alt="" class="w-16 h-auto" />
            <span class="text-sm font-light text-gray-500">No Site Found</span>
          </div>
          <div v-for="(site, j) in filteredRectifierSites" :key="site.uid + j" class="divide-y">
            <RectifierSiteListItem v-for="(tenant, i) in getFilteredTenants(site)" :key="site.uid + i" :serial="j + 1"
              :site="site" :with-event="getEventName(site)" :tenant="tenant" />
          </div>
          <div ref="sentinel" class="flex flex-col p-2">
            <!-- <LoadingSpinner v-if="isLoadingMore" /> -->
            <TableItemPlaceholder v-if="fetching || isLoadingMore" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { COMPANY } from '~/assets/js/Constant'
  import UserTypeChecker from '~/mixins/UserTypeChecker'
  import { getTenantsFromFilters } from '~/assets/js/SiteHelper'

  export default {
    mixins: [UserTypeChecker],
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
    }),
    computed: {
      ...mapGetters('user', ['allowedTenants', 'companyName']),
      ...mapGetters('site', ['sites', 'paginatedSites', 'fetchingPaginatedSites', 'hasMoreSites', 'fetchingSites', 'rectifierSites']),
      filteredRectifierSites() {
        return this.paginatedSites;
      },
      focusedEventName() {

        return ''
      },
      fetching() {
        if (this.isReadOnlyUser) {
          return this.fetchingSites
        }
        return this.fetchingPaginatedSites
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
    mounted() {
      this.currentFilters = { ...this.filters[0] }
      this.fetchPaginatedSites()
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
    },
    destroyed() {
      if (this.listEndObserver) {
        this.listEndObserver.disconnect()
      }
    },
    methods: {
      async fetchPaginatedSites() {
        await this.$store.dispatch('site/fetchRectifierSites', {
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
        await this.$store.dispatch('site/loadMoreRectifierSites', {
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

      getEventName(site) {
        return site.more_details.event_name;
      }
    },
  }
</script>

<style scoped></style>
