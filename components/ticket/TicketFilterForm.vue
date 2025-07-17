<template>
  <div class="grid w-full grid-cols-12 gap-2 rounded bg-white p-2">
    <DropdownMenu
      v-model="status"
      :options="statusOptions"
      :reset="shouldClear"
      placeholder="Select a Status"
      class="col-span-12 md:col-span-2"
      @input="onStatusSelect"
    />
    <DropdownMenu
      v-model="priority"
      :options="priorityOptions"
      :reset="shouldClear"
      placeholder="Select a Priority"
      class="col-span-12 md:col-span-2"
      @input="onPrioritySelect"
    />

    <SearchableSiteDropdown
      v-if="sites.length"
      :sites="sites"
      :z="50"
      :with-all-sites-option="false"
      :reset="shouldClear"
      class="col-span-12 md:col-span-2"
      @single="onSiteSelect"
      @clear="onClear"
    />
    <div class="col-span-12 flex cursor-pointer items-center gap-2 md:col-span-6 lg:col-span-2">
      <button
        class="flex items-center justify-center gap-2 rounded bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600"
        @click="filterData"
      >
        <i class="fas fa-filter"></i> Filter
      </button>
      <div v-if="canClearFilter" class="group flex items-center gap-1" @click="clearFilter">
        <i
          class="fas fa-times rounded-full bg-red-500 py-0.5 px-1 text-[8px] font-semibold text-white group-hover:bg-red-700 group-hover:text-white"
        ></i>
        <span class="text-xs font-semibold text-red-500 group-hover:text-red-700">Clear Filter</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    toggleView: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      devices: [],
      shouldClear: false,
      status: null,
      priority: null,
      company: '',
      search: '',
      selectedSite: '',
      sitesToShow: [],
      filterQuery: { page: 1, limit: 25 },
      statusOptions: [
        { id: 1, label: 'Open', value: 'open' },
        { id: 6, label: 'Investigating', value: 'investigating' },
        { id: 2, label: 'Waiting-for-info', value: 'wfi' },
        { id: 3, label: 'Resolved', value: 'resolved' },
        { id: 4, label: 'Closed', value: 'closed' },
        { id: 5, label: 'Reopen', value: 'reopen' },
      
      ],
      priorityOptions: [
        { id: 1, label: 'High', value: 'high' },
        { id: 2, label: 'Medium', value: 'medium' },
        { id: 3, label: 'Low', value: 'low' },
      ],
    }
  },

  computed: {
    ...mapGetters('site', ['sites']),
    canClearFilter() {
      return this.status || this.priority || this.selectedSite
    },
  },
  methods: {
    onStatusSelect(item) {
      this.shouldClear = false
      this.status = item.value
    },
    onPrioritySelect(item) {
      this.shouldClear = false
      this.priority = item.value
    },
    onSiteSelect(site) {
      this.shouldClear = false
      this.selectedSite = +site.uid
    },
    validateData() {
      if (!this.status || !this.priority || !this.selectedSite) {
        alert('Please choose a filter')
        return false
      }
      return true
    },
    clearFilter() {
      this.shouldClear = true
      this.priority = null
      this.status = null
      this.selectedSite = ''
      this.filterQuery = { page: 1, limit: 25 }
      this.$emit('filter', this.filterQuery)
    },

    filterData() {
      this.filterQuery = {}
      if (this.priority) {
        this.filterQuery.priority = this.priority
      }
      if (this.status) {
        this.filterQuery.status = this.status
      }
      if (this.selectedSite) {
        this.filterQuery.site_uid = this.selectedSite
      }
      this.$emit('filter', this.filterQuery)
    },

    onClear() {
      this.selectedSite = ''
    },
  },
}
</script>
