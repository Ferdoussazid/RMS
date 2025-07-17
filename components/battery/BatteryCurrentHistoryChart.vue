<template>
  <div class="flex flex-col rounded bg-white shadow-md">
    <div class="flex flex-row items-center justify-between px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">{{ chartTitle }}</h3>
      <button
        class="rounded border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition duration-300 hover:bg-slate-100"
        @click="onDatePickerClick">
        <i class="fas fa-calendar"></i>
        <span class="ml-1">{{ selectedDateLabel }}</span>
      </button>
    </div>
    <ApexChart :ref="chartTag" width="100%" :height="height" type="area" :options="chartOptions" :series="chartData" />

    <DateTimePickerModal ref="picker" :time-picker="false" :tag="chartTag" @submit="onDatePicked" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { startOfDay, format, startOfYesterday, differenceInSeconds } from 'date-fns'
import { APP_EVENT } from '~/assets/js/Constant'
import { getTenantLabel } from '~/assets/js/Helper';

export default {
  components: {},
  props: {
    tenant: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      default: 250,
    },
  },
  data: () => ({
    currentTrend: {},
    shouldRefreshChart: 0,
    date: startOfDay(new Date()),
    lastDataFetched: startOfYesterday(),
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    chartTitle() {
      return 'DC Load Current - ' + this._.capitalize(this.getLabelOfTenant(this.tenant))
    },
    chartTag() {
      return 'dc_current_' + this.tenant
    },
    datePickerTag() {
      return 'tenant_' + this.tenant
    },
    seriesColors() {
      return ['#2d98da', '#fa8231', '#20bf6b']
    },
    chartOptions() {
      return {
        chart: {
          id: this.chartTag,
          type: 'area',
          stacked: false,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true,
          },
          toolbar: {
            autoSelected: 'zoom',
          },
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000,
            },
          },
        },
        colors: this.seriesColors,
        legend: {
          position: 'top',
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100],
          },
        },
        yaxis: {
          min: -100,
          max: 100,
          labels: {
            formatter(val) {
              return val.toFixed(1) + ' A'
            },
          },
          title: {
            text: 'Load Current',
          },
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'h:mm tt',
            datetimeUTC: false,
          },
        },
        tooltip: {
          shared: false,
          y: {
            formatter(val) {
              return `${val.toFixed(1)} Amp`
            },
          },
          x: {
            format: 'h:mm tt',
          },
        },
      }
    },
    chartData() {
      return [
        {
          name: 'Critical Load',
          data: [],
        },
        {
          name: 'Non Critical Load',
          data: [],
        },
        {
          name: 'Total Load',
          data: [],
        },
      ]
    },
    selectedDateLabel() {
      return format(this.date, 'd MMM yyyy')
    },
  },
  watch: {
    shouldRefreshChart(val, old) {
      const toDataPoint = record => [new Date(record.bucket), record.average]
      const seriesList = []
      if (this.currentTrend.critical) {
        seriesList.push({ data: this.currentTrend.critical.map(toDataPoint) })
      }
      if (this.currentTrend.nonCritical) {
        seriesList.push({ data: this.currentTrend.nonCritical.map(toDataPoint) })
      }
      if (this.currentTrend.total) {
        seriesList.push({ data: this.currentTrend.total.map(toDataPoint) })
      }
      this.$refs[this.chartTag].updateSeries(seriesList)
    },
    tenant(val, old) {
      this.getLoadCurrentTrend(true)
    },
  },
  mounted() {
    this.getLoadCurrentTrend()
    this.$bus.$on(APP_EVENT.DC_CURRENT_PUBLISHED, this.getLoadCurrentTrend.bind(this))
  },
  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
    isRecentlyRefreshed() {
      return differenceInSeconds(new Date(), this.lastDataFetched) < 300
    },
    async getLoadCurrentTrend(forced = false) {
      try {
        if (!forced && this.isRecentlyRefreshed()) {
          return
        }
        this.lastDataFetched = new Date()

        const params = { site_uid: this.siteConfig.siteUid, date: this.date, tenant: this.tenant }
        const res = await this.$axios.$get('/battery/current/trend', { params })

        this.currentTrend = res
        this.shouldRefreshChart++
      } catch (error) { }
    },
    onDatePickerClick() {
      this.$refs.picker.show()
    },
    onDatePicked(date) {
      this.$refs.picker.dismiss()
      this.date = startOfDay(date)
      this.getLoadCurrentTrend(true)
    },
  },
}
</script>

<style lang="scss" scoped></style>
