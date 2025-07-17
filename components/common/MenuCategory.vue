<template>
  <li class="px-6 py-2 text-indigo-500 font-semibold uppercase">
    <span class="text-xs">{{ name }}</span>
  </li>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
</style>