<template>
  <div class="flex flex-col rounded bg-white shadow-md">
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
        <h3 class="ml-4 text-sm font-semibold text-gray-600">Temperature history</h3>
      </div>
      <MonthChooserDropdown @select="onMonthSelect" />
    </div>
    <ApexChart ref="chart" width="100%" :height="height" type="bar" :options="chartOptions" :series="chartData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { add } from 'date-fns'
import { getXAxisDateLabel, oneMonthRange } from '~/assets/js/ChartHelper'

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
    seriesData: [],
    chartFilter: oneMonthRange(),
    selectedMonth: new Date(),
  }),
  computed: {
    ...mapGetters('temperature', ['primaryPin']),
    chartTag() {
      return 'site_temperature_trend'
    },
    isInDailyZoomLevel() {
      return this._.get(this.chartFilter, 'resolution', 0) === 1440
    },
    isInHourlyZoomLevel() {
      return !this.isInDailyZoomLevel
    },
    xAxisLabels() {
      const zoom = this.chartFilter.resolution === 1440 ? 'day' : 'hour'
      return this.seriesData.map(v => getXAxisDateLabel(v.bucket, zoom))
    },
    chartOptions() {
      return {
        chart: {
          id: this.chartTag,
          // stacked: true,
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
          categories: this.xAxisLabels,
        },
        yaxis: {
          min: 10,
          max: 60,
          labels: {
            formatter(val) {
              return val.toFixed(1)
            },
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
            formatter(val) {
              return `${val.toFixed(1)}&deg; C`
            },
          },
        },
      }
    },
    chartData() {
      return [
        { name: 'Average Temperature', data: this.seriesData.map(v => Math.max(v.average, 0)) },
        { name: 'Maximum Temperature', data: this.seriesData.map(v => Math.max(v.maximum, 0)) },
      ]
    },
  },
  // watch: {
  //   shouldUpdateHistoryChart(val, old) {
  //     this.$refs.chart.updateOptions({
  //       xaxis: {
  //         type: 'categories',
  //         categories: this.historyChartXLabels(0),
  //       },
  //     })
  //     this.$refs.chart.updateSeries(this.historyChartSeries(0))
  //   },
  // },
  mounted() {
    this.fetchTemperatureTrendHistory(oneMonthRange())
  },
  methods: {
    onDataPointClick(config) {
      if (this.isInDailyZoomLevel) {
        let fromDate = new Date(this.chartFilter.fromDate)
        fromDate = add(fromDate, { days: config.dataPointIndex })
        const untilDate = add(fromDate, { days: 1 })

        this.fetchTemperatureTrendHistory({
          from_time: fromDate,
          until_time: untilDate,
          resolution: 60,
        })
      }
    },

    async fetchTemperatureTrendHistory(filter) {
      if (!this.primaryPin) {
        return
      }

      try {
        const history = await this.$axios.$get('/temperature/temperature/history', {
          params: {
            ...filter,
            pin_id: this.primaryPin.id,
          },
        })

        this.chartFilter = filter
        this.seriesData = history.series
      } catch (error) {}
    },

    onNavigationIconClick() {
      if (this.isInHourlyZoomLevel) {
        this.fetchTemperatureTrendHistory(oneMonthRange(this.selectedMonth))
      }
    },

    onMonthSelect(month) {
      this.selectedMonth = month
      this.fetchTemperatureTrendHistory(oneMonthRange(month))
    },
  },
}
</script>

<style lang="scss" scoped></style>
