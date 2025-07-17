<template>
  <div class="flex min-h-screen w-full flex-col">
    <AppToolbar title="OEM Integration" />
    <SiteTabMenu class="mt-2" />
    <div class="flex flex-col rounded-b-lg bg-white md:px-4 md:py-0">
      <div class="flex w-full flex-col items-stretch justify-between md:flex-row">
        <div class="tabs w-full">
          <a
            class="tab-lifted tab font-medium"
            :class="[rectifierTabActive ? 'tab-active text-gray-800 ' : 'text-gray-600']"
            @click="onTabClick('rectifier')"
          >
            <i class="fas fa-bell mr-2"></i> Rectifier
          </a>
          <a
            class="tab-lifted tab font-medium"
            :class="[bmsTabActive ? 'tab-active  text-gray-800' : 'text-gray-600']"
            @click="onTabClick('bms')"
          >
            <i class="fas fa-list-ul mr-2"></i> BMS
          </a>
        </div>
        <div v-if="showBatteryAddressDropdown" class="w-40 pb-2">
          <DropdownMenu
            :options="batteryAddressOptions"
            :placeholder="selectedBattery"
            @input="onBatteryAddressSelect"
          />
        </div>
      </div>

      <RectifierDataContainer v-if="rectifierTabActive" :site="focusedSite" />
      <BMSDataContainer v-if="bmsTabActive" :site="focusedSite" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup'],
  data: () => ({}),
  computed: {
    ...mapGetters('site', ['focusedSite']),
    ...mapGetters('oem', ['selectedBatteryAddress', 'selectedTab']),
    rectifierTabActive() {
      return this.selectedTab === 'rectifier'
    },
    bmsTabActive() {
      return this.selectedTab === 'bms'
    },
    showBatteryAddressDropdown() {
      const batteryType = this._.get(this.focusedSite.bms, 'bms_type', '')
      return this.selectedTab === 'bms' && batteryType
    },
    batteryAddressCount() {
      return this._.get(this.focusedSite.bms, 'bms_address', 0)
    },
    batteryAddressOptions() {
      const options = []
      for (let i = 1; i <= this.batteryAddressCount; i++) {
        options.push({ id: i, value: i, label: `Battery ${i}` })
      }
      return options
    },
    selectedBattery() {
      const address = this.batteryAddressOptions.find(a => a.value === this.selectedBatteryAddress)
      return address?.label || 'Select a battery'
    },
  },
  methods: {
    onTabClick(tab) {
      this.$store.commit('oem/SET_SELECTED_TAB', tab)
    },
    onBatteryAddressSelect(item) {
      this.$store.commit('oem/SET_SELECTED_BATTERY_ADDRESS', item.value)
    },
  },
}
</script>

<style lang="scss" scoped></style>
