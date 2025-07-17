<template>
  <div class="flex flex-col gap-2 overflow-hidden">
    <AppToolbar title="RMS OEM Records" :with-site-id="false" />
    <OEMRecordsFilter :show-site-dropdown="showSiteDropdown" @filter="handleFilter" />
    <!-- <div class="mt-2 flex h-full w-full flex-col gap-2 rounded bg-white p-4 shadow-md"> -->
    <div class="flex flex-col items-center gap-2 rounded">
      <div class="flex w-full items-center justify-between">
        <div class="col-span-6 flex items-center gap-2"></div>
      </div>
      <div v-if="!loading" class="flex w-full flex-col items-center gap-2 bg-white">
        <div
          v-if="oemRecords.total === 0"
          class="m-auto flex min-h-[50vh] flex-col items-center justify-center space-y-6"
        >
          <img src="/icon/empty.png" alt="" class="h-auto w-16" />
          <span class="text-sm font-light text-gray-500">No Record Found</span>
        </div>
        <div v-else class="w-full flex-col gap-2">
          <div class="w-full divide-y divide-gray-100 rounded border border-slate-200 shadow-md">
            <OEMRecordsTableHeader />
            <div class="flex h-[65vh] w-full flex-col items-stretch overflow-scroll">
              <OEMRecordsTableItem
                v-for="(record, i) in oemRecords.items"
                :id="getSerial(i)"
                :key="i"
                :class="[i % 2 === 0 ? 'bg-white' : 'bg-gray-100']"
                :record="record"
              />
            </div>
          </div>
        </div>
      </div>

      <el-pagination
        v-if="!loading"
        background
        :hide-on-single-page="showPagination"
        :current-page.sync="currentPage"
        :page-size="perPage"
        :pager-count="7"
        layout="prev, pager, next"
        :total="oemRecords.total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
      <div v-if="loading" class="flex min-h-[65vh] w-full items-center justify-center rounded bg-white text-center">
        <div role="status">
          <svg
            aria-hidden="true"
            class="mr-2 inline h-8 w-8 animate-spin fill-blue-400 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
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
  data: () => ({
    loading: true,
    data: {},
    showSiteDropdown: true,
  }),

  computed: {
    ...mapGetters('customer', ['oemRecords']),
  },

  async mounted() {
    this.data = {
      site_uid: 79163,
      page: this.currentPage,
      limit: this.perPage,
    }
    await this.getPaginatedOemRecordsList(this.data)
  },

  methods: {
    async getPaginatedOemRecordsList(data) {
      this.loading = true
      try {
        await this.$store.dispatch('customer/getOemRecords', data)
        this.pageCount = Math.ceil(this.oemRecords.total / this.perPage)
        this.showPaginate(this.oemRecords)
      } catch (error) {
        this.$toast.error('Error Fetching Data')
      }
      this.loading = false
    },

    // async getSiteList(query) {
    //   this.showSiteDropdown = false
    //   await this.$store.dispatch('site/getSiteList', query)
    //   this.showSiteDropdown = true
    // },

    paginateHandler(page) {
      this.currentPage = page
      this.getPaginatedOemRecordsList({
        ...this.data,
        page: this.currentPage,
        limit: this.perPage,
      })
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getPaginatedOemRecordsList({
        ...this.data,
        page: this.currentPage,
        limit: this.perPage,
      })
    },

    handleFilter(data) {
      if (data.site_uid) this.data.site_uid = data.site_uid
      if (data.com_id) this.data.com_id = data.com_id
      if (data.register_type) this.data.register_type = data.register_type
      if (data.rectifier_type) this.data.rectifier_type = data.rectifier_type
      this.getPaginatedOemRecordsList(this.data)
    },
  },
}
</script>

<style lang="scss" scoped></style>
