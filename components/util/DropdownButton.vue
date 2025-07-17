<template>
  <div v-click-outside="hideDropdown" class="relative">
    <!-- v-click-outside="hideDropdown" -->
    <div
      class="flex h-full w-full cursor-pointer flex-row items-center rounded border py-1 shadow transition duration-200"
      @click="onDropdownButtonClick"
    >
      <div class="pl-2 pr-1.5">
        <span class="select-none text-[0.7rem] font-semibold text-gray-600">
          {{ label }}
        </span>
      </div>
      <div class="h-6 w-px bg-slate-300"></div>
      <div class="pl-1.5 pr-2">
        <span class="text-gray-500">
          <i class="fas fa-angle-down"></i>
        </span>
      </div>
    </div>

    <div
      class="absolute right-0 z-50 max-h-[50vh] w-32 origin-top transform overflow-auto rounded border border-gray-200 bg-white shadow-lg transition duration-200"
      :class="[showDropdown ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0', dropdownPosition]"
    >
      <ul class="w-auto list-none divide-y divide-gray-300">
        <DropdownItem v-for="(item, i) in options" :key="i" :item="item" compact @click="onItemClick" />
      </ul>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  directives: {
    ClickOutside,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: 'Select One',
    },
    dropdownPosition: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    showDropdown: false,
    selectedItem: null,
  }),
  computed: {},
  mounted() {},
  methods: {
    onItemClick(item) {
      this.hideDropdown()
      this.selectedItem = item
      this.$emit('input', item)
      this.$emit('item-click', item)
    },

    onDropdownButtonClick() {
      this.showDropdown = !this.showDropdown
      if (this.showDropdown) {
        this.$emit('show')
      } else {
        this.$emit('hide')
      }
    },

    hideDropdown() {
      this.showDropdown = false
      this.$emit('hide')
    },
  },
}
</script>

<style lang="css" scoped></style>
