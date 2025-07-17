<template>
  <div class="flex flex-col rounded bg-white shadow-md" :class="border">
    <div class="flex flex-row items-center justify-between px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">{{ chartTitle }}</h3>
      <button
        class="rounded border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition duration-300 hover:bg-slate-100"
        @click="onDatePickerClick"
      >
        <i class="fas fa-calendar"></i>
        <span class="ml-1">{{ selectedDateLabel }}</span>
      </button>
    </div>
    <ApexChart :ref="chartTag" width="100%" :height="height" type="area" :options="chartOptions" :series="chartData" />

    <DateTimePickerModal
      ref="dcPowerDate"
      :range-picker="true"
      :tag="datePickerTag"
      :time-picker="false"
      :range="dateRange"
      @submit="onDatePicked"
      @range="onDateRangePicked"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { startOfDay, format, endOfDay, startOfToday, endOfToday, differenceInSeconds } from 'date-fns'
import { getTenantLabel } from '~/assets/js/Helper'
import { COMPANY } from '~/assets/js/Constant'

export default {
  components: {},
  props: {
    height: {
      type: Number,
      default: 250,
    },
    tenant: {
      type: String,
      required: true,
    },
    isAtTop: {
      type: Boolean,
      default: true,
    },
    tenantSerial: {
      type: Number,
      default: 1,
    },
    range: {
      type: Object,
      default: () => ({
        start: startOfToday(),
        end: endOfToday(),
      }),
    },
    showSiteName: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    dateRange: {
      start: startOfToday(),
      end: endOfToday(),
    },
    // date: startOfDay(new Date()),
    powerSeriesData: [],
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('user', ['rootUserUid', 'companyName']),
    ...mapGetters('settings', ['siteSettings']),
    chartTitle() {
      const title = this.getChartTitle()
      if (this.showSiteName) {
        const siteName = this._.get(this.siteConfig.site, 'name', '')
        const tenantLabel = getTenantLabel(this.tenant)
        return `${title}: ${siteName} (${tenantLabel})`
      }
      if (this.tenant) {
        return title + ' - ' + getTenantLabel(this.tenant, false)
      }
      return title
    },
    chartTag() {
      return 'dc_power_' + this.tenant
    },
    border() {
      return this.isAtTop && this.tenantSerial === 1 ? ' md:rounded-t-none' : ''
    },
    datePickerTag() {
      return 'tenant_' + this.tenant
    },
    loadThreshold() {
      const loadThresholdSettings = this._.get(this.siteConfig.site.settings, 'load_threshold', [])
      const tenantSpecificThreshold = loadThresholdSettings.find(t => t.tenant === this.tenant)
      return +tenantSpecificThreshold?.powerKW || 3
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
        colors: ['#2d98da', '#ffa502'],
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
          min: 0,
          max: this.loadThreshold + 2,
          tickAmount: this.loadThreshold + 2,
          labels: {
            formatter(val) {
              return val.toFixed(1) + ' KW'
            },
          },
          title: {
            text: 'DC Power',
          },
        },
        xaxis: {
          type: 'datetime',
          labels: {
            // hideOverlappingLabels: false,
            // formatter(val, timestamp) {
            //   if (timestamp) {
            //     return [format(startOfHour(new Date(timestamp)), 'hh:mm a'), format(timestamp, 'dd MMM yy')]
            //   }
            // },
            datetimeFormatter: {
              month: 'MMM',
              day: 'dd MMM',
              hour: 'hh:mm tt', // 'hh' for 12-hour format, 'a' for AM/PM
            },

            datetimeUTC: false,
          },
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
        tooltip: {
          shared: false,
          y: {
            formatter(val) {
              return `${val.toFixed(1)} KW`
            },
          },
          x: {
            format: 'hh:mm TT dd MMM',
          },
        },
      }
    },
    chartData() {
      return [
        {
          name: this.getChartTitle(),
          data: this.powerSeriesData.map(p => [new Date(p.bucket), p.average]),
        },
        {
          name: 'Max. Threshold',
          data: this.powerSeriesData.map(p => [new Date(p.bucket), this.loadThreshold]),
        },
      ]
    },
    selectedDateLabel() {
      if (differenceInSeconds(this.dateRange.end, this.dateRange.start) > 86400) {
        const start = format(this.dateRange.start, 'd MMM yy')
        const end = format(this.dateRange.end, 'd MMM yy')
        return start + ' - ' + end
      }
      return format(this.dateRange.start, 'd MMM yyyy')
    },
    tenantName() {
      return this.tenant.charAt(0).toUpperCase() + this.tenant.slice(1)
    },
  },
  watch: {
    tenant(val, old) {
      this.getDCPowerTrend()
    },
    range: {
      handler(val, old) {
        this.dateRange = { ...val }
        this.getDCPowerTrend()
      },
      deep: true,
    },
  },
  mounted() {
    this.dateRange = { ...this.range }
    this.getDCPowerTrend()
  },
  methods: {
    async getDCPowerTrend() {
      try {
        const res = await this.$axios.$get('/battery/power/history', {
          params: {
            site_uid: this.siteConfig.site.uid,
            tenant: this.tenant,
            from_time: this.dateRange.start,
            until_time: this.dateRange.end,
            resolution: 60,
          },
        })
        this.powerSeriesData = res.series
      } catch (error) {}
    },
    onDatePickerClick() {
      this.$refs.dcPowerDate.show()
    },
    onDatePicked(date) {
      this.$refs.dcPowerDate.dismiss()
      this.dateRange = { start: startOfDay(date), end: endOfDay(date) }
      this.getDCPowerTrend()
    },
    onDateRangePicked(range) {
      this.$refs.dcPowerDate.dismiss()
      this.dateRange = { ...range }
      this.getDCPowerTrend()
    },
    getChartTitle() {
      let title = 'DC Power'
      if (this.companyName === COMPANY.FRONTIER_TOWERS_BD) {
        title = 'DC Load'
      }
      return title
    },
  },
}
</script>

<style lang="scss" scoped></style>
