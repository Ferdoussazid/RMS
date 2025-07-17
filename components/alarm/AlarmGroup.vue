<template>
  <div class="flex w-full flex-col items-center gap-y-3" :class="[theme]">
    <span v-if="!masked" class="w-full text-left text-xs font-medium uppercase text-slate-700">{{ name }}</span>
    <div v-if="!masked" class="flex w-full flex-col items-center gap-y-3">
      <AlarmItem v-for="(a, i) in sortedAlarms" :key="i" :alarm="a" />
    </div>
    <div v-if="masked" class="flex w-full flex-col items-center justify-start py-[20vh]">
      <!-- <img src="/icon/unavailable.png" alt="" class="h-auto w-8" /> -->
      <i class="fas fa-ban h-auto w-8 text-center text-sm font-semibold text-slate-500"></i>
      <span class="text-center text-sm font-normal italic text-slate-500"> Not Available </span>
    </div>
  </div>
</template>

<script>
import UserTypeChecker from '~/mixins/UserTypeChecker'
export default {
  mixins: [UserTypeChecker],
  props: {
    name: {
      type: String,
      required: true,
    },
    alarms: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      default: 'rounded-xl md:rounded-t-none bg-white/70 p-6 shadow backdrop-blur-sm backdrop-filter',
    },
    masked: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sortedAlarms() {
      const list = [...this.alarms]
      list.sort((a, b) => {
        const valA = a.isAvailable ? 1 : 0
        const valB = b.isAvailable ? 1 : 0
        return valB - valA
      })
      return list
    },
  },
}
</script>

<style lang="scss" scoped></style>
