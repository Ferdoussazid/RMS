<template>
  <ContentCard title="Power Alarm">
    <template #content>
      <div class="w-full pt-6">
        <ApexChart ref="chart" width="95%" height="120" type="bar" :options="chartOptions" :series="chartSeries" />
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '~/mixins/utils'
import { SITE_ALARM, SITE_FILTER_TYPE } from '~/assets/js/Constant'

export default {
  mixins: [utils],
  data: () => ({
    filter: [
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.DC_POWER_FAIL, expected: 0 },
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.RECTIFIER_FAIL, expected: 0 },
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.DC_LOAD_FAIL, expected: 0 },
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.HIGH_TEMPERATURE, expected: 0 },
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.AVIATION_LIGHT_FAIL, expected: 0 },
    ],
  }),
  computed: {
    ...mapGetters('dashboard', ['alarm']),
    chartSeries() {
      return [
        { name: 'DC Power Fail', data: [this.alarm.dc_power_fail] },
        { name: 'Rectifier Fail', data: [this.alarm.rectifier_fail] },
        { name: 'DC Load Fail', data: [this.alarm.dc_load_fail] },
        { name: 'High Temperature', data: [this.alarm.high_temperature] },
        { name: 'Aviation Light Fail', data: [this.alarm.aviation_light_fail] },
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
          position: 'top',
        },
        colors: ['#B53471', '#ff4757', '#5f27cd', '#222f3e', '#c56cf0'],
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
