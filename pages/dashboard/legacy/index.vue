<template>
    <div>
        <div class="flex justify-center pt-40" v-if="loading">
            <LoadingSpinner />
        </div>
        <div class="grid grid-cols-12 w-full p-6 gap-5">
            <LegacyAllRmsStationGraph :loading="loading" v-for="item in types" :key="item" :type="item"
                @stopLoader="loading = false" />
            <AllRmsStationViewSettings :selectedTypes="types" @updateTypes="types = $event" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSiteEventNameFromAlarm } from '~/assets/js/Helper'
import { COMPANY, SITE_PROPERTY } from '~/assets/js/Constant'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { getTenantsFromFilters } from '~/assets/js/SiteHelper'

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
        //types: ["mains_fail"],
        types: ["mains_fail", "pg_run", "battery_low", "site_down"],
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
            { name: 'all', label: 'All' },
        ],
        viewSettings: true,
        loading: true,
    }),
    computed: {
        ...mapGetters('user', ['allowedTenants', 'companyName']),
        ...mapGetters('site', ['sites', 'paginatedSites', 'fetchingPaginatedSites', 'hasMoreSites', 'fetchingSites']),
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

        // All sites ('sites' getter) are fetched in background, it takes a bit long to fetch all sites.
        // So, we are fetching sites in paginated way ('siteList' getter) to show the sites in the list
        // on landing till all sites are fetched.

        if (!this.sites.length && !this.isReadOnlyUser) {
            this.fetchPaginatedSites()
        }
        if (this.companyName === COMPANY.FRONTIER_TOWERS_BD && !this.isReadOnlyUser) {
            this.fetchLiveDCValues()
        }
        if (localStorage && localStorage.getItem('rms_selectedTypes')) {
            this.types = JSON.parse(localStorage.getItem('rms_selectedTypes'))
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
    },
}
</script>

<style scoped></style>