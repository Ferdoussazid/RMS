<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Map Overview" :with-site-id="false" />
    <div class="mt-2 w-full overflow-hidden rounded-xl shadow">
      <SiteFilterForm :alarm-filters="filters" @filter="handleFilteredSites" />
      <BaseMap ref="base" :zoom="7" @map-ready="onMapReady" @bounds="onBoundsChanged">
        <div v-if="mapReady">
          <StaticPin v-for="s in sitesFiltered" ref="markers" :key="s.uid" :origin="s" @click="onSiteClick" />
        </div>
      </BaseMap>

      <SiteOverviewModal ref="modal" :site="selectedSite" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup', 'user'],
  asyncData({ query }) {
    const filters = []
    if (query.type) {
      filters.push(query)
    }
    return { filters }
  },
  data: () => ({
    sitesFiltered: [],
    selectedSite: null,
    mapReady: false,
  }),
  computed: {
    ...mapGetters('site', ['sites', 'tasks', 'getAlarmsOfGroup']),
  },
  watch: {
    tasks: {
      handler(arr, old) {
        for (const task of arr) {
          if (!this.$refs.markers) return
          for (const marker of this.$refs.markers) {
            if (marker.getId() === task.id) {
              marker.redraw()
              break
            }
          }
        }
        if (arr.length) {
          this.$store.commit('site/CLEAR_TASKS')
        }
      },
    },
  },
  mounted() {},
  methods: {
    handleFilteredSites($event) {
      this.sitesFiltered = $event
    },
    onMapReady() {
      this.mapReady = true
    },
    onBoundsChanged() {},
    onSiteClick(site, latlng) {
      this.selectedSite = site
      this.$refs.modal.show()
    },
  },
}
</script>

<style lang="scss" scoped></style>
