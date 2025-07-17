<template>
  <div class="flex flex-col w-80 md:w-96">
    <div
      class="
        px-5
        py-4
        flex flex-row
        justify-between
        items-center
        border-b border-gray-200
      "
    >
      <h5 class="text-gray-600 uppercase text-sm font-thin">Notifications</h5>
      <!-- <el-button size="mini" :loading="clearing" @click="clearAll">Clear All</el-button> -->
    </div>

    <div
      class="
        flex flex-col
        max-h-[60vh]
        overflow-scroll
        divide-y divide-gray-200
      "
    >
      <NotificationItem
        v-for="(item, i) in unseenNotifications"
        :key="i"
        :notification="item"
      />
      <NoNotification v-if="!unseenCount" />
    </div>
    <div
      class="flex flex-row justify-between items-center px-5 py-4 bg-gray-200"
    >
      <span class="text-base text-gray-500 font-light">All notifications</span>
      <span class="text-base text-gray-400">
        <i class="fas fa-cog"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import NotificationItem from '~/components/notification/NotificationItem'
import NoNotification from '~/components/notification/NoNotification'

export default {
  components: {
    NotificationItem,
    NoNotification,
  },
  data: () => ({
    clearing: false,
  }),
  computed: {
    ...mapGetters('notification', ['unseenCount', 'unseenNotifications']),
  },
  async mounted() {
    await this.$store.dispatch('notification/fetch', { status: 'unseen' })
  },
  methods: {
    async clearAll() {
      try {
        this.clearing = true
        await this.$store.dispatch('notification/markAllSeen')
      } catch (error) {}
      this.clearing = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
