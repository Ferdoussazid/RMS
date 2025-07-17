<template>
  <div
    class="col-span-1 flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg border border-solid border-slate-200 py-4 transition duration-300 hover:bg-slate-100"
    @click="onClick"
  >
    <div
      class="flex h-14 w-14 flex-row items-center justify-center rounded-full bg-gradient-to-tr shadow-lg"
      :class="[theme]"
    >
      <span class="text-2xl font-semibold text-white">{{ count }}</span>
    </div>
    <span class="text-center text-xs font-semibold text-gray-500">{{ label }}</span>
  </div>
</template>

<script>
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
  props: {
    label: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    theme: {
      type: String,
      default: 'text-gray-700',
    },
    filter: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    onClick() {
      this.$router.push(this.siteListUrl(this.filter))
    },
  },
}
</script>

<style lang="scss" scoped></style>
