<template>
  <div class="relative flex h-full w-full flex-col overflow-hidden bg-slate-100">
    <div class="flex shrink-0 flex-row items-center justify-between border-b border-gray-200 px-4 py-1">
      <h3 class="text-sm font-semibold text-gray-600">Availability</h3>
      <button
        class="rounded border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition duration-300 hover:bg-slate-100"
        @click="onDatePickerClick"
      >
        <i class="fas fa-calendar"></i>
        <span class="ml-1">{{ selectedDateLabel }}</span>
      </button>
    </div>
    <DateTimePickerModal
      ref="datePicker"
      :range-picker="true"
      tag="availability"
      :time-picker="false"
      :range="availabilityGraphDate"
      @range="onDateRangePicked"
    />
    <div
      v-if="fetching || exporting"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-white opacity-60"
    >
      <span v-if="exporting" class="text-sm font-semibold text-indigo-700">Exporting Availability...</span>
      <CircularSpinner size="lg" />
    </div>
    <div class="grid grid-cols-12 gap-2 bg-white p-2">
      <div
        v-for="availabilityItem in availabilityTypes"
        :key="availabilityItem.id"
        class="col-span-12 flex flex-col shadow md:col-span-6"
      >
        <div class="flex items-center justify-center space-x-2 pt-2">
          <i :class="availabilityItem.icon"></i><span class="text-xs font-medium"> {{ availabilityItem.title }}</span>
        </div>
        <ApexChart
          type="bar"
          width="100%"
          height="180"
          :options="chartOptions[availabilityItem.name]"
          :series="availabilityItem.data"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { differenceInSeconds, format } from 'date-fns'
import { mapGetters } from 'vuex'
const downloadFile = require('js-file-download')
export default {
  data() {
    return {
      fetching: false,
      exporting: false,
      chartOptions: { site_availability: {}, dc_availability: {}, grid_availability: {} },
      availabilityRanges: {
        site_availability: [
          { start: 99.9, end: 100 },
          { start: 99.5, end: 99.9 },
          { start: 99, end: 99.5 },
          { start: 98, end: 99 },
          { start: -1, end: 98 },
        ],
        dc_availability: [
          { start: 99.9, end: 100 },
          { start: 99.5, end: 99.9 },
          { start: 99, end: 99.5 },
          { start: 98, end: 99 },
          { start: -1, end: 98 },
        ],
        grid_availability: [
          { start: 98, end: 100 },
          { start: 95, end: 98 },
          { start: 92, end: 95 },
          { start: 85, end: 92 },
          { start: -1, end: 85 },
        ],
      },
    }
  },
  computed: {
    ...mapGetters('user', ['rootUserUid']),
    ...mapGetters('dashboard', ['availabilityData', 'availabilityGraphDate']),
    selectedDateLabel() {
      if (differenceInSeconds(this.availabilityGraphDate.end, this.availabilityGraphDate.start) > 86400) {
        const start = format(this.availabilityGraphDate.start, 'd MMM yy')
        const end = format(this.availabilityGraphDate.end, 'd MMM yy')
        return start + ' - ' + end
      }
      return format(this.availabilityGraphDate.start, 'd MMM yyyy')
    },

    siteAvailabilityChartData() {
      const data = []
      const ranges = this.availabilityRanges.site_availability
      for (const range of ranges) {
        const sites = this.getSitesInRange(range, 'site_availability')
        data.push(sites.length)
      }
      return [{ name: 'Count', data }]
    },
    dcPowerAvailabilityChartData() {
      const data = []
      const ranges = this.availabilityRanges.dc_availability
      for (const range of ranges) {
        const sites = this.getSitesInRange(range, 'dc_availability')
        data.push(sites.length)
      }
      return [{ name: 'Count', data }]
    },
    gridAvailabilityChartData() {
      const data = []
      const ranges = this.availabilityRanges.grid_availability
      for (const range of ranges) {
        const sites = this.getSitesInRange(range, 'grid_availability')
        data.push(sites.length)
      }
      return [{ name: 'Count', data }]
    },
    availabilityTypes() {
      return [
        {
          id: 1,
          name: 'site_availability',
          title: 'Site Availability (%)',
          icon: 'fas fa-broadcast-tower',
          data: this.siteAvailabilityChartData,
        },
        {
          id: 2,
          name: 'dc_availability',
          title: 'DC Power Availability (%)',
          icon: 'fas fa-battery-three-quarters',
          data: this.dcPowerAvailabilityChartData,
        },
        {
          id: 3,
          name: 'grid_availability',
          title: 'Grid Availability (%)',
          icon: 'fas fa-bolt',
          data: this.gridAvailabilityChartData,
        },
      ]
    },
  },
  mounted() {
    if (!this.availabilityData.length) {
      this.fetchAvailabilityList({
        user_uid: this.rootUserUid,
        from_time: this.availabilityGraphDate.start,
        until_time: this.availabilityGraphDate.end,
      })
    }
    this.buildChartOptions()
  },
  methods: {
    async fetchAvailabilityList(query) {
      this.fetching = true
      await this.$store.dispatch('dashboard/getAvailabilityData', query)
      this.fetching = false
    },
    buildChartOptions() {
      this.chartOptions.site_availability = this.getChartOptions('site_availability')
      this.chartOptions.dc_availability = this.getChartOptions('dc_availability')
      this.chartOptions.grid_availability = this.getChartOptions('grid_availability')
    },
    getTitle(type) {
      const type2Title = {
        site_availability: 'Site Availability',
        dc_availability: 'DC Power Availability',
        grid_availability: 'Grid Availability',
      }
      return type2Title[type] || ''
    },
    getColors(type) {
      switch (type) {
        case 'site_availability':
          return ['#008080', '#66b2b2', '#b2d8d8']
        case 'dc_availability':
          return ['#005b96', '#6497b1', '#b3cde0']
        case 'grid_availability':
          return ['#A09DB2', '#BCBAC9', '#E6E5EB']
      }
    },
    onDatePickerClick() {
      this.$refs.datePicker.show()
    },
    onDateRangePicked(range) {
      this.$refs.datePicker.dismiss()
      this.$store.commit('dashboard/SET_AVAILABILITY_GRAPH_DATE', range)

      this.fetchAvailabilityList({
        user_uid: this.rootUserUid,
        from_time: this.availabilityGraphDate.start,
        until_time: this.availabilityGraphDate.end,
      })
    },
    getSitesInRange(range, key) {
      return this.availabilityData.filter(item => {
        const value = +item[key].split('%')[0]
        return value > range.start && value <= range.end
      })
    },
    async exportAvailability(range, availabilityType) {
      try {
        this.exporting = true
        const sites = this.getSitesInRange(range, availabilityType)
        const siteUids = this._.uniq(sites.map(s => s.site_uid))
        const rangeStart = range.start === -1 ? 0 : range.start
        const rangeEnd = range.end

        const params = {
          user_uid: this.rootUserUid,
          from_time: this.availabilityGraphDate.start,
          until_time: this.availabilityGraphDate.end,
          start_range: range.start,
          end_range: range.end,
          availability_type: availabilityType,
          site_uid: siteUids,
        }
        const fileName =
          `${this.getTitle(availabilityType)} of Range (` +
          rangeStart +
          '-' +
          rangeEnd +
          `)% (${format(this.availabilityGraphDate.start, 'd LLL yy')} - ${format(
            this.availabilityGraphDate.end,
            'd LLL yy'
          )}).xlsx`
        const res = await this.$axios.$get('/user/report/availability', {
          params,
          responseType: 'arraybuffer',
        })
        downloadFile(res, fileName)
      } catch (error) {
        this.$toast.error("Can't export availability")
      }
      this.exporting = false
    },
    getChartOptions(type) {
      return {
        chart: {
          offsetY: -20,
          toolbar: {
            show: false,
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const range = this.availabilityRanges[type][config.dataPointIndex]
              this.exportAvailability(range, type)
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '90%',
            position: top,
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '10px',
            colors: ['#fff'],
          },
        },
        tooltip: {
          x: {
            formatter: (val, { series, seriesIndex, dataPointIndex, w }) => {
              return this.getTitle(type) + ': ' + val
            },
          },
          y: {
            formatter: (siteCount, { series, seriesIndex, dataPointIndex, w }) => {
              const plurality = siteCount > 1 ? 's' : ''
              return `${siteCount} Site${plurality}`
            },
          },
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff'],
        },
        xaxis: {
          categories: this.getCategories(type),
          // title: {
          //   text: 'Site Count',
          //   offsetX: 0,
          //   offsetY: 10,
          //   style: {
          //     color: undefined,
          //     fontSize: '10px',
          //     fontFamily: 'Helvetica, Arial, sans-serif',
          //     fontWeight: 600,
          //     cssClass: 'apexcharts-xaxis-title',
          //   },
          // },
        },
        yaxis: {
          // title: {
          //   text: 'Percentage',
          //   offsetX: -10,
          //   offsetY: 0,
          //   style: {
          //     color: undefined,
          //     fontSize: '10px',
          //     fontFamily: 'Helvetica, Arial, sans-serif',
          //     fontWeight: 600,
          //     cssClass: 'apexcharts-xaxis-title',
          //   },
          // },

          labels: {
            style: {
              fontSize: '12px',
              fontWeight: 600,
            },
            offsetX: 10,
          },
        },
        colors: this.getColors(type),
      }
    },
    getCategories(type) {
      if (type === 'grid_availability') {
        return ['98 - 100', '95 - 98', '92 - 95', '85 - 92', '< 85']
      } else {
        return ['99.9 - 100', '99.5 - 99.9', '99 - 99.5', '98 - 99', '< 98']
      }
    },
  },
}
</script>
<style>
.apexcharts-series {
  cursor: pointer;
}
</style>
