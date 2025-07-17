<template>

  <div class="flex justify-between align-middle flex-wrap gap-4 px-6 py-4 rounded bg-white/80">
    <div class="">
      <button v-for="tab in filterTabs" :key="tab.name"
        class="col-span-2 cursor-pointer rounded border border-slate-200  py-1.5 px-4 text-xs font-medium  shadow-sm md:col-span-1 mr-1"
        :class="isActiveFilter(tab.name) ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'"
        @click="changeSelectedFilter(tab.name)">{{ tab.label }} </button>
    </div>
    <div class="flex sm:flex-row flex-col justify-between align-middle " v-if="selectedFilter === 'all'">
      <div class="flex gap-2 align-middle flex-wrap h-100 pr-2">
        <div class="flex shrink-0 justify-end">
          <select v-model="selectedType"
            class="cursor-pointer rounded border border-blue-200 bg-blue-50 h-100 pl-4 pr-8 text-xs font-semibold capitalize text-gray-600 shadow-sm">
            <option v-for="(t, i) in typeFilters" :key="i" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div class="relative flex max-w-[160px] shrink-0 justify-end" v-if="selectedType === 'rms'">
          <div
            class="absolute left-0 top-0 z-50 mt-12 flex max-h-[300px] w-full items-center overflow-x-hidden overflow-y-scroll rounded border bg-white"
            :class="rmsText == '' || selectedRMS ? 'hidden' : searchResults.length > 5 ? 'min-h-20' : ''">
            <div v-if="searchResults.length > 0" class="w-full"
              :class="searchResults.length > 5 ? 'h-[200px]' : 'h-[100%]'">
              <div v-for="r in searchResults" :key="r.uid" @click="selectRMS(r)"
                class="flex cursor-pointer items-center justify-between border-b border-gray-200 p-2 hover:bg-gray-100">
                <span class="text-xs font-semibold text-gray-700">{{ r.name }}</span>
              </div>
            </div>
            <!-- <div v-else class="flex items-center justify-center px-2 py-4">
                            <span class="text-xs font-semibold text-gray-500">No RMS Found</span>
                        </div> -->
          </div>
          <LegacySearchInputField v-model="rmsText" :selectedItem="(selectedRMS && selectedRMS.name) || ''"
            @clear="clearRmsSearch" :h_full="true" />
        </div>
        <div class="relative flex max-w-[160px] shrink-0 justify-end " v-if="selectedType === 'cluster'">
          <select v-model="cluster"
            class="col-span-6 cursor-pointer rounded border border-slate-200 bg-white h-100 pl-4 pr-8 text-xs font-medium text-gray-600 shadow-sm md:col-span-2">
            <option value="">{{ clusterSelectLabel }}</option>
            <option v-for="(c, i) in clusterList" :key="i" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="relative flex max-w-[160px] shrink-0 justify-end" v-if="selectedType === 'area'">
          <select v-model="area"
            class="col-span-6 cursor-pointer rounded border border-slate-200 bg-white h-100 pl-4 pr-8 text-xs font-medium text-gray-600 shadow-sm md:col-span-2">
            <option value="">Select Zone</option>
            <option v-for="(c, i) in areaList" :key="i" :value="c">{{ c }}</option>
          </select>
        </div>

      </div>
      <div class="flex gap-2 align-middle flex-wrap">
        <button
          class="col-span-2 cursor-pointer  rounded border border-slate-200  py-1.5 px-4  shadow-sm text-xs text-gray-600 md:col-span-1"
          @click="updateSort()">
          <i class="fas fa-sort-amount-up" v-if="getSort"></i><i class="fas fa-sort-amount-down" v-else></i>
          Sort</button>
        <button @click="exportHandeler" v-if="showExportButton"
          class="col-span-2 cursor-pointer rounded border border-slate-200 bg-blue-500 py-1.5 pl-4 pr-4 text-xs font-medium text-white shadow-sm md:col-span-1">
          <i v-if="loadingExport" class="fas fa-circle-notch fa-spin"></i><i class="fas fa-download" v-else></i>
          Export</button>
      </div>
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
    typeFilters: [
      {
        id: 1,
        value: 'rms',
        label: 'RMS',
      },
      {
        id: 2,
        value: 'cluster',
        label: 'Cluster',
      },
      {
        id: 3,
        value: 'area',
        label: 'Zone',
      },
    ],
    searchResults: [],
    areaList: [],
    clusterList: [],
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
    selectedType: 'rms',
    rmsText: '',
    cluster: '',
    area: '',
    selectedRMS: null,
    selectedClusterSites: null,
    selectedZoneSites: null,
  }),
  computed: {
    ...mapGetters('site', ['sites']),
    ...mapGetters('user', ['allowedTenants', 'companyName', 'rootUserUid']),
    ...mapGetters('dashboard-legacy', ['selectedTab', 'selectedTenant', 'fetchingDashboard', 'getLegacySort', 'alarmSort', 'dcEnergyMeterSort', 'climateSort', 'rectifierSort']),
    tenantList() {
      const tenants = ['all', ...this.allowedTenants]
      return tenants
    },
    clusterSelectLabel() {
      return 'Select Cluster'
    },
    // rmsText(searchText) {
    //   if (!this.sites) return []
    //   this.searchResults = this.sites.filter(s => s.name.toLowerCase().includes(searchText.toLowerCase()))
    // },
    getSort() {
      return this.selectedTab === LEGACY_PAGES.DC_ENERGY_METER ? this.dcEnergyMeterSort === 'asc' : this.selectedTab === LEGACY_PAGES.ALARM ? this.alarmSort === 'asc' : this.selectedTab === LEGACY_PAGES.CLIMATE ? this.climateSort === 'asc' : this.rectifierSort === 'asc'
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
    cluster(val) {
      if (val) {
        const siteUids = this.sites.filter(site => site.place.cluster === this.cluster).map(site => site.uid)
        this.$emit('search-result', siteUids)
      } else {
        this.$emit('search-result', null)
      }
    },
    area(val) {
      if (val) {
        const siteUids = this.sites.filter(site => site.place.zone === this.area).map(site => site.uid)
        this.$emit('search-result', siteUids)
      } else {
        this.$emit('search-result', null)
      }
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
    rmsText(searchText) {
      if (!this.sites) return []
      this.searchResults = this.sites.filter(s => s.name.toLowerCase().includes(searchText.toLowerCase()))
    },
    sites(val, old) {
      this.setAreaList()
      this.setClusterList()
    },
    selectedType(val, old) {
      this.area = ''
      this.cluster = ''
      this.selectedRMS = null
      this.searchResults = []
      this.$emit('search-result', null)
    },
  },
  async mounted() {
    this.filterSites()
    await this.fetchData()
    window.addEventListener("resize", this.updateWindowWidth);
    this.setAreaList()
    this.setClusterList()
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
      } else if (this.selectedTab === LEGACY_PAGES.ALARM) {
        this.$store.dispatch('dashboard-legacy/sortAlarm', { key: 'time' })
      }
      this.filterSites()
    },
    filterSites() {
      let items = [...this.sites]
      if (this.search.trim().length) {
        items = filterSiteListByTextSearch(items, this.search)
      }

      if (this.area) {
        items = items.filter(s => this._.get(s, 'place.zone', '') === this.area)
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
          }), type: this.selectedTab,
        })
        await exporter.execute()
      } catch (error) {
        console.log(error)
        this.$toast.error(JSON.stringify(error))
      } finally {
        this.loadingExport = false
      }
    },
    setAreaList() {
      const items = this.sites.map(s => this._.get(s, 'place.zone', '')).filter(a => !!a)
      this.areaList = this._.uniq(items)
    },
    setClusterList() {
      const items = this.sites.map(s => this._.get(s, 'place.cluster', '')).filter(c => !!c)
      this.clusterList = this._.uniq(items)

    },
    async fetchData() {
      try {
        const from_time = new Date()
        from_time.setDate(from_time.getDate() - this.selectedDuration)

        const params = {
          user_uid: this.rootUserUid,
          event_name: this.type,
          until_time: new Date().toISOString(),
          from_time: from_time.toISOString(),
          tenant: this.selectedTenant !== '' ? this.selectedTenant : null,
        }
        const res = await this.$axios.$get('/user/network/legacy-trend', { params })
        this.series = res.map(v => ({
          time: v.time,
          site_uids: v.site_uids,
          count: v.site_uids.length,
          percent: this.siteCount.total ? Math.round((v.site_uids.length / this.siteCount.total) * 100) : 0,
        }))
        // this.shouldRefresh++
        console.log(this.data)
      } catch (error) {
        console.log(error)
      }
    },
    selectRMS(rms) {
      this.selectedRMS = rms
      this.rmsText = rms.name
      this.searchResults = [rms.uid]
      this.$emit('search-result', [rms.uid])
    },
    clearRmsSearch() {
      this.selectedRMS = null
      this.rmsText = ''
      this.$emit('search-result', null)
    },
  },

}
</script>

<style lang="scss" scoped></style>
