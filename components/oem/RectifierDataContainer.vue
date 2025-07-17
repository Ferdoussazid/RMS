<template>
  <div class="min-h-[70vh] w-full rounded">
    <LoadingContainer v-if="loading" />
    <div v-if="!loading" class="grid w-full grid-cols-12 gap-2">
      <VertivAlarmsContainer v-if="rectifierType === 'vertiv'" :site-uid="site.uid" />
      <EltekAlarmsContainer v-if="rectifierType === 'eltek'" :site-uid="site.uid" />
      <JvoltAlarmsContainer v-if="rectifierType === 'jvolt'" :site-uid="site.uid" />
      <SarbsAlarmsContainer v-else-if="rectifierType === 'sarbs'" :site-uid="site.uid" />
      <div
        v-if="rectifierType"
        class="col-span-12 flex min-h-[70vh] w-full flex-col items-center gap-2 overflow-hidden rounded bg-slate-100 lg:col-span-7"
      >
        <div class="h-full w-full">
          <div class="flex w-full flex-col gap-2">
            <div
              class="clock-container flex flex-col items-center justify-between bg-slate-200 px-4 py-2 shadow-md md:flex-row"
            >
              <div id="clock" class="flex flex-1 flex-col items-center px-4 py-2">
                <span class="select-none text-xs font-medium text-[#daf6ff]">Updated</span>
                <span class="text-base font-bold text-[#daf6ff]"
                  >{{ fetchInterval && !showRectifierSettings ? fetchInterval : '--' }} ago</span
                >
              </div>
              <div class="hidden flex-1 flex-col items-center md:flex">
                <span class="text-lg font-normal text-[#daf6ff]">{{ title }}</span>
              </div>
              <div id="clock" v-if="isClock" class="flex flex-1 flex-col items-center">
                <span class="select-none text-xs font-medium text-[#daf6ff]">Rectifier Clock</span>
                <DigitalClock
                  class="flex w-full flex-col rounded"
                  :site-uid="site.uid"
                  :rectifier-type="rectifierType"
                />
              </div>

              <button
                class="relative rounded-md border border-white p-1 text-sm text-white"
                @mouseover="showText = true"
                @mouseleave="showText = false"
                @click="showRectifierSettings = !showRectifierSettings"
              >
                <i v-if="!showRectifierSettings" class="fas fa-cog"></i>
                <i v-else class="fas fa-bolt"></i>
                <div
                  v-if="showText && !showRectifierSettings"
                  class="absolute top-[-25px] left-[-20px] rounded-md bg-black p-1"
                >
                  <span class="leading-0 text-[10px] font-semibold text-white">Settings</span>
                </div>
                <div
                  v-if="showText && showRectifierSettings"
                  class="absolute top-[-25px] left-[-35px] rounded-md bg-black p-1"
                >
                  <span class="leading-0 text-[10px] font-semibold text-white">Measurements</span>
                </div>
              </button>
            </div>
            <RectifierSettings v-if="showRectifierSettings" />
            <RectifierMeasurementData
              v-else
              :site-uid="site.uid"
              :rectifier-type="rectifierType"
              @update="resetInterval"
            />
          </div>
        </div>
      </div>
      <div
        v-if="!rectifierType"
        class="col-span-12 m-auto flex min-h-[70vh] w-full flex-col items-center justify-center space-y-6 rounded bg-slate-100 md:p-4"
      >
        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">Rectifier not integrated</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDistanceStrict } from 'date-fns'
import { RECTIFIER_TYPE } from '~/assets/js/Constant'

export default {
  props: {
    site: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    intervalId: null,
    lastFetchTime: null,
    showRectifierSettings: false,
    fetchInterval: 0,
    showText: false,
  }),
  computed: {
    rectifierType() {
      return this._.get(this.site.rectifier, 'rectifier_type', '')
    },
    title() {
      if (this.showRectifierSettings) {
        return 'Rectifier Settings'
      }
      return 'Measurement Data'
    },
    isClock() {
      return this.rectifierType !== RECTIFIER_TYPE.JVOLT
    },
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.updateFetchInterval()
    }, 1000)
    this.getRectifierSettings()
  },
  destroyed() {
    clearInterval(this.intervalId)
  },
  methods: {
    updateFetchInterval() {
      this.fetchInterval = this.lastFetchTime ? formatDistanceStrict(new Date(), this.lastFetchTime) : null
    },
    resetInterval() {
      this.lastFetchTime = new Date()
    },
    async getRectifierSettings() {
      await this.$store.dispatch('oem/getRectifierSettings', {
        site_uid: this.site.uid,
        rectifier_type: this.rectifierType,
      })
    },
  },
}
</script>

<style></style>
