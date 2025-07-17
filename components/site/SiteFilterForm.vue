<template>
  <div class="grid grid-cols-12 items-stretch gap-4 rounded bg-white/80 px-6 py-4">
    <div
      class="col-span-12 grid grid-cols-12 gap-4 md:col-span-5"
      :class="[showTenantFilter ? 'lg:col-span-3' : 'lg:col-span-2']"
    >
      <SearchInputField v-model="search" :class="searchGridSpan" />
      <select
        v-if="showTenantFilter"
        v-model="tenant"
        :class="tenantGridSpan"
        class="cursor-pointer rounded border border-slate-200 bg-white py-1.5 pl-4 pr-8 text-xs font-medium capitalize text-gray-600 shadow-sm"
      >
        <option value="">Select Tenant</option>
        <option v-for="(t, i) in tenantList" :key="i" :value="t">{{ getLabelOfTenant(t) }}</option>
      </select>
    </div>
    <div class="col-span-4 grid grid-cols-6 gap-2">
      <select
        v-model="device_vendor"
        class="col-span-6 cursor-pointer rounded border border-slate-200 bg-white py-1.5 pl-4 pr-8 text-xs font-medium text-gray-600 shadow-sm md:col-span-2"
      >
        <option value="">{{ deviceVendorSelectLabel }}</option>
        <option value="null">HSL</option>
        <option v-for="(a, i) in deviceVendorList" :key="i" :value="a.uid">{{ a.name }}</option>
      </select>
      <select
        v-model="area"
        class="col-span-6 cursor-pointer rounded border border-slate-200 bg-white py-1.5 pl-4 pr-8 text-xs font-medium text-gray-600 shadow-sm md:col-span-2"
      >
        <option value="">{{ areaSelectLabel }}</option>
        <option v-for="(a, i) in areaList" :key="i" :value="a">{{ a }}</option>
      </select>

      <select
        v-model="cluster"
        class="col-span-6 cursor-pointer rounded border border-slate-200 bg-white py-1.5 pl-4 pr-8 text-xs font-medium text-gray-600 shadow-sm md:col-span-2"
      >
        <option value="">{{ clusterSelectLabel }}</option>
        <option v-for="(c, i) in clusterList" :key="i" :value="c">{{ c }}</option>
      </select>
    </div>

    <FilterDropdown
      v-model="dropdownFilters"
      class="col-span-12 md:col-span-3 lg:col-span-2"
      hint="Filter by Alarm"
      :options="filterGroups"
    />
    <label v-if="!isReadOnlyUser" class="col-span-12 flex items-center space-x-2 md:col-span-2">
      <input v-model="rectifierInstalled" type="checkbox" class="h-4 w-4 rounded border-gray-300" />
      <span class="text-xs font-medium text-gray-600">Rectifier Integrated</span>
    </label>

    <SiteDump v-if="showSiteDump" class="col-span-2 md:col-span-1" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COMPANY, SITE_ALARM, SITE_FILTER_TYPE, SITE_PROPERTY, SITE_TENANT } from '~/assets/js/Constant'
import { alarmFilterGroups } from '~/assets/js/AlarmHelper'
import {
  checkAlarmInclusivity,
  filterSiteListByTextSearch,
  siteListAlphabeticSort,
  siteListEventTimeSort,
  filterExpectedAlarms,
} from '~/assets/js/SiteHelper'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { getTenantLabel } from '~/assets/js/Helper'

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
  },
  data: () => ({
    filters: [],
    dropdownFilters: [],
    areaList: [],
    clusterList: [],
    search: '',
    area: '',
    device_vendor: '',
    cluster: '',
    tenant: '',
    intervalId: null,
    debounceTimer: null,
    filteredSites: [],
    rectifierInstalled: false,
  }),
  computed: {
    ...mapGetters('site', ['sites']),
    ...mapGetters('user', ['allowedTenants', 'companyName']),
    ...mapGetters('device-vendor', ['device_vendors']),
    tenantList() {
      const tenants = ['all', ...this.allowedTenants]
      return tenants
    },
    deviceVendorList() {
      return this.device_vendors.map(v => ({ name: v.name, uid: v.uid }))
    },
    showTenantFilter() {
      const tenantSpecificAlarms = [
        SITE_ALARM.AC_LINE_FAIL,
        SITE_ALARM.DC_LOW_VOLTAGE,
        SITE_ALARM.SITE_DOWN,
        SITE_ALARM.SITE_ON_BATTERY,
      ]
      if (this.allowedTenants.length === 1) {
        return false
      }
      for (const filter of this.filters) {
        if (filter.type === 'alarm') {
          if (tenantSpecificAlarms.includes(filter.id)) {
            return false
          }
        }
      }

      return true
    },
    searchGridSpan() {
      if (this.showTenantFilter) {
        return 'col-span-12 md:col-span-7 lg:col-span-7'
      }
      return 'col-span-12'
    },
    tenantGridSpan() {
      if (this.showTenantFilter) {
        return 'col-span-12 md:col-span-5 lg:col-span-5'
      }
      return ''
    },
    filterGroups() {
      const groupsToFilter = this.isRmsUser
        ? alarmFilterGroups.filter(group => group.label !== 'Access') // Filter out 'Access' group for rmsUser
        : alarmFilterGroups // No filtering for non-rms users

      groupsToFilter.forEach(group => {
        group.items = group.items.filter(item => {
          const isTenant = checkAlarmInclusivity(item, this.allowedTenants)
          if (this.isReadOnlyUser) {
            return isTenant && this.isReadOnlyAlarm(item)
          }
          return isTenant
        })
      })

      return groupsToFilter
    },
    clusterSelectLabel() {
      if (this.companyName === COMPANY.SUMMIT_COM) {
        return 'Select Cluster'
      }
      return 'Select Cluster'
    },
    areaSelectLabel() {
      if (this.companyName === COMPANY.SUMMIT_COM) {
        return 'Select Zone'
      }
      return 'Select Area'
    },
    deviceVendorSelectLabel() {
      return 'All Device Vendor'
    },
    showSiteDump() {
      const path = this.$route.fullPath
      const allowedPaths = [
        '/site/list',
        '/site/list?type=alarm&id=lock_status',
        '/site/list?type=property&id=devices&exists=1',
      ]
      return allowedPaths.includes(path)
    },
  },
  watch: {
    sites(val, old) {
      this.setAreaList()
      if (this.companyName === COMPANY.SUMMIT_COM) {
        this.setClusterList()
      }
    },
    area(val, old) {
      this.cluster = ''
      this.setClusterList()
      this.filterSites()
      this.$emit('filter-click')
    },
    cluster(val, old) {
      this.filterSites()
      this.$emit('filter-click')
    },
    device_vendor(val, old) {
      this.device_vendor = val
      this.filterSites()
      this.$emit('filter-click')
    },
    search(val, old) {
      clearTimeout(this.debounceTimer)

      this.debounceTimer = setTimeout(() => {
        this.filterSites()
        this.$emit('filter-click')
      }, 500)
    },
    tenant(val, old) {
      this.$emit('tenant', val)
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
    rectifierInstalled(val, old) {
      const queryParams = new URLSearchParams(this.$route.query)
      if (val) {
        this.filters = [
          ...this.alarmFilters,
          { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.RECTIFIER, exists: 1 },
        ]
        queryParams.set('type', SITE_FILTER_TYPE.PROPERTY)
        queryParams.set('id', SITE_PROPERTY.RECTIFIER)
        queryParams.set('exists', 1)
        this.$router.replace({ query: queryParams })
      } else {
        this.filters = this.alarmFilters.filter(f => f.id !== SITE_PROPERTY.RECTIFIER)
        queryParams.delete('type')
        queryParams.delete('id')
        queryParams.delete('exists')
      }
      this.$router.replace({ query: Object.fromEntries(queryParams.entries()) })
    },
  },
  mounted() {
    this.filters = [...this.alarmFilters]
    this.setAreaList()
    if (this.companyName === COMPANY.SUMMIT_COM) {
      this.setClusterList()
    }
    this.startFilterInterval()
    this.setRectifierInstalled()
  },
  destroyed() {
    clearInterval(this.intervalId)
  },
  methods: {
    getLabelOfTenant(tenant) {
      if (tenant === 'all') return 'All'
      return getTenantLabel(tenant, false)
    },
    setRectifierInstalled() {
      const query = this.$route.query
      const isRectifierInstalled = query?.id === SITE_PROPERTY.RECTIFIER && +query?.exists === 1
      if (isRectifierInstalled) {
        this.rectifierInstalled = true
      }
    },
    setAreaList() {
      if (this.companyName === COMPANY.SUMMIT_COM) {
        const items = this.sites.map(s => this._.get(s, 'place.zone', '')).filter(a => !!a)
        this.areaList = this._.uniq(items)
      } else {
        const items = this.sites.map(s => this._.get(s, 'place.division', '')).filter(a => !!a)
        this.areaList = this._.uniq(items)
      }
    },
    setClusterList() {
      const items = this.sites
        .filter(s => this._.get(s, 'place.division', '') === this.area || this.companyName === COMPANY.SUMMIT_COM)
        .map(s => this._.get(s, 'place.cluster', ''))
        .filter(c => !!c)
      // console.log(items)
      this.clusterList = this._.uniq(items)
    },
    startFilterInterval() {
      this.filterSites()
      this.intervalId = setInterval(() => {
        if (this.sites.length === 0) return
        this.filterSites()
      }, 5000)
    },
    filterSites() {
      let items = [...this.sites]
      if (this.search.trim().length) {
        items = filterSiteListByTextSearch(items, this.search)
      }

      if (this.area && this.companyName !== COMPANY.SUMMIT_COM) {
        items = items.filter(s => this._.get(s, 'place.division', '') === this.area)
      } else if (this.area && this.companyName === COMPANY.SUMMIT_COM) {
        items = items.filter(s => this._.get(s, 'place.zone', '') === this.area)
      }

      if (this.cluster) {
        items = items.filter(s => this._.get(s, 'place.cluster', '') === this.cluster)
      }

      if (this.device_vendor) {
        items = items.filter(
          s => this._.get(s, 'device_vendor', '') === (this.device_vendor !== 'null' ? this.device_vendor : null)
        )
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
                  include =
                    include &&
                    (value.rectifier_type === filter.rectifier_type || value.rectifier_type_2 === filter.rectifier_type)
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
  },
}
</script>

<style lang="scss" scoped></style>
