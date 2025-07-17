<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Site Management" :with-site-id="false" />
    <div class="mt-2 flex w-full flex-col items-stretch justify-evenly gap-2 md:flex-row">
      <SiteGroupForm :group="focusedGroup" class="w-full lg:w-2/3" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup'],
  asyncData({ query }) {
    const { groupId = '' } = query

    return { groupId: +groupId }
  },
  data: () => ({}),
  computed: {
    ...mapGetters('acs', ['siteGroups']),
    focusedGroup() {
      if (!this.groupId) return null
      return this.siteGroups.find(g => g.id === this.groupId)
    },
  },
  mounted() {},
  methods: {},
}
</script>
