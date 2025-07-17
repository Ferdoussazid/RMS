<template>
  <li
    class="
      w-full
      px-5
      py-3
      cursor-pointer
      bg-white
      hover:bg-gray-100
      duration-300
      flex flex-row
      justify-between
      items-center
    "
    @click="$emit('click', site)"
  >
    <span class="text-gray-600 font-semibold text-xs">
      {{ site.name }}
    </span>
    <span  v-if="isSelected" class="text-sm text-green-500">
      <i class="fas fa-check"></i>
    </span>
  </li>
</template>

<script>
export default {
  props: {
    site: {
      type: Object,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
</style>