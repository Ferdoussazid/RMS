<template>
  <div class="flex flex-col items-center rounded bg-white px-3 py-1.5">
    <span class="text-sm font-bold leading-tight text-blue-500">{{ formattedValue }} Amp</span>
    <span class="text-xs font-normal leading-none text-gray-700">{{ pin.label }}</span>
  </div>
</template>

<script>
export default {
  props: {
    pin: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedValue() {
      return this.pin.ampere.toFixed(1)
    },
  },
}
</script>

<style lang="scss" scoped></style>
