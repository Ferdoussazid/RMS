<template>
  <div class="z-50 flex w-full items-center gap-4 rounded bg-white p-2">
    <div class="relative grid w-full grid-cols-12 gap-2">
      <div class="col-span-12 grid grid-cols-4 gap-2 md:grid-cols-12 lg:col-span-6">
        <DropdownMenu
          v-model="company"
          :options="companiesWithLabel"
          placeholder="Select a Company"
          class="col-span-4"
        />
        <div
          v-if="!sites.length"
          class="col-span-4 flex h-full w-full items-center justify-center space-x-2 rounded-md border border-gray-200 bg-white p-2 px-4 py-2 shadow-sm"
        >
          <LoadingSpinner class="scale-50" />
        </div>
        <SearchableSiteDropdown
          v-if="sites.length"
          :sites="filteredSites"
          :with-all-sites-option="false"
          class="col-span-4"
          @single="onSiteSelect"
          @clear="onClear"
        />
        <select
          v-model="selectedDevice"
          class="col-span-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="" disabled selected>Select a device</option>
          <option v-for="(device, i) in devices" :key="i" :value="device.com_id">{{ device.com_id }}</option>
        </select>
      </div>
      <div class="col-span-12 grid grid-cols-12 gap-2 md:col-span-6 lg:col-span-4">
        <vc-date-picker v-model="fromDate" class="col-span-6" mode="dateTime">
          <template #default="{ inputValue, inputEvents }">
            <input
              ref="fromPicker"
              class="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm"
              placeholder="From"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </vc-date-picker>
        <vc-date-picker v-model="toDate" class="col-span-6" mode="dateTime">
          <template #default="{ inputValue, inputEvents }">
            <input
              ref="toPicker"
              class="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm"
              placeholder="To"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </vc-date-picker>
      </div>
      <div class="col-span-12 grid grid-cols-12 gap-2 md:col-span-6 lg:col-span-2">
        <button
          class="col-span-5 flex items-center justify-center gap-2 rounded bg-green-500 py-2 px-4 text-xs font-semibold text-white hover:bg-green-600"
          @click="filterData"
        >
          <i class="fas fa-filter"></i> Filter
        </button>
        <button
          class="col-span-5 rounded bg-teal-500 p-2 text-xs text-white shadow transition duration-300 hover:bg-teal-600"
          @click="exportData"
        >
          <i v-if="loadingExport" class="fas fa-circle-notch fa-spin"></i>
          <i v-else class="fas fa-download"></i>
          <span class="font-semibold">Export</span>
        </button>
        <div
          v-if="toggleView"
          class="col-span-2 flex cursor-pointer items-center justify-center rounded border border-slate-400 shadow transition duration-300 hover:border-slate-200 hover:text-slate-400"
          @click="$emit('view')"
        >
          <i class="fas fa-eye"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { subHours, differenceInDays, format, addDays } from 'date-fns'
import { mapGetters } from 'vuex'
const downloadFile = require('js-file-download')

export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    toggleView: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      devices: [],
      selectedDevice: '',
      company: '',
      fromDate: subHours(new Date(), 1),
      toDate: addDays(new Date(), 1),
      search: '',
      selectedSite: '',
      sitesToShow: [],
      loadingExport: false,
      previousDevice: null,
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
    filteredSites() {
      if (this.company) {
        return this.sites.filter(site => site.user_uid === this.company.user_uid)
      }
      return this.sites
    },
    exportAPIPath() {
      const path = this.$route.path
      switch (path) {
        case '/monitor/service-string':
          return '/user/report/service-string'
        case '/monitor/device-health':
          return '/user/report/device-health'
        default:
          return null
      }
    },
    fileName() {
      const path = this.$route.path
      const durationString = `${format(this.fromDate, 'd LLL yy')} - ${format(this.toDate, 'd LLL yy')}`
      switch (path) {
        case '/monitor/service-string':
          return `Service Strings Export of Com.ID- ${this.selectedDevice} (${durationString}).xlsx`
        case '/monitor/device-health':
          return `Battery Health Export of Com.ID- ${this.selectedDevice} (${durationString}).xlsx`
        default:
          return null
      }
    },
  },

  mounted() {
    this.getCompanyList()
  },

  methods: {
    async getCompanyList() {
      await this.$store.dispatch('customer/getCompanyList')
    },

    onSiteSelect(site) {
      this.devices = site.devices
      this.selectedSite = site.name
    },

    validateData() {
      if (!this.selectedDevice) {
        alert('Please select a device ')
        return false
      }

      if (!this.fromDate && !this.toDate) {
        this.$refs.fromPicker.focus()
        return false
      } else if (!this.fromDate) {
        this.$refs.fromPicker.focus()
        return false
      } else if (!this.toDate) {
        this.$refs.toPicker.focus()
        return false
      }

      return true
    },

    filterData() {
      if (!this.validateData()) return
      const start = new Date(this.fromDate)
      const end = new Date(this.toDate)
      let page = 1
      if (this.previousDevice && this.previousDevice === this.selectedDevice) {
        page = this.currentPage
      }
      this.previousDevice = this.selectedDevice

      this.$emit('filter', {
        page,
        limit: 25,
        com_id: this.selectedDevice,
        start_time: start,
        end_time: end,
      })
    },
    async exportData() {
      if (!this.validateData()) return
      if (this.loadingExport) return
      this.loadingExport = true
      try {
        if (differenceInDays(this.toDate, this.fromDate) > 30) {
          throw new Error('Please pick a range within 31 days')
        }
        if (!this.exportAPIPath) {
          throw new Error('Invalid export!')
        }
        const params = {
          com_id: this.selectedDevice,
          from_time: new Date(this.fromDate),
          until_time: new Date(this.toDate),
        }
        const res = await this.$axios.$get(this.exportAPIPath, {
          params,
          responseType: 'arraybuffer',
        })
        downloadFile(res, this.fileName)
      } catch (error) {
        this.$toast.error(error)
      }
      this.loadingExport = false
    },
    onClear() {
      this.devices = []
      this.selectedSite = ''
      this.selectedDevice = ''
    },
  },
}
</script>
