<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Site Down History" :with-site-id="false" />
    <div class="mt-2 flex h-screen w-full flex-col rounded bg-white shadow-md lg:h-[80vh]">
      <LoadingContainer v-if="loading.container" />
      <SiteDownHistoryHeader v-if="!loading.container" />
      <div v-if="!loading.container" class="flex h-full w-full flex-col items-stretch overflow-y-scroll">
        <SiteDownHistoryItem
          v-for="(item, i) in siteDownHistory"
          :key="i"
          :serial="i + 1"
          :tenant="tenant"
          :site-name="siteName"
          :item="item"
        />
        <!-- :site-name="siteName"
          :tenant="tenant"
          :history-data="s" -->
        <!-- <div class="w-full">
          <div class="h-[50vh] w-full bg-white"></div>
        </div> -->
        <div v-if="!canLoadMore" class="flex w-full justify-center py-4">
          <span class="text-xs font-light italic text-gray-500">No more events available</span>
        </div>

        <div class="flex w-full items-center justify-center">
          <button
            v-if="canLoadMore"
            class="my-4 mx-2 h-8 space-x-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-500 shadow-sm transition duration-300 hover:bg-gray-100"
            @click="loadMore"
          >
            <CircularSpinner v-if="loading.button" size="sm" theme="border-indigo-500" />
            <span v-if="!loading.button"><i class="fas fa-plus"></i></span>
            <span v-if="!loading.button" class="uppercase">Load More</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup', 'user'],
  asyncData({ query }) {
    const filters = []
    if (query.siteUid) {
      filters.push(query)
    }
    return { filters }
  },
  data: () => ({
    limit: 50,
    offset: 0,
    loading: { container: true, button: false },
    canLoadMore: false,
  }),
  computed: {
    ...mapGetters('site', ['siteUid2Name', 'siteDownHistory']),
    ...mapGetters('user', ['rootUserUid']),
    siteUid() {
      return this._.get(this.filters[0], 'siteUid', null)
    },
    siteName() {
      return this.siteUid2Name[this.siteUid]
    },
    tenant() {
      return this._.get(this.filters[0], 'tenant', '')
    },
  },
  async mounted() {
    this.loading.container = true
    this.$store.dispatch('site/clearSiteDownHistory')
    await this.fetchSiteDownHistory()
    this.loading.container = false
  },
  methods: {
    async fetchSiteDownHistory() {
      const siteDownCountBeforeLoad = this.siteDownHistory.length
      try {
        const query = {
          user_uid: this.rootUserUid,
          site_uid: this.siteUid,
          tenant: this.tenant,
          limit: this.limit,
          offset: this.offset,
        }
        await this.$store.dispatch('site/getSiteDownHistory', query)
      } catch (error) {
        // this.$toast.error('Site Down History not found!')
      }
      const siteDownCountAfterLoad = this.siteDownHistory.length
      const loadedHistoryItems = siteDownCountAfterLoad - siteDownCountBeforeLoad
      this.canLoadMore = loadedHistoryItems >= this.limit
    },
    async loadMore() {
      this.loading.button = true
      this.offset += 50
      await this.fetchSiteDownHistory()
      this.loading.button = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
