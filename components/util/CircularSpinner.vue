<template>
  <div>
    <div style="border-top-color: transparent" class="animate-spin rounded-full border-solid" :class="[bounds, theme]"></div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'md',
      validate: val => ['xs', 'sm', 'md', 'lg'].includes(val),
    },
    theme: {
      type: String,
      default: 'border-indigo-500',
    },
  },
  computed: {
    bounds() {
      switch (this.size) {
        case 'xs':
          return 'w-3 h-3 border-1'
        case 'sm':
          return 'w-4 h-4 border-2'
        case 'lg':
          return 'w-12 h-12 border-4'

        default:
          return 'w-8 h-8 border-2'
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
