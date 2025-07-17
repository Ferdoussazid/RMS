<template>
  <div
    :class="[
      'flex flex-1 flex-row items-center justify-center',
      'cursor-pointer rounded-t-md border-b-4',
      'py-3 transition duration-300 hover:bg-gray-100',
      isActive ? 'border-indigo-400 bg-gray-100' : 'border-transparent bg-transparent',
    ]"
    @click="$emit('select')"
  >
    <span :class="['text-xs font-semibold transition duration-300', isActive ? 'text-indigo-500' : 'text-gray-600']">
      <i :class="['fas mr-2', icon]"></i> {{ title }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped></style>
