<template>
  <div class="flex w-full flex-col rounded bg-white shadow-md">
    <div class="flex flex-row items-center justify-between px-4 py-3">
      <div class="flex flex-row items-center justify-start">
        <div
          class="flex h-8 w-8 cursor-pointer flex-row items-center justify-center rounded-full bg-white duration-300 hover:bg-gray-200"
          @click="onNavigationIconClick">
          <span class="text-sm text-gray-500">
            <i class="fas" :class="[isInHourlyZoomLevel ? 'fa-arrow-left' : 'fa-chart-bar']"></i>
          </span>
        </div>
        <h3 class="ml-4 text-sm font-semibold capitalize text-gray-600">Main Power Outage History ({{
          getLabelOfTenant(tenant) }})</h3>
      </div>
      <MonthChooserDropdown @select="onMonthSelect" />
    </div>
    <ApexChart :ref="outageRef" width="100%" :height="height" type="bar" :options="chartOptions" :series="chartData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { add, formatDistance, format } from 'date-fns'
import { getDefaultDayRangeFilter, getXAxisDateLabels } from '~/assets/js/ChartHelper'

import MonthChooserDropdown from '~/components/util/MonthChooserDropdown.vue'
import { SITE_EVENT } from '~/assets/js/Constant'
import { getTenantLabel } from '~/assets/js/Helper'

export default {
  components: {
    MonthChooserDropdown,
  },
  props: {
    height: {
      type: Number,
      default: 250,
    },
    tenant: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    /**
     * The 'chartData' computed property relies on 'pins' array from vuex store
     * The 'pins' array is mutable & gets updated with 'Array.splice' method every times pin voltage is changed
     * As a result, the data series gets disappeard when we modify the vuex state
     * For this reason, we create a new array & copy 'pins' from vuex state inside mounted hook
     */
    pinsCopy: [],
    selectedMonth: new Date(),
    selectedDate: new Date(),
    dataPointClicked: false,

    series: [],
    shouldRefresh: 0,
    zoomLevel: 'day',
  }),
  computed: {
    ...mapGetters('mains', ['pins']),
    ...mapGetters('site', ['siteConfig']),
    outageRef() {
      return 'outage_' + this.tenant
    },
    isInDailyZoomLevel() {
      return this.zoomLevel === 'day'
    },
    isInHourlyZoomLevel() {
      return !this.isInDailyZoomLevel
    },
    maxYValue() {
      const SECONDS_IN_ONE_HOUR = 3600
      const SECONDS_IN_ONE_DAY = 84600
      return this.isInDailyZoomLevel ? SECONDS_IN_ONE_DAY : SECONDS_IN_ONE_HOUR
    },
    chartOptions() {
      return {
        chart: {
          stacked: true,
          toolbar: {
            show: true,
            export: {
              csv: {
                filename: `Mains outage history of ${this.siteConfig.site.name}`,
                headerCategory: 'Date',
                headerValue: 'Outage (Seconds)',
              },
            },
          },
          zoom: {
            enabled: true,
          },
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000,
            },
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              this.onDataPointClick(config)
            },
          },
        },
        legend: {
          position: 'top',
        },
        xaxis: {
          type: 'category',
          tickPlacement: 'on', // To enable zoom controls
          categories: [],
        },
        yaxis: {
          max: this.maxYValue,
          labels: {
            formatter: val => this.$utils.toTimeDuration(+val, { onlyHours: true }),
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 4,
          },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          x: {
            show: !this.dataPointClicked,
            formatter: val => {
              const date = new Date(this.selectedMonth)
              date.setDate(+val)
              return format(date, 'd MMM')
            },
          },
          y: {
            formatter: (seconds, { series, seriesIndex, dataPointIndex, w }) => {
              return formatDistance(0, seconds * 1000)
            },
          },
        },
      }
    },
    chartData() {
      return [{ name: 'Main Outage', data: [] }]
    },
  },
  watch: {
    shouldRefresh(val, old) {
      this.$refs[this.outageRef].updateOptions({
        xaxis: {
          type: 'category',
          tickPlacement: 'on',
          overwriteCategories: getXAxisDateLabels(this.series, this.zoomLevel),
        },
      })
      this.$refs[this.outageRef].updateSeries([{ data: this.series.map(v => v.seconds) }])
    },
    tenant(val, old) {
      this.onMonthSelect(this.selectedMonth)
    },
  },
  mounted() {
    this.pinsCopy = [...this.pins]
    const filter = getDefaultDayRangeFilter()
    this.fetchMainsOffDurations(filter.fromDate, filter.untilDate, filter.zoom)
  },
  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
    onDataPointClick(config) {
      if (this.isInDailyZoomLevel) {
        let dateFrom = new Date(this.chartFilter.fromDate)
        dateFrom = add(dateFrom, { days: config.dataPointIndex })
        const dateUntil = add(dateFrom, { days: 1 })
        this.dataPointClicked = true

        this.fetchMainsOffDurations(dateFrom, dateUntil, 'hour')
      }
    },

    async fetchMainsOffDurations(fromDate, untilDate, zoom) {
      if (fromDate instanceof Date) {
        fromDate = format(fromDate, 'yyyy-MM-dd')
      }
      if (untilDate instanceof Date) {
        untilDate = format(untilDate, 'yyyy-MM-dd')
      }

      this.zoomLevel = zoom
      this.selectedDate = fromDate

      try {
        const res = await this.$axios.$get('/mains/event/offhours', {
          params: {
            site_uid: this.siteConfig.siteUid,
            event: SITE_EVENT.MAINS_OUTAGE,
            from_date: fromDate,
            until_date: untilDate,
            tenant: this.tenant,
            zoom,
          },
        })
        this.series = res
        this.shouldRefresh++
      } catch (error) { }
    },

    onNavigationIconClick() {
      if (this.isInHourlyZoomLevel) {
        const filter = getDefaultDayRangeFilter(this.selectedMonth)
        this.fetchMainsOffDurations(filter.fromDate, filter.untilDate, filter.zoom)
        this.dataPointClicked = false
      }
    },

    onMonthSelect(month) {
      this.selectedMonth = month
      const filter = getDefaultDayRangeFilter(month)
      this.fetchMainsOffDurations(filter.fromDate, filter.untilDate, filter.zoom)
    },
  },
}
</script>

<style lang="scss" scoped></style>
