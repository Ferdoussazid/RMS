<template>
  <div name="chartcount" class="flex flex-row gap-1">
    <div class="flex flex-row items-center divide-x-2 rounded bg-slate-50">
      <div name="chart" class="flex flex-col items-center">
        <div>
          <ApexChart type="donut" :options="donutChartOptions" :series="donutChartSeries" height="150" />
        </div>
        <div class="flex flex-col items-center">
          <span class="text-3xl font-bold">45%</span>
          <span>Resolved</span>
        </div>
      </div>

      <div name="total count" class="flex flex-col space-y-4 p-8">
        <div class="border-b border-gray-300 pb-2 text-center font-semibold">Total: 512</div>
        <div class="flex items-center gap-2">
          <div class="inline-flex items-center justify-center rounded-full bg-blue-200 bg-opacity-50 p-2">
            <i class="fas fa-recycle text-blue-500"></i>
          </div>
          <div class="flex space-x-1"><span class="font-semibold">160</span> <span>ACTIVE</span></div>
        </div>
        <div class="flex items-center gap-2">
          <div class="inline-flex items-center justify-center rounded-full bg-green-200 bg-opacity-50 p-2">
            <i class="far fa-check-circle text-green-500"></i>
          </div>
          <div class="flex space-x-1"><span class="font-semibold">160</span> <span>CLOSED</span></div>
        </div>
      </div>
      <div name="barchart">
        <ApexChart type="bar" :options="barChartOptions" :series="barChartSeries" height="180" />
      </div>
    </div>

    <div class="flex h-full grow items-center space-x-5 divide-x-2 bg-slate-50">
      <div name="new" class="flex w-full flex-1 flex-row items-center justify-center space-x-3">
        <div class="inline-flex items-center justify-center rounded-full bg-blue-200 bg-opacity-50 p-4">
          <i class="fas fa-exclamation-circle text-blue-500"></i>
        </div>
        <div class="items-left flex flex-col">
          <span class="text-slate-70 font-semibold">New</span>
          <span class="text-3xl font-bold">1</span>
        </div>
      </div>

      <div name="open" class="flex w-full flex-1 flex-row items-center justify-center space-x-3">
        <div class="inline-flex items-center justify-center rounded-full bg-orange-200 bg-opacity-50 p-4">
          <i class="fas fa-circle-notch text-orange-500"></i>
        </div>
        <div class="items-left flex flex-col">
          <span class="text-slate-70 font-semibold">Open</span>
          <span class="text-3xl font-bold">1</span>
        </div>
      </div>

      <div name="unassigned" class="flex w-full flex-1 flex-row items-center justify-center space-x-3">
        <div class="inline-flex items-center justify-center rounded-full bg-purple-200 bg-opacity-50 p-4">
          <i class="fas fa-user-plus text-purple-500"></i>
        </div>
        <div class="items-left flex flex-col">
          <span class="text-slate-70 font-semibold">Unassigned</span>
          <span class="text-3xl font-bold">45</span>
        </div>
      </div>

      <div name="closed" class="flex w-full flex-1 flex-row items-center justify-center space-x-3">
        <div class="inline-flex items-center justify-center rounded-full bg-green-200 bg-opacity-50 p-4">
          <i class="far fa-check-circle text-green-500"></i>
        </div>
        <div class="items-left flex flex-col">
          <span class="text-slate-70 font-semibold">Closed</span>
          <span class="text-3xl font-bold">43</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      donutChartOptions: {
        chart: {
          type: 'donut',
        },
        dataLabels: {
          enabled: false, // Set to false to hide labels
        },
        legend: {
          show: false, // Set to false to hide legend
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                show: false, // Set to false to hide legend
              },
            },
          },
        ],
      },
      donutChartSeries: [50, 50],
      barChartOptions: {
        chart: {
          type: 'bar',
          stacked: true,
          toolbar: {
            show: false,
          },
          width: '10%',
        },

        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '25%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        grid: {
          show: false,
        },
        xaxis: {
          categories: ['test'],
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          grid: {
            show: false,
          },
          align: 'left',
        },
        yaxis: {
          show: false,
          axisBorder: {
            show: false,
          },
        },
        legend: {
          position: 'right',
          width: 200,
          itemMargin: {
            // vertical: 4, // Adjust the vertical gap between legend items
          },
        },
        fill: {
          opacity: 1,
        },
      },
      barChartSeries: [],
    }
  },
  computed: {},
  mounted() {
    this.barChartOptions = this.getbarChartSeries([
      {
        name: 'Open',
        data: 10,
        colour: '#FF5733',
      },
      {
        name: 'Closed',
        data: 10,
        colour: '#FF3366',
      },
      {
        name: 'Resolved',
        data: 10,
        colour: '#5733FF',
      },
    ])
  },
  methods: {
    getbarChartSeries(options) {
      let arr = []

      options.forEach(o => {
        arr.push({
          name: o.name,
          data: [o.count],
          fill: {
            colors: [o.colour],
          },
        })
      })
      return arr
    },
  },
}
</script>

<style lang="scss" scoped></style>
