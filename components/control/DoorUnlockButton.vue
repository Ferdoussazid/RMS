<template>
  <div>
    <button
      class="flex h-10 items-center justify-center space-x-2 rounded-md bg-green-500 px-4 text-sm font-medium text-white shadow-lg transition duration-300 hover:bg-green-600"
      @click="onClick"
    >
      <CircularSpinner v-show="loading" size="sm" theme="border-white" />
      <span v-show="!loading"><i class="fas fa-unlock"></i></span>
      <span>Unlock Door</span>
    </button>
    <UnlockFormModal ref="unlock_form" />
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    showForm: false,
  }),
  methods: {
    onClick() {
      this.$refs.unlock_form.show()
    },
  },
}
</script>

<style lang="scss" scoped></style>
