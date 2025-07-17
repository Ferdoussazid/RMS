<template>
  <div class="flex grow flex-row items-center justify-end md:mr-4">
    <span v-if="!loading" class="rounded px-3 py-1 text-xs font-bold text-white" :class="[availabilityTheme]"
      >{{ percentage }}%</span
    >
    <LoadingSpinner v-else class="scale-50" />
    <span class="ml-2 text-xs font-normal leading-tight text-gray-600">Site Availability in </span>
    <!-- <div class="w-[120px]">
      <TenantDropdownMenu :tenants="site.tenants" @change="getAvailabilityByTenant" />
    </div> -->
    <!-- <span class="text-xs font-normal leading-tight text-gray-600">in</span> -->
    <div class="w-[120px]">
      <MonthDropdownMenu @change="onMonthChanged" />
    </div>
  </div>
</template>

<script>
import { add } from 'date-fns'
import { mapGetters } from 'vuex'

export default {
  props: {
    site: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    loading: true,
    // tenant: '',
    percentage: '',
  }),
  computed: {
    ...mapGetters('site', ['availability', 'focusedTenant']),
    availabilityTheme() {
      switch (true) {
        case this.percentage > 98:
          return 'bg-green-500'
        case this.percentage > 95:
          return 'bg-blue-500'
        case this.percentage > 85:
          return 'bg-purple-500'
        case this.percentage > 80:
          return 'bg-orange-500'
        default:
          return 'bg-red-500'
      }
    },
  },
  watch: {
    focusedTenant(val, old) {
      this.percentage = this.getAvailabilityByTenant(val)
    },
  },
  mounted() {
    this.onAvailabilityMonthChanged(new Date())
  },
  methods: {
    onMonthChanged(date) {
      /**
       * if start of month is passed, somehow the previous month's data is fetched :X
       * To avoid this annoying JS TimeZone problem just add some days. make it any day inside the month.
       * Backend service will convert this date to start of month
       */
      date = add(date, { days: 2 })
      this.onAvailabilityMonthChanged(date)
    },
    async onAvailabilityMonthChanged(date) {
      this.loading = true
      try {
        await this.$store.dispatch('site/getAvailability', {
          siteUid: this.site.uid,
          date,
        })
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.percentage = this.getAvailabilityByTenant(this.focusedTenant)
      this.loading = false
    },
    getAvailabilityByTenant(tenant) {
      const percentageItem = this._.get(
        this.availability.find(a => a.tenant === tenant),
        'percentage',
        0
      )
      return percentageItem.toFixed(1)
    },
  },
}
</script>

<style lang="scss" scoped></style>
