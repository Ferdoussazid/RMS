<template>
  <div class="relative flex-shrink-0">
    <div
      v-click-outside="hideMenu"
      class="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-white transition duration-300 hover:bg-gray-200"
      :class="{ 'bg-gray-200': isOpen }"
      @click="isOpen = !isOpen"
    >
      <span class="text-center text-xs font-light text-gray-400">
        <i class="fas fa-ellipsis-v"></i>
      </span>
    </div>

    <ul
      class="absolute right-0 top-full mt-1 w-32 origin-top transform list-none overflow-hidden rounded border border-slate-100 bg-white shadow-lg transition duration-200"
      :class="[isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0']"
    >
      <li
        class="flex cursor-pointer flex-row items-center space-x-1 bg-transparent px-3 py-1.5 text-gray-600 transition duration-300 hover:bg-gray-100"
        @click="onClick('export')"
      >
        <TableExportIcon class="w-4" />
        <span class="select-none text-xs font-normal"> Export </span>
      </li>
    </ul>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import { TableExportIcon } from 'vue-tabler-icons'

export default {
  components: {
    TableExportIcon,
  },
  directives: {
    ClickOutside,
  },
  data: () => ({
    isOpen: false,
  }),
  methods: {
    onClick(event) {
      this.isOpen = false
      this.$emit(event)
    },

    hideMenu() {
      this.isOpen = false
    },
  },
}
</script>

<style scoped></style>
