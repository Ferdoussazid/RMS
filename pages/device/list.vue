<template>
  <div class="flex flex-col gap-2">
    <AppToolbar title="RMS Device List" :with-site-id="false" />
    <!-- <div class="mt-2 flex h-full w-full flex-col gap-2 rounded bg-white p-4 shadow-md"> -->
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-col items-center justify-between gap-2 rounded bg-white p-2 md:flex-row">
        <div class="flex flex-col items-center gap-2 md:flex-row">
          <SearchInputField v-model="comIdSearch" hint="Com. ID" class="" @clear="clearSearch" />
          <SearchInputField v-model="phoneSearch" hint="Phone Number" class="" @clear="clearSearch" />
          <button
            class="flex items-center gap-1 rounded bg-blue-500 p-2 text-xs text-white shadow hover:bg-blue-700"
            @click="searchDevice"
          >
            <i v-if="searching" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-search"></i>
            <span class="font-semibold">Search</span>
          </button>
          <button
            class="rounded bg-teal-500 p-2 text-xs text-white shadow transition duration-300 hover:bg-teal-600"
            @click="exportDevices"
          >
            <i v-if="loadingExport" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-download"></i>
            <span class="font-semibold">Export Devices</span>
          </button>
        </div>
        <NLink
          class="cursor-pointer rounded bg-sky-600 px-6 py-2 text-xs font-semibold text-white shadow hover:bg-sky-800"
          to="/device/create"
        >
          <i class="fas fa-plus"></i>
          New Device
        </NLink>
      </div>
      <div class="relative m-auto flex h-[72vh] w-full flex-col overflow-auto rounded bg-white shadow">
        <div v-if="loading" class="flex h-full items-center justify-center text-center">
          <CircularSpinner size="lg" />
        </div>
        <div v-if="devices.total === 0" class="m-auto flex h-full flex-col items-center justify-center space-y-6">
          <img src="/icon/empty.png" alt="" class="h-auto w-16" />
          <span class="text-sm font-light text-gray-500">No Device Found</span>
        </div>
        <table
          v-if="!loading && devices.total !== 0"
          class="whitespace-no-wrap table-striped relative w-full table-auto border-collapse"
        >
          <DeviceListTableHeader />
          <tbody>
            <DeviceListTableItem
              v-for="(device, i) in devices.items"
              :id="getSerial(i)"
              :key="i"
              :class="[i % 2 === 0 ? '' : 'bg-gray-100']"
              :device="device"
            />
          </tbody>
          <div class="w-full">
            <div class="h-[50vh] w-full"></div>
          </div>
        </table>
      </div>

      <el-pagination
        v-if="!loading"
        background
        :hide-on-single-page="showPagination"
        :current-page.sync="currentPage"
        :page-size="perPage"
        :pager-count="7"
        layout="prev, pager, next"
        :total="devices.total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginatedList from '~/mixins/PaginatedList'
const downloadFile = require('js-file-download')

export default {
  mixins: [PaginatedList],
  middleware: ['auth', 'setup', 'admin'],
  data: () => ({
    search: '',
    searching: false,
    availableDevices: [],
    loading: true,
    loadingExport: false,
    phoneSearch: '',
    comIdSearch: '',
  }),

  computed: {
    ...mapGetters('customer', ['sites', 'devices']),
  },

  mounted() {
    this.getPaginatedDeviceList({
      page: this.currentPage,
      limit: this.perPage,
    })
    this.getSiteList({
      page: 1,
      limit: 3000,
      with_devices: 'YES',
    })
  },

  methods: {
    async getSiteList(query) {
      await this.$store.dispatch('site/getSiteList', query)
    },

    async getPaginatedDeviceList(query) {
      this.loading = true
      await this.$store.dispatch('customer/getDeviceList', query)
      this.pageCount = Math.ceil(this.devices.total / this.perPage)
      this.showPaginate(this.devices)
      this.loading = false
    },

    paginateHandler(page) {
      this.currentPage = page
      this.getPaginatedDeviceList({
        page: this.currentPage,
        limit: this.perPage,
      })
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getPaginatedDeviceList({
        page: this.currentPage,
        limit: this.perPage,
      })
    },

    searchDevice() {
      if (this.searching) return
      this.searching = true
      let deviceComId = this.comIdSearch
      let devicePhoneNumber = this.phoneSearch
      this.currentPage = 1
      if (deviceComId && devicePhoneNumber) {
        this.$toast.error('Please give Commercial ID or Phone Number')
        this.comIdSearch = ''
        this.phoneSearch = ''
        this.searching = false
        return
      }
      if (!deviceComId) deviceComId = undefined
      if (!devicePhoneNumber) devicePhoneNumber = undefined
      this.getPaginatedDeviceList({
        com_id: deviceComId,
        phone: devicePhoneNumber,
        page: 1,
        limit: this.perPage,
      })
      this.showPaginate(this.devices)
      this.searching = false
    },

    clearSearch() {
      this.getPaginatedDeviceList({
        page: 1,
        limit: this.perPage,
      })
    },

    async exportDevices() {
      if (this.loadingExport) return
      this.loadingExport = true
      try {
        const res = await this.$axios.$get('/user/report/device', {
          responseType: 'arraybuffer',
        })
        downloadFile(res, 'All Devices Export.xlsx')
      } catch (error) {
        this.$toast.error(error)
      }
      this.loadingExport = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
