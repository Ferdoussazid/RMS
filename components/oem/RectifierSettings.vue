<template>
  <div class="grid w-full grid-cols-12 gap-4 p-4">
    <div v-if="!rectifierSettings.length" class="col-span-12 flex min-h-[70vh] items-center">
      <NoResultFound message="No data found" icon="/icon/empty.png" />
    </div>
    <div v-if="rectifierSettings.length" class="col-span-12 flex w-full flex-col rounded-md shadow-md md:col-span-4">
      <RectifierSettingsItem v-for="(setting, i) in leftColumnSettings" :key="i" :serial-no="i" :setting="setting" />
    </div>
    <div v-if="middleColumnSettings.length" class="col-span-12 flex w-full flex-col rounded-md shadow-md md:col-span-4">
      <RectifierSettingsItem v-for="(setting, i) in middleColumnSettings" :key="i" :serial-no="i" :setting="setting" />
    </div>
    <div v-if="rightColumnSettings.length" class="col-span-12 flex w-full flex-col rounded-md shadow-md md:col-span-4">
      <RectifierSettingsItem v-for="(setting, i) in rightColumnSettings" :key="i" :serial-no="i" :setting="setting" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { RECTIFIER_TYPE } from '~/assets/js/Constant'

export default {
  computed: {
    ...mapGetters('oem', ['rectifierSettings']),
    ...mapGetters('site', ['focusedSite']),
    rectifierType() {
      return this._.get(this.focusedSite?.rectifier, 'rectifier_type', '')
    },
    leftColumnSettings() {
      return this.rectifierSettings.slice(0, 7)
    },
    middleColumnSettings() {
      if (this.rectifierType === RECTIFIER_TYPE.SARBS) {
        return this.rectifierSettings.slice(7, 16)
      }
      return this.rectifierSettings.slice(7, 14)
    },
    rightColumnSettings() {
      return this.rectifierSettings.slice(14, this.rectifierSettings.length)
    },
  },
}
</script>

<style scoped></style>
