<template>
  <ContentCard title="Main Power Status" is-top-blending>
    <template #content>
      <div class="flex min-h-[40vh] flex-1 flex-col justify-evenly pl-8">
        <PhaseVoltage v-for="(pin, i) in pinsOfFocusedTenant" :key="i" :label="pin.label" :voltage="pin.voltage" />

        <div v-if="withDg && hasPGPin" class="flex flex-row items-center justify-start space-x-6">
          <PowerBulb :has-power="!!pgPin.status" />

          <p class="text-xs font-bold text-gray-700">
            PG is
            <span :class="[pgPin.status ? 'text-green-500' : 'text-red-500']">
              {{ pgPin.status ? 'ON' : 'OFF' }}
            </span>
          </p>
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
  props: {
    withDg: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('mains', ['pins']),
    ...mapGetters('site', ['focusedTenant']),
    ...mapGetters('generator', ['dgPin', 'pgPin']),
    hasPGPin() {
      return !!this.pgPin
    },
    pinsOfFocusedTenant() {
      const pins = this.pins.filter(pin => this.focusedTenant === (pin.tenant || SITE_TENANT.BANGLALINK))
      pins.sort(sortPinsByTenant)
      return pins
    },
    // dgPinOfFocusedTenant() {
    //   const pin = this.dgPins.find(pin => this.focusedTenant === pin.tenant)
    //   if (pin) {
    //     return pin
    //   }
    //   return this.dgPins.find(pin => !pin.tenant)
    // },
    // pgPinOfFocusedTenant() {
    //   const pin = this.pgPins.find(pin => this.focusedTenant === pin.tenant)
    //   if (pin) {
    //     return pin
    //   }
    //   return this.pgPins.find(pin => !pin.tenant)
    // },
  },
  watch: {
    pgPin: {
      handler(val, old) {},
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
