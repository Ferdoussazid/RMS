<template>
  <div class="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col w-full h-full bg-white rounded pb-4 shadow-md">
    <div class="w-full flex justify-between items-center px-4 py-3">
      <h3 class="text-gray-600 font-semibold text-sm">Mains Availability</h3>
      <ContextMenu v-on="$listeners" />
    </div>
    <div class="flex-1 flex flex-col justify-center px-2 space-y-4">
      <MainsCount :count="mains.on" state="good" :filter="filters[0]" />
      <MainsCount :count="mains.off" state="bad" :filter="filters[1]" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ContextMenu from '~/components/util/ContextMenu'
import MainsCount from '~/components/mains/MainsCount.vue'
import { SITE_ALARM, SITE_FILTER_TYPE } from '~/assets/js/Constant'

export default {
  components: {
    ContextMenu,
    MainsCount,
  },
  data: () => ({
    filters: [
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.AC_LINE_FAIL, expected: 1 },
      { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.AC_LINE_FAIL, expected: 0 },
    ],
  }),
  computed: {
    ...mapGetters('dashboard', ['mains']),
  },
}
</script>

<style lang="scss" scoped></style>
