<template>
  <li
    class="flex w-full cursor-pointer flex-row items-center justify-between bg-white px-5 py-3 duration-300 hover:bg-gray-100"
    @click="$emit('click', month)"
  >
    <span class="text-xs font-semibold text-gray-600">
      {{ label }}
    </span>
    <span v-if="isSelected" class="text-sm text-green-500">
      <i class="fas fa-check"></i>
    </span>
  </li>
</template>

<script>
import { format } from 'date-fns'

export default {
  props: {
    month: {
      type: Date,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    label() {
      return format(this.month, 'MMM yyyy')
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped></style>
