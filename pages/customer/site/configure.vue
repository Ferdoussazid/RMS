<template>
  <div class="flex w-full flex-col gap-2">
    <AppToolbar title="Site Configuration" :with-site-id="false" />
    <div class="flex w-full flex-row items-center gap-x-4 rounded-md bg-white py-2 px-4">
      <!-- <button class="shrink-0 rounded bg-blue-800 px-4 py-2 text-white" @click="$emit('close', 'configure')">
        <i class="fas fa-arrow-left"></i>
      </button> -->
      <span class="flex-grow text-base font-semibold">{{ siteName }} Configuration</span>
      <button
        class="shrink-0 rounded bg-blue-500 py-2 px-4 text-sm font-semibold text-white hover:bg-blue-700"
        @click="showBindForm = true"
      >
        <i class="fas fa-plug"></i>
        Bind Device
      </button>
    </div>
    <div class="flex min-h-[70vh] w-full flex-col gap-y-5 overflow-auto bg-white p-4">
      <LoadingContainer v-if="loading" />
      <div v-if="isEmpty" class="m-auto flex flex-col items-center justify-center space-y-6">
        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">No Device Bound</span>
      </div>
      <DeviceBindForm
        v-if="showBindForm && deviceCount <= 2"
        :site="siteConfig.siteInfo"
        @binded="onBindCompleted"
        @close="showBindForm = false"
      />
      <div v-if="devices.length !== 0 && !loading" class="flex min-h-[70vh] w-full flex-col gap-4 overflow-auto">
        <div
          v-for="(device, i) in devices"
          :key="i"
          class="relative flex w-full flex-col justify-center rounded bg-white md:px-8 lg:items-center"
        >
          <div class="overflow-auto rounded border bg-sky-50 py-4">
            <div class="flex w-full flex-row items-center justify-between space-x-2 py-2 pl-4 pr-28">
              <div class="flex flex-col gap-0 rounded border-2 border-slate-300 bg-white p-2">
                <span class="text-2xl font-bold text-emerald-600">{{ device.com_id }}</span>
                <span class="text-xs font-normal">Com. ID </span>
              </div>
              <button
                class="flex shrink-0 gap-1 rounded bg-yellow-500 p-2 text-sm font-semibold text-white hover:bg-yellow-600"
                @click="unbind(device.com_id)"
              >
                <i v-if="unbinding" class="fas fa-circle-notch fa-spin"></i>
                <svg v-if="!unbinding" width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M9.5 21v-3L6 14.5V9q0-.6.275-1.125t.8-.8v2.8L1.4 4.2l1.4-1.4l18.4 18.4l-1.4 1.4l-4.95-4.95l-.35.35v3h-5Zm7.65-6.7L8 5.15V3h2v4h4V3h2v5l-1-1h1q.825 0 1.413.588T18 9v4.45l-.85.85Z"
                  />
                </svg>
                <span class="">Unbind</span>
              </button>
            </div>
            <table class="table-striped">
              <PinHeader class="pb-2" />
              <tbody class="flex flex-col space-y-2">
                <PinConfig v-for="pin in getPinconfigsOfDevice(device.com_id)" :key="pin.id" :config="pin" />
                <PinConfigForm
                  v-if="pinConfigFormVisibility(+device.com_id)"
                  :site-uid="siteUid"
                  :com-id="device.com_id"
                  :user-uid="siteConfig.siteInfo.user_uid"
                  @close="onPinConfigFormClosed"
                />
              </tbody>
              <div v-if="!pinConfigFormVisibility(+device.com_id)" class="flex flex-row justify-end pr-24">
                <div class="flex flex-row px-4 pt-2">
                  <button
                    class="rounded bg-blue-500 py-2 px-4 text-xs font-semibold text-white hover:bg-blue-600"
                    @click="showPinConfigForm(+device.com_id)"
                  >
                    <i class="fas fa-plus"></i>
                    Add Pin
                  </button>
                </div>
              </div>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  middleware: ['auth', 'setup', 'admin'],
  data: () => ({
    loading: true,
    unbinding: false,
    showBindForm: false,
    visibleForms: [],
    site: {},
    siteUid: 0,
  }),
  computed: {
    ...mapGetters('customer', ['siteConfig']),
    isEmpty() {
      return this.devices.length === 0 && !this.showBindForm && !this.loading
    },
    siteName() {
      return _.get(this.siteConfig, 'siteInfo.name', '')
    },
    devices() {
      if (this.siteConfig === null) return []
      return _.get(this.siteConfig, 'devices')
    },
    deviceCount() {
      return this.devices.length
    },
  },

  mounted() {
    this.fetchSiteDetails()
  },
  methods: {
    async fetchSiteDetails() {
      this.loading = true
      try {
        this.siteUid = this.$route.query.siteUid
        await this.$store.dispatch('customer/getSiteConfig', { site_uid: this.siteUid })
      } catch (error) {}
      this.loading = false
    },
    async unbind(comId) {
      try {
        if (this.unbinding) return
        if (confirm('Are you sure you want unbind this device ?')) {
          this.unbinding = true
          await this.$store.dispatch('customer/unbindDevice', { site_uid: +this.siteUid, com_id: comId })
        }
        await this.$store.dispatch('customer/getSiteConfig', { site_uid: this.siteUid })
      } catch (error) {
        this.$toast.error(error)
      }
      this.unbinding = false
    },

    getPinconfigsOfDevice(comId) {
      return this.siteConfig.pinConfigs.filter(p => p.com_id === comId)
    },

    onPinConfigFormClosed(comId) {
      const index = this.visibleForms.findIndex(id => id === comId)
      if (index !== -1) {
        this.visibleForms.splice(index, 1)
      }
    },
    showPinConfigForm(comId) {
      if (!this.visibleForms.includes(comId)) {
        this.visibleForms.push(comId)
      }
    },
    pinConfigFormVisibility(comId) {
      return this.visibleForms.includes(comId)
    },
    onBindCompleted(comId) {
      this.fetchSiteDetails()
      this.showBindForm = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
