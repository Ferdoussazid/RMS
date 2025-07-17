<template>
  <div class="col-span-12 flex flex-col rounded border border-gray-200 p-4 sm:col-span-6 md:col-span-4 lg:col-span-3">
    <div class="flex flex-row items-center justify-start space-x-4">
      <div :class="['flex h-10 w-10 items-center justify-center rounded-full p-3', iconBg]">
        <img :src="iconPath" alt="" />
      </div>
      <div class="flex flex-col">
        <span class="text-xs font-semibold text-gray-800">{{ device.site.name }}</span>
        <span class="text-xs font-medium text-gray-600"> Device ID - {{ device.com_id }} </span>
      </div>
    </div>
    <div class="mt-6 flex flex-row items-stretch divide-x divide-gray-200 text-xs text-gray-600">
      <div class="flex flex-1 flex-col text-center">
        <span class="font-semibold text-gray-700">{{ device.rpm }}</span> <span class="italic">Pulse/min</span>
      </div>
      <div class="flex flex-1 flex-col text-center">
        <span class="font-semibold text-gray-700">{{ device.requests }}</span> <span class="italic">in 24 Hours</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    device: {
      type: Object,
      required: true,
    },
  },
  computed: {
    iconBg() {
      switch (this.device.category) {
        case 'normal':
          return 'bg-green-50'
        case 'abnormal':
          return 'bg-orange-50'
        default:
          return 'bg-red-50'
      }
    },
    iconPath() {
      switch (this.device.category) {
        case 'normal':
          return '/icon/full-signal.png'
        case 'abnormal':
          return '/icon/low-signal.png'

        default:
          return '/icon/no-wifi.png'
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
