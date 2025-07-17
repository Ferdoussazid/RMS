<template>
  <div
    class="grid items-stretch justify-center grid-cols-12 sm:py-4 py-2 transition duration-300 bg-white border-b border-slate-200 md:border-0 md:py-0"
    :class="[theme]">

    <div
      class="flex flex-col items-center justify-start h-full col-span-4 px-4 sm:py-3 py-1 border-0 border-gray-200 md:flex-1 md:flex-row md:items-start md:border-l md:col-span-2">
      <span class="text-xs font-semibold text-blue-900 capitalize">{{ data.name }}</span>
      <span class="block text-xs font-normal text-center text-gray-500 md:hidden">Status</span>
    </div>
    <div
      class="flex flex-col items-center justify-center h-full col-span-4 px-1 sm:py-3 py-1 border-0 border-gray-200 md:flex-1 md:flex-row md:items-start md:border-l md:col-span-2">
      <span class="text-xs font-semibold text-blue-900 capitalize">{{ data.total }}</span>
      <span class="block text-xs font-normal text-center text-gray-500 md:hidden">Total</span>
    </div>
    <div v-if="!isSComm"
      class="flex flex-col items-center justify-center h-full col-span-4 px-1 sm:py-3 py-1 border-0 border-gray-200 md:flex-1 md:flex-row md:items-start md:border-l md:col-span-2">
      <span class="text-xs font-semibold text-blue-900 capitalize">{{ data.banglalink }}</span>
      <span class="block text-xs font-normal text-center text-gray-500 md:hidden">Banglalink</span>
    </div>
    <div v-if="!isSComm"
      class="flex flex-col items-center justify-center h-full col-span-4 px-1 sm:py-3 py-1 border-0 border-gray-200 md:flex-1 md:flex-row md:items-start md:border-l md:col-span-2">
      <span class="text-xs font-semibold text-blue-900 capitalize">{{ data.robi }}</span>
      <span class="block text-xs font-normal text-center text-gray-500 md:hidden">Robi</span>
    </div>
    <div v-if="!isSComm"
      class="flex flex-col items-center justify-center h-full col-span-4 px-1 sm:py-3 py-1 border-0 border-gray-200 md:flex-1 md:flex-row md:items-start md:border-l md:col-span-2">
      <span class="text-xs font-semibold text-blue-900 capitalize">{{ data.grameenphone }}</span>
      <span class="block text-xs font-normal text-center text-gray-500 md:hidden">Grameenphone</span>
    </div>
    <div v-if="!isSComm"
      class="flex flex-col items-center justify-center h-full col-span-4 px-1 sm:py-3 py-1 border-0 border-gray-200 md:flex-1 md:flex-row md:items-start md:border-l md:col-span-2">
      <span class="text-xs font-semibold text-blue-900 capitalize">{{ data.teletalk }}</span>
      <span class="block text-xs font-normal text-center text-gray-500 md:hidden">Teletalk</span>
    </div>
    <div v-if="isSComm"
      class="flex flex-col items-center justify-center h-full col-span-4 px-1 sm:py-3 py-1 border-0 border-gray-200 md:flex-1 md:flex-row md:items-start md:border-l md:col-span-4">
      <span class="text-xs font-semibold text-blue-900 capitalize">{{ data.scom_rect_1 }}</span>
      <span class="block text-xs font-normal text-center text-gray-500 md:hidden">SComm Rect 1</span>
    </div>
    <div v-if="isSComm"
      class="flex flex-col items-center justify-center h-full col-span-4 px-1 sm:py-3 py-1 border-0 border-gray-200 md:flex-1 md:flex-row md:items-start md:border-l md:col-span-4">
      <span class="text-xs font-semibold text-blue-900 capitalize">{{ data.scom_rect_2 }}</span>
      <span class="block text-xs font-normal text-center text-gray-500 md:hidden">SComm Rect 2</span>
    </div>


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COMPANY } from '~/assets/js/Constant';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    serial: {
      type: Number,
      required: true,
    },

  },
  computed: {
    ...mapGetters('user', ['companyName']),
    theme() {
      return this.serial % 2 === 0 ? 'md:bg-gray-100' : ''
    },
    isSComm() {
      return this.companyName === COMPANY.SUMMIT_COM
    },
  }
}
</script>

<style lang="scss" scoped></style>
