<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Mains Status" />
    <div class="mt-2 flex flex-row items-stretch space-x-2">
      <div class="w-3/12 shadow-md">
        <LiveFuelValue />
      </div>
      <div class="w-9/12 shadow-md">
        <FuelStockDailyChart :height="300" />
      </div>
    </div>
  </div>
</template>

<script>
import AppToolbar from '~/components/common/AppToolbar.vue'

import LiveFuelValue from '~/components/fuel/LiveFuelValue.vue'
import FuelStockDailyChart from '~/components/fuel/FuelStockDailyChart.vue'

export default {
  components: {
    AppToolbar,
    LiveFuelValue,
    FuelStockDailyChart,
  },
  middleware: ['auth', 'user', 'site'],
}
</script>
