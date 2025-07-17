<template>
  <div class="relative h-full w-full overflow-hidden">
    <MapLoader @loaded="loadMap" />
    <div class="map-wrapper">
      <div id="map-view" class="map-viewport" :class="[rotatable ? 'large-viewport' : '']" :style="style"></div>
    </div>
    <slot></slot>
    <!-- <div
      class="status-bar absolute flex flex-col items-stretch gap-y-2 lg:flex-row lg:items-center lg:gap-y-0"
      :class="`justify-${controlStyle}`"
    >
      <slot name="controls"></slot>
    </div> -->

    <!-- <div class="absolute top-20 bottom-4 left-4 w-1/4">
      <slot name="sidebar"></slot>
    </div> -->
  </div>
</template>

<script>
import MapLoader from '~/components/map/MapLoader'

export default {
  components: {
    MapLoader,
  },
  props: {
    controlStyle: {
      type: String,
      default: 'center',
      validate: val => ['center', 'between'].includes(val),
    },
    center: {
      type: Object,
      default: () => ({
        lat: 23.807059,
        lng: 90.368568,
      }),
    },
    zoom: {
      type: Number,
      default: 10,
    },
    rotatable: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    map: null,
    viewport: null,
    mapLoaded: false,

    theta: 40,
  }),
  computed: {
    hasClickListener() {
      return this.$listeners && this.$listeners.click
    },
    hasZoomListener() {
      return this.$listeners && this.$listeners.zoom
    },
    hasBoundsListener() {
      return this.$listeners && this.$listeners.bounds
    },
    style() {
      if (!this.rotatable) return {}

      return { transform: `translate(-50%, -50%) rotate(${this.theta}deg)` }
    },
  },
  watch: {},
  mounted() {},
  methods: {
    getMap() {
      return this.map
    },

    setRotation(degree) {
      this.theta = degree
    },

    loadMap() {
      this.map = new window.google.maps.Map(document.getElementById('map-view'), {
        zoom: this.zoom,
        center: new window.google.maps.LatLng(this.center),
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        styles: [
          // {
          //   elementType: 'labels',
          //   stylers: [
          //     {
          //       visibility: 'off',
          //     },
          //   ],
          // },
          {
            featureType: 'administrative.land_parcel',
            stylers: [
              {
                visibility: 'on',
              },
            ],
          },
          {
            featureType: 'administrative.neighborhood',
            stylers: [
              {
                visibility: 'on',
              },
            ],
          },
          {
            featureType: 'road',
            stylers: [
              {
                visibility: 'on',
              },
            ],
          },
        ],
      })
      window.google.maps.event.addListenerOnce(this.map, 'idle', this.onMapReady.bind(this))
      if (this.hasClickListener) {
        window.google.maps.event.addListener(this.map, 'click', e => this.$emit('click', e))
      }
      if (this.hasZoomListener) {
        window.google.maps.event.addListener(this.map, 'zoom_changed', e => this.$emit('zoom'))
      }
      if (this.hasBoundsListener) {
        window.google.maps.event.addListener(this.map, 'bounds_changed', e => this.$emit('bounds'))
      }
    },

    onMapReady() {
      this.mapLoaded = true
      this.$emit('map-ready')
    },
  },
}
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  min-height: 85vh;
  position: relative;
  overflow: hidden;
}
.map-viewport {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transition: all 0.5s ease-in-out;
  transform: translate(-50%, -50%);
}
.large-viewport {
  width: 2000px;
  height: 2000px;
}
.status-bar {
  top: 12px;
  left: 20px;
  right: 20px;
}
</style>
