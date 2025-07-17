<template>
  <div class="flex flex-col w-full min-h-screen bg-gray-50">
    <!-- Toolbar with Dashboard Buttons -->
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

    <!-- Main Content -->
    <div class="flex flex-col items-center justify-center flex-grow py-10 space-y-8">
      <!-- Input field -->
      <FixedLabelInput v-model="myinput" label="My Level" />

      <!-- Blue-bordered Circle Counter -->
      <div class="w-48 h-48 rounded-full border-8 border-blue-500 bg-white shadow-xl flex items-center justify-center text-5xl font-bold text-blue-600">
        {{ count }}
      </div>

      <!-- Counter Buttons -->
      <div class="flex space-x-6">
        <button @click="increment"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-md">+</button>
        <button @click="decrement"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-md">-</button>
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
      count: 0,
      myinput: ''
    }
  },
  computed: {
    canAccessLegacyDashboard() {
      return this.isSuperAdmin || this.isAdmin || this.isFTB
    }
  },
  watch: {
    myinput(newValue) {
      console.log('Input changed:', newValue)
    }
  },
  methods: {
    increment() {
      this.count++
      this.myinput = this.count.toString()
    },
    decrement() {
      if (this.count > 0) {
        this.count--
        this.myinput = this.count.toString()
      }
    }
  }
}
</script>
