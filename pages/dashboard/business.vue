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

    <CountSummaryBar />

    <div class="flex flex-col w-full gap-2 lg:flex-row">
      <ContentCard title="Power" class="w-full lg:w-4/12">
        <template #content>
          <div v-if="fetchingDashboard" class="flex h-full min-h-[30vh] w-full items-center justify-center">
            <CircularSpinner />
          </div>
          <div v-else
            class="flex h-full w-full flex-col divide-y divide-slate-300 md:flex-row md:divide-x md:divide-y-0 lg:min-h-[70vh] lg:flex-col lg:divide-y lg:divide-x-0">
            <MainPowerDashboard class="min-h-[30vh] flex-1" />
            <MainOutageDashboard class="min-h-[30vh] flex-1" />
          </div>
        </template>
      </ContentCard>
      <div class="flex flex-col w-full bg-white rounded lg:w-8/12">
        <div class="flex flex-col pr-6 md:flex-row md:justify-between md:pr-10">
          <div class="flex flex-row items-center px-2 pt-2 mt-2 tabs shrink-0">
            <a class="font-medium tab-lifted tab"
              :class="[alarmCountTabActive ? 'tab-active text-gray-800' : 'text-gray-600']"
              @click="onTabClick('alarm')">
              <i class="mr-2 fas fa-bell"></i> Alarms
            </a>
            <a class="font-medium tab-lifted tab"
              :class="[rectifierAlarmTabActive ? 'tab-active text-gray-800' : 'text-gray-600']"
              @click="onTabClick('rectifier-alarm')">
              <i class="mr-2 fas fa-microchip"></i> Rectifier
            </a>
            <a class="font-medium tab-lifted tab"
              :class="[loadStatusTabActive ? 'tab-active text-gray-800' : 'text-gray-600']"
              @click="onTabClick('load-status')">
              <i class="mr-2 fas fa-list-ul"></i> Load Status
            </a>

            <a class="font-medium tab-lifted tab"
              :class="[availabilityTabActive ? 'tab-active text-gray-800' : 'text-gray-600']"
              @click="onTabClick('availability')">
              <i class="mr-2 fas fa-signal"></i> Availability
            </a>
          </div>

          <div v-if="showExtraOptions" class="flex justify-end mt-4 shrink-0">
            <select v-model="tenant"
              class="cursor-pointer rounded border border-blue-200 bg-blue-50 py-1.5 pl-4 pr-8 text-xs font-semibold capitalize text-gray-600 shadow-sm">
              <option value="">Select Tenant</option>
              <option v-for="(t, i) in allowedTenants" :key="i" :value="t">{{ getLabelOfTenant(t) }}</option>
            </select>
          </div>
        </div>
        <div class="w-full lg:min-h-[70vh]">
          <div v-if="!showTabContent" class="flex h-[65vh] w-full items-center justify-center">
            <CircularSpinner size="lg" />
          </div>
          <AlarmCountContainer v-if="alarmCountTabActive" />
          <RectifierContainer v-if="rectifierAlarmTabActive" />
          <AvailabilityCountContainer v-if="availabilityTabActive" />
          <LoadStatusCountContainer v-if="loadStatusTabActive" />
          <div v-if="showExtraOptions" class="flex justify-end pb-2 pr-4 shrink-0">
            <button class="p-2 text-xs text-white rounded bg-sky-500 hover:bg-sky-600" @click="onCurrentAlarmExport">
              <i v-if="loadingExport" class="fas fa-circle-notch fa-spin"></i>
              <i v-else class="fas fa-file-export"></i>
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { SITE_TENANT } from '~/assets/js/Constant'
import { getTenantLabel } from '~/assets/js/Helper'
const downloadFile = require('js-file-download')

export default {
  mixins: [UserTypeChecker],
  middleware: ['auth', 'user'],
  data() {
    return {
      loading: true,
      intervalId: null,
      loadingExport: false,
      tenant: '',
      showExport: false,
    }
  },
  computed: {
    ...mapGetters('site', ['sites', 'fetchingSites']),
    ...mapGetters('user', ['rootUserUid', 'tokenExpired', 'allowedTenants']),
    ...mapGetters('dashboard', ['selectedTab', 'selectedTenant', 'fetchingDashboard']),
    alarmCountTabActive() {
      return this.selectedTab === 'alarm'
    },
    loadStatusTabActive() {
      return this.selectedTab === 'load-status'
    },
    rectifierAlarmTabActive() {
      return this.selectedTab === 'rectifier-alarm'
    },
    availabilityTabActive() {
      return this.selectedTab === 'availability'
    },
    showTabContent() {
      return this.selectedTab
    },
    showExtraOptions() {
      return this.alarmCountTabActive && !this.isReadOnlyUser
    },
  },

  watch: {
    tenant(val, old) {
      this.$store.commit('dashboard/SET_SELECTED_TENANT', val)
      this.$store.commit('dashboard-legacy/SET_SELECTED_TENANT', val)
    },
  },
  mounted() {
    this.setupSites()
    if (!this.selectedTab) {
      this.$store.commit('dashboard/SET_SELECTED_TAB', 'alarm')
    }
    if (this.isFTB && !this.isReadOnlyUser) {
      this.$store.commit('dashboard/SET_SELECTED_TENANT', SITE_TENANT.BANGLALINK)
    }
    this.tenant = this.selectedTenant
    this.countDashboardAlarms()
  },
  destroyed() {
    clearInterval(this.intervalId)
  },

  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
    async setupSites() {
      try {
        if (this.sites.length === 0 && !this.tokenExpired) {
          await this.$store.dispatch('site/setupSites')
        }
      } catch (error) {
        // console.log(error)
      }
    },
    countDashboardAlarms() {
      this.intervalId = setInterval(() => {
        if (this.sites.length) {
          this.$store.dispatch('dashboard/updateAlarmDashboard')
        }
      }, 2000)
    },

    onTabClick(tab) {
      this.$store.commit('dashboard/SET_SELECTED_TAB', tab)
    },
    async onCurrentAlarmExport() {
      if (this.loadingExport) return

      this.loadingExport = true

      try {
        const params = {
          user_uid: this.rootUserUid,
        }
        const res = await this.$axios.$get('/user/report/current', {
          params,
          responseType: 'arraybuffer',
        })
        downloadFile(res, `Current Alarms Export of All Sites ${format(new Date(), 'dd-MM-yyyy h:mm:ss a')}.xlsx`)
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.loadingExport = false
    },
  },
}
</script>
