<template>
  <div class="flex flex-1 flex-col space-y-2 rounded transition duration-300 ease-in-out">
    <div class="flex items-center justify-between px-1">
      <span class="text-xs font-semibold text-gray-700">Unadded Sites</span>
      <span v-if="siteUids.length" class="text-xs font-normal text-gray-500">Selected: {{ siteUids.length }}</span>
    </div>
    <div class="grid grid-cols-12 items-stretch gap-2">
      <SearchInputField v-model="search" class="col-span-12 bg-slate-100 md:col-span-12 lg:col-span-4" />

      <select
        v-model="area"
        class="col-span-6 rounded border border-slate-200 bg-white py-1.5 text-xs font-medium text-gray-600 shadow-sm md:col-span-12 lg:col-span-4"
      >
        <option value="">Select Area</option>
        <option v-for="(a, i) in areaList" :key="i" :value="a">{{ a }}</option>
      </select>

      <select
        v-model="cluster"
        class="col-span-6 rounded border border-slate-200 bg-white py-1.5 text-xs font-medium text-gray-600 shadow-sm md:col-span-12 lg:col-span-4"
      >
        <option value="">Select Cluster</option>
        <option v-for="(c, i) in clusterList" :key="i" :value="c">{{ c }}</option>
      </select>
    </div>
    <div class="relative max-h-[200px] min-h-[200px] overflow-scroll rounded shadow-md scrollbar-hide md:max-h-[290px]">
      <div
        v-for="(site, i) in filteredSites"
        :key="site.uid"
        :class="[i % 2 === 0 ? 'bg-slate-100' : 'bg-white']"
        class="roundedshadow-sm flex flex-row items-center space-x-2 transition duration-300"
      >
        <span class="shrink-0 px-2 py-3 text-xs font-semibold text-gray-500">{{ i + 1 }}.</span>
        <span class="grow text-xs font-semibold text-gray-700">{{ site.name }}</span>
        <div class="pr-4">
          <button
            class="flex cursor-pointer items-center gap-1 rounded border-2 border-cyan-600 bg-white p-1.5 text-xs font-semibold text-cyan-600 hover:border-cyan-600 hover:bg-cyan-600 hover:text-white"
            @click="$emit('add-site', site.uid), onSiteAdd(site.uid)"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { filterSiteListByTextSearch, siteListAlphabeticSort } from '~/assets/js/SiteHelper'

export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    search: '',
    area: '',
    cluster: '',
    siteUids: [],
  }),
  computed: {
    areaList() {
      const items = this.items.map(s => _.get(s, 'place.division', '')).filter(a => !!a)
      return _.uniq(items)
    },
    clusterList() {
      if (!this.area) return []
      const items = this.items
        .filter(s => _.get(s, 'place.division', '') === this.area)
        .map(s => _.get(s, 'place.district', ''))
        .filter(c => !!c)
      return _.uniq(items)
    },
    filteredSites() {
      let items = [...this.items]
      if (this.search.trim().length) {
        items = filterSiteListByTextSearch(items, this.search)
      }

      if (this.area) {
        items = items.filter(s => _.get(s, 'place.division', '') === this.area)
      }

      if (this.cluster) {
        items = items.filter(s => _.get(s, 'place.district', '') === this.cluster)
      }

      // Sort sites alphabetically
      items.sort(siteListAlphabeticSort)

      return items
    },
  },
  methods: {
    onSiteAdd(uid) {
      this.siteUids.push(uid)
    },
  },
}
</script>

<style lang="scss" scoped></style>
