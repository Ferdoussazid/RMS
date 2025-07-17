<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Ticket details" :with-site-id="false"> </AppToolbar>

    <div v-if="focusedTicket" class="mt-2 flex h-full w-full flex-col rounded bg-white shadow-md">
      <TicketDetails :ticket="focusedTicket" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup', 'ticket'],
  data: () => ({}),
  computed: {
    ...mapGetters('ticket', ['tickets']),
    focusedTicket() {
      return this.tickets.items.find(t => t.id === +this.$route.query.ticketID)
    },
  },
  mounted() {
    // if (this.tickets.total === 0) {
    // }
    // this.getTicketList({ page: 1, limit: 300 })
  },
  methods: {
    // async getTicketList(query) {
    //   await this.$store.dispatch('ticket/getTicketList', query)
    // },
  },
}
</script>

<style lang="scss" scoped></style>
