<template>
  <div class="flex flex-col gap-2">
    <AppToolbar title="Device Vendors" :with-site-id="false" />
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-col items-center gap-2 rounded bg-white p-2 md:flex-row md:justify-between">
        <div class="grid grid-cols-12 gap-2">
          <DropdownMenu
            v-model="company"
            :options="companiesWithLabel"
            placeholder="Select a Company"
            class="col-span-12 min-w-[200px]"
          />
        </div>
        <NLink to="/device-vendor/create" class="rounded bg-teal-600 px-6 py-2 text-xs font-semibold text-white shadow">
          <i class="fas fa-plus"></i>
          New Device Vendor
        </NLink>
      </div>

      <div class="flex w-full rounded">
        <div class="flex w-full flex-col rounded border bg-white shadow-md">
          <div
            v-if="filteredDeviceVendors.length === 0 && !fetchingDeviceVendors"
            class="m-auto flex h-[70vh] flex-col items-center justify-center space-y-6"
          >
            <img src="/icon/empty.png" alt="" class="h-auto w-16" />
            <span class="text-sm font-light text-gray-500">No Device Vendors Found</span>
          </div>
          <div v-if="fetchingDeviceVendors" class="flex h-[71.8vh] items-center justify-center bg-white text-center">
            <CircularSpinner size="lg" />
          </div>
          <DeviceVendorListTableHeader v-if="!fetchingDeviceVendors && filteredDeviceVendors.length !== 0" />
          <div
            v-if="!fetchingDeviceVendors && filteredDeviceVendors.length !== 0"
            class="h-[67vh] overflow-auto bg-white"
          >
            <DeviceVendorListTableItem
              v-for="(vendor, i) in filteredDeviceVendors"
              :key="vendor.id"
              :serial="i + 1"
              :name="vendor.name"
              :phone="vendor.phone"
              :address="vendor.address"
              :uid="vendor.uid"
              :class="[i % 2 === 0 ? 'bg-white' : 'bg-gray-100']"
            />
            <div class="w-full">
              <div class="h-[50vh] w-full bg-white"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'admin'],
  data: () => ({
    company: '',
  }),

  computed: {
    ...mapGetters('customer', { configurableSites: 'sites' }),
    ...mapGetters('site', { dropdownSites: 'sites' }),
    ...mapGetters('user', ['tokenExpired']),
    ...mapGetters('device-vendor', ['filteredDeviceVendors', 'fetchingDeviceVendors', 'selectedCompany']),
    ...mapGetters('customer', ['companies']),

    companiesWithLabel() {
      return [
        { id: '', label: 'All' },
        ...this.companies.map(c => {
          return { ...c, label: c.name }
        }),
      ]
    },
  },

  watch: {
    company(val) {
      console.log(val)
      this.$store.dispatch('device-vendor/setSelectedCompany', val.id)
    },
  },

  mounted() {
    this.company = this.selectedCompany
    this.$store.dispatch('customer/getCompanyList')
    this.$store.dispatch('device-vendor/fetchDeviceVendors')
  },

  methods: {},
}
</script>

<style lang="scss" scoped></style>
