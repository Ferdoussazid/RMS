<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Site Details" />
    <SiteTabMenu class="mt-2" />
    <div class="flex min-h-[70vh] justify-center gap-2 bg-white pt-4">
      <div class="w-full md:w-1/2">
        <SiteInfoTabContainer :site="focusedSite" :show-single-tenant="true" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  middleware: ['auth', 'setup', 'user', 'site'],
  computed: {
    ...mapGetters('site', ['focusedSite']),
  },
}
</script>

<style lang="scss" scoped></style>
