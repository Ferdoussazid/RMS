<template>
  <ApexChart ref="chart" width="97%" height="120" type="bar" :options="chartOptions" :series="chartSeries" />
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '~/mixins/utils'
import { SITE_ALARM, SITE_FILTER_TYPE } from '~/assets/js/Constant'

export default {
  mixins: [utils],
  data: () => ({
    filter: [
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.LOCK_CLOSE_FAIL, expected: 0 },
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.VIBRATION, expected: 0 },
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.SECURITY_BREACH, expected: 0 },
    ],
  }),
  computed: {
    ...mapGetters('dashboard', ['access']),
    chartSeries() {
      return [
        { name: 'Lock Close Fail', data: [this.access.lock_close_fail] },
        { name: 'Vibration', data: [this.access.vibration] },
        { name: 'Security Breach', data: [this.access.security_breach] },
      ]
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
            dataPointSelection: (event, chartContext, options) => {
              this.$router.push(this.siteListUrl(this.filter[options.seriesIndex]))
            },
          },
        },
        legend: {
          position: 'bottom',
        },
        colors: ['#40407a', '#ffdd59', '#ff3838'],
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        xaxis: {
          categories: ['Alarm'],
          labels: {
            formatter(val) {
              return Math.ceil(val)
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (siteCount, { series, seriesIndex, dataPointIndex, w }) => {
              const suffix = siteCount > 1 ? ' Sites' : ' Site'
              return siteCount + suffix
            },
          },
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
