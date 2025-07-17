<template>
  <nav
    class="isolate z-[999] flex h-auto w-full flex-col items-stretch justify-between rounded-xl bg-white/80 px-4 py-2 shadow backdrop-blur-sm backdrop-filter md:h-14 md:flex-row md:items-center md:py-0">
    <div class="flex flex-col md:flex-row">
      <div class="flex shrink-0 items-center space-x-2">
        <div
          class="relative cursor-pointer rounded bg-transparent px-2 py-1.5 text-blue-600 transition duration-300 hover:bg-blue-100"
          @click="$bus.$emit('drawer', 'open')">
          <span v-if="isEmergencyAlarm" class="absolute top-1 left-1 z-10 flex h-3 w-3">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff3838] opacity-75"></span>
            <span class="relative inline-flex h-3 w-3 rounded-full bg-[#ff3838]"></span>
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current stroke-current" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <div class="flex flex-row items-center">
          <span class="text-base font-semibold leading-tight text-gray-800">
            {{ title }}
          </span>
        </div>
      </div>
      <div class="flex shrink-0 items-center">
        <div v-show="hasSiteName && withSiteId"
          class="flex flex-row items-center space-x-1 px-1 py-2 md:space-x-2 md:px-4">
          (
          <span class="text-xs font-semibold leading-tight text-gray-800"> Site ID: </span>
          <span class="cursor-pointer text-xs font-bold leading-tight text-blue-600 underline underline-offset-2"
            @click="$router.push('/site')">
            {{ siteName }}
          </span>
          )
          <span class="cursor-pointer" @click="copySiteId"><i class="far fa-copy text-gray-400"></i></span>
        </div>
        <div v-if="showTenantDropDown" class="w-36">
          <DropdownMenu :options="tenantOptions" :placeholder="selectedTenant" :flat="true" :compact="true"
            @input="onTenantSelect" />
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center">
      <slot name="overview"></slot>
    </div>

    <div class="flex shrink-0 flex-row items-center justify-center space-x-2 md:justify-end">
      <slot name="action"></slot>
      <NLink v-if="withSiteId" to="/site/list"
        class="mt-2 rounded border border-indigo-500 bg-transparent px-4 py-1.5 text-xs font-semibold text-indigo-500 transition duration-300 hover:bg-indigo-500 hover:text-white md:mt-0">
        <i class="fas fa-arrow-left"></i>
        All Sites
      </NLink>
    </div>
  </nav>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { getTenantLabel } from '~/assets/js/Helper'

export default {
  mixins: [UserTypeChecker],
  props: {
    title: {
      type: String,
      default: '',
    },
    withSiteId: {
      type: Boolean,
      default: true,
    },
    inTenantSpecificPage: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    isEmergencyAlarm: false,
    dateRange: {},
  }),
  computed: {
    ...mapGetters('site', ['siteConfig', 'focusedSite', 'focusedTenant']),
    ...mapGetters('user', ['allowedTenants']),
    siteName() {
      return _.get(this.focusedSite, 'name', 'N/A')
    },
    hasSiteName() {
      return this.withSiteId && !!this.siteConfig.site
    },
    tenantOptions() {
      const tenants = this.focusedSite.tenants || []
      let i = 0
      return tenants.map(t => {
        i++
        return {
          id: i,
          value: t,
          label: getTenantLabel(t, false),
        }
      })
    },
    selectedTenant() {
      return getTenantLabel(this.focusedTenant, false)
    },
    showTenantDropDown() {
      return this.inTenantSpecificPage && this.withSiteId && this.allowedTenants.length > 1
    },
  },
  mounted() {
    this.$bus.$on('emergency-alarm', this.showPulse)
    this.$bus.$on('drawer', this.removePulse.bind(this))
  },
  methods: {
    showPulse() {
      this.isEmergencyAlarm = true
    },
    removePulse(action) {
      if (action === 'open' || action === 'close') {
        this.isEmergencyAlarm = false
      }
    },
    onTenantSelect(item) {
      if (item.value !== this.focusedTenant) {
        this.$store.commit('site/SET_FOCUSED_TENANT', item.value)
      }
    },
    async copySiteId() {
      try {
        await navigator.clipboard.writeText(_.get(this.focusedSite, 'name', 'N/A'));
        this.$toast.success('Site ID copied to clipboard');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    },
  },
}
</script>

<style scoped></style>
