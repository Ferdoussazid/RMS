<template>
  <div class="flex flex-col divide-y">
    <SettingItem ref="details" :can-edit="isSuperUser" title="BMS Integration Status" @save="onBMSDetailsSave">
      <template #value>
        <span class="text-xs font-semibold text-slate-700">{{ bmsStatusLabel }}</span>
      </template>
      <template v-if="isSuperUser" #editor>
        <div class="flex flex-col items-center gap-2 md:flex-row">
          <div class="flex w-24 flex-row items-center space-x-2">
            <DropdownMenu v-model="bmsStatusToSet" :placeholder="bmsStatusToSet.label" :options="statusOptions" />
          </div>
          <div v-if="hasBMSDetails" class="w-36 shrink-0">
            <FloatingLabelInput v-model="bmsAddressToSet" :prefill="`${bmsAddressToSet}`" label="Battery Address" />
          </div>
          <div v-if="hasBMSDetails" class="flex w-32 flex-row items-center space-x-2">
            <DropdownMenu
              v-model="bmsTypeToSet"
              :placeholder="bmsTypeToSet.label || 'Batt. Name'"
              :options="bmsTypeOptions"
            />
          </div>
          <div v-if="hasBMSDetails" class="flex w-32 flex-row items-center space-x-2">
            <DropdownMenu
              v-model="bmsVersionToSet"
              :placeholder="bmsVersionToSet.label || 'Version'"
              :options="filteredBMSVersions"
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

export default {
  mixins: [UserTypeChecker],
  data: () => ({
    bmsStatusToSet: {},
    bmsTypeToSet: {},
    bmsVersionToSet: {},
    bmsAddressToSet: 0,
    statusOptions: [
      { id: 1, value: 'YES', label: 'YES' },
      { id: 2, value: 'NO', label: 'NO' },
    ],
    bmsTypeOptions: [
      { id: 1, value: 'stealth', label: 'Stealth' },
      { id: 2, value: 'vision', label: 'Vision' },
    ],
    bmsVersionOptions: [
      { id: 1, value: '1.0.1', label: '1.1.0', battery: 'stealth' },
      { id: 2, value: '1.1.1', label: '1.1.2', battery: 'vision' },
      { id: 3, value: '1.4.1', label: '1.4.1', battery: 'stealth' },
      { id: 4, value: '1.6.1', label: '2.6.1', battery: 'vision' },
    ],
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('settings', ['siteSettings']),
    ...mapGetters('user', ['rootUserUid']),

    bmsStatusLabel() {
      if (!this.hasBMSDetails) {
        return 'NO'
      }
      return `${this.bmsTypeToSet.label || ''} ${this.bmsVersionToSet.label || ''}`
    },
    oemIntegrationStatus() {
      const status = Object.keys(this.siteBMS).length ? 'YES' : 'NO'
      return { value: status, label: status }
    },
    hasBMSDetails() {
      return this.bmsStatusToSet?.value === 'YES'
    },
    siteBMS() {
      return this.siteSettings?.bms || {}
    },
    filteredBMSVersions() {
      return this.bmsVersionOptions.filter(item => item.battery === this.bmsTypeToSet?.value)
    },
    bmsType() {
      if (!this.hasBMSDetails) return {}
      return this.bmsTypeOptions.find(item => item.value === this.siteBMS?.bms_type) || {}
    },
    bmsVersion() {
      if (!this.hasBMSDetails) return {}
      return this.filteredBMSVersions.find(item => item.value === this.siteBMS?.bms_version) || {}
    },
  },
  watch: {
    siteSettings() {
      this.bmsStatusToSet = { ...this.oemIntegrationStatus }
      this.bmsTypeToSet = { ...this.bmsType }
      this.bmsVersionToSet = { ...this.bmsVersion }
      this.bmsAddressToSet = this.siteBMS.bms_address || 0
    },
  },
  mounted() {
    this.bmsStatusToSet = { ...this.oemIntegrationStatus }
    this.bmsTypeToSet = { ...this.bmsType }
    this.bmsVersionToSet = { ...this.bmsVersion }
    this.bmsAddressToSet = this.siteBMS.bms_address || 0
  },
  methods: {
    async onBMSDetailsSave() {
      if (this.hasBMSDetails && !this.validateBMSFields()) return

      try {
        const bmsValue = {
          status: this.bmsStatusToSet?.value || 'NO',
        }
        if (this.hasBMSDetails) {
          bmsValue.bms_type = this.bmsTypeToSet.value
          bmsValue.bms_version = this.bmsVersionToSet.value
          bmsValue.bms_address = this.bmsAddressToSet
        }
        await this.$store.dispatch('settings/saveSettings', {
          siteUid: this.siteConfig.site.uid,
          prop: 'bms',
          value: JSON.stringify({ ...bmsValue, user_uid: this.rootUserUid }),
        })
        this.$toast.success('BMS details updated')
        this.$store.commit('site/UPDATE_FOCUSED_SITE_PROPERTY', { prop: 'bms', value: bmsValue })
        this.$refs.details.onCancelClick()
      } catch (error) {
        this.$toast.error('Error updating settings!')
      }
    },

    validateBMSFields() {
      if (!this.bmsTypeToSet.value) {
        this.$toast.error('Please select a battery name')
        return false
      }
      if (!this.bmsAddressToSet) {
        this.$toast.error('Please enter BMS address')
        return false
      }
      return true
    },
  },
}
</script>

<style lang="scss" scoped></style>
