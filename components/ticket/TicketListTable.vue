<template>
  <div class="relative m-auto flex h-[72vh] w-full flex-col rounded bg-white shadow">
    <div class="min-h-[50vh] overflow-y-auto">
      <table v-if="filtersTickets" class="whitespace-no-wrap table-striped relative w-full table-auto border-collapse">
        <TicketListHeader />
        <tbody>
          <TicketListItem v-for="(ticket, i) in tickets.items" :key="i" :ticket-item="ticket" />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import PaginatedList from '~/mixins/PaginatedList'

export default {
  mixins: [UserTypeChecker, PaginatedList],
  props: {},
  data: () => ({
    filtersTickets: [],
  }),
  computed: {
    ...mapGetters('ticket', ['tickets']),
  },
  watch: {},
  mounted() {},
  methods: {
    filterTicket(filterdata) {
      this.$emit('filter', filterdata)
    },
  },
}
</script>

<style lang="scss" scoped></style>
