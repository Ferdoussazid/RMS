<template>
  <div class="flex flex-col rounded bg-white shadow-md">
    <div class="flex flex-row items-start justify-start px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">{{ chartTitle }}</h3>
    </div>
    <ApexChart :ref="chartTag" width="100%" :height="height" type="area" :options="chartOptions" :series="chartData" />
  </div>
</template>

<script>
import { differenceInSeconds, startOfYesterday } from 'date-fns'
import { APP_EVENT, SITE_TENANT } from '~/assets/js/Constant'
import { getTenantLabel } from '~/assets/js/Helper';

export default {
  components: {},
  props: {
    pin: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
      default: 250,
    },
  },
  data: () => ({
    series: [],
    shouldUpdateChart: 0,
    lastDataFetched: startOfYesterday(),
  }),
  computed: {
    chartTitle() {
      const tenant = this._.capitalize(this.tenant)
      return `Battery Terminal Voltage - ${tenant} (Last 1 Hour)`
    },
    tenant() {
      return this.getLabelOfTenant(this.pin.tenant || SITE_TENANT.BANGLALINK)
    },
    chartTag() {
      return 'dc_voltage_' + this.tenant
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
        },
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
          min: 10,
          max: 60,
          labels: {
            formatter(val) {
              return val.toFixed(1) + ' V'
            },
          },
          title: {
            text: 'Terminal Voltage',
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
              return `${val.toFixed(1)} Volt`
            },
          },
          x: {
            format: 'h:mm tt, d MMM',
          },
        },
      }
    },
    chartData() {
      return [
        {
          name: 'Terminal Voltage',
          data: [],
        },
      ]
    },
  },
  watch: {
    shouldUpdateChart(val, old) {
      this.$refs[this.chartTag].updateSeries([
        {
          data: this.series.map(v => [new Date(v.bucket), v.average]),
        },
      ])
    },
  },
  mounted() {
    this.getRecentTerminalVoltages()
    this.$bus.$on(APP_EVENT.DC_VOLTAGE_PUBLISHED, this.getRecentTerminalVoltages.bind(this))
  },
  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
    isRecentlyRefreshed() {
      return differenceInSeconds(new Date(), this.lastDataFetched) < 300
    },
    async getRecentTerminalVoltages() {
      try {
        if (this.isRecentlyRefreshed()) {
          return
        }
        this.lastDataFetched = new Date()

        const params = {
          pin_id: this.pin.id,
          resolution: 5,
        }
        const history = await this.$axios.$get('/battery/voltage/recent', { params })
        this.series = history.series
        this.shouldUpdateChart++
      } catch (error) { }
    },
  },
}
</script>

<style lang="scss" scoped></style>
