<template>
  <div class="flex w-full flex-row items-stretch space-x-2 opacity-100">
    <div
      class="flex grow flex-row items-center justify-between space-x-2 overflow-hidden rounded-md px-3 py-2 shadow-lg"
      :class="[alarm.status === 0 ? 'bg-green-100' : 'bg-red-100']"
    >
      <span class="select-none text-xs font-semibold text-gray-700">{{ label }}</span>
    </div>
    <div class="flex shrink-0 flex-row items-center justify-center">
      <span v-if="alarm.status === 0"><i class="fas fa-xl fa-check-circle text-green-500 shadow-lg"></i></span>
      <span v-else><i class="fas fa-xl fa-exclamation-triangle text-red-500 shadow-lg"></i></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alarm: {
      type: Object,
      required: true,
    },
  },
  computed: {
    label() {
      if (this.alarm.status === 1 && this.alarm.message) {
        return `${this.alarm.label}: ${this.alarm.message}`
      }
      return this.alarm.label
    },
  },
}
</script>

<style lang="scss" scoped></style>
