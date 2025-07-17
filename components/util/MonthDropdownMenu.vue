<template>
  <DropdownMenu v-model="month" class="col-span-1" :placeholder="currentMonthLabel" :options="monthOptions" :flat="true" :compact="true" />
</template>

<script>
import { startOfMonth, sub, format } from 'date-fns'

export default {
  data: () => ({
    month: null,
  }),
  computed: {
    currentMonthLabel() {
      return format(new Date(), 'MMM y')
    },
    monthOptions() {
      const months = []
      let thisMonth = startOfMonth(new Date())
      for (let i = 0; i < 12; i++) {
        months.push({ id: i, label: format(thisMonth, 'MMM y'), value: thisMonth })
        thisMonth = sub(thisMonth, { months: 1 })
      }
      return months
    },
  },
  watch: {
    month(val, old) {
      this.$emit('change', val.value)
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
