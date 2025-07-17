<template>
  <div class="flex flex-col items-center justify-center space-y-1">
    <div
      class="flex items-center justify-center rounded-full font-normal"
      :class="[theme.bg, theme.text, iconSize, flat ? '' : 'shadow-lg']"
    >
      <span><i class="fas" :class="icon"></i></span>
    </div>
    <span class="block text-center text-xs font-normal text-gray-500 md:hidden">{{ label }}</span>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'success',
      validate: val => ['success', 'error', 'unavailable'].includes(val),
    },
    label: {
      type: String,
      required: true,
    },
    icSuccess: {
      type: String,
      default: 'fa-check',
    },
    icError: {
      type: String,
      default: 'fa-exclamation',
    },
    icUnavailable: {
      type: String,
      default: 'fa-exclamation',
    },
    flat: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'md',
      validate: val => ['sm', 'md', 'lg'].includes(val),
    },
    withDevice: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isSuccess() {
      return this.type === 'success'
    },
    isError() {
      return this.type === 'error'
    },
    isUnavailable() {
      return this.type === 'unavailable'
    },
    theme() {
      if (!this.withDevice) {
        return { bg: 'bg-gray-400', text: 'text-white' }
      }
      if (this.isUnavailable) {
        if (this.flat) {
          return { bg: 'bg-transparent', text: 'text-gray-400' }
        }
        return { bg: 'bg-gray-400', text: 'text-white' }
      }
      if (this.isSuccess) {
        if (this.flat) {
          return { bg: 'bg-transparent', text: 'text-green-500' }
        }
        return { bg: 'bg-green-400', text: 'text-white' }
      }
      if (this.flat) {
        return { bg: 'bg-transparent', text: 'text-red-500' }
      }
      return { bg: 'bg-red-400', text: 'text-white' }
    },
    iconSize() {
      if (this.flat) return 'text-[1.2rem]'

      switch (this.size) {
        case 'sm':
          return 'h-5 w-5 text-[0.6rem]'
        case 'lg':
          return 'h-8 w-8 text-[0.75rem]'

        default:
          return 'h-6 w-6 text-[0.67rem]'
      }
    },
    icon() {
      if (this.isSuccess) {
        return this.icSuccess
      }
      if (this.isError) {
        return this.icError
      }
      return this.icUnavailable
    },
  },
}
</script>

<style lang="scss" scoped></style>
