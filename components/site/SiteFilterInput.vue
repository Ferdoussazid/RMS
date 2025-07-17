<template>
  <li class="relative w-full bg-white">
    <input
      type="text"
      class="w-full border-0 py-3 pl-10 pr-4 text-sm font-normal text-gray-700 placeholder:text-xs placeholder:font-light placeholder:text-gray-400"
      placeholder="Search Here"
      @input="e => $emit('input', e.target.value)"
      @keyup.esc="$emit('cancel')"
    />
    <span class="absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-400">
      <SearchIcon class="w-4 text-gray-500" />
    </span>
  </li>
</template>

<script>
import { SearchIcon } from 'vue-tabler-icons'

export default {
  components: {
    SearchIcon,
  },
}
</script>

<style lang="scss" scoped></style>
