<template>
  <div class="flex flex-col w-full">
    <AppToolbar title="Telegram" :with-site-id="false" />
    <div class="flex flex-col items-stretch w-full gap-2 mt-2 justify-evenly md:flex-row">
      <TelegramGroupList class="w-full md:w-1/2" />
      <!-- <TelegramGroupList class="w-full md:w-1/2" /> -->
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth', 'setup'],
  data: () => ({}),
  computed: {},
  mounted() { },
  methods: {},
}
</script>
