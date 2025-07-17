<template>
  <div :class="[colorbar]"
    class="my-1 mx-2 flex flex-col gap-2 divide-y rounded-md border-x-[1px] border-t-4 border-b-[1px] border-x-slate-200 border-b-slate-200 bg-white px-3 py-2.5 shadow-sm">
    <div class="flex flex-row items-center space-x-2 cursor-default">
      <div
        class="flex h-10 w-10 shrink-0 flex-row items-center justify-center rounded-full bg-gradient-to-tr p-1.5 shadow-lg"
        :class="[theme]">
        <img :src="icon" alt="" />
      </div>
      <div class="flex grow flex-col gap-1.5 pl-1.5">
        <div class="flex grow flex-col gap-0.5">
          <div v-if="showSiteName" class="flex flex-row items-center justify-start space-x-1 text-[0.6rem]">
            <span class="font-semibold text-indigo-500 cursor-pointer" @click="onSiteNameClick">{{ siteName }}</span>
          </div>
          <span class="text-xs font-semibold text-gray-600">
            <slot></slot>
          </span>
        </div>
        <div class="flex flex-row items-center justify-between space-x-1">
          <span class="grow text-[0.66rem] font-medium text-gray-500">{{ formattedTime }}</span>
          <div class="shrink-0">
            <slot name="meta"></slot>
          </div>
        </div>
      </div>
    </div>
    <slot name="extra"></slot>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { format } from 'date-fns'
  import { getRectifierEventColor } from '~/assets/js/EventStyle'
  import { RMS_EVENTS } from '~/assets/js/Helper'

  export default {
    props: {
      event: {
        type: Object,
        required: true,
      },
      theme: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        required: true,
      },
      showSiteName: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ...mapGetters('site', ['siteUid2Name', 'sites', 'siteConfig', 'focusedTenant']),
      formattedTime() {
        return format(new Date(this.event.time), 'h:mm aaa, d MMM yyyy')
      },
      siteName() {
        return this.siteUid2Name[this.event.siteUid] || 'N/A'
      },
      colorbar() {
        return getRectifierEventColor(this.event.name)
      },
    },
    methods: {
      getSiteFromEvent() {
        return this.sites.find(s => s.uid === this.event.siteUid)
      },
      getRedirectionPath() {
        return RMS_EVENTS.includes(this.event.name) ? '/site' : '/oem/data'
      },
      setFocusedTenant() {
        const site = this.getSiteFromEvent()
        const siteTenants = site.tenants || []
        const tenant = siteTenants.find(t => t === this.focusedTenant)
        const tenantToFocus = tenant || site.tenants[0]
        this.$store.commit('site/SET_FOCUSED_TENANT', tenantToFocus)
      },
      async onSiteNameClick() {
        this.setFocusedTenant()
        if (this.event.siteUid !== this.siteConfig.siteUid) {
          await this.$store.dispatch('site/getSiteConfig', this.event.siteUid)
        }
        const redirectionPath = this.getRedirectionPath()
        this.$router.push(redirectionPath)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
