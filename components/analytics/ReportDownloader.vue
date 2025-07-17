<template>
  <div class="flex w-full flex-col items-center justify-center space-y-6 rounded-md border border-gray-200 bg-gray-100 py-16">
    <img src="/icon/excel.png" alt="" class="h-auto w-32" />
    <button
      class="flex min-w-[160px] flex-row items-center justify-center rounded bg-green-500 px-6 py-2.5 text-xs font-normal text-white shadow-md transition duration-300 hover:bg-green-600"
      @click="onButtonClick"
    >
      <span v-if="!loading">Export to Excel</span>
      <CircularSpinner v-if="loading" theme="border-white" size="sm" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onButtonClick() {
      if (!this.loading) {
        this.$emit('export')
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
