<template>
  <li class="flex w-auto cursor-pointer">
    <div
      class="flex w-full items-center justify-start gap-2 py-2 px-4 transition duration-200"
      :class="[
        compact ? 'px-2 py-1.5' : 'px-4 py-2.5',
        selected
          ? 'border-indigo-500 bg-indigo-50 text-indigo-500'
          : ' border-white bg-white text-gray-700 hover:border-gray-100 hover:bg-gray-100',
      ]"
      @click="$emit('click', item)"
    >
      <span :class="[item.icon, ' text-xs opacity-70']" aria-hidden="true"></span>
      <span class="select-none bg-transparent text-xs font-medium">
        {{ item.label }}
      </span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      /**
       * 'item' object must be of format: {id: '', label: '', ... ...}
       * ie. 'id' & 'label' fields must be present
       */
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped></style>
