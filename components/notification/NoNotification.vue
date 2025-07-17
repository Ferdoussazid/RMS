<template>
  <div class="w-full py-16 bg-gray-100 flex flex-col justify-center items-center space-y-6">
    <img :src="pathto('/icon/bell.png')" alt="" class="w-20 h-20" />
    <span class="text-base text-gray-500 font-thin">No Unseen Notifications</span>
  </div>
</template>

<script>
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
}
</script>

<style lang="scss" scoped></style>
