<template>
  <div>
    <div v-show="zoom === 'month'" class="flex w-full flex-col rounded bg-white shadow-md">
      <div class="flex flex-row items-center justify-between px-4 py-3">
        <div class="flex flex-row items-center justify-start">
          <h3 class="ml-4 text-sm font-semibold capitalize text-gray-600">Power History ({{ getLabelOfTenant(tenant) }})
          </h3>
        </div>
        <MonthChooserDropdown @select="onMonthSelect" />
      </div>
      <ApexChart ref="chart" width="100%" :height="height" type="bar" :options="chartOptions" :series="chartData" />
    </div>
    <DailyPowerTrendChart v-show="zoom === 'day'" :height="300" :date="zoomedInDate" :series="hourlySeries"
      @close="showMonthlyTrendChart" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format, formatDistance } from 'date-fns'

import MonthChooserDropdown from '~/components/util/MonthChooserDropdown.vue'
import { getTenantLabel } from '~/assets/js/Helper';

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
    zoom: 'month',
    series: [],
    shouldRefresh: 0,
    selectedMonth: new Date(),
    hourlySeries: [],
    zoomedInDate: new Date(),
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('mains', ['pins', 'powerTrend', 'shouldUpdatePowerTrend']),
    chartOptions() {
      return {
        chart: {
          stacked: true,
          toolbar: {
            show: true,
            export: {
              csv: {
                filename: `Power history of ${this.siteConfig.site.name}`,
                headerCategory: 'Date',
                headerValue: 'Duration (Seconds)',
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
              const date = new Date(this.selectedMonth)
              date.setDate(config.dataPointIndex + 1)
              this.showDailyTrendChart(date, this.tenant)
            },
          },
        },
        colors: ['#00E396', '#008FFB', '#FEB019'],
        legend: {
          position: 'top',
        },
        xaxis: {
          type: 'categories',
          tickPlacement: 'on', // To enable zoom controls
          categories: [],
        },
        yaxis: {
          max: 86400,
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
        { name: 'Mains Available', data: [] },
        { name: 'Site On Battery', data: [] },
        { name: 'PG Run', data: [] },
      ]
    },
  },
  watch: {
    shouldRefresh(val, old) {
      const dateLabels = this.series.map(v => v.time).map(t => format(new Date(t), 'd MMM'))
      this.$refs.chart.updateOptions({
        xaxis: {
          type: 'categories',
          categories: dateLabels,
        },
      })
      this.$refs.chart.updateSeries([
        { name: 'Mains Available', data: this.series.map(v => v.mains) },
        { name: 'Site On Battery', data: this.series.map(v => v.battery) },
        { name: 'PG Run', data: this.series.map(v => v.generator) },
      ])
    },
    tenant(val, old) {
      this.onMonthSelect(this.selectedMonth)
    },
  },
  mounted() {
    this.onMonthSelect(new Date())
  },
  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
    async fetchPowerTrend(month, year) {
      try {
        const params = { site_uid: this.siteConfig.siteUid, month, year, tenant: this.tenant }
        const res = await this.$axios.$get('/mains/analytics/power-trend', { params })
        this.series = res
        this.shouldRefresh++
      } catch (error) { }
    },

    onMonthSelect(date) {
      this.selectedMonth = date
      this.fetchPowerTrend(date.getMonth() + 1, date.getFullYear())
    },
    async showDailyTrendChart(date, tenant) {
      this.zoom = 'day'
      this.zoomedInDate = new Date(date)
      try {
        const params = {
          site_uid: this.siteConfig.site.uid,
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          tenant,
        }
        const res = await this.$axios.$get('/mains/analytics/hourly-power-trend', { params })
        this.hourlySeries = res
      } catch (error) { }
    },

    showMonthlyTrendChart() {
      this.zoom = 'month'
    },
  },
}
</script>

<style lang="scss" scoped></style>
