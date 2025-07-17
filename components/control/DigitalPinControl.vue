<template>
  <ContentCard title="Access Control" is-top-blending>
    <template #content>
      <div class="flex flex-col items-center justify-start space-y-6 p-6 lg:flex-row lg:justify-between lg:space-y-0">
        <div class="flex flex-row items-center justify-center space-x-2 md:space-x-4">
          <div
            v-for="(pin, i) in pins"
            :key="i"
            class="relative flex flex-col items-center rounded-md border border-gray-200 px-6 py-3"
          >
            <span
              class="absolute left-1/2 top-0 w-2/3 -translate-x-1/2 -translate-y-1/2 transform bg-white text-center text-xs font-normal text-gray-700"
            >
              {{ pin.label }}
            </span>
            <div
              class="flex h-8 w-[100px] cursor-default flex-row items-center justify-center rounded-full shadow-lg transition-all duration-300"
              :class="{
                'bg-green-500 shadow-green-200': sitesWithReversePins.includes(pin.site_uid)
                  ? pin.status == 0
                  : pin.status == 1,
                'bg-red-500 shadow-red-200': sitesWithReversePins.includes(pin.site_uid)
                  ? pin.status == 1
                  : pin.status == 0,
              }"
            >
              <span class="text-xs font-semibold uppercase text-white">
                {{ getPinValueLabel(pin) }}
              </span>
            </div>
          </div>
        </div>
        <DoorUnlockButton />
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {},
  data: () => ({
    checked: false,
    sitesWithReversePins: [92224, 42230],
  }),
  computed: {
    ...mapGetters('access', ['pins']),
    // switchColor() {
    //   const enabledColor = 'bg-green-500 shadow-green-600'
    //   const disabledColor = 'bg-red-500 shadow-red-600'
    //   if (this.orientation === 'normal') {
    //     return this.checked ? enabledColor : disabledColor
    //   }
    //   return this.checked ? disabledColor : enabledColor
    // },
  },
  mounted() {},
  methods: {
    getPinValueLabel(pin) {
      if (pin.label.toLowerCase().includes('door')) {
        if (this.sitesWithReversePins.includes(pin.site_uid)) {
          return pin.status === 0 ? 'Closed' : 'Open'
        } else {
          return pin.status === 1 ? 'Closed' : 'Open'
        }
      }
      if (this.sitesWithReversePins.includes(pin.site_uid)) {
        return pin.status === 0 ? 'Locked' : 'Unlocked'
      } else {
        return pin.status === 1 ? 'Locked' : 'Unlocked'
      }
    },
    // async onClick() {
    //   this.checked = true
    //   this.$emit('trigger')
    //   await new Promise((resolve, reject) => {
    //     setTimeout(resolve, 1200)
    //   })
    //   this.checked = false
    // },
  },
}
</script>

<style lang="scss" scoped></style>
