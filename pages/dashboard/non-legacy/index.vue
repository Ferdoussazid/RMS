<template>
  <div class="flex flex-col w-full min-h-screen">
    <AppToolbar title="Dashboard" :with-site-id="false">
      <template #action>
        <NLink to="/dashboard/legacy" v-if="canAccessLegacyDashboard"
          class="flex flex-row items-center space-x-2 rounded bg-blue-500 px-4 py-1.5 text-xs font-medium text-white transition duration-300 hover:bg-blue-600">
          <i class="fas fa-layer-group"></i>
          <span>Legacy Dashboard</span>
        </NLink>
        <NLink to="/dashboard"
          class="flex flex-row items-center space-x-2 rounded bg-blue-500 px-4 py-1.5 text-xs font-medium text-white transition duration-300 hover:bg-blue-600">
          <i class="fas fa-chart-line"></i>
          <span>Functional Dashboard</span>
        </NLink>
        <NLink to="/dashboard/non-legacy"
          class="flex flex-row items-center space-x-2 rounded bg-blue-500 px-4 py-1.5 text-xs font-medium text-white transition duration-300 hover:bg-blue-600">
          <i class="fas fa-bell"></i>
          <span>Non Functional Dashboard</span>
        </NLink>
      </template>
    </AppToolbar>

    <!-- 🟦 Keep sidebar or content container if needed -->
    <div class="flex flex-col w-full lg:flex-row">
      <div class="w-full h-[70vh] flex items-center justify-center text-gray-500">
        <!-- 🟨 Placeholder for empty content -->
        <p>This dashboard view is currently empty.</p>
      </div>
    </div>
  </div>
</template>

<script>
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  middleware: ['auth', 'user'],
  computed: {
    canAccessLegacyDashboard() {
      return this.isSuperAdmin || this.isAdmin || this.isFTB
    }
  }
}
</script>
