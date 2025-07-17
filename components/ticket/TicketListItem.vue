<template>
  <tr class="cursor-pointer hover:bg-slate-100" @click="onTicketClick">
    <!-- <td class="text-center">
      <span class="flex items-center py-2 px-4 text-sm font-normal text-gray-900"> {{ this.ticketItem.id }}</span>
    </td> -->
    <td class="text-center">
      <span class="flex items-center justify-center px-4 py-2 text-sm font-normal text-gray-900">
        {{ ticketItem.token }}</span
      >
    </td>
    <td class="text-left">
      <div class="flex w-[200px] items-center px-4 py-2">
        <span class="truncate text-sm font-semibold text-gray-900"> {{ ticketItem.title }}</span>
      </div>
    </td>
    <td class="text-left">
      <span class="flex items-center px-4 py-2 text-sm font-normal text-gray-900">
        {{ siteName }}
      </span>
    </td>
    <td class="text-left">
      <span class="flex items-center px-4 py-2 text-sm font-normal text-gray-900"> {{ openedBy }}</span>
    </td>
    <td class="text-left">
      <span class="flex items-center px-4 py-2 text-sm font-normal text-gray-900">
        {{ getAssignedToName(ticketItem.assigned_to) }}</span
      >
    </td>
    <td class="flex items-center py-1 text-left">
      <div :class="statusTheme" class="rounded-2xl border px-4 py-1 text-xs font-semibold">
        <span>{{ statusLabel }}</span>
      </div>
    </td>

    <td class="text-left">
      <span class="flex items-center px-4 py-2 text-sm font-normal text-gray-900">{{
        stringStartCase(ticketItem.priority)
      }}</span>
    </td>
    <td class="text-left">
      <span class="flex items-center px-4 py-2 text-xs font-normal leading-tight text-gray-700"> {{ createdAt }}</span>
    </td>

    <td class="text-left">
      <span class="flex items-center px-4 py-2 text-xs font-normal leading-tight text-gray-700"> {{ updatedAt }}</span>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import { getStatusLabel, getStatusTheme } from '~/assets/js/TicketHelper'
export default {
  props: {
    ticketItem: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('site', ['siteUid2Name']),
    ...mapGetters('user', ['users', 'accessUsers']),

    openedBy() {
      const openedBy = this.users.find(u => u.uid === this.ticketItem.opened_by)
      return openedBy?.name || 'N/A'
    },
    siteName() {
      return this.siteUid2Name[this.ticketItem.site_uid] || 'N/A'
    },
    statusLabel() {
      return getStatusLabel(this.ticketItem.status)
    },
    statusTheme() {
      return getStatusTheme(this.ticketItem.status)
    },
    createdAt() {
      return format(new Date(this.ticketItem.created_at), 'h:mm aaa, d MMM yyyy')
    },
    updatedAt() {
      return format(new Date(this.ticketItem.updated_at), 'h:mm aaa, d MMM yyyy')
    },
  },
  mounted() {},
  methods: {
    stringStartCase(str) {
      return this._.startCase(str)
    },
    onTicketClick() {
      this.$router.push({ path: '/ticket/details', query: { ticketID: this.ticketItem.id } })
    },
    getAssignedToName(uid) {
      if (this.accessUsers.total > 0) {
        const user = this.accessUsers.items.find(u => u.uid === uid)
        return user?.name || 'N/A'
      } else {
        return 'N/A'
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
