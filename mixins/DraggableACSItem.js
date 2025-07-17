export default {
  data: () => ({
    loading: false,
  }),
  methods: {
    async onDropSubmit() {
      this.loading = true
      try {
        await this.$store.dispatch('acs/attachGroups')
        this.$toast.success('Cards will be added in a moment')
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.loading = false
    },
  },
}
