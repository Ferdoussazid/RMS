<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Payment List" :with-site-id="false" />
    <div class="mt-2 min-h-[80vh] rounded bg-white p-4 shadow">
      <div class="flex flex-col items-center md:flex-row md:justify-between">
        <div class="z-50 flex flex-col items-center gap-2 md:flex-row">
          <div class="flex items-center justify-center gap-2">
            <vc-date-picker v-model="fromDate" mode="dateTime">
              <template #default="{ inputValue, inputEvents }">
                <input
                  ref="fromPicker"
                  class="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm"
                  placeholder="From"
                  :value="inputValue"
                  v-on="inputEvents"
                />
              </template>
            </vc-date-picker>
            <vc-date-picker v-model="toDate" mode="dateTime">
              <template #default="{ inputValue, inputEvents }">
                <input
                  ref="toPicker"
                  class="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm"
                  placeholder="To"
                  :value="inputValue"
                  v-on="inputEvents"
                />
              </template>
            </vc-date-picker>
          </div>
          <SearchableSiteDropdown
            v-if="sites.length"
            :sites="sites"
            :with-all-sites-option="false"
            class="w-48"
            @single="onSiteSelect"
            @clear="onClear"
          />
          <div class="flex items-center justify-center gap-2">
            <button
              class="hover:bg-fuschia-700 group relative flex items-center justify-center gap-1 rounded bg-sky-500 p-1.5 text-white transition duration-300"
              @click="filterData"
            >
              <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
              <i v-else class="fas fa-filter"></i>
              Filter
              <div
                class="tooltip absolute left-[50%] bottom-0 z-[999] mb-1 -translate-x-1/2 translate-y-10 transform opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <div class="tooltip-arrow"></div>
                <span class="tooltip-text">Filter Payment List</span>
              </div>
            </button>
            <button
              class="group relative flex h-16 w-16 items-center justify-center transition duration-300 md:h-8 md:w-8"
              @click="exportData"
            >
              <i v-if="loadingExport" class="fas fa-circle-notch fa-spin"></i>
              <img v-else src="/icon/ms-excel.png" alt="" />
              <div
                class="tooltip absolute left-[50%] bottom-0 z-[999] mb-1 -translate-x-1/2 translate-y-10 transform opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <div class="tooltip-arrow"></div>
                <span class="tooltip-text">Export Payment List</span>
              </div>
            </button>
          </div>
        </div>
        <NLink
          v-if="isFinanceUser || isSudoUser"
          to="/billing/update"
          class="rounded bg-green-500 px-3 py-2 text-white"
        >
          <i class="fas fa-pencil-alt"></i> Create/Update</NLink
        >
      </div>
      <div v-if="loading" class="flex h-[50vh] flex-col space-y-2 p-2">
        <TableHeaderPlaceholder />
        <TableItemPlaceholder v-for="index in 5" :key="index" />
      </div>
      <div
        v-if="!loading && billingList.total"
        class="mt-4 max-h-[70vh] overflow-x-auto border border-gray-300 scrollbar-hide"
      >
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <SiteBillingHeader is-extended />
          </thead>
          <tbody>
            <SiteBillingRow v-for="(row, index) in billingList.items" :key="index" :is-extended="true" :row="row" />
          </tbody>
        </table>
      </div>
      <div
        v-if="!loading && billingList.total === 0"
        class="m-auto flex min-h-[67vh] flex-col items-center justify-center space-y-6"
      >
        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">No Record Found</span>
      </div>
      <el-pagination
        v-if="billingList.total > perPage"
        background
        :hide-on-single-page="showPagination"
        :current-page.sync="currentPage"
        :page-size="perPage"
        :pager-count="7"
        layout="prev, pager, next"
        :total="billingList.total"
        class="mt-4 flex w-full justify-center"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as downloadFile from 'js-file-download'
import { format, sub } from 'date-fns'
import PaginatedList from '~/mixins/PaginatedList'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [PaginatedList, UserTypeChecker],
  layout: 'default',
  middleware: ['auth', 'bill', 'setup'],
  data() {
    return {
      title: 'Billing List',
      loading: false,
      loadingExport: false,
      fromDate: sub(new Date(), { days: 30 }),
      toDate: new Date(),
      currentPage: 1,
      selectedSite: null,
      billingList: {
        total: 0,
        items: [],
      },
    }
  },
  computed: {
    ...mapGetters('user', ['rootUserUid']),
    ...mapGetters('site', ['sites']),
  },
  mounted() {
    this.getPaginatedData()
    this.setPagination()
  },
  methods: {
    async filterData() {
      this.currentPage = 1
      await this.getPaginatedData()
    },
    async getPaginatedData() {
      if (this.loading) return
      this.loading = true
      try {
        const query = {
          user_uid: this.rootUserUid,
          page: this.currentPage,
          limit: this.perPage,
          from_time: this.fromDate,
          until_time: this.toDate,
        }
        if (this.selectedSite) {
          query.site_uid = this.selectedSite.uid
        }
        const response = await this.$axios.$get('/user/payment/list', { params: query })
        this.billingList = response
        this.setPagination()
      } catch (error) {
        this.$toast.error('Failed to fetch billing list')
      } finally {
        this.loading = false
      }
    },

    setPagination() {
      this.pageCount = Math.ceil(this.billingList.total / this.perPage)
      this.showPaginate(this.billingList)
    },

    async handleCurrentChange(val) {
      this.currentPage = val
      await this.getPaginatedData()
    },

    onSiteSelect(site) {
      this.selectedSite = site
    },

    onClear() {
      this.selectedSite = null
    },

    async exportData() {
      if (this.loadingExport) return
      this.loadingExport = true
      try {
        const query = {
          user_uid: this.rootUserUid,
          from_time: this.fromDate,
          until_time: this.toDate,
        }
        if (this.selectedSite) {
          query.site_uid = this.selectedSite.uid
        }
        const res = await this.$axios.get('/user/report/payment', {
          params: query,
          responseType: 'arraybuffer',
        })
        const formattedFromDate = format(this.fromDate, 'dd MMM yyyy')
        const formattedToDate = format(this.toDate, 'dd MMM yyyy')
        const fileName = `RMS Site List Payment (${formattedFromDate} to ${formattedToDate}).xlsx`
        downloadFile(res.data, fileName)
      } catch (error) {
        this.$toast.error('Failed to export sites')
      } finally {
        this.loadingExport = false
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
