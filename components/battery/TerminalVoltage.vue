<template>
  <div class="flex flex-row items-center space-x-6">
    <div
      class="flex h-14 w-14 flex-row items-center justify-center rounded-full bg-gradient-to-tr p-3 shadow-lg"
      :class="gradient"
    >
      <img src="/icon/multimeter2.png" alt="" class="" />
    </div>
    <div class="flex flex-col">
      <span v-if="voltage > -1" class="text-xs font-bold text-gray-700"> {{ voltage.toFixed(1) }} Volt </span>
      <span v-else class="text-xs font-bold text-gray-700"> -- Volt </span>
      <span class="text-xs font-normal text-gray-700">{{ label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    voltage: {
      type: Number,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },
  },
  computed: {
    gradient() {
      if (this.voltage >= 25.0) {
        return 'from-green-500 to-green-300'
      }
      if (this.voltage >= 22.0) {
        return 'from-blue-500 to-blue-300'
      }
      return 'from-red-500 to-red-300'
    },
  },
}
</script>

<style lang="scss" scoped></style>
