<template>
  <div class="flex w-full flex-col items-center gap-y-2 p-4">
    <span v-if="alarmGroup.label" class="select-none text-xs font-medium text-gray-700">{{ alarmGroup.label }}</span>
    <OEMAlarmItem v-for="(a, i) in alarms" :key="i" :alarm="a" />
  </div>
</template>

<script>
export default {
  props: {
    alarmGroup: {
      type: Object,
      required: true,
    },
  },
  computed: {
    alarms() {
      return this.alarmGroup.items || []
    },
  },
}
</script>

<style lang="scss" scoped></style>
