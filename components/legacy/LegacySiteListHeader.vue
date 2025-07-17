<template>
  <div
    class="hidden bg-slate-200 pr-4 text-xs font-semibold leading-tight text-gray-600 md:grid md:grid-cols-12 md:items-center"
    v-if="!isLoading()"
  >
    <div class="col-span-2 place-items-center px-4 py-2 text-left">
      <span>Site Name</span>
    </div>
    <!-- <div class="col-span-1 place-items-center px-4 py-2 text-left">
      <span>Tenant</span>
    </div> -->
    <div class="col-span-1 place-items-center px-4 py-2 text-left">
      <span>Towerco ID</span>
    </div>
    <!-- <div class="col-span-1 place-items-center px-4 py-2 text-left">
      <span>MNO Site ID</span>
    </div> -->
    <div class="col-span-1 place-items-center px-4 py-2 text-left">
      <span>Cluster</span>
    </div>
    <div class="col-span-1 place-items-center px-4 py-2 text-left">
      <span>Zone</span>
    </div>
    <div class="col-span-6 grid grid-cols-12 place-items-center md:flex md:w-full">
      <div v-for="header in getHeaders()" :key="header.name" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>{{ header.name }}</span>
      </div>
      <div class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>Attended</span>
      </div>
    </div>
    <div class="col-span-1 px-1 py-2 text-center md:flex-1">
      <span>Action</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { LEGACY_COLUMNS, LEGACY_PAGES } from '~/assets/js/Constant'

export default {
  mixins: [UserTypeChecker],
  computed: {
    ...mapGetters('user', ['companyName']),
    ...mapGetters('dashboard-legacy', ['selectedTab', 'dcEnergyMeter', 'climate', 'rectifier', 'battery']),
  },
  methods: {
    isLoading() {
      if (!this.selectedTab) return true
      this.selectedTab === LEGACY_PAGES.DC_ENERGY_METER
        ? this.dcEnergyMeter === null
        : this.selectedTab === LEGACY_PAGES.CLIMATE
        ? this.climate === null
        : this.rectifier === null
    },
    getHeaders() {
      if (!this.selectedTab) return []
      return LEGACY_COLUMNS[this.selectedTab]
    },
  },
}
</script>

<style lang="scss" scoped></style>
