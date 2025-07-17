<template>
  <div class="flex flex-row items-center space-x-2">
    <div
      class="
        w-14
        h-14
        rounded-full
        bg-gradient-to-tr
        from-cyan-500
        to-cyan-300
        flex flex-row flex-shrink-0
        items-center
        justify-center
        p-3
      "
    >
      <img :src="pathto('/icon/battery9.svg')" alt="" class="" />
    </div>

    <div class="flex flex-col flex-grow">
      <span class="text-sm text-gray-600 font-normal leading-tight">{{
        label
      }}</span>
      <span class="text-sm text-gray-700 font-semibold">{{ ampere.toFixed(1) }} amp</span>
    </div>

    <div class="flex-shrink-0">
      <span class="text-green-500"><i class="fas fa-arrow-up"></i></span>
    </div>
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
    ampere: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
