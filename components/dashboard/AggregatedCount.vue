<template>
  <NLink :class="[
    masked ? 'cursor-not-allowed bg-slate-300' : backgroundColor,
    shouldPulse && count !== 0 ? 'gps-ring' : '',
    disableLink ? 'cursor-not-allowed' : '',
  ]" class="group relative space-x-2 rounded shadow-md transition-all duration-300"
    :event="masked || disableLink ? '' : 'click'" :to="targetUrl">
    <div v-if="masked" class="flex h-full w-full items-center justify-center">
      <i class="fas fa-ban text-sm font-semibold text-gray-100"></i>
    </div>
    <div v-else class="flex items-center"
      :class="[shouldPulse && count !== 0 ? 'pulsing-container absolute right-0 bottom-0 rounded bg-slate-800' : '']">
      <div class="relative flex grow items-center pl-2">
        <span class="leading-none text-white group-hover:text-yellow-300"
          :class="[shouldPulse && count !== 0 ? 'text-size-shuffle' : 'text-xs font-semibold']">
          {{ label }}
        </span>
        <!-- <i
          v-if="shouldPulse && count !== 0"
          class="fas fa-bell absolute -left-1 -top-6 z-10 text-2xl text-[#fff646]"
          :class="shouldPulse && count !== 0 ? 'ringing-bell' : ''"
        ></i> -->
      </div>
      <div class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-r" :class="[theme]">
        <CircularSpinner v-if="count === '_'" size="sm" theme="border-white" />
        <span v-else class="absolute flex items-center justify-center text-center leading-tight text-white"
          :class="[shouldPulse && count !== 0 ? 'text-size-shuffle' : 'text-sm font-bold']">
          {{ count }}
        </span>
      </div>
    </div>
  </NLink>
</template>

<script>
import UserTypeChecker from '~/mixins/UserTypeChecker'
import utils from '~/mixins/utils'

export default {
  mixins: [utils, UserTypeChecker],
  props: {
    theme: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    count: {
      type: [Number, String],
      required: true,
    },
    filter: {
      type: Object,
      default: () => ({}),
    },
    masked: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: 'bg-slate-800',
    },
    shouldPulse: {
      type: Boolean,
      default: false,
    },
    disableLink: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    targetUrl() {
      return this.siteListUrl(this.filter, '/site/list')
    },
  },
}
</script>

<style scoped></style>
