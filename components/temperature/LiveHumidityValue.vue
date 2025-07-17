<template>
  <div class="flex h-full w-full flex-col rounded bg-white pb-4 shadow-md" :class="{ 'md:rounded-t-none': isAtTop }">
    <div class="flex flex-row justify-between px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">Humidity</h3>
    </div>
    <div class="flex flex-1 flex-row items-center">
      <div class="flex flex-1 justify-center">
        <img :src="pathto('/icon/humidity.png')" alt="" class="w-24" />
      </div>
      <div class="flex h-full flex-1 flex-col divide-y divide-gray-200">
        <div v-for="(pin, i) in humidityPins" :key="i" class="flex flex-1 flex-col items-center justify-center">
          <span class="text-xs font-bold text-gray-700"> {{ (pin.humidity || 0).toFixed(1) }}% </span>
          <span class="text-center text-xs font-normal text-gray-700">
            {{ pin.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
  props: {
    isAtTop: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters('temperature', ['humidityPins']),
  },
}
</script>

<style lang="scss" scoped></style>
