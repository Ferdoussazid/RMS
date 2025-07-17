<template>
  <div
    class="flex cursor-pointer flex-col items-center justify-center rounded bg-white py-4 px-4 transition duration-300 hover:bg-slate-100"
  >
    <div
      class="relative flex h-16 w-16 flex-row items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-violet-300 shadow-lg"
      @click="onClick"
    >
      <span class="text-3xl font-bold text-white">
        {{ count }}
      </span>

      <img
        :src="icon"
        alt=""
        class="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-solid border-white"
      />
    </div>
    <span class="mt-3 text-xs font-semibold text-gray-500"> Site{{ count > 1 ? 's' : '' }} running on DG </span>
  </div>
</template>

<script>
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
  props: {
    count: {
      type: Number,
      required: true,
    },
    filter: {
      type: Object,
      default: () => null,
    },
  },
  data: () => ({}),
  computed: {
    icon() {
      return this.count > 0 ? '/icon/warning3.png' : '/icon/check.png'
    },
  },
  methods: {
    onClick() {
      if (this.filter) {
        this.$router.push(this.siteListUrl(this.filter, '/site/list'))
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
