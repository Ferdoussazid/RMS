<template>
  <div :class="[bgColor]" class="flex flex-row items-center space-x-4 px-4 py-2">
    <div
      class="flex h-9 w-9 flex-row items-center justify-center rounded-full bg-gradient-to-tr p-2 shadow-lg"
      :class="[item.theme]"
    >
      <img :src="item.icon" alt="" class="" />
    </div>
    <div class="flex flex-col">
      <span class="text-xs font-semibold text-gray-700"> {{ value }} {{ unit }}</span>
      <span class="text-xs font-normal text-gray-700">{{ title }}</span>
      <span v-if="subtitle" class="text-[0.7rem] font-light text-gray-700">({{ subtitle }})</span>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { BMS_MEASUREMENT_DATA, RECTIFIER_MEASUREMENT_DATA } from '~/assets/js/Constant'
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    serial: {
      type: Number,
      required: true,
    },
  },
  computed: {
    title() {
      return this.item.label || ''
    },
    subtitle() {
      if (
        [
          RECTIFIER_MEASUREMENT_DATA.CURRENT_MAINS_CONSUMPTION,
          RECTIFIER_MEASUREMENT_DATA.CURRENT_LOAD_CONSUMPTION,
        ].includes(this.item.id)
      ) {
        return `${format(new Date(), 'LLL')} '${format(new Date(), 'yy')}`
      }
      return null
    },
    value() {
      if (this.item.data) {
        const intValueItems = [
          RECTIFIER_MEASUREMENT_DATA.AC_PHASE_NUMBER,
          RECTIFIER_MEASUREMENT_DATA.SYSTEM_RECT_NUMBER,
          BMS_MEASUREMENT_DATA.CYCLE,
        ]
        const decimalPoint = +!intValueItems.includes(this.item.id)
        return this.item.data.value?.toFixed(decimalPoint)
      }
      return 'N/A'
    },
    unit() {
      return this.item.data ? this.item.data.unit : ''
    },
    bgColor() {
      return this.serial % 2 === 1 ? 'bg-gray-100' : 'bg-white'
    },
  },
}
</script>

<style lang="scss" scoped></style>
