<template>
  <div class="w-full rounded-t-xl px-2 py-3" :class="[background]">
    <div
      class="flex cursor-pointer justify-center rounded bg-transparent px-2 py-1.5 text-blue-600 transition duration-300 md:hidden"
      @click="showTabItems = !showTabItems"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 fill-current stroke-current"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </div>
    <div v-if="showTabItems" class="tabs grid grid-cols-11">
      <SiteTabMenuItem
        v-for="item in tabItems"
        :key="item.id"
        :name="item.name"
        :tag="item.tag"
        :icon="item.icon"
        :url="item.url"
        :has-service="item.serviceStatus"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  props: {
    background: {
      type: String,
      default: 'bg-white',
    },
  },
  data: () => ({
    showTabItems: true,
  }),
  computed: {
    ...mapGetters('access', {
      hasAccessService: 'isServiceAvailable',
    }),
    ...mapGetters('mains', {
      hasMainsService: 'isServiceAvailable',
    }),
    ...mapGetters('generator', {
      hasGeneratorService: 'isServiceAvailable',
    }),
    ...mapGetters('battery', {
      hasBatteryService: 'isServiceAvailable',
    }),
    ...mapGetters('temperature', {
      hasTemperatureService: 'isServiceAvailable',
    }),
    ...mapGetters('fuel', {
      hasFuelService: 'isServiceAvailable',
    }),
    ...mapGetters('site', ['focusedSite']),
    tabItems() {
      return [
        { id: 1, name: 'Site Details', icon: 'fas fa-layer-group', url: '/site' },
        { id: 2, name: 'Alarms', icon: 'fas fa-exclamation-circle', url: '/alarm' },
        {
          id: 3,
          name: 'OEM Integration',
          icon: 'fas fa-microchip',
          url: '/oem/data',
          serviceStatus: !this.isReadOnlyUser && this.focusedSite?.isHslDeviceVendor,
        },
        {
          id: 4,
          name: 'Site Access',
          icon: 'fas fa-door-open',
          url: '/access',
          serviceStatus:
            !this.isReadOnlyUser && !!this.hasAccessService && this.canAccessAcs && this.focusedSite?.isHslDeviceVendor,
        },
        {
          id: 5,
          name: 'AC Power',
          icon: 'fas fa-bolt',
          url: '/mains',
          serviceStatus: !!this.hasMainsService || !this.focusedSite?.isHslDeviceVendor,
        },
        {
          id: 6,
          name: 'DC Power',
          icon: 'fas fa-car-battery',
          url: '/battery',
          serviceStatus: !!this.hasBatteryService || !this.focusedSite?.isHslDeviceVendor,
        },
        {
          id: 7,
          name: 'Generator',
          icon: 'fas fa-charging-station',
          url: '/generator',
          serviceStatus: (!this.isReadOnlyUser && !!this.hasGeneratorService) || !this.focusedSite?.isHslDeviceVendor,
        },
        {
          id: 8,
          name: 'Temperature',
          icon: 'fas fa-temperature-low',
          url: '/temperature',
          serviceStatus: (!this.isReadOnlyUser && !!this.hasTemperatureService) || !this.focusedSite?.isHslDeviceVendor,
        },
        { id: 9, name: 'Report', icon: 'fas fa-file-excel', url: '/report', serviceStatus: true },
        { id: 10, name: 'Settings', icon: 'fas fa-cog', url: '/settings', serviceStatus: true },
        { id: 11, name: 'Info', icon: 'fas fa-info-circle', url: '/site/info', serviceStatus: true },
      ]
    },
  },
}
</script>

<style lang="scss" scoped></style>
