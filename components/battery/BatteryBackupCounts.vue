<template>
  <div class="flex h-full w-full flex-col rounded bg-white pb-4 shadow-md">
    <div class="flex w-full items-center justify-between px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">Battery Backup</h3>
      <ContextMenu v-on="$listeners" />
    </div>
    <div class="flex flex-1 flex-col justify-evenly space-y-4 px-4">
      <BatteryCount :count="battery.full" state="full" />
      <BatteryCount :count="battery.good" state="good" />
      <BatteryCount :count="battery.ok" state="ok" />
      <BatteryCount :count="battery.bad" state="bad" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import BatteryCount from '~/components/battery/BatteryCount.vue'
import ContextMenu from '~/components/util/ContextMenu'

export default {
  components: {
    BatteryCount,
    ContextMenu,
  },
  computed: {
    ...mapGetters('dashboard', ['battery']),
  },
}
</script>

<style lang="scss" scoped></style>
