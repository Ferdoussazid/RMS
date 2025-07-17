<template>
  <div
    class="hidden bg-slate-200 pr-4 text-xs font-semibold leading-tight text-gray-600 md:grid md:grid-cols-12 md:items-center"
  >
    <div class="col-span-2 place-items-center px-4 py-2 text-left"><span>Site Name</span></div>
    <div class="col-span-1 place-items-center px-4 py-2 text-left"><span>Tenant</span></div>
    <div class="col-span-1 place-items-center px-4 py-2 text-left"><span>MNO Site ID</span></div>
    <div :class="[isReadOnlyUser ? 'grid-cols-8' : 'grid-cols-10']" class="col-span-6 grid place-items-center">
      <div class="col-span-2 px-1 py-2 text-center">
        <span>{{ acFailHeader }}</span>
      </div>
      <div class="col-span-2 px-1 py-2 text-center">
        <span>{{ dcLowHeader }}</span>
      </div>
      <div class="col-span-2 px-1 py-2 text-center"><span>Site Down</span></div>
      <div class="col-span-2 px-1 py-2 text-center"><span>Battery Backup</span></div>
      <div v-if="!isReadOnlyUser" class="col-span-2 px-1 py-2 text-center"><span>DG/PG ON</span></div>
    </div>
    <div class="col-span-2 grid grid-cols-12 place-items-center">
      <div class="col-span-6 px-1 py-2 text-center"><span>Site Down History</span></div>
      <div class="col-span-6 px-1 py-2 text-center"><span>Action</span></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COMPANY } from '~/assets/js/Constant'
import UserTypeChecker from '~/mixins/UserTypeChecker'
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
  },
}
</script>

<style lang="scss" scoped></style>
