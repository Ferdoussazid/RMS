<template>
  <div class="flex w-full flex-col bg-white shadow-md" :class="border">
    <div class="flex flex-row items-start justify-start px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">
        Mains voltage in Last 1 hour <span class="capitalize">({{ getLabelOfTenant(tenant) }})</span>
      </h3>
    </div>
    <ApexChart ref="phase_history" width="100%" :height="height" type="area" :options="chartOptions"
      :series="chartData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SITE_TENANT } from '~/assets/js/Constant'
import { getTenantLabel } from '~/assets/js/Helper';

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
  },
  data: () => ({
    pinsCopy: [],
    seriesList: [],
    shouldUpdateChart: 0,
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('mains', ['pins']),
    chartOptions() {
      return {
        chart: {
          id: 'site-ac-voltage',
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
          min: 150,
          max: 300,
          labels: {
            formatter(val) {
              return val.toFixed(1) + ' V'
            },
          },
          title: {
            text: 'AC Voltage',
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
            format: 'h:mm tt',
          },
        },
      }
    },
    chartData() {
      return this.pinsCopy.map(pin => ({ name: pin.label, data: [] }))
    },
    border() {
      return this.isAtTop && this.tenantSerial === 1 ? 'rounded md:rounded-t-none' : 'rounded'
    },
  },
  watch: {
    shouldUpdateChart(val, old) {
      const toDataSeries = series => series.map(v => [new Date(v.bucket), v.average])
      this.$refs.phase_history.updateSeries(this.seriesList.map((series, i) => ({ data: toDataSeries(series) })))
    },
    tenant(val, old) {
      this.pinsCopy = this.pins.filter(pin => (pin.tenant || SITE_TENANT.BANGLALINK) === this.tenant)
      this.getRecentPhaseVoltages()
    },
  },
  mounted() {
    this.pinsCopy = this.pins.filter(pin => (pin.tenant || SITE_TENANT.BANGLALINK) === this.tenant)
    this.seriesList = this.pinsCopy.map(_ => [])
    this.getRecentPhaseVoltages()
  },
  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
    async getRecentPhaseVoltages() {
      await Promise.all(this.pinsCopy.map((p, i) => this.fetchSinglePhaseHistory(p, i)))
      this.shouldUpdateChart++
    },

    async fetchSinglePhaseHistory(pin, i) {
      const series = await this.$axios.$get('/mains/voltage/history', {
        params: {
          pin_id: pin.id,
          resolution: 5,
          tenant: this.tenant,
        },
      })
      this.seriesList[i] = series
    },
  },
}
</script>

<style lang="scss" scoped></style>
