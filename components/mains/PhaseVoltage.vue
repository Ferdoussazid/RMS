<template>
  <div class="flex flex-row items-center space-x-6">
    <PowerBulb :has-power="voltage > 120" />
    <div class="flex flex-col">
      <span class="text-xs font-bold text-gray-700">{{ clampedVoltage.toFixed(1) }} Volt</span>
      <span class="text-xs font-normal text-gray-700">{{ label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    voltage: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    clampedVoltage() {
      if (this.voltage <= 120) return 0.0
      return this.voltage
    },
  },
}
</script>

<style lang="scss" scoped></style>
