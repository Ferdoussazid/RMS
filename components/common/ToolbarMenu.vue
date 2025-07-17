<template>
  <div :class="[responsiveClass, 'relative']">
    <button class="flex h-full w-auto flex-row items-center justify-center px-4" :class="{ 'bg-opacity-10': isOpen }" @click="onClick">
      <slot></slot>
    </button>
    <button v-if="isOpen" class="fixed inset-0 z-[998] h-screen w-screen cursor-default bg-opacity-0" @click="isOpen = false"></button>
    <div
      class="fixed top-auto right-4 z-[9999] mt-2 flex origin-top transform flex-col overflow-hidden rounded bg-white shadow-lg transition duration-300 ease-in-out md:absolute md:top-full md:right-0"
      :class="{
        'scale-y-0 opacity-0': !isOpen,
        'scale-y-100 opacity-100': isOpen,
      }"
    >
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showBelow: {
      type: String,
      default: null, // screen breakpoint value: 'sm', 'md', 'lg' etc.
    },
    hideBelow: {
      type: String,
      default: null, // screen breakpoint value: 'sm', 'md', 'lg' etc.
    },
  },
  data: () => ({
    isOpen: false,
  }),
  computed: {
    responsiveClass() {
      if (this.showBelow) {
        return `flex ${this.showBelow}:hidden`
      }
      if (this.hideBelow) {
        return `hidden ${this.hideBelow}:flex`
      }
      return ''
    },
  },
  methods: {
    onClick() {
      if (this.$listeners.click) {
        this.$emit('click')
      } else {
        this.isOpen = !this.isOpen
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
