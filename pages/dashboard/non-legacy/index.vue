<template>
  <div class="flex flex-col w-full min-h-screen">
    <AppToolbar title="Dashboard" :with-site-id="false">
      <template #action>

         <!-- <vc-date-picker  color="indigo" is-range class="mt-1 border-0"> </vc-date-picker> -->
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

    <!-- 🟦 Dashboard Content -->
    <div class="flex flex-col w-full lg:flex-row">
      <div class="w-full h-[70vh] flex flex-col items-center justify-center space-y-6">
        <!-- Circular Counter UI -->
        <div class="w-40 h-40 rounded-full bg-white shadow-md flex items-center justify-center text-4xl font-bold text-gray-700">
          {{ count }}
        </div>
        <div class="space-x-4">
          <button @click="increment" class="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 text-lg">+</button>
          <button @click="decrement" class="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 text-lg">-</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  middleware: ['auth', 'user'],
  data() {
    return {
      count: 0
    }
  },
  computed: {
    canAccessLegacyDashboard() {
      return this.isSuperAdmin || this.isAdmin || this.isFTB
    }
  },
  methods: {
    increment() {
      this.count++
    },
    decrement() {
      if (this.count > 0) this.count--
    }
  }
}
</script>
