<template>
  <div class="flex h-full flex-col justify-between overflow-y-auto">
    <AdminMenu v-if="isAdminUser" />
    <UserMenu v-if="isCompanyUser" />
    <div class="flex shrink-0 flex-row items-stretch space-x-3 px-3" @click="$bus.$emit('drawer', 'close')">
      <NLink to="/profile" class="group flex grow cursor-pointer flex-col items-center space-y-1 rounded-md py-3">
        <span class="text-blue-500"><i class="fas fa-user-alt"></i></span>
        <span class="text-xs font-medium text-gray-600 transition duration-300 group-hover:text-blue-500">Account</span>
      </NLink>
      <div class="group flex grow cursor-pointer flex-col items-center space-y-1 rounded-md py-3" @click="logOut">
        <span class="text-red-500"><i class="fas fa-sign-out-alt"></i></span>
        <span class="text-xs font-medium text-gray-600 transition duration-300 group-hover:text-red-500">Logout</span>
      </div>
    </div>
  </div>
</template>

<script>
import UserTypeChecker from '~/mixins/UserTypeChecker'
export default {
  mixins: [UserTypeChecker],
  methods: {
    logOut() {
      this.$auth.logout()
      this.$store.commit('dashboard/CLEAR_RMS_EVENTS')
      this.$store.commit('dashboard/CLEAR_ACS_EVENTS')
      this.$store.commit('dashboard/CLEAR_COUNTS')
      this.$store.commit('dashboard/CLEAR_LOAD_DASHBOARD')
      this.$store.commit('site/CLEAR_COUNTS')
      this.$store.commit('customer/CLEAR_SITE_LIST')
      this.$store.commit('customer/CLEAR_SELECTED_PAGE')
      this.$store.commit('user/CLEAR_USER_LIST')
      this.$store.commit('dashboard/SET_SELECTED_TENANT', '')
      this.$store.dispatch('oem/clearOemData', {})
      this.$store.commit('ticket/CLEAR_TICKET_LIST')
    },
  },
}
</script>
