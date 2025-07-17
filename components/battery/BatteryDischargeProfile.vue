<template>
  <div class="col-span-12 flex h-full flex-col rounded bg-white shadow-md">
    <div class="flex flex-col items-start justify-start space-y-1 px-4 py-3">
      <span class="text-sm font-semibold text-gray-600"> Battery Discharging Profile </span>
      <span v-if="dischargeProfileEvent" class="text-xs font-normal text-gray-500">
        {{ eventTime }}, <strong class="font-medium text-gray-600">{{ eventDuration }}</strong>
      </span>
    </div>
    <div v-if="state === 'loading'" class="flex h-[40vh] flex-row items-center justify-center">
      <LoadingSpinner />
    </div>
    <NoResultFound v-if="state === 'failed'" icon="/icon/folder.png" message="No data available" />
    <ApexChart
      v-show="state === 'success'"
      ref="chart"
      width="100%"
      :height="height"
      type="area"
      :options="chartOptions"
      :series="chartData"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format, differenceInSeconds } from 'date-fns'

export default {
  components: {},
  props: {
    height: {
      type: Number,
      default: 250,
    },
  },
  data: () => ({
    state: 'loading',
    startTime: '00',
  }),
  computed: {
    ...mapGetters('battery', [
      'refreshDischargeProfileChart',
      'dischargeProfileSeries',
      'dischargeProfileEvent',
      'voltagePins',
    ]),
    ...mapGetters('site', ['focusedSite', 'focusedTenant']),
    eventTime() {
      return format(new Date(this.dischargeProfileEvent.time), 'h:mm a, d MMM yyyy')
    },
    eventDuration() {
      const diff = differenceInSeconds(
        new Date(this.dischargeProfileEvent.endAt),
        new Date(this.dischargeProfileEvent.time)
      )
      return this.$utils.toTimeDuration(diff, { longForm: true })
    },
    seriesStartTimestamp() {
      try {
        const firstPoint = this.dischargeProfileSeries[0]
        return firstPoint[0].getTime()
      } catch (error) {
        return 0
      }
    },
    chartOptions() {
      return {
        chart: {
          id: 'battery-history',
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
        grid: {
          borderColor: '#f5f5f5',
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
            datetimeUTC: false,
            formatter: (value, timestamp, opts) => {
              const diff = Math.floor((timestamp - this.seriesStartTimestamp) / 1000)
              return this.$utils.toTimeDuration(diff)
            },
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
    voltagePins: {
      handler(val, old) {
        if (val) {
          this.getRecentBatteryProfile()
        }
      },
      immediate: true,
    },
    refreshDischargeProfileChart(val, old) {
      this.$refs.chart.updateSeries([{ data: this.dischargeProfileSeries }])
    },
  },
  mounted() {},
  methods: {
    async getRecentBatteryProfile() {
      try {
        if (this.focusedSite) {
          this.state = 'loading'
          const { uid: siteUid } = this.focusedSite
          const comId = this.voltagePins[0].com_id
          await this.$store.dispatch('battery/getVoltageProfile', { siteUid, comId, tenant: this.focusedTenant })
          this.state = 'success'
        }
      } catch (error) {
        this.state = 'failed'
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
