<template>
  <div class="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col w-full h-full bg-white rounded pb-4 shadow-md">
    <div class="px-4 py-3">
      <h3 class="text-gray-600 font-semibold text-sm">DG Fuel</h3>
    </div>
    <div class="flex-1 flex flex-col justify-center items-center">
      <div
        class="
          w-14
          h-14
          rounded-full
          bg-gradient-to-tr
          from-orange-500
          to-orange-300
          flex flex-row
          items-center
          justify-center
          p-3
        "
      >
        <img :src="pathto('/icon/fuel1.svg')" alt="" class="" />
      </div>

      <p class="text-xs text-gray-700 font-normal mt-4 text-center">
        <span class="text-sm text-blue-500 font-bold">132.4 Liter</span> available<br />
        Last refill - <span class="font-bold">85 Ltr</span>
      </p>
    </div>
  </div>
</template>

<script>
import utils from '~/mixins/utils'

export default {
  components: {},
  mixins: [utils],
}
</script>

<style lang="scss" scoped>
</style>