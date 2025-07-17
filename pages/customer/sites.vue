<template>
  <div class="flex flex-col gap-2">
    <AppToolbar title="RMS Site Lists" :with-site-id="false" />
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-col items-center gap-2 rounded bg-white p-2 md:flex-row md:justify-between">
        <div class="grid grid-cols-12 gap-2">
          <DropdownMenu
            v-model="company"
            :options="companiesWithLabel"
            placeholder="Select a Company"
            class="col-span-12 md:col-span-5"
          />

          <div class="col-span-12 flex items-center gap-2 md:col-span-7">
            <SearchInputField
              v-model="search"
              hint="Search Sites"
              class=""
              :selected-item="search"
              @clear="clearSearch"
            />
            <button
              class="flex items-center gap-1 rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
              @click="searchSite"
            >
              <i v-if="searching" class="fas fa-circle-notch fa-spin"></i>
              <i v-else class="fas fa-search text-xs"></i>
              <span class="text-xs font-semibold">Search</span>
            </button>
          </div>
        </div>
        <NLink to="/customer/site/create" class="rounded bg-teal-600 px-6 py-2 text-xs font-semibold text-white shadow">
          <i class="fas fa-plus"></i>
          New Site
        </NLink>
      </div>

      <div class="flex w-full rounded">
        <div class="flex w-full flex-col rounded border bg-white shadow-md">
          <div
            v-if="configurableSites.total === 0 && !fetchingSites"
            class="m-auto flex h-[70vh] flex-col items-center justify-center space-y-6"
          >
            <img src="/icon/empty.png" alt="" class="h-auto w-16" />
            <span class="text-sm font-light text-gray-500">No Sites Found</span>
          </div>
          <div v-if="fetchingSites" class="flex h-[71.8vh] items-center justify-center bg-white text-center">
            <CircularSpinner size="lg" />
          </div>
          <SiteListTableHeader v-if="!fetchingSites && configurableSites.total !== 0 && !fetchingSites" />
          <div v-if="configurableSites.total !== 0 && !fetchingSites" class="h-[67vh] overflow-auto bg-white">
            <SiteListTableItem
              v-for="(site, i) in configurableSites.items"
              :key="site.id"
              :serial="getSerial(i)"
              :site="site"
              :devices="site.devices"
              :class="[i % 2 === 0 ? 'bg-white' : 'bg-gray-100']"
            />
            <div class="w-full">
              <div class="h-[50vh] w-full bg-white"></div>
            </div>
          </div>
        </div>
      </div>

      <el-pagination
        v-if="!fetchingSites"
        background
        :hide-on-single-page="showPagination"
        :current-page.sync="currentPage"
        :page-size="perPage"
        :pager-count="7"
        layout="prev, pager, next"
        :total="configurableSites.total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginatedList from '~/mixins/PaginatedList'

export default {
  mixins: [PaginatedList],
  middleware: ['auth', 'admin'],
  data: () => ({
    search: '',
    searching: false,
    company: '',
  }),

  computed: {
    ...mapGetters('customer', { configurableSites: 'sites' }),
    ...mapGetters('site', { dropdownSites: 'sites' }),
    ...mapGetters('user', ['tokenExpired']),
    ...mapGetters('customer', [
      'sites',
      'companies',
      'selectedCompany',
      'selectedPage',
      'fetchingSites',
      'siteSearchText',
    ]),

    companiesWithLabel() {
      return this.companies.map(c => {
        return { ...c, label: c.name }
      })
    },
  },

  watch: {
    company(val) {
      this.currentPage = 1
      this.$store.dispatch('customer/setSelectedCompany', val)
      this.$store.dispatch('customer/setSelectedPage', this.currentPage)
      this.getpaginatedSites({
        user_uid: this.selectedCompany.user_uid,
        page: this.selectedPage,
        limit: this.perPage,
        with_devices: 'YES',
      })
    },
  },

  mounted() {
    this.currentPage = this.selectedPage
    this.search = this.siteSearchText
    this.$store.dispatch('customer/getCompanyList')
    if (this.dropdownSites.length === 0 && !this.tokenExpired) {
      this.$store.dispatch('site/setupSites')
    }
    this.setPagination()
  },

  methods: {
    async getpaginatedSites(query) {
      await this.$store.dispatch('customer/getSiteList', query)
      this.setPagination()
    },

    setPagination() {
      this.pageCount = Math.ceil(this.configurableSites.total / this.perPage)
      this.showPaginate(this.configurableSites)
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.$store.dispatch('customer/setSelectedPage', val)
      this.getpaginatedSites({
        user_uid: this.selectedCompany.user_uid,
        page: this.selectedPage,
        limit: this.perPage,
        with_devices: 'YES',
      })
    },

    searchSite() {
      if (this.searching) return
      this.searching = true
      this.currentPage = 1
      this.$store.dispatch('customer/setSelectedPage', this.currentPage)
      this.$store.dispatch('customer/setSiteSearchText', this.search.trim())
      this.getpaginatedSites({
        user_uid: this.selectedCompany.user_uid,
        name: this.siteSearchText,
        page: this.selectedPage,
        limit: this.perPage,
        with_devices: 'YES',
      })
      this.searching = false
    },

    clearSearch() {
      this.search = ''
      this.$store.dispatch('customer/setSiteSearchText', this.search)
      this.getpaginatedSites({
        user_uid: this.selectedCompany.user_uid,
        page: this.selectedPage,
        limit: this.perPage,
        with_devices: 'YES',
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
