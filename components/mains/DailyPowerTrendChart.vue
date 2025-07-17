<template>
  <div class="flex w-full flex-col rounded bg-white shadow-md">
    <div class="flex flex-row items-center justify-between px-4 py-3">
      <div class="flex flex-row items-center justify-start">
        <div
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition duration-300 hover:bg-gray-200"
          @click="$emit('close')"
        >
          <span class="text-sm text-gray-700"><i class="fas fa-arrow-left"></i></span>
        </div>
        <h3 class="ml-4 text-sm font-semibold text-gray-600">Power History of {{ dateLabel }}</h3>
      </div>
    </div>

    <div class="flex w-full flex-row items-center justify-center space-x-6">
      <div class="flex items-center space-x-2">
        <div class="rounded-xs h-3 w-3 bg-green-500"></div>
        <span class="text-xs font-medium text-slate-600">AC Available</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="rounded-xs h-3 w-3 bg-blue-500"></div>
        <span class="text-xs font-medium text-slate-600">Site On Battery</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="rounded-xs h-3 w-3 bg-orange-500"></div>
        <span class="text-xs font-medium text-slate-600">DG/PG Run</span>
      </div>
    </div>

    <div class="h-[320px] w-full px-12 py-8">
      <div class="relative flex h-full w-full flex-row items-stretch justify-evenly border-b border-l border-slate-300">
        <div v-for="(col, i) in series" :key="i" class="relative w-6 overflow-hidden rounded-t bg-gray-200">
          <div
            class="absolute inset-x-0 bg-green-500"
            :style="getEventPosition(col.availability.seconds, col.availability.offset)"
          ></div>
          <div
            v-for="event in col.events"
            :key="event.id"
            v-tooltip.top="event.duration"
            class="absolute inset-x-0"
            :class="[getEventColor(event)]"
            :style="getEventPosition(event.seconds, event.offset)"
          ></div>
        </div>

        <div class="absolute top-full mt-1 flex w-full flex-row justify-evenly">
          <div v-for="(col, k) in series" :key="k">
            <span class="text-[0.55rem] font-medium text-slate-500">{{ col.label }}</span>
          </div>
        </div>

        <div class="absolute right-full mr-1 flex h-full flex-col-reverse justify-between">
          <div v-for="(x, y) in 7" :key="x">
            <span class="text-[0.55rem] font-medium leading-none text-slate-500">{{ y * 10 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { mapGetters } from 'vuex'
import 'floating-vue/dist/style.css'

import { SITE_EVENT } from '~/assets/js/Constant'

export default {
  props: {
    date: {
      type: Date,
      required: true,
    },
    series: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
      default: 250,
    },
  },
  data: () => ({
    zoom: 'day',
  }),
  computed: {
    ...mapGetters('mains', ['pins']),
    ...mapGetters('site', ['siteConfig']),
    dateLabel() {
      return format(this.date, 'd MMM yyyy')
    },
  },
  watch: {},
  mounted() {},
  methods: {
    getEventColor(event) {
      if (event.name === SITE_EVENT.BATTERY_POWER) {
        return 'bg-blue-500'
      }
      return 'bg-orange-500'
    },

    getEventPosition(seconds, offset) {
      const height = ((seconds * 1.0) / 3600) * 100
      const bottom = ((offset * 1.0) / 3600) * 100
      return {
        height: `${height}%`,
        bottom: `${bottom}%`,
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
