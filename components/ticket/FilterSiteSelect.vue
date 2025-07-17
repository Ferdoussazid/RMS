<template>
  <div class="grid w-full grid-cols-12 gap-4 md:grid-cols-12">
    <div class="col-span-12 md:col-span-3">
      <select
        v-model="tenant"
        class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 text-sm shadow-sm"
      >
        <option value="" disabled selected>Select operator</option>
        <option v-for="(t, i) in tenantList" :key="i" :value="t">{{ t }}</option>
      </select>
    </div>

    <div class="col-span-12 md:col-span-3">
      <select
        v-model="area"
        class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 text-sm shadow-sm"
      >
        <option value="">Select Area</option>
        <option v-for="(a, i) in areaList" :key="i" :value="a">{{ a }}</option>
      </select>
    </div>

    <div class="col-span-12 md:col-span-3">
      <select
        v-model="cluster"
        class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 text-sm shadow-sm"
      >
        <option value="">{{ clusterSelectLabel }}</option>
        <option v-for="(c, i) in clusterList" :key="i" :value="c">{{ c }}</option>
      </select>
    </div>
    <SearchableSiteDropdown
      v-if="sites.length"
      :sites="filteredSites"
      :with-all-sites-option="false"
      class="col-span-12 md:col-span-3"
      @single="onSiteSelect"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COMPANY } from '~/assets/js/Constant'
export default {
  data: () => ({
    filters: [],
    areaList: [],
    clusterList: [],
    search: '',
    area: '',
    cluster: '',
    tenant: '',
    filteredSites: [],
  }),
  computed: {
    ...mapGetters('site', ['sites']),
    ...mapGetters('user', ['allowedTenants', 'companyName']),
    tenantList() {
      const tenants = ['all', ...this.allowedTenants]
      return tenants
    },
    clusterSelectLabel() {
      if (this.companyName === COMPANY.SUMMIT_TOWERS_LTD) {
        return 'Select RIO'
      }
      return 'Select Cluster'
    },
  },
  watch: {
    area(val, old) {
      this.cluster = ''
      this.setClusterList()
      this.filterSites()
    },
    cluster(val, old) {
      this.filterSites()
    },

    tenant(val, old) {
      this.$emit('tenant', val)
      this.filterSites()
    },
    filters(val, old) {
      this.filterSites()
    },
  },
  mounted() {
    this.setAreaList()
    this.filterSites()
  },

  methods: {
    setAreaList() {
      const items = this.sites.map(s => this._.get(s, 'place.division', '')).filter(a => !!a)
      this.areaList = this._.uniq(items)
    },
    setClusterList() {
      const items = this.sites
        .filter(s => this._.get(s, 'place.division', '') === this.area)
        .map(s => this._.get(s, 'place.cluster', ''))
        .filter(c => !!c)

      this.clusterList = this._.uniq(items)
    },
    filterSites() {
      let items = [...this.sites]

      if (this.area) {
        items = items.filter(s => this._.get(s, 'place.division', '') === this.area)
      }

      if (this.cluster) {
        items = items.filter(s => this._.get(s, 'place.cluster', '') === this.cluster)
      }

      if (this.tenant) {
        if (this.tenant !== 'all') {
          items = items.filter(s => this._.get(s, 'tenants', []).includes(this.tenant))
        }
      }
      this.filteredSites = [...items]
    },
    onSiteSelect(site) {
      this.$emit('select', site)
    },
  },
}
</script>

<style lang="scss" scoped></style>
