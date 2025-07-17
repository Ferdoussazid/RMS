<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Manage Site Access" :with-site-id="false" />
    <div class="mt-2 flex w-full flex-col items-stretch justify-evenly gap-2 md:flex-row">
      <SiteGroupList class="w-full md:w-1/2" />
      <CardGroupList class="w-full md:w-1/2" />
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth', 'setup'],
  data: () => ({}),
  computed: {},
  mounted() {},
  methods: {},
}
</script>
