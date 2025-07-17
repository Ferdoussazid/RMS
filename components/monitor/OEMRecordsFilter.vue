<template>
  <div class="z-50 flex w-full items-center gap-4 rounded bg-white py-2 px-4">
    <div class="relative grid w-full grid-cols-12 gap-2">
      <div class="col-span-6 grid grid-cols-12 gap-2">
        <DropdownMenu
          v-model="company"
          :options="companiesWithLabel"
          placeholder="Select a Company"
          class="col-span-4"
        />
        <CircularSpinner v-if="!showSiteDropdown" size="sm" class="col-span-4 flex items-center justify-center" />
        <SearchableSiteDropdown
          v-if="showSiteDropdown"
          :sites="sitesToShow"
          :with-all-sites-option="false"
          class="col-span-4"
          @single="onSiteSelect"
        />
        <select
          v-model="selectedDevice"
          class="col-span-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="" disabled selected>Select a device</option>
          <option v-for="(device, i) in devices" :key="i" :value="device.com_id">{{ device.com_id }}</option>
        </select>
      </div>
      <div class="col-span-4 grid grid-cols-12 gap-2">
        <DropdownMenu
          v-model="registerType"
          :options="registerList"
          placeholder="Select a Register"
          class="col-span-6"
        />
        <DropdownMenu
          v-model="rectifierType"
          :options="rectifierList"
          placeholder="Select a Rectifier"
          class="col-span-6"
        />
      </div>
      <div class="col-span-2 grid grid-cols-12 gap-2">
        <button
          class="col-span-5 flex items-center justify-center gap-2 rounded bg-green-500 py-2 px-4 text-xs font-semibold text-white hover:bg-green-600"
          @click="filterData"
        >
          <i class="fas fa-filter"></i> Filter
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginatedList from '~/mixins/PaginatedList'

export default {
  mixins: [PaginatedList],

  props: {
    showSiteDropdown: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      devices: [],
      selectedDevice: '',
      company: '',
      search: '',
      selectedSite: '',
      sitesToShow: [],
      registerList: [
        { id: 'reg1', label: 'cr', value: 'cr' },
        { id: 'reg2', label: 'hr', value: 'hr' },
        { id: 'reg3', label: 'ir', value: 'ir' },
      ],
      rectifierList: [
        { id: 'rec1', label: 'Sarbs', value: 'sarbs' },
        { id: 'rec2', label: 'Vertiv', value: 'vertiv' },
      ],
      registerType: {},
      rectifierType: {},
      siteUid: null,
    }
  },

  computed: {
    ...mapGetters('customer', ['companies']),
    ...mapGetters('site', ['sites']),
    companiesWithLabel() {
      return this.companies.map(c => {
        return { ...c, label: c.name }
      })
    },
  },

  watch: {
    company(val) {
      this.sitesToShow = this.sites.filter(site => site.user_uid === this.company.user_uid)
    },
  },

  mounted() {
    this.sitesToShow = [...this.sites]
    this.getCompanyList()
  },

  methods: {
    async getCompanyList() {
      await this.$store.dispatch('customer/getCompanyList')
    },

    onSiteSelect(site) {
      this.devices = site.devices
      this.selectedSite = site.name
      this.siteUid = site.uid
    },

    filterData() {
      this.$emit('filter', {
        site_uid: this.siteUid,
        com_id: this.selectedDevice,
        register_type: this.registerType.value,
        rectifier_type: this.rectifierType.value,
      })
    },
  },
}
</script>
