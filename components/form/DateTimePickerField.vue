<template>
  <div class="flex flex-col space-y-1 items-start">
    <span class="text-xs font-medium text-gray-700">
      {{ label }}
    </span>
    <div
      class="
        px-4
        py-2
        w-full
        rounded-md
        border border-slate-300
        bg-slate-100
        cursor-pointer
        text-sm text-gray-800
        placeholder:text-sm placeholder:font-light placeholder:text-gray-400
      "
      @click="$emit('click')"
    >
      <span class="text-xs text-slate-700 font-normal">{{ placeholder }}</span>
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
    placeholder: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
</style>