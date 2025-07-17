<template>
  <SettingItem ref="container" :can-edit="canChangeValue" title="SMS Alert Mobile No." @save="onSaveClick">
    <template #value>
      <div class="grid justify-items-end gap-2" :class="[gridColumns]">
        <div
          v-for="(p, i) in phones"
          :key="i"
          class="group flex cursor-pointer flex-row items-center space-x-1 rounded bg-slate-100 px-2 py-0.5 transition duration-300 hover:bg-slate-200"
          @click="onDeleteClick(p)"
        >
          <span class="text-xs font-semibold text-slate-700">{{ p }}</span>
          <span class="duration text-sm text-slate-500 transition group-hover:text-red-500">
            <i class="fas fa-times-circle"></i>
          </span>
        </div>
      </div>
    </template>
    <template #editor>
      <div class="flex flex-row items-center space-x-2">
        <FloatingLabelInput v-model="phone" label="Add Phone Number" />
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
    phone: '',
    phones: [],
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('settings', ['siteSettings']),
    gridColumns() {
      switch (this.phones.length) {
        case 1:
          return 'grid-cols-1'
        case 2:
          return 'grid-cols-2'

        default:
          return 'grid-cols-3'
      }
    },
    canChangeValue() {
      return !(this.isReadOnlyUser || this.isSystemReadOnlyUser)
    },
  },
  watch: {
    siteSettings(val, old) {
      this.phones = [...(val.sms_alert_phones || [])]
    },
  },
  methods: {
    async onSaveClick() {
      try {
        const payload = {
          action: 'add',
          phone: this.phone,
        }
        await this.$store.dispatch('settings/saveSettings', {
          siteUid: this.siteConfig.site.uid,
          prop: 'sms_alert_phones',
          value: JSON.stringify(payload),
        })
        this.phones.push(this.phone)
        this.$toast.success('Phone number added')
        this.$refs.container.onCancelClick()
      } catch (error) {}
    },
    async onDeleteClick(phone) {
      if (!this.getPermissionStatus('delete a number')) return
      if (!confirm('Delete SMS alert number ?')) return
      try {
        const payload = {
          action: 'remove',
          phone,
        }
        await this.$store.dispatch('settings/saveSettings', {
          siteUid: this.siteConfig.site.uid,
          prop: 'sms_alert_phones',
          value: JSON.stringify(payload),
        })
        this.phones = this.phones.filter(p => p !== phone)
        this.$toast.success('Phone number removed')
        this.$refs.container.onCancelClick()
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped></style>
