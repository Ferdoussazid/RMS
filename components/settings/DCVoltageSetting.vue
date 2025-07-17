<template>
  <SettingItem ref="container" :can-edit="canChangeValue" title="DC Operating Voltage" @save="onSaveClick">
    <template #value>
      <span class="text-xs font-semibold text-slate-700">{{ lowValue }} Volt</span>
      <span class="text-xs font-normal text-slate-500">to</span>
      <span class="text-xs font-semibold text-slate-700">{{ highValue }} Volt</span>
    </template>
    <template #editor>
      <div class="flex flex-row items-center space-x-2">
        <FloatingLabelInput v-model="lowValue" :prefill="`${lowValue}`" label="Low Voltage" />
        <FloatingLabelInput v-model="highValue" :prefill="`${highValue}`" label="Full Voltage" />
      </div>
    </template>
  </SettingItem>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  data: () => ({
    lowValue: '0',
    highValue: '0',
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('settings', ['siteSettings']),
    canChangeValue() {
      return !(this.isReadOnlyUser || this.isSystemReadOnlyUser)
    },
  },
  watch: {
    siteSettings(val, old) {
      this.lowValue = `${val.dc_low_voltage || 0}`
      this.highValue = `${val.dc_high_voltage || 0}`
    },
  },
  methods: {
    async onSaveClick() {
      try {
        await this.$store.dispatch('settings/saveSettings', {
          siteUid: this.siteConfig.site.uid,
          prop: 'dc_low_voltage',
          value: this.lowValue,
        })
        await this.$store.dispatch('settings/saveSettings', {
          siteUid: this.siteConfig.site.uid,
          prop: 'dc_high_voltage',
          value: this.highValue,
        })
        this.$toast.success('Settings updated')
        this.$refs.container.onCancelClick()
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped></style>
