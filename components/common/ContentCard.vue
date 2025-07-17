<template>
  <div
    class="flex h-full w-full flex-col overflow-hidden bg-slate-100"
    :class="{
      'border border-slate-200 shadow-sm': isFlat,
      ' rounded': !isTopBlending,
      'rounded md:rounded-t-none': isTopBlending,
    }"
  >
    <div class="flex shrink-0 flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">{{ title }}</h3>
      <slot name="action"></slot>
    </div>
    <div class="flex w-full grow flex-col bg-white shadow-inner">
      <slot name="content"></slot>
    </div>
    <div v-if="hasFooter" class="w-full shrink-0 bg-white">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    isFlat: {
      type: Boolean,
      default: false,
    },
    hasFooter: {
      type: Boolean,
      default: false,
    },
    isTopBlending: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped></style>
