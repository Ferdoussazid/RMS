<template>
  <div class="flex flex-row items-stretch shadow rounded-md">
    <button
      v-for="(o, i) in options"
      :key="i"
      class="
        first:border-l
        last:border-r
        first:rounded-l-md
        last:rounded-r-md
        border-b border-t border-slate-200
        px-4
        py-3
        text-xs
        font-semibold
      "
      :class="[selectedIndex === i ? 'bg-indigo-500 text-white' : 'bg-white text-slate-700']"
      @click="onOptionClick(i)"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    selectedIndex: 0,
  }),
  mounted() {
    this.$emit('input', this.options[0])
  },
  methods: {
    onOptionClick(i) {
      this.selectedIndex = i
      this.$emit('input', this.options[i])
    },
  },
}
</script>

<style lang="scss" scoped>
</style>