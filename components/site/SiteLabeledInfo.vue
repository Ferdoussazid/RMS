<template>
  <div class="col-span-1 flex items-start space-x-3">
    <div class="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg" :class="[theme]">
      <img :src="icon" alt="" class="h-6 w-auto" />
    </div>
    <div class="flex flex-col">
      <span class="text-xs font-light text-slate-800">{{ label }}</span>
      <p class="text-sm font-semibold text-slate-700">{{ title || '' }}</p>
      <p class="text-xs font-medium text-slate-600">{{ caption }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'bg-slate-100',
    },
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped></style>
