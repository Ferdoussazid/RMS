<template>
  <div class="w-full h-full bg-white rounded flex flex-col">
    <div class="px-4 py-3 flex flex-row justify-between items-start">
      <h3 class="text-gray-600 font-semibold text-sm">
        Daily fuel availability
      </h3>
      <select
        class="
          text-xs text-gray-600
          font-normal
          rounded
          border border-gray-300
          py-1.5
        "
      >
        <option value="7">7 days</option>
        <option value="15">15 days</option>
        <option value="30">30 days</option>
      </select>
    </div>
    <ApexChart
      width="100%"
      :height="height"
      type="bar"
      :series="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { sub } from 'date-fns'

const range = require('licia/range')
const random = require('licia/random')

const randomFuelValues = function (count) {
  let stock = 220
  const res = []
  for (let i = 0; i < 30; i++) {
    stock -= random(5, 25)
    res.push(stock)
    if (stock < 40) {
      stock += random(120, 200)
    }
  }
  return res.slice(0, count)
}

export default {
  components: {},
  props: {
    height: {
      type: Number,
      default: 250,
    },
  },
  data: () => ({
    chartOptions: {
      chart: {
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      legend: {
        position: 'top',
      },
      xaxis: {
        type: 'datetime',
        categories: range(30, 0, -1).map((n) =>
          sub(new Date(), { days: n }).toISOString()
        ),
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
        },
      },
      fill: {
        opacity: 1,
      },
    },
  }),
  computed: {
    chartData() {
      return [
        {
          name: 'Fuel stock',
          data: randomFuelValues(30),
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
</style>