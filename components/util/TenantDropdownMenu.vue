<template>
  <DropdownMenu
    v-model="tenant"
    class="col-span-1"
    :placeholder="currentTenantLabel"
    :options="tenantOptions"
    :flat="true"
    :compact="true"
  />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    tenants: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    tenant: null,
  }),
  computed: {
    ...mapGetters('user', ['allowedTenants']),
    currentTenantLabel() {
      return this.tenantOptions[0].label || 'Select one'
    },
    tenantOptions() {
      return this.tenants
        .filter(tenant => this.allowedTenants.includes(tenant))
        .map((tenant, i) => {
          const label = tenant.charAt(0).toUpperCase() + tenant.slice(1)
          return { id: i + 1, value: tenant, label }
        })
    },
  },
  watch: {
    tenant(val, old) {
      this.$emit('change', val.value)
    },
  },
  mounted() {
    this.tenant = this.tenantOptions[0] || {}
  },
  methods: {},
}
</script>

<style lang="scss" scoped></style>
