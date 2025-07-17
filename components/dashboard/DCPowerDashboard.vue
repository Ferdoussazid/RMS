<template>
  <ApexChart
    ref="dcPowerDashboard"
    width="100%"
    height="200px"
    type="pie"
    :options="chartOptions"
    :series="chartSeries"
  />
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import utils from '~/mixins/utils'
import { SITE_FILTER_TYPE, SITE_PROPERTY } from '~/assets/js/Constant'

export default {
  mixins: [utils],
  data: () => ({
    loaded: false,
    filter: [
      { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.DC_LOAD, expected: 'DOWN' },
      { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.DC_LOAD, expected: 'OVER' },
      { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.DC_LOAD, expected: 'NORMAL' },
    ],
  }),
  computed: {
    ...mapGetters('dashboard', ['dcPower']),
    chartSeries() {
      return [this.dcPower.no_load, this.dcPower.over_load, this.dcPower.normal_load]
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
              const filter = this.filter[config.dataPointIndex]
              this.$router.push(this.siteListUrl(filter))
            },
          },
        },
        legend: {
          position: 'bottom',
        },
        labels: ['No Load', 'Over Load', 'Normal Load'],
        colors: ['#ee5253', '#ff9f43', '#2ed573'],
        plotOptions: {
          pie: {
            startAngle: 0,
            endAngle: 360,
            expandOnClick: true,
            offsetX: 0,
            offsetY: 0,
            customScale: 1,
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10,
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter(val, { seriesIndex, dataPointIndex, w }) {
            return w.config.series[seriesIndex]
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (siteCount, { series, seriesIndex, dataPointIndex, w }) => {
              return siteCount + ' Sites'
            },
          },
        },
      }
    },
  },
  watch: {
    dcPower: {
      handler(val, old) {
        if (!_.isEqual(val, old) || !this.loaded) {
          this.loaded = true
          this.$refs.dcPowerDashboard.updateSeries([val.no_load, val.over_load, val.normal_load])
          this.$refs.dcPowerDashboard.updateOptions({ ...this.chartOptions })
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
