<template>
  <div class="flex flex-col w-full h-full pb-4 bg-white rounded shadow-md">
    <div v-if="!masked" class="flex items-center justify-between w-full px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">Temperature Status</h3>
      <ContextMenu v-on="$listeners" />
    </div>
    <div v-if="!masked" class="flex flex-col justify-around flex-1 px-4 space-y-2 md:flex-row md:space-y-0">
      <TemperatureCount :count="normalTempCount" state="good" />
      <TemperatureCount :count="highTempCount" state="bad" />
    </div>
    <div v-if="masked" class="flex h-full w-full flex-col items-center justify-start py-[8vh]">
      <!-- <img src="/icon/unavailable.png" alt="" class="w-8 h-auto" /> -->
      <i class="w-8 h-auto text-sm font-semibold text-center fas fa-ban text-slate-500"></i>
      <span class="text-sm italic font-normal text-center text-slate-500"> Not Available </span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { SITE_ALARM } from '~/assets/js/Constant'

  import TemperatureCount from '~/components/temperature/TemperatureCount.vue'
  import ContextMenu from '~/components/util/ContextMenu'

  export default {
    components: {
      TemperatureCount,
      ContextMenu,
    },
    props: {
      masked: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ...mapGetters('dashboard', ['frequency']),
      ...mapGetters('site', ['siteCount']),
      highTempCount() {
        return this.frequency[SITE_ALARM.HIGH_TEMPERATURE] || 0
      },
      normalTempCount() {
        return this.siteCount.total - this.highTempCount
      },
    },
  }
</script>

<style lang="scss" scoped></style>
