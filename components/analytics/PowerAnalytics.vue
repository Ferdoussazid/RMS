<template>
  <div class="col-span-12 flex h-full w-full flex-col rounded bg-white pb-4 shadow-md">
    <div class="flex flex-row items-start justify-start px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">Power Report</h3>
    </div>
    <div class="grid grid-flow-row grid-cols-1 gap-4 px-4 md:grid-cols-3 lg:grid-cols-5">
      <DropdownMenu v-model="form.power_source" class="col-span-1" :options="powerSources" placeholder="Select Power Source" />
      <DropdownMenu v-model="form.compare" class="col-span-1" :options="compareOptions" placeholder="Select Filter" />
      <FloatingLabelInput v-model="form.daily_avg" class="col-span-1" :label="inputLabel" placeholder="example: 3" />
      <DropdownMenu v-model="form.duration" class="col-span-1" :options="durationOptions" placeholder="Aggregation period" />

      <div class="col-span-1">
        <button
          class="mx-auto block rounded bg-blue-500 px-5 py-3 text-xs font-normal text-white shadow-md transition duration-300 hover:bg-blue-600 md:mx-0"
          @click="onGenerateClick"
        >
          Generate Report
        </button>
      </div>
    </div>

    <div v-show="listState === 'loading'" class="flex h-[50vh] flex-row items-center justify-center">
      <LoadingSpinner />
    </div>

    <ReportPlaceholder v-if="listState === 'idle'" message="Use the above filter to find out all the sites by power source availability" />
    <NoResultFound v-if="listState === 'empty'" />

    <div v-if="listState === 'success'" class="mt-6 grid grid-cols-1 gap-4 px-4 md:grid-cols-2">
      <SiteList class="col-span-1" :columns="columns" :rows="sites" />
      <ReportDownloader class="col-span-1 px-0 md:px-4 lg:px-12" :loading="exportState === 'loading'" @export="onExportClick" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    listState: 'idle',
    exportState: 'idle',
    form: {
      daily_avg: '',
      duration: null,
      user_uid: 0,
      power_source: null,
    },

    powerSources: [
      { id: 'mains', label: 'Main Power Unavailability' },
      { id: 'dg', label: 'Generator Run Hour' },
    ],
    compareOptions: [
      { id: 'gt', label: 'Greater Than' },
      { id: 'lt', label: 'Less Than' },
    ],
    durationOptions: [
      { id: 1, value: 1, label: 'Last Month' },
      { id: 2, value: 2, label: 'Last 2 Months' },
      { id: 3, value: 3, label: 'Last 3 Months' },
      { id: 4, value: 4, label: 'Last 4 Months' },
      { id: 5, value: 5, label: 'Last 5 Months' },
      { id: 6, value: 6, label: 'Last 6 Months' },
    ],

    columns: [
      { prop: 'serial', label: '#' },
      { prop: 'site_name', label: 'Site Name' },
      { prop: 'month_name', label: 'Month' },
      { prop: 'duration', label: 'Duration (Hours)' },
    ],
  }),
  computed: {
    ...mapGetters('analytics', ['mainsReport', 'dgReport']),
    ...mapGetters('site', ['firstAvailableUserUid']),
    sites() {
      if (!this.form.power_source) {
        return []
      }
      if (this.form.power_source.id === 'mains') {
        return this.mainsReport
      }
      return this.dgReport
    },
    inputLabel() {
      if (this.form.power_source?.id === 'mains') {
        return 'Daily outage (Hours)'
      }
      return 'Daily runhours'
    },
  },
  methods: {
    async onGenerateClick() {
      try {
        if (!this.form.power_source) {
          throw new Error('Select Mains or DG')
        }
        this.listState = 'loading'
        this.form.user_uid = this.firstAvailableUserUid
        const action = this.form.power_source.id === 'mains' ? 'getMainsReport' : 'getDGReport'
        await this.$store.dispatch(`analytics/${action}`, this.form)
        this.listState = this.sites.length ? 'success' : 'empty'
      } catch (error) {
        this.$toast.error(error.message)
        this.listState = 'idle'
      }
    },
    async onExportClick() {
      try {
        if (!this.form.power_source) {
          throw new Error('Select Mains or DG')
        }
        this.exportState = 'loading'
        const action = this.form.power_source.id === 'mains' ? 'exportMainsReport' : 'exportDGReport'
        const fileName = this.form.power_source.id === 'mains' ? 'Mains Outage Report' : 'DG Runhour Report'
        await this.$store.dispatch(`analytics/${action}`, {
          ...this.form,
          file_name: fileName,
        })
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.exportState = 'idle'
    },
  },
}
</script>

<style lang="scss" scoped></style>
