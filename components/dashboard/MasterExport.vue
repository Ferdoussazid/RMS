<template>
  <ContentCard :title="title" :is-top-blending="isAtTop">
    <template #content>
      <div class="flex flex-col items-stretch justify-start space-x-6 p-4 md:flex-row md:items-stretch">
        <div class="flex shrink-0 flex-col items-start space-y-4">
          <!-- <div v-if="siteUid === null" class="w-full max-w-xs form-control">
            <label class="pt-0 label">
              <span class="text-xs font-semibold label-text">Choose Site</span>
            </label>
            <SearchableSiteDropdown :sites="sites" @single="handleSingleSiteSelect" @all="handleAllSitesSelect" />
          </div> -->

          <div class="flex w-full flex-col items-start">
            <span class="text-xs font-semibold text-gray-600">Date Range</span>
            <vc-date-picker v-model="dateRange" color="indigo" is-range class="mt-1 border-0"> </vc-date-picker>
          </div>
        </div>

        <div class="flex grow flex-col">
          <span class="text-xs font-semibold text-gray-600">Data Columns</span>
          <div class="mt-2 flex flex-row flex-wrap gap-2">
            <span
              v-for="(col, i) in filteredColumns"
              :key="i"
              class="cursor-pointer select-none rounded-full border border-solid px-3 py-1 text-xs font-medium transition duration-300"
              :class="[
                isColumnSelected(col)
                  ? 'border-teal-600 bg-teal-500 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-200',
              ]"
              @click="toggleColumn(col)"
            >
              {{ col.label }}
            </span>
            <!-- </label> -->
          </div>

          <span class="mt-6 text-xs font-semibold text-gray-600">Time Resolution</span>
          <div class="mt-2 flex flex-row flex-wrap gap-2">
            <label v-for="(res, i) in resolutions" :key="i">
              <input
                v-model="selectedResolution"
                type="radio"
                name="resolution"
                class="peer sr-only"
                :value="res.value"
              />
              <span
                class="font-noraml cursor-pointer select-none rounded-full border border-solid border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition duration-300 hover:bg-gray-200 peer-checked:border-teal-600 peer-checked:bg-teal-500 peer-checked:text-white"
              >
                {{ res.label }}
              </span>
            </label>
          </div>

          <div
            class="mt-6 flex flex-row items-center justify-center space-x-4 space-y-0 lg:flex-col lg:space-y-2 lg:space-x-0"
          >
            <button
              class="rounded bg-teal-500 px-6 py-2 text-sm text-white shadow-lg transition duration-300 hover:bg-teal-600"
              @click="exportData"
            >
              <i v-if="loadingData" class="fas fa-circle-notch fa-spin"></i>
              <i v-else class="fas fa-file-export"></i>
              Export Data
            </button>

            <span class="text-xs font-light text-gray-600">OR</span>

            <div class="flex flex-col gap-2 lg:flex-row">
              <button
                class="rounded bg-blue-500 p-2 text-xs text-white shadow-lg transition duration-300 hover:bg-blue-600"
                @click="exportEvents('RMS')"
              >
                <i v-if="loadingRMSEvents" class="fas fa-circle-notch fa-spin"></i>
                <i v-else class="fas fa-list-ul"></i>
                Export RMS Events
              </button>
              <button
                v-if="!isReadOnlyUser && !isRmsUser"
                class="rounded bg-cyan-500 p-2 text-xs text-white shadow-lg transition duration-300 hover:bg-cyan-600"
                @click="exportEvents('ACS')"
              >
                <i v-if="loadingACSEvents" class="fas fa-circle-notch fa-spin"></i>
                <i v-else class="fas fa-list-ul"></i>
                Export ACS Events
              </button>
              <button
                class="rounded bg-sky-500 p-2 text-xs text-white shadow-lg transition duration-300 hover:bg-sky-600"
                @click="exportSiteAvailability"
              >
                <i v-if="loadingAvailability" class="fas fa-circle-notch fa-spin"></i>
                <i v-else class="fas fa-list-ul"></i>
                Export Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'
import { sub, startOfToday, differenceInDays, add, format } from 'date-fns'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { COMPANY } from '~/assets/js/Constant'
const downloadFile = require('js-file-download')

export default {
  mixins: [UserTypeChecker],
  props: {
    siteUid: {
      type: Number,
      default: () => null,
    },
    title: {
      type: String,
      default: 'Export Data',
    },
    isAtTop: {
      type: Boolean,
      default: true,
    },
    showAllTags: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    dateRange: {
      start: sub(startOfToday(), { days: 5 }),
      end: startOfToday(),
    },
    columns: [
      { label: 'Mains', tag: 'mains' },
      { label: 'PG', tag: 'pg' },
      { label: 'DC Voltage', tag: 'dc_voltage' },
      { label: 'Critical Load', tag: 'critical_load' },
      { label: 'Non-Critical Load', tag: 'non_critical_load' },
      { label: 'Temperature', tag: 'temperature' },
      { label: 'Power', tag: 'power' },
    ],
    readOnlyColumnTags: ['mains', 'dc_voltage', 'power'],
    dashboardColumnTags: ['mains', 'pg', 'dc_voltage', 'critical_load', 'non_critical_load', 'temperature'],
    resolutions: [
      { label: '1 hour', value: 60 },
      { label: '1 day', value: 60 * 24 },
    ],
    selectedColumns: [],
    selectedResolution: 0,
    selectedSiteUid: 'all',
    loadingData: false,
    loadingRMSEvents: false,
    loadingACSEvents: false,
    loadingAvailability: false,
  }),
  computed: {
    ...mapGetters('site', ['sites', 'focusedSite']),
    ...mapGetters('user', ['rootUserUid', 'allowedTenants', 'companyName']),
    filteredColumns() {
      if (this.showAllTags) return this.columns

      if (!this.siteUid) {
        return this.columns.filter(column => this.dashboardColumnTags.includes(column.tag))
      }
      if (this.isReadOnlyUser) {
        return this.columns.filter(column => this.readOnlyColumnTags.includes(column.tag))
      }
      return this.columns
    },
  },
  watch: {
    selectedSiteUid(val, old) {
      const len = this.selectedColumns.length
      if (val === 'all' && len) {
        this.selectedColumns = [this.selectedColumns[len - 1]]
      }
    },
  },
  mounted() {
    if (this.siteUid) {
      this.selectedSiteUid = this.siteUid
    } else if (this.focusedSite) {
      this.selectedSiteUid = this.focusedSite.uid
    }
  },
  methods: {
    async exportData() {
      if (this.loadingData) return

      this.loadingData = true
      try {
        if (differenceInDays(this.dateRange.end, this.dateRange.start) > 30) {
          throw new Error('Please pick a range within 31 days')
        }
        if (!this.selectedColumns.length) {
          throw new Error(`Please select at least 1 column`)
        }
        if (!+this.selectedResolution) {
          throw new Error(`Please specify the time resolution`)
        }

        if (this.siteUid === null) {
          const options = this.getAllSitesExportOptions()
          const res = await this.$axios.$get('/user/report/all-sites', {
            params: options,
            responseType: 'arraybuffer',
          })
          downloadFile(res, options.file_name)
        } else {
          const options = this.getSingleSiteExportOptions()
          const res = await this.$axios.$post('/user/report/single-site', options, {
            responseType: 'arraybuffer',
          })
          downloadFile(res, options.file_name)
        }
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.loadingData = false
    },

    async exportEvents(eventType) {
      if (this.loadingRMSEvents || this.loadingACSEvents || this.loadingAvailability) return

      if (eventType === 'RMS') {
        this.loadingRMSEvents = true
      } else {
        this.loadingACSEvents = true
      }

      let exportedSiteName = 'All Sites'
      if (this.siteUid) {
        const site = this.sites.find(s => s.uid === this.selectedSiteUid)
        exportedSiteName = site.name
      }

      try {
        const untilTime = add(this.dateRange.end, { days: 1 })
        const params = {
          file_name: 'Events Export',
          group: eventType,
          tenants: this.allowedTenants,
          from_time: this.dateRange.start.toISOString(),
          until_time: untilTime.toISOString(),
          site_uid: this.siteUid ? this.siteUid : undefined,
          user_uid: this.rootUserUid,
        }

        const fileName = this.getFileName(`${eventType} Events`, exportedSiteName)
        const res = await this.$axios.$get('/user/report/events', {
          params,
          responseType: 'arraybuffer',
        })
        downloadFile(res, fileName)
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.loadingRMSEvents = false
      this.loadingACSEvents = false
    },

    async exportSiteAvailability() {
      if (this.loadingRMSEvents || this.loadingACSEvents || this.loadingAvailability) return

      this.loadingAvailability = true

      try {
        const untilTime = add(this.dateRange.end, { days: 1 })
        let exportedSiteName = 'All Sites'
        if (this.siteUid) {
          const site = this.sites.find(s => s.uid === this.selectedSiteUid)
          exportedSiteName = site.name
        }
        const params = {
          from_time: this.dateRange.start.toISOString(),
          tenants: this.allowedTenants,
          until_time: untilTime.toISOString(),
          site_uid: this.siteUid ? [this.siteUid] : undefined,
          user_uid: this.rootUserUid,
        }
        const fileName = this.getFileName('Availability', exportedSiteName)
        const res = await this.$axios.$get('/user/report/availability', {
          params,
          responseType: 'arraybuffer',
        })
        downloadFile(res, fileName)
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.loadingAvailability = false
    },

    getAllSitesExportOptions() {
      const selectedColumns = { columns: this.selectedColumns }
      return {
        ...selectedColumns,
        user_uid: this.rootUserUid,
        resolution: this.selectedResolution,
        tenants: this.allowedTenants,
        from_time: this.dateRange.start,
        until_time: add(this.dateRange.end, { days: 1 }),
        file_name: this.getDataExportFilename(),
      }
    },

    getSingleSiteExportOptions() {
      return {
        columns: this.selectedColumns,
        site_uid: this.selectedSiteUid,
        tenants: this.allowedTenants,
        resolution: this.selectedResolution,
        from_time: this.dateRange.start,
        until_time: add(this.dateRange.end, { days: 1 }),
        file_name: this.getDataExportFilename(),
      }
    },

    getDataExportFilename() {
      let exportedDataLabel = 'Data'
      let exportedSiteName = 'All Sites'

      if (this.selectedColumns.length === 1) {
        exportedDataLabel = this.columns.find(c => c.tag === this.selectedColumns[0]).label
      }

      if (this.siteUid) {
        const site = this.sites.find(s => s.uid === this.selectedSiteUid)
        exportedSiteName = site.name
      }

      return this.getFileName(exportedDataLabel, exportedSiteName)
    },

    getFileName(exportLabel, siteLabel) {
      return `${exportLabel} Export of ${siteLabel} (${format(this.dateRange.start, 'd LLL yy')} - ${format(
        this.dateRange.end,
        'd LLL yy'
      )}).xlsx`
    },

    toggleColumn(col) {
      if (this.isColumnSelected(col)) {
        this.selectedColumns = this.selectedColumns.filter(c => c !== col.tag)
      } else if (
        !this.siteUid &&
        this.companyName !== COMPANY.SUMMIT_TOWERS_LTD &&
        this.companyName !== COMPANY.SUMMIT_COM
      ) {
        // } else if (!this.siteUid) {
        this.selectedColumns = [col.tag]
      } else {
        this.selectedColumns.push(col.tag)
      }
    },

    isColumnSelected(col) {
      return this.selectedColumns.includes(col.tag)
    },
  },
}
</script>

<style lang="scss" scoped></style>
