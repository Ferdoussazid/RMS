<template>
  <div class="divide-y">
    <SiteListItem
      v-for="(tenant, i) in filteredTenants"
      :key="site.uid + i"
      :serial="serial"
      :site="site"
      :with-event="withEvent"
      :tenant="tenant"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTenantsFromFilters } from '~/assets/js/SiteHelper'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  props: {
    serial: {
      type: Number,
      required: true,
    },
    site: {
      type: Object,
      required: true,
    },
    withEvent: {
      type: String,
      default: () => null,
    },
    filters: {
      type: Array,
      default: () => {
        return []
      },
    },
    dropdownTenant: {
      type: String,
      default: () => 'all',
    },
  },
  computed: {
    ...mapGetters('user', ['allowedTenants']),
    filteredTenants() {
      return getTenantsFromFilters(this.site, this.dropdownTenant, this.filters, this.allowedTenants)
    },
  },
}
</script>

<style lang="scss" scoped></style>
