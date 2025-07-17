<template>
  <SettingItem ref="container" :can-edit="canChangeValue" title="DC Critical Voltage" @save="onSaveClick">
    <template #value>
      <span class="text-xs font-semibold text-slate-700">{{ value }} Volt</span>
    </template>
    <template #editor>
      <div class="flex flex-row items-center space-x-2">
        <FloatingLabelInput v-model="value" :prefill="`${value}`" label="Critical Voltage" />
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
    value: '0',
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
      this.value = `${val.dc_critical_voltage || 0}`
    },
  },
  methods: {
    async onSaveClick() {
      try {
        await this.$store.dispatch('settings/saveSettings', {
          siteUid: this.siteConfig.site.uid,
          prop: 'dc_critical_voltage',
          value: this.value,
        })
        this.$toast.success('Settings updated')
        this.$refs.container.onCancelClick()
      } catch (error) {
        this.$toast.error('Error saving the setting')
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
