<template>
  <SettingItem ref="container" :can-edit="canChangeValue" title="DC Backup Duration" @save="onSaveClick">
    <template #value>
      <span class="text-xs font-semibold text-slate-700">{{ hour }}:{{ minute }} Hrs</span>
    </template>
    <template #editor>
      <div class="flex flex-row items-center space-x-2">
        <FloatingLabelInput v-model="hour" :prefill="hour + ''" label="Hours" />
        <FloatingLabelInput v-model="minute" :prefill="minute + ''" label="Minutes" />
      </div>
    </template>
  </SettingItem>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  data: () => ({
    hour: '0',
    minute: '0',
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
      this.hour = _.get(val, 'dc_backup_duration.hour', '0')
      this.minute = _.get(val, 'dc_backup_duration.minute', '0')
    },
  },
  methods: {
    async onSaveClick() {
      try {
        await this.$store.dispatch('settings/saveSettings', {
          siteUid: this.siteConfig.site.uid,
          prop: 'dc_backup_duration',
          value: JSON.stringify({ hour: this.hour, minute: this.minute }),
        })

        const duration = (+this.hour * 60 + +this.minute) * 60
        this.$store.commit('UPDATE_BATTERY_BACKUP', {
          batteryMax: duration,
          batteryLeft: duration,
        })

        this.$toast.success('Settings updated')
        this.$refs.container.onCancelClick()
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped></style>
