<template>
  <div class="w-full pr-5">
    <ApexChart
      ref="chart"
      width="100%"
      height="120px"
      type="bar"
      :series="chartData"
      :options="chartOptions"
      class="my-6"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('health', ['counts']),
    chartOptions() {
      const comp = this
      return {
        chart: {
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: false,
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
              this.onDataPointClick(config)
            },
          },
        },
        grid: { show: false },
        colors: ['#2ed573', '#1e90ff', '#ff4757'],
        legend: {
          position: 'top',
          formatter(seriesName, opts) {
            return [seriesName, ` (${comp.seriesPercentage(opts.seriesIndex)}%)`]
          },
        },
        xaxis: {
          type: 'categories',
          categories: [],
          min: 0,
          max: 100,
          labels: {
            show: false,
          },
          axisBorder: { show: false },
        },
        yaxis: {
          show: false,
          axisBorder: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        stroke: {
          width: 1,
          colors: ['#fff'],
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          x: {
            formatter: () => {
              return 'Last 24 Hours'
            },
          },
          y: {
            formatter: (percentage, { series, seriesIndex, dataPointIndex, w }) => {
              return `${percentage}%`
            },
          },
        },
      }
    },
    chartData() {
      return [
        {
          name: 'Healthy Device',
          data: [this.seriesPercentage(0)],
        },
        {
          name: 'Unusual Device',
          data: [this.seriesPercentage(1)],
        },
        {
          name: 'Offline Device',
          data: [this.seriesPercentage(2)],
        },
      ]
    },
  },
  methods: {
    seriesPercentage(index) {
      const total = this.counts.normal + this.counts.abnormal + this.counts.offline
      let x = 0
      switch (index) {
        case 0:
          x = this.counts.normal
          break
        case 1:
          x = this.counts.abnormal
          break
        default:
          x = this.counts.offline
          break
      }
      return Math.round((x * 100) / total)
    },
  },
}
</script>

<style lang="scss" scoped></style>
