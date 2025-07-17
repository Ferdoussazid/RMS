<template>
  <div class="flex grow flex-row items-center justify-end md:mr-4">
    <span class="rounded bg-indigo-500 px-3 py-1 text-xs font-bold text-white">{{ kwh.toFixed(1) }} KWH</span>
    <span class="ml-2 text-xs font-normal leading-tight text-gray-600">consumption</span>
    <div class="w-[120px]">
      <MonthDropdownMenu @change="onMonthChanged" />
    </div>
  </div>
</template>

<script>
import { add } from 'date-fns'

export default {
  props: {
    consumption: {
      type: Number,
      required: true,
    },
  },
  computed: {
    kwh() {
      return this.consumption / (1000 * 3600)
    },
  },
  methods: {
    onMonthChanged(date) {
      /**
       * if start of month is passed, somehow the previous month's data is fetched :X
       * To avoid this annoying JS TimeZone problem just add some days. make it any day inside the month.
       * Backend service will convert this date to start of month
       */
      date = add(date, { days: 2 })
      this.$emit('change', date)
    },
  },
}
</script>

<style lang="scss" scoped></style>
