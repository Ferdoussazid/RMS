<template>
  <div v-click-outside="hideDropdown" class="relative" :style="{ 'z-index': z }">
    <div v-show="isOpen" class="sticky top-0 grow text-xs font-medium text-gray-600">
      <SearchInputField
        id="search"
        v-model="search"
        :focused="isOpen"
        :selected-item="search"
        @clear="clearSearchField"
      />
    </div>
    <div
      v-show="!isOpen"
      for="search"
      class="flex h-full w-full cursor-pointer items-center justify-between space-x-2 rounded-md border border-gray-200 bg-white px-4 py-2 shadow-sm"
      @click="isOpen = true"
    >
      <span class="grow text-xs font-medium" :class="getTextColor(selectedSite)"
        ><i v-if="!selectedSite" class="fas fa-search"></i> {{ selectedSite || placeholder }}
      </span>
    </div>

    <ul
      class="absolute inset-x-0 left-0 right-0 top-full mt-1 max-h-[260px] w-full origin-top transform list-none divide-y divide-gray-200 overflow-auto overflow-y-scroll rounded border border-slate-100 bg-white shadow-lg transition duration-300 ease-in-out"
      :class="[isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0']"
    >
      <li
        v-if="withAllSitesOption"
        class="w-full cursor-pointer px-3 py-2 text-xs font-medium tracking-wide text-gray-600 hover:bg-sky-500 hover:text-white"
      >
        <label class="flex w-full cursor-pointer items-center" @click="onAllSiteSelect()">
          <span>All Sites</span>
        </label>
      </li>
      <li
        v-for="(site, i) in filteredSites"
        :key="i"
        class="w-full cursor-pointer px-3 py-2 text-xs font-medium hover:bg-sky-500 hover:text-white"
        :class="getTextColor(site)"
        @click="onSingleSiteSelect(site)"
      >
        {{ site.name }} {{ getTenantName(site) }}
      </li>
    </ul>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import { mapGetters } from 'vuex'
import { filterSiteListByTextSearch, siteListAlphabeticSort } from '~/assets/js/SiteHelper'
import { getTenantLabel } from '~/assets/js/Helper'

export default {
  directives: {
    ClickOutside,
  },
  props: {
    withAllSitesOption: {
      type: Boolean,
      default: true,
    },
    reset: {
      type: Boolean,
      default: false,
    },
    z: {
      type: Number,
      default: 0,
    },
    sites: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Choose a site',
    },
  },

  data: () => ({
    search: '',
    isOpen: false,
    selectedSite: null,
  }),
  computed: {
    ...mapGetters('site', ['focusedSite']),
    ...mapGetters('dashboard', ['selectedLoadCountItem']),
    filteredSites() {
      let items = [...this.sites]
      if (this.search) {
        items = filterSiteListByTextSearch(items, this.search)
        if (items.length) {
          items.sort(siteListAlphabeticSort)
        }
      }
      return items
    },
  },
  watch: {
    'selectedLoadCountItem.range'(val, old) {
      this.selectedSite = null
      this.search = ''
    },
    'selectedLoadCountItem.date'(val, old) {
      this.selectedSite = null
      this.search = ''
    },
    reset(val, old) {
      if (this.reset) {
        this.selectedSite = null
        this.search = ''
      }
    },
  },
  methods: {
    hideDropdown() {
      this.isOpen = false
    },
    onAllSiteSelect() {
      this.$emit('all', this.sites)
      this.isOpen = false
      this.selectedSite = 'All Sites'
      this.search = ''
    },
    onSingleSiteSelect(site) {
      this.$emit('single', site)
      this.isOpen = false
      this.selectedSite = site.name
      this.search = ''
    },
    onSearchBoxClick() {
      this.isOpen = true
    },
    clearSearchField() {
      this.selectedSite = null
      this.$emit('clear')
    },
    getTextColor(site) {
      return site && site.overload === 'YES' ? 'text-red-600' : 'text-gray-600'
    },
    getTenantName(site) {
      if (site.tenant) {
        return `(${getTenantLabel(site.tenant)})`
      }
      return ''
    },
  },
}
</script>

<style scoped></style>
