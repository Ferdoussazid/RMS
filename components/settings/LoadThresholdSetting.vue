<template>
  <SettingItem ref="container" :can-edit="canChangeValue" :title="title" @save="onSaveClick">
    <template #value>
      <span class="text-xs font-semibold text-slate-700">{{ value }} KW</span>
    </template>
    <template #editor>
      <div class="flex flex-row items-center space-x-2">
        <FloatingLabelInput v-model="value" :prefill="`${value}`" label="Threshold" />
      </div>
    </template>
  </SettingItem>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTenantLabel } from '~/assets/js/Helper';
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  props: {
    tenant: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    value: 3,
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('settings', ['siteSettings']),
    title() {
      return `Load Threshold (${this.getLabelOfTenant(this.tenant)})`
    },
    canChangeValue() {
      return !(this.isReadOnlyUser || this.isSystemReadOnlyUser)
    },
  },
  watch: {
    siteSettings(val, old) {
      const loadThresholdSettings = this._.get(val, 'load_threshold', [])
      const tenantSpecificThreshold = loadThresholdSettings.find(t => t.tenant === this.tenant)
      this.value = tenantSpecificThreshold?.powerKW || 3
    },
  },
  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
    async onSaveClick() {
      try {
        const payload = {
          tenant: this.tenant,
          powerKW: this.value,
        }
        await this.$store.dispatch('settings/saveSettings', {
          siteUid: this.siteConfig.site.uid,
          prop: 'load_threshold',
          value: JSON.stringify(payload),
        })
        this.$toast.success('Settings updated')
        this.$refs.container.onCancelClick()
      } catch (error) { }
    },
  },
}
</script>

<style lang="scss" scoped></style>
