<template>
  <div class="flex flex-col divide-y">
    <SettingItem ref="details" :can-edit="isSuperUser" :title="title" @save="onRectifierSave">
      <template #value>
        <span class="text-xs font-semibold text-slate-700">{{ rectifierStatusLabel }}</span>
      </template>
      <template v-if="isSuperUser" #editor>
        <div class="flex flex-col items-center gap-2 md:flex-row">
          <div class="flex w-24 flex-row items-center space-x-2">
            <DropdownMenu
              v-model="rectifierStatusToSet"
              :placeholder="rectifierStatusToSet.label"
              :options="statusOptions"
            />
          </div>

          <div v-if="hasRectifier" class="flex w-32 flex-row items-center space-x-2">
            <DropdownMenu
              v-model="rectifierTypeToSet"
              :placeholder="rectifierTypeToSet.label || 'Rect. Type'"
              :options="rectifierTypeOptions"
            />
          </div>

          <div v-if="hasRectifier" class="flex w-32 flex-row items-center space-x-2">
            <DropdownMenu
              v-model="rectifierVersionToSet"
              :placeholder="rectifierVersionToSet.label || 'Version'"
              :options="filteredRectifierVersions"
            />
          </div>
          <div v-if="hasRectifier" class="flex w-32 flex-row items-center space-x-2">
            <DropdownMenu
              v-model="rectifierTenentToset"
              :placeholder="rectifierTenentToset.label || 'Tenant'"
              :options="tenantOptions"
            />
          </div>
        </div>
      </template>
    </SettingItem>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { getTenantLabel } from '~/assets/js/Helper'

export default {
  mixins: [UserTypeChecker],
  props: {
    title: {
      type: String,
      required: true,
    },
    rectifier: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    position: {
      type: Number,
      default: null,
      required: true,
    },
  },
  data: () => ({
    rectifierStatusToSet: {},
    rectifierTypeToSet: {},
    rectifierPositionToset: {},
    rectifierTenentToset: {},
    rectifierVersionToSet: {},
    statusOptions: [
      { id: 1, value: 'YES', label: 'YES' },
      { id: 2, value: 'NO', label: 'NO' },
    ],
    rectifierTypeOptions: [
      { id: 1, value: 'sarbs', label: 'Sarbs' },
      { id: 2, value: 'vertiv', label: 'Vertiv' },
      { id: 3, value: 'eltek', label: 'ELTEK' },
      { id: 4, value: 'huawei', label: 'Huawei' },
      { id: 5, value: 'dpc', label: 'DPC' },
      { id: 6, value: 'jvolt', label: 'JVolt' },
    ],
    rectifierPositionOptions: [
      { id: 1, value: 1, label: '1' },
      { id: 2, value: 2, label: '2' },
    ],
    rectifierVersionOptions: [
      { id: 1, value: '1.0.1', label: '1.0.1', rectifier: 'sarbs' },
      { id: 2, value: '1.1.1', label: '1.1.1', rectifier: 'sarbs' },
      { id: 3, value: '1.4.1', label: '1.4.1', rectifier: 'vertiv' },
      { id: 4, value: '1.6.1', label: '1.6.1', rectifier: 'vertiv' },
      { id: 5, value: '0.0.1', label: '0.0.1', rectifier: 'eltek' },
      { id: 6, value: '0.0.1', label: '0.0.1', rectifier: 'jvolt' },
    ],
    rectifierTenantOptions: [],
  }),
  computed: {
    ...mapGetters('site', ['siteConfig', 'focusedSite']),
    ...mapGetters('settings', ['siteSettings']),
    ...mapGetters('user', ['rootUserUid']),

    test() {
      if (!this.hasRectifier) return {}
      return this.filteredRectifierVersions.find(item => item.value === this.siteRectifier?.rectifier_version) || {}
    },

    oemIntegrationStatus() {
      const status = Object.keys(this.siteRectifier).length ? 'YES' : 'NO'
      return { value: status, label: status }
    },
    hasRectifier() {
      return this.rectifierStatusToSet?.value === 'YES'
    },
    siteRectifier() {
      return this.rectifier && this.rectifier.rectifier_type ? this.rectifier : {}
    },
    filteredRectifierVersions() {
      return this.rectifierVersionOptions.filter(item => item.rectifier === this.rectifierTypeToSet?.value)
    },
    rectifierType() {
      if (!this.hasRectifier) return {}
      return this.rectifierTypeOptions.find(item => item.value === this.siteRectifier?.rectifier_type) || {}
    },
    rectifierVersion() {
      if (!this.hasRectifier) return {}
      return this.filteredRectifierVersions.find(item => item.value === this.siteRectifier?.rectifier_version) || {}
    },

    rectifierStatusLabel() {
      if (!this.hasRectifier) {
        return 'NO'
      }
      const label = this.rectifierTypeToSet.label || ''
      const version = this.rectifierVersionToSet.label || ''
      return `${label} ${version}`
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
    rectifierTenant() {
      if (!this.hasRectifier) return {}
      const tenant = this.tenantOptions.find(item => item.value === this.siteRectifier?.rectifier_tenant) || {}

      return tenant
    },
  },
  watch: {
    siteSettings(val, old) {
      this.rectifierStatusToSet = { ...this.oemIntegrationStatus }
      this.rectifierTypeToSet = { ...this.rectifierType }
      this.rectifierVersionToSet = { ...this.rectifierVersion }
      this.rectifierTenentToset = { ...this.rectifierTenant }
    },
  },
  mounted() {
    this.rectifierStatusToSet = { ...this.oemIntegrationStatus }
    this.rectifierTypeToSet = { ...this.rectifierType }
    this.rectifierVersionToSet = { ...this.rectifierVersion }
    this.rectifierTenentToset = { ...this.rectifierTenant }
  },
  methods: {
    async onRectifierSave() {
      if (this.hasRectifier && !this.validateRectifierFields()) return

      try {
        const rectifierValue = {
          status: this.rectifierStatusToSet.value,
          position: this.position,
        }
        if (this.hasRectifier) {
          rectifierValue.rectifier_type = this.rectifierTypeToSet.value
          rectifierValue.rectifier_version = this.rectifierVersionToSet.value
          rectifierValue.tenant = this.rectifierTenentToset.value
        }
        await this.$store.dispatch('settings/saveSettings', {
          siteUid: this.siteConfig.site.uid,
          prop: 'rectifier',
          value: JSON.stringify({ ...rectifierValue, user_uid: this.rootUserUid }),
        })
        this.$toast.success('Rectifier details updated')

        const currentRectifier = { ...this.focusedSite.rectifier }

        if (rectifierValue.status === 'NO') {
          // Clear rectifier values based on position
          const keysToRemove =
            rectifierValue.position === 1
              ? ['rectifier_type', 'rectifier_version', 'rectifier_tenant']
              : ['rectifier_type_2', 'rectifier_version_2', 'rectifier_tenant_2']
          keysToRemove.forEach(key => delete currentRectifier[key])
        } else {
          // Update rectifier values based on position
          const keysToUpdate =
            rectifierValue.position === 1
              ? {
                  rectifier_type: rectifierValue.rectifier_type,
                  rectifier_version: rectifierValue.rectifier_version,
                  rectifier_tenant: rectifierValue.tenant,
                }
              : {
                  rectifier_type_2: rectifierValue.rectifier_type,
                  rectifier_version_2: rectifierValue.rectifier_version,
                  rectifier_tenant_2: rectifierValue.tenant,
                }

          Object.assign(currentRectifier, keysToUpdate)
        }
        // Commit the updated rectifier to the store
        this.$store.commit('site/UPDATE_FOCUSED_SITE_PROPERTY', { prop: 'rectifier', value: currentRectifier })
        this.$store.dispatch('site/UpdateSiteCounts')
        this.$refs.details.onCancelClick()
      } catch (error) {
        this.$toast.error('Error updating settings!')
      }
    },
    validateRectifierFields() {
      if (!this.rectifierTypeToSet.value) {
        this.$toast.error('Please select a rectifier type')
        return false
      }

      if (!this.rectifierTenentToset.value) {
        this.$toast.error('Please select a rectifier tenant')
        return false
      }
      if (!this.rectifierVersionToSet.value) {
        this.$toast.error('Please select a rectifier version')
        return false
      }
      return true
    },

    setRectifierTenant() {
      this.rectifierTenentToset =
        this.rectifierTenantOptions.find(item => item.value === this.siteRectifier?.rectifier_tenant) || {}
    },
  },
}
</script>

<style lang="scss" scoped></style>
