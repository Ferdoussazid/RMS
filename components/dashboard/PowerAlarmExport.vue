<template>
  <div class="flex flex-col w-full h-full pb-4 bg-white rounded shadow-md">
    <div class="flex items-center justify-between w-full px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">Power Data Export</h3>
    </div>
    <div class="flex flex-col items-center justify-around w-full p-2 border-t md:flex-row">


      <div>

        <select v-model="selectedPowerMonth"
          class="cursor-pointer rounded border border-blue-200 bg-blue-50 py-1.5 pl-4 pr-8 text-xs font-semibold capitalize text-gray-600 shadow-sm">
          <!-- <option value="null" disabled selected>Select month</option> -->
          <option v-for="(r, i) in months" :key="i" :value="r.value">{{ r.label }}</option>
        </select>
        <!-- <span class="mt-6 text-xs font-semibold text-gray-600">Months</span>
        <div class="flex flex-row flex-wrap gap-2 mt-2">
          <label v-for="(res, i) in months" :key="i">
            <input v-model="selectedPowerMonth" type="radio" name="selectedPowerMonth" class="sr-only peer"
              :value="res.value" />
            <span
              class="px-3 py-1 text-xs text-gray-700 transition duration-300 bg-white border border-gray-300 border-solid rounded-full cursor-pointer select-none hover:bg-gray-200 peer-checked:border-teal-600 peer-checked:bg-teal-500 peer-checked:text-white">
              {{ res.label }}
            </span>
          </label>
        </div> -->
      </div>

      <div class="min-w-[130px] ">
        <span class="mt-6 text-xs font-semibold text-gray-600">Time Resolution</span>
        <div class="flex flex-row flex-wrap gap-2 mt-2">
          <label v-for="(res, i) in resolutions" :key="i">
            <input v-model="selectedResolution" type="radio" name="resolution" class="sr-only peer"
              :value="res.value" />
            <span
              class="px-3 py-1 text-xs font-medium text-gray-700 transition duration-300 bg-white border border-gray-300 border-solid rounded-full cursor-pointer select-none font-noraml hover:bg-gray-200 peer-checked:border-teal-600 peer-checked:bg-teal-500 peer-checked:text-white">
              {{ res.label }}
            </span>
          </label>
        </div>
      </div>
      <div class="flex mt-4 align-center md:mt-0 ">

        <button
          class="px-6 py-2 min-w-[150px] text-sm text-white transition duration-300 bg-teal-500 rounded shadow-lg hover:bg-teal-600"
          @click="exportPowerData">
          <i v-if="loadingPower" class="fas fa-circle-notch fa-spin"></i>
          <i v-else class="fas fa-file-export"></i>
          Export Data
        </button>
      </div>


    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { sub, startOfToday, startOfMonth, format } from 'date-fns'
  import UserTypeChecker from '~/mixins/UserTypeChecker'
  const downloadFile = require('js-file-download')

  export default {
    mixins: [UserTypeChecker],
    props: {
      siteUid: {
        type: Number,
        default: () => null,
      },

    },
    data: () => ({
      dateRange: {
        start: sub(startOfToday(), { days: 5 }),
        end: startOfToday(),
      },
      readOnlyColumnTags: ['mains', 'dc_voltage', 'power'],
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
      loadingPower: false,
      selectedPowerMonth: startOfMonth(new Date()),
      months: [],
      selectedMonth: new Date(),
    }),
    computed: {
      ...mapGetters('site', ['sites', 'focusedSite']),
      ...mapGetters('user', ['rootUserUid', 'allowedTenants', 'companyName']),
      filteredColumns() {
        if (this.isReadOnlyUser) {
          return this.columns.filter(column => this.readOnlyColumnTags.includes(column.tag))
        }
        return this.columns
      },
      currentMonthName() {
        return format(this.selectedMonth, 'MMM yyyy')
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
      this.initMonths()

      if (this.siteUid) {
        this.selectedSiteUid = this.siteUid
      } else if (this.focusedSite) {
        this.selectedSiteUid = this.focusedSite.uid
      }
    },
    methods: {


      async exportPowerData() {


        if (this.loadingPower) return

        this.loadingPower = true
        try {

          const dt = new Date(this.selectedPowerMonth)

          if (!this.selectedPowerMonth) {
            throw new Error(`Please select a month`)
          }
          if (!+this.selectedResolution) {
            throw new Error(`Please specify the time resolution`)
          }
          let untilTime = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).setHours(23, 59, 59, 999);

          if (dt.getMonth() === new Date().getMonth()) {
            untilTime = new Date().setHours(23, 59, 59, 999)
          }

          untilTime = new Date(untilTime).toISOString();

          if (this.siteUid === null) {
            const options = {
              columns: ['power'],
              user_uid: this.rootUserUid,
              resolution: this.selectedResolution,
              tenants: this.allowedTenants,
              from_time: this.selectedPowerMonth.toISOString(),
              until_time: untilTime,
              file_name: this.getDataPowerExportFilename(),
            }
            const res = await this.$axios.$get('/user/report/all-sites', {
              params: options,
              responseType: 'arraybuffer',
            })
            downloadFile(res, options.file_name)
          } else {
            const options = {
              columns: ['power'],
              user_uid: this.rootUserUid,
              resolution: this.selectedResolution,
              tenants: this.allowedTenants,
              from_time: this.selectedPowerMonth.toISOString(),
              until_time: untilTime,
              file_name: this.getDataPowerExportFilename(),
            }
            const res = await this.$axios.$post('/user/report/single-site', options, {
              responseType: 'arraybuffer',
            })
            downloadFile(res, options.file_name)
          }
        } catch (error) {
          this.$toast.error(error.message)
        }
        this.loadingPower = false

      },


      getDataPowerExportFilename() {
        let exportedDataLabel = 'Data'
        let exportedSiteName = 'All Sites'


        exportedDataLabel = 'Power'


        if (this.siteUid) {
          const site = this.sites.find(s => s.uid === this.selectedSiteUid)
          exportedSiteName = site.name
        }

        return `${exportedDataLabel} Export of ${exportedSiteName} (${format(this.selectedPowerMonth, 'MMM-yyyy')}).xlsx`
      },
      onMonthSelect(month) {
        this.selectedMonth = month
      },
      initMonths() {
        this.months = [];
        let thisMonth = startOfMonth(new Date());
        for (let i = 0; i < 6; i++) {
          this.months.push({
            value: thisMonth,
            label: format(thisMonth, 'MMM-yyyy')
          });
          thisMonth = sub(thisMonth, { months: 1 });
        }
      }
    },
  }
</script>

<style lang="scss" scoped></style>
