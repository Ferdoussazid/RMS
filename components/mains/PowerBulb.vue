<template>
  <div
    class="flex h-14 w-14 flex-row items-center justify-center rounded-full bg-gradient-to-tr p-3 shadow-lg"
    :class="[hasPower ? 'from-green-500 to-green-300' : 'from-red-500 to-red-300']"
  >
    <img :src="pathto('/icon/flash.svg')" alt="" />
  </div>
</template>

<script>
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
  props: {
    hasPower: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped></style>
