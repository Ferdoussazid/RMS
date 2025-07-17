<template>
  <div class="flex h-full w-full flex-col rounded bg-white pb-4 shadow-md">
    <div v-if="!masked" class="flex w-full items-center justify-between px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">DG Status</h3>
      <ContextMenu v-on="$listeners" />
    </div>
    <div v-if="!masked" class="flex flex-1 flex-col items-center justify-center space-y-4 px-4">
      <DgCount :count="dgOnCount" :filter="filter" />
    </div>
    <div v-if="masked" class="flex h-full w-full flex-col items-center justify-start py-[8vh]">
      <!-- <img src="/icon/unavailable.png" alt="" class="h-auto w-8" /> -->
      <i class="fas fa-ban h-auto w-8 text-center text-sm font-semibold text-slate-500"></i>
      <span class="text-center text-sm font-normal italic text-slate-500"> Not Available </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SITE_ALARM, SITE_FILTER_TYPE } from '~/assets/js/Constant'

export default {
  props: {
    masked: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    filter: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.DG_ON, expected: 0 },
  }),
  computed: {
    ...mapGetters('dashboard', ['frequency']),
    dgOnCount() {
      return this.frequency[SITE_ALARM.DG_ON] || 0
    },
  },
}
</script>

<style lang="scss" scoped></style>
