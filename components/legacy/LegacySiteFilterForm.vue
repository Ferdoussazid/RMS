<template>

  <div class="grid items-stretch grid-cols-12 gap-4 px-6 py-4 rounded bg-white/80">
    <div class="col-span-12 md:col-span-7 lg:col-span-8 ">
      <button v-for="tab in filterTabs" :key="tab.name"
        class="col-span-2 cursor-pointer rounded border border-slate-200  py-1.5 px-4 text-xs font-medium  shadow-sm md:col-span-1 mr-1"
        :class="isActiveFilter(tab.name) ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'"
        @click="changeSelectedFilter(tab.name)">{{ tab.label }} <span v-if="tab.count"
          class="text-[10px] py-0.5 px-1.5 rounded"
          :class="isActiveFilter(tab.name) ? 'text-blue-600 bg-white' : 'bg-slate-300'">{{
            tab.count
          }}</span></button>
    </div>
    <div class="flex sm:flex-row flex-col justify-between align-middle col-span-12 gap-4 md:col-span-5 lg:col-span-4">
      <SearchInputField v-model="search" :class="searchGridSpan" />
      <button
        class="col-span-2 cursor-pointer rounded border border-slate-200 bg-white py-1.5 pl-4 pr-8 text-xs font-medium text-gray-600 shadow-sm md:col-span-1"
        @click="updateSort()">
        <i class="fas fa-sort-amount-up" v-if="getSort"></i><i class="fas fa-sort-amount-down" v-else></i>
        Sort</button>
      <button @click="exportHandeler" v-if="showExportButton"
        class="col-span-2 cursor-pointer rounded border border-slate-200 bg-blue-500 py-1.5 pl-4 pr-4 text-xs font-medium text-white shadow-sm md:col-span-1">
        <i v-if="loadingExport" class="fas fa-circle-notch fa-spin"></i><i class="fas fa-download" v-else></i>
        Export</button>
    </div>


  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UserTypeChecker from '~/mixins/UserTypeChecker';
import {
  filterSiteListByTextSearch,
  siteListAlphabeticSort,
  siteListEventTimeSort,
  filterExpectedAlarms,
} from '~/assets/js/SiteHelper'
import { LEGACY_PAGES } from '~/assets/js/Constant';
import { LegacyExportAction } from '~/assets/js/LegacyExporExcel';
const downloadFile = require('js-file-download')
export default {
  mixins: [UserTypeChecker],
  props: {
    alarmFilters: {
      type: Array,
      required: true,
    },
    focusedEventName: {
      type: String,
      required: false,
      default: '',
    },
    filterTabs: {
      type: Array,
      required: false,
      default: () => [],
    },
    downloadData: {
      type: Array,
      required: false,
      default: () => [],
    }

  },
  data: () => ({
    filters: [],
    dropdownFilters: [],
    search: '',
    debounceTimer: null,
    filteredSites: [],
    selectedFilter: 'all',
    loadingExport: false,
  }),
  computed: {
    ...mapGetters('site', ['sites']),
    ...mapGetters('user', ['allowedTenants', 'companyName', 'rootUserUid']),
    ...mapGetters('dashboard-legacy', ['selectedTab', 'selectedTenant', 'fetchingDashboard', 'getLegacySort', 'dcEnergyMeterSort', 'climateSort', 'rectifierSort']),
    tenantList() {
      const tenants = ['all', ...this.allowedTenants]
      return tenants
    },
    getSort() {
      return this.selectedTab === LEGACY_PAGES.DC_ENERGY_METER ? this.dcEnergyMeterSort === 'asc' : this.selectedTab === LEGACY_PAGES.CLIMATE ? this.climateSort === 'asc' : this.rectifierSort === 'asc'
    },
    searchGridSpan() {
      return 'col-span-12'
    },
    showExportButton() {
      return this.selectedTab !== LEGACY_PAGES.BATTERY
    },
    tenantGridSpan() {
      if (this.showTenantFilter) {
        return 'col-span-12 md:col-span-5 lg:col-span-5'
      }
      return ''
    },
    showSiteDump() {
      const path = this.$route.fullPath
      const allowedPaths = [
        '/site/list',
        '/site/list?type=alarm&id=lock_status',
        '/site/list?type=property&id=devices&exists=1',
      ]
      return this.isSuperUser && allowedPaths.includes(path)
    },
  },
  watch: {
    selectedFilter(val, old) {
      this.$emit('filter-click')
    },
    search(val, old) {
      clearTimeout(this.debounceTimer)

      this.filterSites()
      this.$emit('filter-click')

    },
    filters(val, old) {
      this.filterSites()
      this.$emit('filter-click')
    },
    dropdownFilters(val, old) {
      this.filterSites()
      this.$emit('filter-click')
    },
  },
  mounted() {
    this.filterSites()
  },
  destroyed() {
    clearInterval(this.intervalId)
  },
  methods: {
    siteName() {
      return this.site.name
    },

    getTowerCoId(site) {
      if (!site.name) {
        return '-'
      }
      return site.name.split('_')[0]
    },
    getCluster(site) {
      if (!site.place.cluster) {
        return '-'
      }
      return site.place.cluster

    },
    getZone(site) {
      if (!site.place.zone) {
        return '-'
      }
      return site.place.zone

    },
    changeSelectedFilter(val) {
      this.selectedFilter = val
      this.$emit('filter-tabs', val)
    },
    updateSearch(val) {
      this.$emit('search', val)
    },
    isActiveFilter(val) {
      return this.selectedFilter === val
    },
    updateSort() {
      if (this.selectedTab === LEGACY_PAGES.DC_ENERGY_METER) {
        this.$store.dispatch('dashboard-legacy/sortDcEnergyMeter', { key: 'load' })
      } else if (this.selectedTab === LEGACY_PAGES.CLIMATE) {
        this.$store.dispatch('dashboard-legacy/sortClimate', { key: 'temperature' })
      } else if (this.selectedTab === LEGACY_PAGES.RECTIFIER) {
        this.$store.dispatch('dashboard-legacy/sortRectifier', { key: 'voltage' })
      }
      this.filterSites()
    },
    filterSites() {
      let items = [...this.sites]
      if (this.search.trim().length) {
        items = filterSiteListByTextSearch(items, this.search)
      }

      if (this.area) {
        items = items.filter(s => this._.get(s, 'place.division', '') === this.area)
      }

      if (this.cluster) {
        items = items.filter(s => this._.get(s, 'place.cluster', '') === this.cluster)
      }

      if (this.tenant && this.tenant !== 'all') {
        items = items.filter(s => this._.get(s, 'tenants', []).includes(this.tenant))
      }

      if (this.filters.length) {
        items = items.filter(this.inclusiveFilter(this.filters))
      }

      if (this.dropdownFilters.length) {
        items = items.filter(this.exclusiveFilter(this.dropdownFilters))
      }

      if (this.focusedEventName) {
        items.sort(siteListEventTimeSort(this.filters[0]))
      } else {
        items.sort(siteListAlphabeticSort)
      }
      this.filteredSites = [...items]
      this.$emit('filter', this.filteredSites)
    },
    inclusiveFilter(filters) {
      return site => {
        let include = true
        for (const filter of filters) {
          if (filter.type === SITE_FILTER_TYPE.ALARM) {
            if (filter.expected === undefined) {
              include = include && true
            }
            const alarms = filterExpectedAlarms(site.alarms, {
              id: filter.id,
              tenant: filter.tenant,
              expected: filter.expected,
              minDuration: filter.minDuration,
              maxDuration: filter.maxDuration,
            })
            const availableCount = alarms.filter(alarm => alarm.isAvailable).length
            if (!alarms.length || !availableCount) {
              include = include && false
            }
            const expected = !!+filter.expected
            const matchedCount = alarms.filter(alarm => alarm.isNormal === expected).length
            if (!matchedCount) {
              include = include && false
            }
          }

          if (filter.type === SITE_FILTER_TYPE.PROPERTY) {
            const value = this._.get(site, filter.id, undefined)
            if (!value) {
              include = include && false
            }
            if (filter.id === SITE_PROPERTY.DC_LOAD) {
              const filteredDCLoads = value.filter(v => {
                const tenant = v.tenant || SITE_TENANT.BANGLALINK
                if (!this.allowedTenants.includes(tenant)) {
                  return false
                }
                if (this.tenant && this.tenant !== 'all') {
                  return tenant === this.tenant
                }
                return true
              })
              if (filteredDCLoads.length) {
                include = include && filteredDCLoads.map(t => t.value).includes(filter.expected)
              } else {
                include = include && false
              }
            }

            if (filter.id === SITE_PROPERTY.COM_IDS) {
              if (+filter.exists === 1) {
                include = include && value.length > 0
              } else {
                include = include && value.length === 0
              }
            }

            if (filter.id === SITE_PROPERTY.RECTIFIER) {
              const rectifierExists = value && Object.keys(value).length > 0


              if (+filter.exists === 1) {
                if (filter.rectifier_type) {

                  include = include && (value.rectifier_type === filter.rectifier_type || value.rectifier_type_2 === filter.rectifier_type)
                }
                include = include && rectifierExists
              } else {
                include = include && !rectifierExists
              }
            }

          }
        }
        return include
      }
    },
    exclusiveFilter(filters) {
      return site => {
        let include = false
        for (const filter of filters) {
          if (filter.type === SITE_FILTER_TYPE.ALARM) {
            if (filter.expected === undefined) {
              include = include || true
              return include
            }
            const alarms = filterExpectedAlarms(site.alarms, {
              id: filter.id,
              tenant: filter.tenant,
              expected: filter.expected,
              minDuration: filter.minDuration,
              maxDuration: filter.maxDuration,
            })
            const availableCount = alarms.filter(alarm => alarm.isAvailable).length
            include = include || (alarms.length && availableCount)
            const expected = !!+filter.expected
            const matchedCount = alarms.filter(alarm => alarm.isNormal === expected).length
            include = include || matchedCount
          }

          if (filter.type === SITE_FILTER_TYPE.PROPERTY) {
            const value = this._.get(site, filter.id, undefined)
            include = include || !!value
            if (filter.id === SITE_PROPERTY.DC_LOAD) {
              const filteredDCLoads = value.filter(v => {
                const tenant = v.tenant || SITE_TENANT.BANGLALINK
                if (!this.allowedTenants.includes(tenant)) {
                  return false
                }
                if (this.tenant && this.tenant !== 'all') {
                  return tenant === this.tenant
                }
                return true
              })
              const expectedLoads = filteredDCLoads.map(t => t.value).includes(filter.expected)
              include = include || expectedLoads
            }

            if (filter.id === SITE_PROPERTY.COM_IDS) {
              if (+filter.exists === 1) {
                include = include || value.length > 0
              } else {
                include = include || value.length === 0
              }
            }

            if (filter.id === SITE_PROPERTY.RECTIFIER) {
              const rectifierExists = value && Object.keys(value).length > 0
              if (+filter.exists === 1) {
                include = include || rectifierExists
              } else {
                include = include || !rectifierExists
              }
            }
          }
        }
        return include
      }
    },
    async exportHandeler() {
      if (this.loadingExport) return
      this.loadingExport = true
      try {
        const exporter = new LegacyExportAction({
          data: this.downloadData.map(item => {
            const site = item.site;
            return {
              ...item,
              towerco_id: this.getTowerCoId(site) || '',
              // operator_id: this.getMNOSiteID(site,item.tenant) || '',
              zone: this.getZone(site) || '',
              cluster: this.getCluster(site) || '',
              name: site.name || '',
            }
          }), type: this.selectedTab
        })
        await exporter.execute()
        //  downloadFile(buff, `${this.selectedTab}.xlsx`)
      } catch (error) {
        console.log(error)
        this.$toast.error(JSON.stringify(error))
      } finally {
        this.loadingExport = false
      }
    },
  },

}
</script>

<style lang="scss" scoped></style>
