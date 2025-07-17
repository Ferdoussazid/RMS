<template>
  <div class="relative h-full w-full" :class="[flat ? '' : 'shadow-sm']">
    <div
      v-click-outside="hideDropdown"
      class="flex h-full w-full cursor-pointer flex-row items-center space-x-2 rounded border transition duration-300"
      :class="[
        showDropdown && !flat ? 'bg-gray-100' : 'bg-transparent',
        flat ? 'border-transparent' : 'border-gray-200 hover:bg-gray-100',
        compact ? 'justify-start px-2 py-1' : 'justify-between px-4 py-1.5',
      ]"
      @click="handleDropdownPosition"
    >
      <span class="select-none text-[0.75rem] font-semibold text-gray-600">
        {{ selectedItemLabel }}
      </span>
      <span class="text-gray-500">
        <i class="fas fa-angle-down"></i>
      </span>
    </div>

    <div
      class="absolute z-20 mt-2 w-full origin-top transform overflow-auto rounded border-t border-solid border-gray-100 bg-white shadow-lg transition duration-300 ease-in-out"
      :class="[showDropdown ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0', dropdownMenuPosition, listHeight]"
    >
      <ul class="w-full list-none divide-y divide-gray-100">
        <DropdownItem
          v-for="(item, i) in options"
          :key="i"
          :item="item"
          :selected="isSelected(item)"
          @click="onItemClick"
        />
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
    compact: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    reset: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Select One',
    },
    listHeight: {
      type: String,
      default: 'max-h-[50vh]',
    },
  },
  data: () => ({
    showDropdown: false,
    selectedItem: null,
    percentageY: 0,
    shouldCalculatePosition: true,
  }),
  computed: {
    selectedItemLabel() {
      if (!this.selectedItem) {
        return this.placeholder
      }
      return this.selectedItem.label
    },
    dropdownMenuPosition() {
      if (this.percentageY < 80) {
        return 'ease-in-out inset-x-0 top-full'
      } else {
        return 'ease-in-out-reverse bottom-8'
      }
    },
  },
  watch: {
    reset(val, old) {
      if (val) {
        this.selectedItem = null
      }
    },
  },
  mounted() {},
  methods: {
    onItemClick(item) {
      this.hideDropdown()
      this.selectedItem = item
      this.$emit('input', item)
    },

    hideDropdown() {
      this.showDropdown = false
    },

    isSelected(item) {
      if (!this.selectedItem) return false
      return this.selectedItem.id === item.id
    },
    handleDropdownPosition(event) {
      this.showDropdown = !this.showDropdown
      const viewportHeight = window.innerHeight
      const clickVerticalPosition = event.clientY
      if (this.shouldCalculatePosition) this.percentageY = (clickVerticalPosition / viewportHeight) * 100
    },
  },
}
</script>

<style lang="css" scoped></style>
