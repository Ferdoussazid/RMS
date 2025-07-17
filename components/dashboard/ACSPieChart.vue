<template>
  <ApexChart ref="chart" width="100%" height="200px" type="pie" :options="chartOptions" :series="chartSeries" />
</template>

<script>
import { mapGetters } from 'vuex'
import { SITE_ALARM, SITE_FILTER_TYPE } from '~/assets/js/Constant'
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
  data: () => ({
    filter: [
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.LOCK_STATUS, expected: 0 },
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.LOCK_STATUS, expected: 1 },
    ],
  }),
  computed: {
    ...mapGetters('dashboard', ['access']),

    chartSeries() {
      return [this.access.lock_open, this.access.total_door - this.access.lock_open]
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
        labels: ['Lock Open', 'Lock Close'],
        colors: ['#ff4757', '#2f3542'],
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
}
</script>

<style lang="scss" scoped></style>
