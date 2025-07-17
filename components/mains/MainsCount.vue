<template>
  <div
    class="flex cursor-pointer items-center space-x-4 rounded-md p-2 transition duration-300 hover:bg-gray-200"
    @click="onClick"
  >
    <div
      class="flex h-14 w-14 flex-row items-center justify-center rounded-full bg-gradient-to-tr p-3 shadow-lg"
      :class="gradient[state]"
    >
      <img src="/icon/flash.svg" alt="" />
    </div>
    <div class="flex flex-col">
      <div class="flex w-full items-baseline justify-start">
        <span class="font-sans text-2xl font-extrabold leading-none" :class="textColor[state]">
          {{ count }}
        </span>
        <small class="ml-1 text-sm font-light text-gray-600">site{{ count > 1 ? 's' : '' }}</small>
      </div>
      <span class="text-xs font-semibold text-gray-500">
        {{ caption[state] }}
      </span>
    </div>
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
    state: {
      type: String,
      required: true,
      validate: val => ['good', 'bad'].includes(val),
    },
    filter: {
      type: Object,
      default: () => null,
    },
  },
  data: () => ({
    gradient: {
      good: 'from-green-500 to-green-300',
      bad: 'from-red-500 to-red-300',
    },
    textColor: {
      good: 'text-green-500',
      bad: 'text-red-500',
    },
    caption: {
      good: 'Mains availabe',
      bad: 'Mains unavailabe',
    },
  }),
  computed: {},
  methods: {
    onClick() {
      if (this.filter) {
        this.$router.push(this.siteListUrl(this.filter))
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
