<template>
  <div class="flex w-full flex-col">
    <ContentCard title="Device Health">
      <template #content>
        <div class="flex flex-col">
          <DeviceHealthChart />

          <div class="relative flex w-full flex-row border-b border-slate-200">
            <TabButton
              icon="fa-check-circle"
              :title="`Healthy (${counts.normal})`"
              :is-active="currentTabIndex === 0"
              @select="onTabClick(0)"
            />
            <TabButton
              icon="fa-exclamation-circle"
              :title="`Unusual (${counts.abnormal})`"
              :is-active="currentTabIndex === 1"
              @select="onTabClick(1)"
            />
            <TabButton
              icon="fa-ban"
              :title="`Offline (${counts.offline})`"
              :is-active="currentTabIndex === 2"
              @select="onTabClick(2)"
            />
          </div>

          <div class="grid w-full grid-cols-12 gap-4 p-8">
            <DeviceStatusCard v-for="(dev, i) in filteredDevices" :key="i" :device="dev" />
          </div>
        </div>
      </template>
    </ContentCard>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth'],
  data: () => ({
    currentTabIndex: 0,
  }),
  async fetch({ store }) {
    try {
      const userUid = store.state.auth.user.uid
      await store.dispatch('health/getDevices', userUid)
    } catch (error) {
      console.log('network healths fetch error', error)
    }
  },
  computed: {
    ...mapGetters('health', ['counts', 'devices', 'loading']),
    filteredDevices() {
      switch (this.currentTabIndex) {
        case 0:
          return this.devices('normal')
        case 1:
          return this.devices('abnormal')

        default:
          return this.devices('offline')
      }
    },
  },
  methods: {
    onTabClick(index) {
      this.currentTabIndex = index
    },
  },
}
</script>
