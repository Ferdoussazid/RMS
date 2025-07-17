<template>
  <div class="flex w-full flex-col rounded bg-white shadow-md">
    <div class="flex flex-row items-center justify-between px-4 py-3">
      <div class="flex flex-row items-center justify-start">
        <div
          class="flex h-8 w-8 cursor-pointer flex-row items-center justify-center rounded-full bg-white duration-300 hover:bg-gray-200"
          @click="onNavigationIconClick"
        >
          <span class="text-sm text-gray-500">
            <i class="fas" :class="[isInHourlyZoomLevel ? 'fa-arrow-left' : 'fa-chart-bar']"></i>
          </span>
        </div>
        <h3 class="ml-4 text-sm font-semibold text-gray-600">Battery Health Trend</h3>
      </div>
      <MonthChooserDropdown @select="onMonthSelect" />
    </div>
    <ApexChart ref="chart" width="100%" :height="height" type="bar" :options="chartOptions" :series="chartData" />
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { add, formatDistance } from 'date-fns'
import { getDefaultDayRangeFilter } from '~/assets/js/ChartHelper'

import MonthChooserDropdown from '~/components/util/MonthChooserDropdown.vue'

export default {
  components: {
    MonthChooserDropdown,
  },
  props: {
    height: {
      type: Number,
      default: 250,
    },
  },
  data: () => ({
    selectedMonth: new Date(),
  }),
  computed: {
    ...mapGetters('battery', ['pins', 'healthChartSeries', 'dateLabelsOfChart', 'chartFilter', 'shouldUpdateHistoryChart']),
    isInDailyZoomLevel() {
      return _.get(this.chartFilter, 'zoom', 'day') === 'day'
    },
    isInHourlyZoomLevel() {
      return !this.isInDailyZoomLevel
    },
    chartOptions() {
      return {
        chart: {
          stacked: false,
          toolbar: {
            show: true,
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
          type: 'categories',
          tickPlacement: 'on', // To enable zoom controls
          categories: [],
        },
        yaxis: {
          labels: {
            formatter: val => this.$utils.toTimeDuration(+val),
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
          y: {
            formatter: (seconds, { series, seriesIndex, dataPointIndex, w }) => {
              return formatDistance(0, seconds * 1000)
            },
          },
        },
      }
    },
    chartData() {
      return [
        { name: 'Low Voltage', data: [] },
        { name: 'Normal Voltage', data: [] },
        { name: 'Full Charged', data: [] },
      ]
    },
  },
  watch: {
    shouldUpdateHistoryChart(val, old) {
      this.$refs.chart.updateOptions({
        xaxis: {
          type: 'categories',
          categories: this.dateLabelsOfChart,
        },
      })
      this.$refs.chart.updateSeries([{ data: this.healthChartSeries(0) }, { data: this.healthChartSeries(1) }, { data: this.healthChartSeries(2) }])
    },
  },
  mounted() {
    const filter = getDefaultDayRangeFilter()
    this.fetchBatteryHealthHistory(filter.fromDate, filter.untilDate, filter.zoom)
  },
  methods: {
    onDataPointClick(config) {
      if (this.isInDailyZoomLevel) {
        let dateFrom = new Date(this.chartFilter.fromDate)
        dateFrom = add(dateFrom, { days: config.dataPointIndex })
        const dateUntil = add(dateFrom, { days: 1 })

        this.fetchBatteryHealthHistory(dateFrom, dateUntil, 'hour')
      }
    },

    async fetchBatteryHealthHistory(fromDate, untilDate, zoom) {
      try {
        await this.$store.dispatch('battery/getBatteryHealthHistory', {
          fromDate,
          untilDate,
          zoom,
        })
      } catch (error) {
        console.log(error)
      }
    },

    onNavigationIconClick() {
      if (this.isInHourlyZoomLevel) {
        const filter = getDefaultDayRangeFilter(this.selectedMonth)
        this.fetchBatteryHealthHistory(filter.fromDate, filter.untilDate, filter.zoom)
      }
    },

    onMonthSelect(month) {
      this.selectedMonth = month
      const filter = getDefaultDayRangeFilter(month)
      this.fetchBatteryHealthHistory(filter.fromDate, filter.untilDate, filter.zoom)
    },
  },
}
</script>

<style lang="scss" scoped></style>
