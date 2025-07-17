<template>
  <div class="col-span-12 flex h-full w-full flex-col rounded bg-white pb-4 shadow-md">
    <div class="flex flex-row items-start justify-start px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">Battery Report</h3>
    </div>
    <div class="grid grid-flow-row grid-cols-1 gap-4 px-4 md:grid-cols-3 lg:grid-cols-5">
      <div class="col-span-1 flex flex-row items-center rounded border border-gray-200 bg-gray-100 px-4 py-3 text-center shadow-sm md:py-2">
        <span class="text-xs font-semibold text-gray-600">Battery Backup</span>
      </div>

      <DropdownMenu v-model="form.compare" class="col-span-1" :options="compareOptions" placeholder="Select Filter" />
      <FloatingLabelInput v-model="form.min_backup" class="col-span-1" label="Battery Backup (Hours)" placeholder="example: 3" />
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

    <ReportPlaceholder v-if="listState === 'idle'" message="Use the above filter to find out all the sites by battery backup" />
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
      min_backup: '',
      duration: null,
      user_uid: 0,
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
      { prop: 'duration', label: 'Backup (Hours)' },
    ],
  }),
  computed: {
    ...mapGetters('analytics', { sites: 'batteryReport' }),
    ...mapGetters('site', ['firstAvailableUserUid']),
  },
  methods: {
    async onGenerateClick() {
      try {
        this.listState = 'loading'
        this.form.user_uid = this.firstAvailableUserUid
        await this.$store.dispatch('analytics/getBatteryReport', this.form)
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.listState = this.sites.length ? 'success' : 'empty'
    },
    async onExportClick() {
      try {
        this.exportState = 'loading'
        await this.$store.dispatch('analytics/exportBatteryReport', {
          ...this.form,
          file_name: 'Battery Backup Report',
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
