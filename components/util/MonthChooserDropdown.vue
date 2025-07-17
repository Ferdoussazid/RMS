<template>
  <div class="relative">
    <div
      v-click-outside="hideDropdown"
      class="flex w-full cursor-pointer flex-row items-center space-x-2 rounded border border-gray-200 bg-white px-5 py-1.5"
      @click="showDropdown = true"
    >
      <span class="text-[0.75rem] font-bold text-gray-600">
        {{ currentMonthName }}
      </span>
      <span class="text-gray-400">
        <i class="fas fa-angle-down"></i>
      </span>
    </div>

    <div
      class="absolute inset-x-0 top-0 z-20 max-h-[50vh] w-full origin-top transform overflow-scroll rounded bg-white shadow-md transition duration-300 ease-in-out"
      :class="{
        'scale-y-0 opacity-0': !showDropdown,
        'scale-y-100 opacity-100': showDropdown,
      }"
    >
      <ul class="w-full list-none divide-y divide-gray-100">
        <MonthDropdownItem v-for="(month, i) in months" :key="i" :month="month" @click="onMonthClick" />
      </ul>
    </div>
  </div>
</template>

<script>
import { sub, format, startOfMonth } from 'date-fns'
import ClickOutside from 'vue-click-outside'

import MonthDropdownItem from '~/components/util/MonthDropdownItem.vue'

export default {
  components: {
    MonthDropdownItem,
  },
  directives: {
    ClickOutside,
  },
  data: () => ({
    months: [],
    showDropdown: false,
    selectedMonth: new Date(),
  }),
  computed: {
    currentMonthName() {
      return format(this.selectedMonth, 'MMM yyyy')
    },
  },
  mounted() {
    this.initMonths()
  },
  methods: {
    initMonths() {
      let thisMonth = startOfMonth(new Date())
      for (let i = 0; i < 12; i++) {
        this.months.push(thisMonth)
        thisMonth = sub(thisMonth, { months: 1 })
      }
    },

    onMonthClick(month) {
      this.hideDropdown()
      this.selectedMonth = month
      this.$emit('select', month)
    },

    hideDropdown() {
      this.showDropdown = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
