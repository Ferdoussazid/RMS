<template>
  <div class="relative h-full w-full shadow-sm">
    <div
      class="flex h-full w-full cursor-pointer flex-row items-center justify-between space-x-2 rounded border border-gray-200 px-4 py-1.5 transition duration-300 hover:bg-gray-100"
      :class="[showDropdown ? 'bg-gray-100' : 'bg-white']"
      @click="openDropdown"
    >
      <span class="select-none text-[0.75rem] font-semibold text-gray-600">
        {{ selectedDateLabel }}
      </span>
      <span class="text-gray-400">
        <i class="fas fa-angle-down"></i>
      </span>
    </div>

    <div
      v-click-outside="hideDropdown"
      class="absolute right-0 top-full z-20 mt-2 h-auto w-auto origin-top transform overflow-scroll rounded border-t border-solid border-gray-100 bg-white shadow-lg transition duration-300 ease-in-out"
      :class="{
        'scale-y-0 opacity-0': !showDropdown,
        'scale-y-100 opacity-100': showDropdown,
      }"
    >
      <DatePicker v-model="date" />
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import { format } from 'date-fns'

export default {
  directives: {
    ClickOutside,
  },
  props: {
    placeholder: {
      type: String,
      default: 'Select One',
    },
  },
  data: () => ({
    showDropdown: false,
    selectedItem: null,
    date: null,

    ignoreNextClickOutside: false,
  }),
  computed: {
    selectedDateLabel() {
      if (!this.date) {
        return this.placeholder
      }
      return format(this.date, 'd MMM yyyy')
    },
  },
  watch: {
    date(val, old) {
      this.$emit('input', val)
    },
  },
  mounted() {},
  methods: {
    openDropdown() {
      this.showDropdown = true
      this.ignoreNextClickOutside = true
    },

    hideDropdown() {
      if (this.ignoreNextClickOutside) {
        this.ignoreNextClickOutside = false
        return
      }

      if (this.showDropdown) {
        this.showDropdown = false
      }
    },
  },
}
</script>

<style lang="css" scoped></style>
