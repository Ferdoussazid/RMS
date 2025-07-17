<template>
  <div class="flex w-full flex-col items-center justify-center gap-2">
    <AppToolbar title="Monitor Service String" :with-site-id="false" />
    <ServiceStringFilter :current-page="currentPage" @filter="handleFilter" @view="toggleView" />
    <div
      :class="[tableView ? 'overflow-scroll' : '']"
      class="relative m-auto flex h-[72vh] w-full flex-col overflow-y-auto rounded bg-white shadow"
    >
      <div
        v-if="!data.com_id && !serviceStrings.total"
        class="m-auto flex h-[72vh] w-full min-w-[600px] flex-col items-center justify-center space-y-6"
      >
        <img src="/icon/router.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">Please select a device and filter Service String</span>
      </div>
      <table
        v-if="!fetching && serviceStrings.total && serviceStrings.total !== 0 && tableView"
        class="whitespace-no-wrap table-striped relative w-full table-auto border-collapse"
      >
        <ServiceStringTableHeader />
        <tbody>
          <ServiceStringTableItem
            v-for="(item, i) in serviceStrings.items"
            :key="i"
            :item="item"
            :theme="getBgTheme(i)"
          />
        </tbody>
      </table>
      <div
        v-if="!fetching && serviceStrings.total && serviceStrings.total !== 0 && !tableView"
        class="border border-slate-100"
      >
        <RawServiceString v-for="(item, i) in serviceStrings.items" :key="i" :item="item" :theme="getBgTheme(i)" />
      </div>
      <div
        v-if="serviceStrings.total === 0"
        class="m-auto flex min-h-[67vh] flex-col items-center justify-center space-y-6"
      >
        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">No Data Found</span>
      </div>
      <div v-if="fetching" class="flex min-h-[67vh] items-center justify-center text-center">
        <CircularSpinner size="lg" />
      </div>
      <div v-if="!fetching && serviceStrings.total" class="w-full">
        <div class="h-[50vh] w-full bg-white"></div>
      </div>
    </div>
    <el-pagination
      v-if="showPagination"
      background
      :hide-on-single-page="showPagination"
      :current-page.sync="currentPage"
      :page-size="perPage"
      :pager-count="7"
      layout="prev, pager, next"
      :total="serviceStrings.total"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginatedList from '~/mixins/PaginatedList'

export default {
  mixins: [PaginatedList],
  middleware: ['auth', 'setup', 'admin'],
  previousComId: null,
  data() {
    return {
      loading: false,
      data: {},
      fetching: false,
      tableView: true,
    }
  },

  computed: {
    ...mapGetters('customer', ['serviceStrings']),
  },

  mounted() {
    this.$store.commit('customer/CLEAR_SERVICE_STRING')
    this.showPaginate(this.serviceStrings)
  },

  methods: {
    handleFilter(data) {
      this.data = data
      this.getServiceString(this.data)
    },

    async getServiceString(query) {
      if (this.fetching) return
      this.fetching = true
      try {
        await this.$store.dispatch('customer/getServiceString', query)
        this.currentPage = query.page || 1
        this.showPaginate(this.serviceStrings)
      } catch (error) {
        this.$toast.error('Error fetching service string')
      }
      this.fetching = false
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.data.page = this.currentPage
      this.getServiceString(this.data)
    },

    getBgTheme(n) {
      return n % 2 === 0 ? 'bg-white' : 'bg-gray-50'
    },

    toggleView() {
      this.tableView = !this.tableView
    },
  },
}
</script>
