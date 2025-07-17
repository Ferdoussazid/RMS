<template>
  <SettingItem ref="container" :can-edit="canChangeValue" :title="title" @save="onSaveClick">
    <template #value>
      <span class="text-xs font-semibold text-slate-700">{{ inc.value }}</span>
    </template>
    <template #editor>
      <div class="flex flex-row items-center space-x-2">
        <DropdownMenu v-model="inc" :placeholder="inc.value" :options="incStatusOptions" />
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
    inc: { value: '' },
    incStatusOptions: [
      { id: 1, label: 'YES', value: 'YES' },
      { id: 2, label: 'NO', value: 'NO' },
    ],
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('settings', ['siteIncStatus']),
    ...mapGetters('user', ['rootUserUid']),
    title() {
      return `I&C Status (${this.getLabelOfTenant(this.tenant)})`
    },
    incDetails() {
      return this.siteIncStatus.find(inc => inc.tenant === this.tenant) || { value: 'NO', tenant: this.tenant }
    },
    canChangeValue() {
      return !(this.isReadOnlyUser || this.isSystemReadOnlyUser)
    },
  },
  watch: {
    incDetails(val, old) {
      this.inc = val
    },
  },
  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
    async onSaveClick() {
      try {
        const payload = {
          user_uid: this.rootUserUid,
          tenant: this.tenant,
          value: this.inc.value,
        }
        await this.$store.dispatch('settings/saveSettings', {
          siteUid: this.siteConfig.site.uid,
          prop: 'inc',
          value: JSON.stringify(payload),
        })
        this.$toast.success('I&C status updated')
        this.$refs.container.onCancelClick()
      } catch (error) { }
    },
  },
}
</script>

<style lang="scss" scoped></style>
