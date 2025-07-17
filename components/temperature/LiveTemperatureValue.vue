<template>
  <div class="flex h-full w-full flex-col rounded bg-white pb-4 shadow-md" :class="{ 'md:rounded-t-none': isAtTop }">
    <div class="flex flex-row justify-between px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">Temperature</h3>
      <div class="flex flex-row">
        <button
          class="rounded-l border border-r-0 px-2 text-xs font-medium"
          :class="[unit === 'C' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-200 bg-white text-gray-700']"
          @click="unit = 'C'"
        >
          &deg; C
        </button>
        <button
          class="rounded-r border border-l-0 px-2 text-xs font-medium"
          :class="[unit === 'F' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-200 bg-white text-gray-700']"
          @click="unit = 'F'"
        >
          &deg; F
        </button>
      </div>
    </div>
    <div class="flex flex-1 flex-row items-center">
      <div class="flex flex-1 justify-center">
        <img :src="pathto('/icon/thermometer2.svg')" alt="" class="w-24" />
      </div>
      <div class="flex h-full flex-1 flex-col divide-y divide-gray-200">
        <div v-for="(pin, i) in pins" :key="i" class="flex flex-1 flex-col items-center justify-center">
          <span class="text-xs font-bold text-gray-700">
            {{ getUnitBasedValue(pin.temperature || 0).toFixed(1) }}&deg;
            {{ unitName }}
          </span>
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
  data: () => ({
    unit: 'C', // Default unit is Celcius
  }),
  computed: {
    ...mapGetters('temperature', ['pins']),
    unitName() {
      return this.unit === 'F' ? 'Fahrenheit' : 'Celsius'
    },
  },
  methods: {
    getUnitBasedValue(temp) {
      if (this.unit === 'F') {
        return (9 * temp) / 5 + 32
      }
      return temp
    },
  },
}
</script>

<style lang="scss" scoped></style>
