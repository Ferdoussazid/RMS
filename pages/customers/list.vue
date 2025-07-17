<template>
  <div class="flex w-full flex-col gap-2">
    <AppToolbar title="Company Details" :with-site-id="false" />
    <div class="flex flex-col items-center gap-4 rounded-md px-4 py-8 md:flex-row md:items-start">
      <CompanyDetailsCard v-for="(c, i) in companies" :key="i" :company="c" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  middleware: ['auth', 'admin'],
  data() {
    return {
      companies: [],
    }
  },
  computed: {
    ...mapGetters('customer', ['companies']),
  },
  mounted() {
    this.getCompanies()
  },
  methods: {
    async getCompanies() {
      try {
        await this.$store.dispatch('customer/getCompanyList')
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
