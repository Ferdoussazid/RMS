<template>
  <div
    class="hidden bg-slate-200 pr-4 text-xs font-semibold leading-tight text-gray-600 md:grid md:grid-cols-12 md:items-center"
  >
    <div class="col-span-2 place-items-center px-4 py-2 text-left">
      <span class="my-auto">Site Name</span>
    </div>

    <div class="col-span-1 place-items-center px-4 py-2 text-left">
      <span class="my-auto">Tenant</span>
    </div>
    <div class="col-span-1 place-items-center px-4 py-2 text-left">
      <span>MNO Site ID</span>
    </div>
    <div class="col-span-1 place-items-center px-4 py-2 text-left">
      <span>Device Vendor</span>
    </div>

    <div class="col-span-7 grid grid-cols-12 place-items-center md:flex md:w-full">
      <div v-if="!isReadOnlyUser" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>Device Status</span>
      </div>
      <div class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>{{ acFailHeader }}</span>
      </div>
      <div class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>{{ dcLowHeader }}</span>
      </div>
      <div v-if="!isReadOnlyUser" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>Rectifier Fail</span>
      </div>
      <div class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>Site Down</span>
      </div>
      <div v-if="!isReadOnlyUser" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>DG/PG ON</span>
      </div>
      <div v-if="!isReadOnlyUser && !isRmsUser" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>Vibration</span>
      </div>
      <div v-if="!isReadOnlyUser && !isRmsUser" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>Motion</span>
      </div>
      <div v-if="!isReadOnlyUser && !isRmsUser" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>Door Status</span>
      </div>
      <div v-if="!isReadOnlyUser && !isRmsUser" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>Lock Status</span>
      </div>
      <div v-if="!isReadOnlyUser && !isRmsUser" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>Security Breach</span>
      </div>
      <div v-if="isFTB && !isReadOnlyUser" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>DC Voltage</span>
      </div>
      <div v-if="isFTB && !isReadOnlyUser" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>NCL</span>
      </div>
      <div v-if="isFTB && !isReadOnlyUser" class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>CL</span>
      </div>
      <div class="col-span-6 px-1 py-2 text-center md:flex-1">
        <span>Action</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { COMPANY } from '~/assets/js/Constant'

export default {
  mixins: [UserTypeChecker],
  computed: {
    ...mapGetters('user', ['companyName']),
    acFailHeader() {
      if ([COMPANY.FRONTIER_TOWERS_BD, COMPANY.SUMMIT_TOWERS_LTD].includes(this.companyName)) {
        return 'Grid Fail'
      }
      return 'AC Fail'
    },
    dcLowHeader() {
      if (this.companyName === COMPANY.SUMMIT_TOWERS_LTD) {
        return 'Battery Low'
      }
      return 'DC Low'
    },
    isFTB() {
      return this.companyName === COMPANY.FRONTIER_TOWERS_BD
    },
  },
}
</script>

<style lang="scss" scoped></style>
