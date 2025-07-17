<template>
  <div class="flex flex-col rounded bg-white shadow-md" :class="{ 'md:rounded-t-none': isAtTop }">
    <div class="flex flex-row items-start justify-start px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">Temperature in Last 1 hour</h3>
    </div>
    <ApexChart :ref="chartTag" width="100%" :height="height" type="area" :options="chartOptions" :series="chartData" />
  </div>
</template>

<script>
import { differenceInSeconds, startOfYesterday } from 'date-fns'
import { mapGetters } from 'vuex'
import { APP_EVENT } from '~/assets/js/Constant'

export default {
  components: {},
  props: {
    height: {
      type: Number,
      default: 250,
    },
    isAtTop: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    seriesName: '',
    seriesData: [],
    lastDataFetched: startOfYesterday(),
  }),
  computed: {
    ...mapGetters('temperature', ['primaryPin']),
    chartTag() {
      return 'site_temperature'
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
              return val.toFixed(1)
            },
          },
          title: {
            text: 'Temperature',
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
              return `${val.toFixed(1)}&deg; C`
            },
          },
          x: {
            format: 'h:m tt',
          },
        },
      }
    },
    chartData() {
      return [{ name: this.seriesName, data: this.seriesData }]
    },
  },
  watch: {},
  mounted() {
    this.seriesName = this.primaryPin.label
    this.getRecentTemperatureSeries()
    this.$bus.$on(APP_EVENT.TEMPERATURE_PUBLISHED, this.getRecentTemperatureSeries.bind(this))
  },
  methods: {
    isRecentlyRefreshed() {
      return differenceInSeconds(new Date(), this.lastDataFetched) < 60
    },
    async getRecentTemperatureSeries() {
      if (!this.primaryPin) {
        return
      }
      try {
        if (this.isRecentlyRefreshed()) {
          return
        }
        this.lastDataFetched = new Date()

        const params = { pin_id: this.primaryPin.id, resolution: 5 }
        const history = await this.$axios.$get('/temperature/temperature/recent', { params })

        this.seriesData = history.series.map(v => [new Date(v.bucket), v.average])
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped></style>
