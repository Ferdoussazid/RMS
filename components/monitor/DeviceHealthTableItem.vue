<template>
  <tr :class="theme" class="hover:bg-gray-100">
    <td class="border-t border-r">
      <div class="flex flex-col items-center justify-center gap-0.5 px-4 py-2 text-left">
        <span class="text-xs font-medium"> {{ splittedTime.hour }}</span>
        <span class="text-[0.6rem] font-light">{{ splittedTime.day }}</span>
      </div>
    </td>

    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.count_loop }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.es || '-1' }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.setup_time / 1000 }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.avg_loop_time / 1000 }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.min_loop_time / 1000 }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.max_loop_time / 1000 }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.min_free_ram }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.max_free_ram }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.session_time || '-1' }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.shield_count || '-1' }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.gps_power || '-1' }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.cr || '-1' }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.wr || '-1' }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ mcuValue }}</span>
    </td>
    <td class="border-t border-r border-gray-200">
      <span class="flex py-3 pl-2 text-xs font-normal text-gray-900"> {{ item.version || '--' }}</span>
    </td>
    <td class="border-t border-gray-200">
      <span class="flex py-3 pl-1 text-xs font-normal text-gray-900"> {{ item.imei || '--' }}</span>
    </td>
  </tr>
</template>

<script>
import { decimalToBinary } from '~/assets/js/Helper'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
  },

  computed: {
    splittedTime() {
      const time = new Date(this.item.time).toLocaleTimeString([], { hour12: false })
      const date = new Date(this.item.time).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      return { hour: time, day: date }
    },
    mcuValue() {
      return decimalToBinary(this.item.mcu)
    },
  },
}
</script>

<style lang="scss" scoped></style>
