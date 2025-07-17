<template>
    <div class="flex w-full flex-col">
        <div class="mt-2 flex h-full w-full flex-col rounded bg-white shadow-md" v-if="formattedData !== null">
            <LegacySiteFilterForm :alarm-filters="filters" :filterTabs="filterTabs"
                :focused-event-name="focusedEventName" @filter="handleFilteredSites" @tenant="handleDropdownTenant"
                @filter-click="handleFilterClick" @filter-tabs="handleFilterTabs" :downloadData="downloadData" />
            <div class="flex w-full flex-col divide-y divide-gray-100">
                <LegacySiteListHeader v-show="!fetching && formattedData.length" />
                <div ref="listContainer" class="flex h-[70vh] w-full flex-col items-stretch overflow-scroll">
                    <div v-if="fetching && !formattedData.length" class="flex h-[70vh] flex-col space-y-2 p-2">
                        <TableHeaderPlaceholder />
                        <TableItemPlaceholder v-for="index in 8" :key="index" />
                    </div>
                    <div v-if="!fetching && !formattedData.length" class="m-auto flex flex-col items-center space-y-6">
                        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
                        <span class="text-sm font-light text-gray-500">No Site Found</span>
                    </div>
                    <div v-for="(site, j) in formattedData" :key="j" class="divide-y">
                        <LegacySiteListItem :dataValues="generateDataValues(site)" :serial="j + 1" :site="site"
                            :with-event="focusedEventName" :tenant="site.tenant" />
                    </div>
                    <div ref="sentinel" class="flex flex-col p-2">
                        <!-- <LoadingSpinner v-if="isLoadingMore" /> -->
                        <TableItemPlaceholder v-if="fetching || isLoadingMore" />
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex h-[70vh] flex-col items-center justify-center space-y-6">
            <LoadingSpinner />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSiteEventNameFromAlarm, getTenantLabel } from '~/assets/js/Helper'
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
            { name: 'battery-low', label: 'Battery Low', active: false, count: 0, key: 'low_voltage', value: 'YES' },
            { name: 'battery-critical', label: 'Battery Critical', active: false, count: 0, key: 'critical_voltage', value: 'YES' },
        ],
        search: '',
        selectedFilter: 'all',
        downloadData: []
    }),
    computed: {
        ...mapGetters('user', ['allowedTenants', 'companyName', 'rootUserUid']),
        ...mapGetters('site', [
            'sites',
            'paginatedSites',
            'fetchingPaginatedSites',
            'hasMoreSites',
            'fetchingSites',
            'siteCount',
        ]),
        ...mapGetters('dashboard', ['frequency', 'loadCount']),
        ...mapGetters('dashboard-legacy', ['rectifier', 'selectedTenant']),
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
        formattedData() {
            if (this.rectifier === null) {
                this.downloadData = []
                return null
            }
            const dt = this.rectifier
                .filter(item => {
                    return this.filteredSites.filter(site => site.uid === item.site_uid).length > 0
                })
                .filter(item => {
                    if (this.selectedTenant) {
                        return item.tenant === this.selectedTenant
                    }
                    return true
                })
                .filter(item => {
                    if (this.selectedFilter === 'all') {
                        return true
                    }
                    return (
                        item[this.filterTabs.find(tab => tab.name === this.selectedFilter).key] ===
                        this.filterTabs.find(tab => tab.name === this.selectedFilter).value
                    )
                })
                .map((item, i) => {
                    return {
                        ...this.filteredSites.find(site => site.uid === item.site_uid),
                        ...item,
                        tenant: item.tenant === null ? 'banglalink' : item.tenant ? item.tenant : 'N/A',
                    }
                })
            this.downloadData = dt.map(item => ({
                site: item,
                tenant: item.tenant,
                voltage: item.voltage ? +item.voltage : '',
            }))

            return dt
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
        rectifier(newValue) {
            this.filterTabs[1].count = this.getStatusCount(newValue, 'low_voltage', 'YES')
            this.filterTabs[2].count = this.getStatusCount(newValue, 'critical_voltage', 'YES')
        },
        siteList(newValue) {
            if (this.isLoadingMore) {
                this.restoreScrollPosition()
            }
        },
    },
    async mounted() {
        this.currentFilters = { ...this.filters[0] }

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
        handleFilterTabs(val) {
            this.selectedFilter = val
        },
        async fetchData() {
            this.$store.dispatch('dashboard-legacy/getRectifier', { user_uid: this.rootUserUid })
        },

        getStatusCount(list, key, value) {
            if (!list) return 0
            return list.filter(item => item[key] === value).length
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
        generateDataValues(site) {
            return [
                { value: getTenantLabel(site.tenant, false), label: 'Tenant' },
                {
                    value: site.voltage ? `${parseFloat(site.voltage).toFixed(2)}V` : '-',
                    label: 'Voltage',
                },
            ]
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
            if (this.selectedTenant && this.selectedTenant !== 'all') {
                return [this.selectedTenant]
            }
            return getTenantsFromFilters(site, this.filters)
        },
    },
}
</script>

<style scoped></style>
