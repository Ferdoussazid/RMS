<template>
  <div class="flex flex-col items-center rounded bg-white px-3 py-1.5">
    <span class="text-sm font-bold leading-tight text-blue-500">{{ powerKW }} KW</span>
    <span class="text-xs font-normal leading-none text-gray-700">Power</span>
  </div>
</template>

<script>
export default {
  props: {
    currentPins: {
      type: Array,
      required: true,
    },
    voltagePins: {
      type: Array,
      required: true,
    },
  },
  computed: {
    powerKW() {
      const current = this.currentPins.reduce((acc, pin) => pin.ampere + acc, 0)
      const voltage = this.voltagePins.reduce((acc, pin) => pin.voltage + acc, 0)
      return ((current * voltage) / 1000).toFixed(2)
    },
  },
}
</script>

<style lang="scss" scoped></style>
