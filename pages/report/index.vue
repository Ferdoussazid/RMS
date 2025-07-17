<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Report"></AppToolbar>
    <SiteTabMenu class="mt-2" />
    <div class="grid grid-flow-row-dense grid-cols-12 items-stretch gap-2">
      <MasterExport class="col-span-12" :site-uid="siteConfig.siteUid" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup', 'user', 'site'],
  computed: {
    ...mapGetters('site', ['siteConfig']),
  },
}
</script>

<style lang="scss" scoped></style>
