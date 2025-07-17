<template>
  <SettingItem ref="container" :can-edit="isSuperUser" title="App Lock Integration Status" @save="onSaveClick">
    <template #value>
      <span class="text-xs font-semibold text-slate-700">{{ bluetoothLockStatus.value }}</span>
    </template>
    <template #editor>
      <div class="flex flex-row items-center space-x-2">
        <DropdownMenu
          v-model="bluetoothLockStatus"
          :placeholder="bluetoothLockStatus.value"
          :options="bluetoothLockStatusOptions"
        />
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
    bluetoothLockStatus: { value: '' },
    bluetoothLockStatusOptions: [
      { id: 1, label: 'YES', value: 'YES' },
      { id: 2, label: 'NO', value: 'NO' },
    ],
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('settings', ['siteSettings']),
  },
  watch: {
    siteSettings(val, old) {
      this.bluetoothLockStatus = { value: val.bluetooth_lock || 'NO' }
    },
  },
  methods: {
    async onSaveClick() {
      try {
        await this.$store.dispatch('settings/saveSettings', {
          siteUid: this.siteConfig.site.uid,
          prop: 'bluetooth_lock',
          value: this.bluetoothLockStatus.value,
        })
        this.$toast.success('Bluetooth lock status updated')
        this.$refs.container.onCancelClick()
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped></style>
