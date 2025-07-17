<template>
  <ToolbarMenu>
    <div class="relative">
      <span class="text-primary">
        <i class="fas fa-bell"></i>
      </span>
      <div
        v-if="unseenCount"
        class="w-5 h-5 bg-red-500 rounded-full absolute right-0 bottom-0 flex justify-center items-center translate-x-3/4 -translate-y-2/3"
      >
        <span class="text-white font-light text-[0.6rem]">
          {{ unseenCount }}
        </span>
      </div>
    </div>
    <template #dropdown>
      <NotificationList />
    </template>
  </ToolbarMenu>
</template>

<script>
// import { mapGetters } from 'vuex'

// import NotificationItem from '~/components/notification/NotificationItem'
// import NoNotification from '~/components/notification/NoNotification'

import ToolbarMenu from '~/components/common/ToolbarMenu.vue'
// import DropDownMenuItem from '~/components/common/DropDownMenuItem.vue'
import NotificationList from '~/components/notification/NotificationList'

export default {
  components: {
    ToolbarMenu,
    // DropDownMenuItem,
    NotificationList,
    // NotificationItem,
    // NoNotification,
  },
  data: () => ({
    clearing: false,
    unseenCount: 3,
  }),
  computed: {
    // ...mapGetters('notification', ['unseenNotifications', 'paging', 'loading', 'unseenCount']),
  },
  async mounted() {
    // await this.$store.dispatch('notification/fetch', { status: 'unseen' })
  },
  methods: {
    async clearAll() {
      try {
        this.clearing = true
        await this.$store.dispatch('notification/markAllSeen')
      } catch (error) {
        // console.log(error)
      }
      this.clearing = false
    },
  },
}
</script>

<style lang="scss" scoped>
</style>