<template>
  <ContentCard has-footer title="Site Groups">
    <template #action>
      <LoadingSpinner v-if="loading" class="scale-50" />
    </template>
    <template #content>
      <div class="md:min-h-auto relative h-full min-h-[60vh] w-full overflow-hidden bg-slate-100">
        <div class="absolute inset-0 flex flex-col items-start justify-start py-1 shadow-inner">
          <div
            v-if="!isEmpty"
            class="flex w-full flex-col items-stretch justify-start space-y-2 overflow-y-scroll px-2 scrollbar-hide"
          >
            <div class="px-2">
              <span class="text-xs font-light text-gray-700">Groups</span>
            </div>
            <SiteGroupItem v-for="g in siteGroups" :key="g.id" :group="g" />
            <div v-if="!siteGroups.length" class="flex justify-center py-2">
              <span class="text-xs font-normal text-gray-500">No Group Available</span>
            </div>
          </div>
          <div v-if="!loading && isEmpty" class="flex w-full flex-col items-center justify-start py-[15vh]">
            <img src="/icon/nothing.png" alt="" class="h-auto w-16" />
            <span class="text-center text-sm font-normal text-gray-400"> No group found </span>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-row items-center justify-between border-t border-slate-200 px-3 py-2">
        <div class="flex flex-row items-center space-x-1">
          <span class="text-2xs font-normal text-gray-500">
            <strong>{{ siteGroups.length }}</strong> Groups
          </span>
          <span class="text-[0.35rem] text-gray-300"><i class="fas fa-circle"></i></span>
          <span class="text-2xs font-normal text-gray-500">
            <strong>{{ sites.length }}</strong> Sites
          </span>
        </div>
        <div v-if="!isReadOnlyUser" class="flex">
          <nuxt-link
            to="/access/site-group/save"
            class="rounded bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow transition duration-300 hover:bg-indigo-600"
          >
            <i class="fas fa-plus"></i>
            Site Group
          </nuxt-link>
        </div>
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { filterSiteListByTextSearch, siteListAlphabeticSort } from '~/assets/js/SiteHelper'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  data: () => ({
    loading: false,
    search: '',
    area: '',
    cluster: '',
  }),
  computed: {
    ...mapGetters('user', ['rootUserUid']),
    ...mapGetters('acs', ['siteGroups']),
    ...mapGetters('site', ['sites']),
    isEmpty() {
      return !this.siteGroups.length && !this.sites.length
    },
    areaList() {
      const items = this.sites.map(s => _.get(s, 'place.division', '')).filter(a => !!a)
      return _.uniq(items)
    },
    clusterList() {
      if (!this.area) return []
      const items = this.sites
        .filter(s => _.get(s, 'place.division', '') === this.area)
        .map(s => _.get(s, 'place.district', ''))
        .filter(c => !!c)
      return _.uniq(items)
    },
    filteredSites() {
      let items = [...this.sites]
      if (this.search.trim().length) {
        items = filterSiteListByTextSearch(items, this.search)
      }

      if (this.area) {
        items = items.filter(s => _.get(s, 'place.division', '') === this.area)
      }

      if (this.cluster) {
        items = items.filter(s => _.get(s, 'place.district', '') === this.cluster)
      }

      // Sort sites alphabetically

      items.sort(siteListAlphabeticSort)

      return items
    },
  },
  mounted() {
    this.fetchGroups()
  },
  methods: {
    async fetchGroups() {
      this.loading = true
      try {
        await this.$store.dispatch('acs/getSiteGroups', this.rootUserUid)
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
