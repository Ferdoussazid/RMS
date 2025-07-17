<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Ticket List" :with-site-id="false">
      <template #action>
        <NLink
          to="/ticket/create"
          class="rounded bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow transition duration-300 hover:bg-indigo-600"
        >
          <i class="fas fa-plus"></i>
          Create Ticket
        </NLink>
      </template>
    </AppToolbar>

    <div class="mt-1 flex w-full flex-col gap-1">
      <!-- <TicketDashboard /> -->

      <TicketFilterForm @filter="handleFilter" />

      <div v-if="!fetching && tickets.total > 0" class="flex flex-col">
        <TicketListTable />
      </div>

      <div v-if="fetching" class="flex min-h-[67vh] items-center justify-center bg-white text-center">
        <CircularSpinner size="lg" />
      </div>

      <div
        v-if="!fetching && tickets.total == 0"
        class="m-auto flex min-h-[67vh] w-full flex-col items-center justify-center space-y-6 bg-white"
      >
        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">No Data Found</span>
      </div>

      <div v-if="!fetching" class="flex justify-center">
        <el-pagination
          v-if="showPagination"
          background
          :hide-on-single-page="showPagination"
          :current-page.sync="currentPage"
          :page-size="perPage"
          :pager-count="7"
          layout="prev, pager, next"
          :total="tickets.total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginatedList from '~/mixins/PaginatedList'

export default {
  mixins: [PaginatedList],
  middleware: ['auth', 'setup'],
  data() {
    return {
      data: {},
      fetching: true,
      tableView: true,
    }
  },
  computed: {
    ...mapGetters('dashboard', ['counts']),
    ...mapGetters('user', ['rootUserUid', 'users', 'accessUsers']),
    ...mapGetters('ticket', ['tickets']),
  },
  mounted() {
    this.initiateTickets()
    this.getAlluser()
    this.getAccessUsers()
  },
  methods: {
    async initiateTickets() {
      if (!this.tickets.total) {
        await this.getTickets(this.data)
      }
      this.fetching = false
    },
    async getTickets(query) {
      this.fetching = true
      try {
        if (!query.page) {
          query.page = 1
        }
        query.limit = this.perPage
        query.company_uid = this.rootUserUid
        await this.$store.dispatch('ticket/getTicketList', query)
        this.currentPage = query.page
        this.showPaginate(this.tickets)
      } catch (error) {
        this.$toast.error('Error fetching Tickets')
      }
      this.fetching = false
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.data.page = this.currentPage
      this.getTickets(this.data)
    },

    handleFilter(data) {
      this.data.page = this.currentPage
      this.getTickets(data)
    },

    async getAlluser() {
      if (!this.users.length) {
        await this.$store.dispatch('user/getUserList')
      }
    },
    async getAccessUsers() {
      if (!this.accessUsers.total) {
        await this.$store.dispatch('user/getAccessUserList')
      }
    },
  },
}
</script>
