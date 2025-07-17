<template>
  <div class="col-span-9 flex flex-col rounded bg-white shadow-md md:rounded-t-none">
    <div class="flex flex-row items-center justify-between px-4 py-3">
      <div class="flex flex-row items-center justify-start">
        <div
          class="flex h-8 w-8 cursor-pointer flex-row items-center justify-center rounded-full bg-white duration-300 hover:bg-gray-200"
          @click="onNavigationIconClick">
          <span class="text-sm text-gray-500">
            <i class="fas" :class="[isInHourlyZoomLevel ? 'fa-arrow-left' : 'fa-chart-bar']"></i>
          </span>
        </div>
        <h3 class="ml-4 text-sm font-semibold text-gray-600">{{ title }}</h3>
      </div>
      <MonthChooserDropdown @select="onMonthSelect" />
    </div>
    <ApexChart :ref="'chart_' + tag" width="100%" :height="height" type="bar" :series="chartData"
      :options="chartOptions" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { add, formatDistance } from 'date-fns'
import { getDefaultDayRangeFilter } from '~/assets/js/ChartHelper'

export default {
  props: {
    tag: {
      type: String,
      required: true,
      validate: val => ['dg', 'pg'].includes(val),
    },
    title: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      default: 250,
    },
  },
  data: () => ({
    selectedMonth: new Date(),
  }),
  computed: {
    ...mapGetters('site', ['siteConfig', 'focusedTenant']),
    ...mapGetters('generator', [
      'runHourChartSeries',
      'dateLabelsOfChart',
      'chartFilter',
      'dgRefreshTick',
      'pgRefreshTick',
      'totalRunDuration',
    ]),
    isInDailyZoomLevel() {
      return this._.get(this.chartFilter(this.tag), 'zoom', 'day') === 'day'
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
        {
          name: 'Run Hour',
          data: [],
        },
      ]
    },
  },
  watch: {
    dgRefreshTick(val, old) {
      if (this.tag === 'dg') {
        this.refreshChartWithData()
      }
    },
    pgRefreshTick(val, old) {
      if (this.tag === 'pg') {
        this.refreshChartWithData()
      }
    },
    focusedTenant(val, old) {
      const filter = getDefaultDayRangeFilter()
      this.fetchGeneratorRunHours(filter.fromDate, filter.untilDate, filter.zoom)
    },
  },
  mounted() {
    const filter = getDefaultDayRangeFilter()
    this.fetchGeneratorRunHours(filter.fromDate, filter.untilDate, filter.zoom)

    this.$emit('change-date', this.tag, { date: filter.fromDate, zoom: 'month' })
  },
  methods: {
    refreshChartWithData() {
      this.$refs['chart_' + this.tag].updateOptions({
        xaxis: {
          type: 'categories',
          tickPlacement: 'on',
          overwriteCategories: this.dateLabelsOfChart(this.tag),
        },
      })
      this.$refs['chart_' + this.tag].updateSeries([{ data: this.runHourChartSeries(this.tag) }])
    },
    onDataPointClick(config) {
      if (this.isInDailyZoomLevel) {
        let dateFrom = new Date(this.chartFilter(this.tag).fromDate)
        dateFrom = add(dateFrom, { days: config.dataPointIndex })
        const dateUntil = add(dateFrom, { days: 1 })

        this.fetchGeneratorRunHours(dateFrom, dateUntil, 'hour')

        /**
         * To Notify parent component about date range selection
         * Parent component will pass this date to Total Run Hour Component
         */
        this.$emit('change-date', this.tag, { date: dateFrom, zoom: 'day' })
      }
    },

    async fetchGeneratorRunHours(fromDate, untilDate, zoom) {
      try {
        const siteUid = this.siteConfig.site.uid
        await this.$store.dispatch('generator/getRunHours', {
          name: this.tag,
          siteUid,
          fromDate,
          untilDate,
          zoom,
          tenant: this.focusedTenant,
        })
      } catch (error) {
        console.log(error)
      }
    },

    onNavigationIconClick() {
      if (this.isInHourlyZoomLevel) {
        const filter = getDefaultDayRangeFilter(this.selectedMonth)
        this.fetchGeneratorRunHours(filter.fromDate, filter.untilDate, filter.zoom)

        this.$emit('change-date', this.tag, { date: filter.fromDate, zoom: 'month' })
      }
    },

    onMonthSelect(month) {
      this.selectedMonth = month
      const filter = getDefaultDayRangeFilter(month)
      this.fetchGeneratorRunHours(filter.fromDate, filter.untilDate, filter.zoom)

      /**
       * To Notify parent component about date range selection
       * Parent component will pass this date to Total Run Hour Component
       */
      this.$emit('change-date', this.tag, { date: filter.fromDate, zoom: 'month' })
    },
  },
}
</script>

<style lang="scss" scoped></style>
