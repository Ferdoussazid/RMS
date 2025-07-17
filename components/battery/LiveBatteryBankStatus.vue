<template>
  <ContentCard title="Battery Bank Status" is-top-blending>
    <template #content>
      <div class="flex flex-1 flex-col items-start justify-center space-y-4 py-4 pl-8">
        <TerminalVoltage
          v-for="pin in voltagePinsOfFocusedTenant"
          :key="'voltage_' + pin.id"
          :voltage="pin.voltage"
          :label="pin.label"
        />

        <div v-for="pin in voltagePinsOfFocusedTenant" :key="'backup_' + pin.id" class="flex flex-col space-y-4">
          <BatteryBackupDuration type="max" :tenant="pin.tenant || ''" :duration="pin.maximum" />
          <BatteryBackupDuration type="left" :tenant="pin.tenant || ''" :duration="pin.remaining" />
        </div>
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'
import { SITE_TENANT } from '~/assets/js/Constant'
import { sortPinsByTenant } from '~/assets/js/SiteHelper'

export default {
  components: {},
  computed: {
    ...mapGetters('battery', ['voltagePins', 'dcBackup']),
    ...mapGetters('site', ['focusedTenant']),
    voltagePinsOfFocusedTenant() {
      const pins = this.voltagePins.filter(pin => this.focusedTenant === (pin.tenant || SITE_TENANT.BANGLALINK))
      pins.sort(sortPinsByTenant)
      return pins
    },
    isBackupTimeAvailable() {
      return this.dcBackup.isAvailable
    },
    formattedBackupTime() {
      return this.$utils.toTimeDuration(this.dcBackup.maximum, { longForm: true })
    },
    formattedRemainingTime() {
      return this.$utils.toTimeDuration(this.dcBackup.remaining, { longForm: true })
    },
  },
}
</script>

<style lang="scss" scoped></style>
